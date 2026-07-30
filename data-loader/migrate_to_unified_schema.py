"""One-off migration: v2 schema (defendant/person split, place/town/street,
offence_category/offence_type, single-valued relationship/occupation
columns) -> v3 unified schema (see
/Users/gjh/.claude/plans/humming-painting-pearl.md for the full design
reasoning).

Reads the OLD tables via raw SQL (their SQLModel classes no longer exist
in qsrecords.models -- this script is the one place that still knows their
shape) and writes the NEW tables via the current SQLModel classes.

Strategy for the three colliding table names (summary_conviction, person,
related_conviction -- same names, different shapes) mirrors the existing
precedent in the old qsrecords.db._migrate_offence_type_to_junction:
rename the old table aside, let create_all() build the fresh new-shaped
table under the original name, migrate data across, verify, then (in a
separate, later cleanup step -- NOT this script) drop the _old tables.

Where a table is a straight 1:1 replacement with no merge (place ->
location), original ids are PRESERVED so no id-mapping dict is needed and
every existing foreign key naturally keeps working. Where two old sources
merge into one new table (defendant + person -> person; offence_category +
offence_type -> crime_type), explicit old-id -> new-id mapping dicts are
built and used, since neither source's ids can be preserved unchanged.
summary_conviction's own id is also preserved directly (single source,
just a reshaped column set), so related_conviction/summary_conviction_*
junction rows never need remapping on that side either.

Usage:
    python3 migrate_to_unified_schema.py
"""

from __future__ import annotations

from sqlalchemy import text
from sqlmodel import Session, SQLModel, select

from qsrecords.config import Settings
from qsrecords.db import get_engine
from qsrecords.models import (
    CrimeType,
    Location,
    Occupation,
    Person,
    PersonOccupation,
    PersonRelationship,
    RelatedConviction,
    RelationshipType,
    RelationshipTypeReciprocal,
    SummaryConviction,
    SummaryConvictionCrimeType,
    SummaryConvictionLocation,
    SummaryConvictionPerson,
)
from qsrecords.text import normalize_key


# ============================================================
# Phase 0: rename the three colliding old tables aside, then create_all()
# ============================================================


def rename_colliding_tables_aside(engine) -> None:
    with engine.connect() as conn:
        for table in ("summary_conviction", "person", "related_conviction"):
            existing = {
                row[0]
                for row in conn.execute(
                    text("SELECT name FROM sqlite_master WHERE type='table'")
                )
            }
            if table not in existing or f"{table}_old" in existing:
                continue  # already renamed (safe to re-run) or doesn't exist
            # legacy_alter_table=ON stops SQLite rewriting every other
            # table's FOREIGN KEY text to follow this table under its new
            # name -- the opposite of what's wanted here (see the existing
            # precedent this mirrors in qsrecords.db's git history).
            conn.execute(text("PRAGMA legacy_alter_table = ON"))
            conn.execute(text(f"ALTER TABLE {table} RENAME TO {table}_old"))
            conn.execute(text("PRAGMA legacy_alter_table = OFF"))
            index_names = [
                row[1]
                for row in conn.execute(text(f"PRAGMA index_list({table}_old)"))
                if not row[1].startswith("sqlite_autoindex_")
            ]
            for index_name in index_names:
                conn.execute(text(f"DROP INDEX {index_name}"))
        conn.commit()


def create_new_tables(engine) -> None:
    SQLModel.metadata.create_all(engine)


# ============================================================
# Phase 1: relationship_type vocabulary + reciprocal seed data
# ============================================================

RELATIONSHIP_TYPE_NAMES = [
    "wife", "husband", "son", "daughter", "father", "mother", "brother", "sister",
    "cousin", "stepson", "stepdaughter", "stepfather", "stepmother", "child",
    "ward", "guardian", "employer", "employee", "servant", "master", "apprentice",
    "agent", "principal", "co-partner", "trustee", "beneficiary", "namesake",
]

# (relationship_type, related_sex_or_None, reciprocal_relationship_type)
RECIPROCAL_SEED = [
    ("wife", None, "husband"),
    ("husband", None, "wife"),
    ("son", "male", "father"), ("son", "female", "mother"),
    ("daughter", "male", "father"), ("daughter", "female", "mother"),
    ("father", "male", "son"), ("father", "female", "daughter"),
    ("mother", "male", "son"), ("mother", "female", "daughter"),
    ("brother", "male", "brother"), ("brother", "female", "sister"),
    ("sister", "male", "brother"), ("sister", "female", "sister"),
    ("cousin", None, "cousin"),
    ("stepson", "male", "stepfather"), ("stepson", "female", "stepmother"),
    ("stepdaughter", "male", "stepfather"), ("stepdaughter", "female", "stepmother"),
    ("child", "male", "father"), ("child", "female", "mother"),
    ("ward", None, "guardian"),
    ("employer", None, "employee"),
    ("employee", None, "employer"),
    ("servant", None, "master"),
    ("apprentice", None, "master"),
    ("agent", None, "principal"),
    ("co-partner", None, "co-partner"),
    ("namesake", None, "namesake"),
    ("trustee", None, "beneficiary"),
    # "master" deliberately has NO entry -- genuinely ambiguous reciprocal
    # (servant or apprentice depending which relationship was actually
    # stated), sex doesn't disambiguate it. See RelationshipTypeReciprocal
    # docstring.
]


def seed_relationship_types(session: Session) -> dict[str, int]:
    name_to_id: dict[str, int] = {}
    for name in RELATIONSHIP_TYPE_NAMES:
        existing = session.exec(select(RelationshipType).where(RelationshipType.name == name)).first()
        if existing is None:
            existing = RelationshipType(name=name)
            session.add(existing)
            session.flush()
        name_to_id[name] = existing.id
    for rel_name, related_sex, recip_name in RECIPROCAL_SEED:
        row = RelationshipTypeReciprocal(
            relationship_type_id=name_to_id[rel_name],
            related_sex=related_sex,
            reciprocal_relationship_type_id=name_to_id[recip_name],
        )
        session.add(row)
    session.commit()
    return name_to_id


# ============================================================
# Phase 2: crime_type from offence_category + offence_type
# ============================================================


def migrate_crime_type(engine, session: Session) -> dict[tuple[str, int], int]:
    """Returns a mapping from ('category', old_id) / ('type', old_id) to
    the new crime_type.id, so summary_conviction_offence_type rows can be
    resolved in a later phase."""
    mapping: dict[tuple[str, int], int] = {}
    with engine.connect() as conn:
        categories = conn.execute(
            text("SELECT id, name, sort_order FROM offence_category")
        ).all()
        for old_id, name, sort_order in categories:
            row = CrimeType(name=name, parent_id=None, is_seeded=True, sort_order=sort_order)
            session.add(row)
            session.flush()
            mapping[("category", old_id)] = row.id
        session.commit()

        category_names_by_old_id = {old_id: name for old_id, name, _ in categories}
        types_ = conn.execute(
            text("SELECT id, name, is_seeded, category_id FROM offence_type")
        ).all()
        for old_id, name, is_seeded, category_id in types_:
            parent_new_id = mapping.get(("category", category_id)) if category_id else None
            # A leaf named identically to its own parent category is
            # redundant once category+type merge into one flat-namespace
            # tree (found: "unclassified" leaf under "unclassified"
            # category) -- map it directly onto the category's own row
            # instead of creating a duplicate-named child.
            if category_id and category_names_by_old_id.get(category_id) == name:
                mapping[("type", old_id)] = parent_new_id
                continue
            row = CrimeType(name=name, parent_id=parent_new_id, is_seeded=bool(is_seeded), sort_order=0)
            session.add(row)
            session.flush()
            mapping[("type", old_id)] = row.id
        session.commit()
    return mapping


# ============================================================
# Phase 3: location from place (+ petty_sessional_division appended)
# ============================================================


def migrate_location(engine, session: Session) -> None:
    with engine.connect() as conn:
        places = conn.execute(
            text(
                "SELECT id, name, parent_id, notes_public, notes_private, "
                "latitude, longitude, path_geometry FROM place"
            )
        ).all()
        # Preserve original place.id as the new location.id directly (1:1
        # replacement, no merge) -- insert every row with parent_id=NULL
        # first, then a second pass sets parent_id, so parent-before-child
        # ordering never has to be solved.
        for old_id, name, _parent_id, notes_public, notes_private, lat, lon, path_geom in places:
            conn.execute(
                text(
                    "INSERT INTO location (id, name, parent_id, notes_public, notes_private, "
                    "latitude, longitude, path_geometry) "
                    "VALUES (:id, :name, NULL, :notes_public, :notes_private, :lat, :lon, :path_geom)"
                ),
                {
                    "id": old_id, "name": name, "notes_public": notes_public,
                    "notes_private": notes_private, "lat": lat, "lon": lon, "path_geom": path_geom,
                },
            )
        conn.commit()
        for old_id, _name, parent_id, *_ in places:
            if parent_id is not None:
                conn.execute(
                    text("UPDATE location SET parent_id = :parent_id WHERE id = :id"),
                    {"parent_id": parent_id, "id": old_id},
                )
        conn.commit()

        max_id_row = conn.execute(text("SELECT MAX(id) FROM location")).first()
        next_id = (max_id_row[0] or 0) + 1
        divisions = conn.execute(text("SELECT id, name FROM petty_sessional_division")).all()
        division_id_map: dict[int, int] = {}
        for old_div_id, name in divisions:
            conn.execute(
                text("INSERT INTO location (id, name, parent_id) VALUES (:id, :name, NULL)"),
                {"id": next_id, "name": name},
            )
            division_id_map[old_div_id] = next_id
            next_id += 1
        conn.commit()
    session.commit()
    # Stash the division mapping on the module for the summary_conviction phase to use.
    global _DIVISION_ID_MAP
    _DIVISION_ID_MAP = division_id_map


_DIVISION_ID_MAP: dict[int, int] = {}


# ============================================================
# Phase 4: occupation, from distinct defendant+person occupation strings
# ============================================================


def migrate_occupations(engine, session: Session) -> dict[str, int]:
    """Mechanical get-or-create dump of whatever occupation strings exist
    right now. The full manual cleaning pass (multi-fact concatenation,
    relationship-info bundled in, wife/husband-swap leftovers,
    relationships_and_details occupation-leakage) is explicitly NOT
    attempted here -- flagged in the plan as separate, necessary follow-up
    work at the same rigor as the earlier 63-batch raw-text audit, not
    something to improvise inline in a migration script."""
    is_police_occupations = {
        "police constable", "superintendent of police", "sergeant of police",
        "constable for the north riding", "inspector of police",
        "constable of the north riding", "constable", "acting sergeant of police",
        "superintendent of police and inspector of weights and measures",
        "police officer", "special constable",
        "superintendent of police and inspector of weights and measures for the north riding",
        "superintendent of police and constable for the north riding",
        "superintendent of police and constable", "policeman", "police superintendent",
        "police constable for the north riding", "constable of the township of whitby",
        "constable of whitby", "assistant constable",
    }
    name_to_id: dict[str, int] = {}
    with engine.connect() as conn:
        names = set()
        for table in ("defendant", "person_old"):
            rows = conn.execute(text(f"SELECT DISTINCT occupation FROM {table} WHERE occupation IS NOT NULL"))
            names.update(r[0] for r in rows)
    for name in sorted(names):
        row = Occupation(name=name, is_police=name.strip().lower() in is_police_occupations)
        session.add(row)
        session.flush()
        name_to_id[name] = row.id
    session.commit()
    return name_to_id


# ============================================================
# Phase 5: person, from defendant + person_old
# ============================================================


def _split_first_middle(first_name: str | None) -> tuple[str | None, str | None]:
    if not first_name:
        return None, None
    parts = first_name.split(" ", 1)
    if len(parts) == 1:
        return parts[0], None
    return parts[0], parts[1]


def _parse_alias(defendant_id: int, alias_rows: list[tuple[str]]) -> str | None:
    names = [r[0] for r in alias_rows]
    return ", ".join(names) if names else None


def migrate_persons(
    engine,
    session: Session,
    occupation_map: dict[str, int],
) -> tuple[dict[int, int], dict[int, int]]:
    """Returns (old_defendant_id -> new_person_id, old_person_id -> new_person_id)."""
    defendant_to_new: dict[int, int] = {}
    person_to_new: dict[int, int] = {}

    with engine.connect() as conn:
        # offence_year per conviction, for birth_year computation.
        conviction_years = dict(
            conn.execute(
                text(
                    "SELECT id, CAST(strftime('%Y', offence_date) AS INTEGER) "
                    "FROM summary_conviction_old WHERE offence_date IS NOT NULL"
                )
            ).all()
        )
        defendant_convictions = {}
        for defendant_id, conviction_id in conn.execute(
            text("SELECT defendant_id, summary_conviction_id FROM summary_conviction_defendant")
        ).all():
            defendant_convictions.setdefault(defendant_id, []).append(conviction_id)
        person_convictions = {}
        for person_id, conviction_id in conn.execute(
            text("SELECT person_id, summary_conviction_id FROM involved_persons")
        ).all():
            person_convictions.setdefault(person_id, []).append(conviction_id)

        alias_rows: dict[int, list[tuple[str]]] = {}
        for defendant_id, alias_name in conn.execute(text("SELECT defendant_id, alias_name FROM alias")).all():
            alias_rows.setdefault(defendant_id, []).append((alias_name,))

        defendants = conn.execute(
            text(
                "SELECT id, first_name, last_name, name_qualifier, sex, age, "
                "occupation, location_id FROM defendant"
            )
        ).all()
        for (old_id, first_name, last_name, name_qualifier, sex, age, occupation, location_id) in defendants:
            fn, mn = _split_first_middle(first_name)
            birth_year = None
            if age is not None:
                conviction_ids = defendant_convictions.get(old_id, [])
                years = [conviction_years[cid] for cid in conviction_ids if cid in conviction_years]
                if years:
                    birth_year = years[0] - age
            new_person = Person(
                first_name=fn, middle_name=mn, last_name=last_name,
                name_postfix=name_qualifier, sex=sex, birth_year=birth_year,
                home_location_id=location_id,
                alias=_parse_alias(old_id, alias_rows.get(old_id, [])),
            )
            session.add(new_person)
            session.flush()
            defendant_to_new[old_id] = new_person.id
            if occupation:
                occ_id = occupation_map.get(occupation)
                if occ_id and not session.exec(
                    select(PersonOccupation).where(
                        PersonOccupation.person_id == new_person.id,
                        PersonOccupation.occupation_id == occ_id,
                    )
                ).first():
                    session.add(PersonOccupation(person_id=new_person.id, occupation_id=occ_id))
        session.commit()

        persons = conn.execute(
            text(
                "SELECT id, first_name, last_name, name_qualifier, age, "
                "occupation, location_id FROM person_old"
            )
        ).all()
        for (old_id, first_name, last_name, name_qualifier, age, occupation, location_id) in persons:
            fn, mn = _split_first_middle(first_name)
            birth_year = None
            if age is not None:
                conviction_ids = person_convictions.get(old_id, [])
                years = [conviction_years[cid] for cid in conviction_ids if cid in conviction_years]
                if years:
                    birth_year = years[0] - age
            new_person = Person(
                first_name=fn, middle_name=mn, last_name=last_name,
                name_postfix=name_qualifier, sex=None, birth_year=birth_year,
                home_location_id=location_id, alias=None,
            )
            session.add(new_person)
            session.flush()
            person_to_new[old_id] = new_person.id
            if occupation:
                occ_id = occupation_map.get(occupation)
                if occ_id and not session.exec(
                    select(PersonOccupation).where(
                        PersonOccupation.person_id == new_person.id,
                        PersonOccupation.occupation_id == occ_id,
                    )
                ).first():
                    session.add(PersonOccupation(person_id=new_person.id, occupation_id=occ_id))
        session.commit()

    return defendant_to_new, person_to_new


# ============================================================
# Phase 6: person_relationship, from relationship_type/related_to_name/
# related_person_id/spouse_person_id on defendant + person_old
# ============================================================


def _resolve_or_stub_person(
    session: Session,
    related_to_name: str,
    same_conviction_person_ids: list[int],
) -> int:
    """Best-effort: match related_to_name against people already on the
    same conviction by name; otherwise create a minimal stub Person row
    (required now that PersonRelationship.related_person_id is NOT NULL --
    every relationship resolves to a real row, per this project's own
    pre-existing "no unlinked strings" principle)."""
    parts = related_to_name.strip().split(" ")
    last = parts[-1]
    first = " ".join(parts[:-1]) if len(parts) > 1 else None
    for pid in same_conviction_person_ids:
        candidate = session.get(Person, pid)
        if candidate and candidate.last_name == last and (first is None or candidate.first_name == first):
            return pid
    stub = Person(first_name=first, last_name=last)
    session.add(stub)
    session.flush()
    return stub.id


def migrate_person_relationships(
    engine,
    session: Session,
    relationship_type_map: dict[str, int],
    defendant_to_new: dict[int, int],
    person_to_new: dict[int, int],
) -> None:
    with engine.connect() as conn:
        defendant_convictions: dict[int, int] = dict(
            conn.execute(
                text("SELECT defendant_id, summary_conviction_id FROM summary_conviction_defendant")
            ).all()
        )
        person_convictions: dict[int, int] = dict(
            conn.execute(text("SELECT person_id, summary_conviction_id FROM involved_persons")).all()
        )
        # All new person ids present on a given old conviction id, for name-matching.
        conviction_people: dict[int, list[int]] = {}
        for old_did, cid in conn.execute(
            text("SELECT defendant_id, summary_conviction_id FROM summary_conviction_defendant")
        ).all():
            conviction_people.setdefault(cid, []).append(defendant_to_new[old_did])
        for old_pid, cid in conn.execute(
            text("SELECT person_id, summary_conviction_id FROM involved_persons")
        ).all():
            conviction_people.setdefault(cid, []).append(person_to_new[old_pid])

        for source_table, id_map, conviction_lookup in (
            ("defendant", defendant_to_new, defendant_convictions),
            ("person_old", person_to_new, person_convictions),
        ):
            rows = conn.execute(
                text(
                    f"SELECT id, relationship_type, related_to_name, spouse_person_id "
                    f"FROM {source_table} WHERE relationship_type IS NOT NULL"
                )
            ).all()
            for old_id, rel_type, related_to_name, spouse_person_id in rows:
                new_person_id = id_map[old_id]
                rel_type_id = relationship_type_map.get(rel_type)
                if rel_type_id is None:
                    continue  # unrecognised value, shouldn't happen given the seeded vocabulary
                if spouse_person_id is not None:
                    related_person_id = person_to_new.get(spouse_person_id)
                    if related_person_id is None:
                        continue
                elif related_to_name:
                    conviction_id = conviction_lookup.get(old_id)
                    same_conviction = conviction_people.get(conviction_id, []) if conviction_id else []
                    related_person_id = _resolve_or_stub_person(
                        session, related_to_name, [p for p in same_conviction if p != new_person_id]
                    )
                else:
                    continue
                if related_person_id == new_person_id:
                    continue  # guard against the self-reference CHECK
                exists = session.exec(
                    select(PersonRelationship).where(
                        PersonRelationship.person_id == new_person_id,
                        PersonRelationship.relationship_type_id == rel_type_id,
                        PersonRelationship.related_person_id == related_person_id,
                    )
                ).first()
                if not exists:
                    session.add(
                        PersonRelationship(
                            person_id=new_person_id,
                            relationship_type_id=rel_type_id,
                            related_person_id=related_person_id,
                        )
                    )
            session.commit()


# ============================================================
# Phase 7: summary_conviction, from summary_conviction_old + raw_case.title
# ============================================================


def migrate_summary_convictions(engine, session: Session) -> None:
    with engine.connect() as conn:
        rows = conn.execute(
            text(
                "SELECT sc.id, sc.reference_number, rc.title, sc.conviction_date, "
                "sc.offence_date, sc.offence_date_raw, sc.offence_time, "
                "sc.charge_description, sc.raw_record "
                "FROM summary_conviction_old sc "
                "LEFT JOIN raw_case rc ON rc.id = sc.raw_case_id"
            )
        ).all()
        for (old_id, record_number, title, conviction_date, offence_date,
             offence_date_raw, offence_time, charge_description, raw_record) in rows:
            conn.execute(
                text(
                    "INSERT INTO summary_conviction "
                    "(id, record_number, title, conviction_date, offence_date, "
                    "offence_date_raw, offence_time, charge_description, raw_record) "
                    "VALUES (:id, :record_number, :title, :conviction_date, :offence_date, "
                    ":offence_date_raw, :offence_time, :charge_description, :raw_record)"
                ),
                {
                    "id": old_id, "record_number": record_number, "title": title,
                    "conviction_date": conviction_date, "offence_date": offence_date,
                    "offence_date_raw": offence_date_raw, "offence_time": offence_time,
                    "charge_description": charge_description, "raw_record": raw_record,
                },
            )
        conn.commit()
    session.commit()


# ============================================================
# Phase 8: summary_conviction_location, from offence_location_id/
# court_location_id/petty_sessional_division_id on summary_conviction_old
# ============================================================


def migrate_summary_conviction_locations(engine, session: Session) -> None:
    with engine.connect() as conn:
        rows = conn.execute(
            text(
                "SELECT id, offence_location_id, court_location_id, "
                "petty_sessional_division_id FROM summary_conviction_old"
            )
        ).all()
    for conviction_id, offence_loc, court_loc, division_id in rows:
        if offence_loc is not None:
            session.add(
                SummaryConvictionLocation(
                    summary_conviction_id=conviction_id, location_id=offence_loc,
                    role="location of offence",
                )
            )
        if court_loc is not None:
            session.add(
                SummaryConvictionLocation(
                    summary_conviction_id=conviction_id, location_id=court_loc,
                    role="court location",
                )
            )
        if division_id is not None and division_id in _DIVISION_ID_MAP:
            session.add(
                SummaryConvictionLocation(
                    summary_conviction_id=conviction_id,
                    location_id=_DIVISION_ID_MAP[division_id],
                    role="petty sessional division",
                )
            )
    session.commit()


# ============================================================
# Phase 9: summary_conviction_crime_type, from summary_conviction_offence_type
# ============================================================


def migrate_summary_conviction_crime_types(
    engine, session: Session, crime_type_map: dict[tuple[str, int], int]
) -> None:
    with engine.connect() as conn:
        rows = conn.execute(
            text("SELECT summary_conviction_id, offence_type_id FROM summary_conviction_offence_type")
        ).all()
    for conviction_id, offence_type_id in rows:
        new_id = crime_type_map.get(("type", offence_type_id))
        if new_id is None:
            continue
        exists = session.exec(
            select(SummaryConvictionCrimeType).where(
                SummaryConvictionCrimeType.summary_conviction_id == conviction_id,
                SummaryConvictionCrimeType.crime_type_id == new_id,
            )
        ).first()
        if not exists:
            session.add(SummaryConvictionCrimeType(summary_conviction_id=conviction_id, crime_type_id=new_id))
    session.commit()


# ============================================================
# Phase 10: summary_conviction_person, from summary_conviction_defendant +
# involved_persons
# ============================================================


def migrate_summary_conviction_persons(
    engine, session: Session, defendant_to_new: dict[int, int], person_to_new: dict[int, int]
) -> None:
    with engine.connect() as conn:
        for old_did, conviction_id in conn.execute(
            text("SELECT defendant_id, summary_conviction_id FROM summary_conviction_defendant")
        ).all():
            session.add(
                SummaryConvictionPerson(
                    summary_conviction_id=conviction_id,
                    person_id=defendant_to_new[old_did],
                    role="defendant",
                )
            )
        session.commit()
        for old_pid, conviction_id, role in conn.execute(
            text("SELECT person_id, summary_conviction_id, role FROM involved_persons")
        ).all():
            session.add(
                SummaryConvictionPerson(
                    summary_conviction_id=conviction_id,
                    person_id=person_to_new[old_pid],
                    role=role or "unspecified",
                )
            )
        session.commit()


# ============================================================
# Phase 11: related_conviction, copied as-is (ids unchanged)
# ============================================================


def migrate_related_convictions(engine, session: Session) -> None:
    with engine.connect() as conn:
        rows = conn.execute(
            text(
                "SELECT summary_conviction_id_a, summary_conviction_id_b, note "
                "FROM related_conviction_old"
            )
        ).all()
        for a, b, note in rows:
            conn.execute(
                text(
                    "INSERT INTO related_conviction (summary_conviction_id_a, summary_conviction_id_b, note) "
                    "VALUES (:a, :b, :note)"
                ),
                {"a": a, "b": b, "note": note},
            )
        conn.commit()


def main() -> None:
    settings = Settings.from_env()
    engine = get_engine(settings.db_path)

    print("Phase 0: rename colliding tables aside, create new tables...")
    rename_colliding_tables_aside(engine)
    create_new_tables(engine)

    with Session(engine) as session:
        print("Phase 1: relationship_type vocabulary...")
        relationship_type_map = seed_relationship_types(session)

        print("Phase 2: crime_type...")
        crime_type_map = migrate_crime_type(engine, session)

        print("Phase 3: location...")
        migrate_location(engine, session)

        print("Phase 4: occupation...")
        occupation_map = migrate_occupations(engine, session)

        print("Phase 5: person...")
        defendant_to_new, person_to_new = migrate_persons(engine, session, occupation_map)
        print(f"  {len(defendant_to_new)} defendants + {len(person_to_new)} persons migrated")

        print("Phase 6: person_relationship...")
        migrate_person_relationships(
            engine, session, relationship_type_map, defendant_to_new, person_to_new
        )

        print("Phase 7: summary_conviction...")
        migrate_summary_convictions(engine, session)

        print("Phase 8: summary_conviction_location...")
        migrate_summary_conviction_locations(engine, session)

        print("Phase 9: summary_conviction_crime_type...")
        migrate_summary_conviction_crime_types(engine, session, crime_type_map)

        print("Phase 10: summary_conviction_person...")
        migrate_summary_conviction_persons(engine, session, defendant_to_new, person_to_new)

        print("Phase 11: related_conviction...")
        migrate_related_convictions(engine, session)

    print("Migration complete.")


if __name__ == "__main__":
    main()
