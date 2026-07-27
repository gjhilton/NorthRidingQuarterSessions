"""One-off fix for confirmed issues found in batches 6-10 of the raw-text-
vs-extraction audit. Each entry was individually verified against
raw_record before being added here.

Sections:
  A. offence_type retags/additions against OFFENCE_TAXONOMY
  B. named places mentioned in raw text but never captured
  C. occupations stated in raw text for a spouse-linked person (see
     backfill_spouses.py) that the original extraction dropped
  D. children named in raw text but missing from involved_persons
  E. individual corrections: two invented-precision fields (an occupation
     inferred from an address, an age inferred from "under 16"), one
     bracketed alternate name never captured as an alias, one
     wrong offence_type on a "removing a barrier" charge

Idempotent in spirit (each target value is set unconditionally, so
re-running is a no-op), but this is a fixed list of specific rows, not a
general backfill -- it is not meant to be re-run against a different
database.

Usage:
    python3 fix_batch_6_10_issues.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import (
    Alias,
    Defendant,
    InvolvedPerson,
    Person,
    SummaryConviction,
    SummaryConvictionOffenceType,
)
from qsrecords.models.reference import Place
from qsrecords.offence_types import get_or_create_offence_type
from qsrecords.text import normalize_name

REPLACEMENTS = [
    ("QSB 1876 1/10/10/34", "vagrancy", "loitering/suspected person"),
    ("QSB 1834 1/10/38", "unclassified", "maritime offence"),
    ("QSB 1870 1/10/14/38", "unclassified", "maritime offence"),
    ("QSB 1876 1/10/10/22", "unclassified", "furious/reckless driving"),
    ("QSB 1836 3/10/24", "malicious/property damage", "cruelty to animals"),
    ("QSB 1876 1/10/10/20", "poaching", "fishing offence"),
    ("QSB 1869 Q4/10/14-24", "vagrancy", "loitering/suspected person"),
    ("QSB 1869 Q4/10/14-37", "breach of the peace", "indecent behaviour"),
    ("QSB 1869 Q4/10/14-38", "breach of the peace", "indecent behaviour"),
    ("QSB 1869 Q4/10/14-39", "breach of the peace", "indecent behaviour"),
    ("QSB 1875 4/10/10/29", "licensing offence", "dog licence offence"),
    ("QSB 1889 4/10/11/89", "breach of the peace", "disorderly behaviour"),
    ("QSB 1869 Q4/10/14-63", "unclassified", "furious/reckless driving"),
    ("QSB 1875 4/10/10/21", "unclassified", "furious/reckless driving"),
    ("QSB 1875 4/10/10/18", "unclassified", "furious/reckless driving"),
    ("QSB 1869 Q4/10/14-75", "unclassified", "furious/reckless driving"),
    ("QSB 1869 Q4/10/14-111", "breach of the peace", "indecent behaviour"),
    ("QSB 1869 Q4/10/14-114", "unclassified", "furious/reckless driving"),
    ("QSB 1869 Q4/10/14/117", "breach of the peace", "indecent behaviour"),
    ("QSB 1889 3/10/9/28", "unclassified", "maritime offence"),
    ("QSB 1875 4/10/10/59", "unclassified", "furious/reckless driving"),
    ("QSB 1875 4/10/10/1", "obstructing the highway", "malicious/property damage"),
]

# "Common prostitute behaving indecently" -- indecent behaviour alone
# doesn't capture the status element, so these three also get a second tag.
ADDITIONS = [
    ("QSB 1869 Q4/10/14-37", "prostitution"),
    ("QSB 1869 Q4/10/14-38", "prostitution"),
    ("QSB 1869 Q4/10/14-39", "prostitution"),
    ("QSB 1869 Q4/10/14-111", "prostitution"),
    ("QSB 1869 Q4/10/14/117", "prostitution"),
]

# (place name, township place-tree parent id, [reference numbers]) for
# brand-new places; a fixed "point" leaf under the township named in
# raw_record's own "Offence committed at..." clause.
NEW_PLACES = [
    ("Rigg Hill", 87, ["QSB 1836 2/10/47"]),  # Hawsker-cum-Stainsacre
    ("Aislaby Street", 1345, ["QSB 1869 Q4/10/14-11"]),  # placeholder, replaced below
    ("Hinderwell Street", 88, ["QSB 1869 Q4/10/14-20"]),
    ("West Cliff", 94, ["QSB 1869 Q4/10/14-24"]),  # Ruswarp
    ("Dean Hall", 8, ["QSB 1875 4/10/10/37"]),  # Eskdaleside-cum-Ugglebarnby
    ("St Mary's Churchyard", 87, ["QSB 1875 4/10/10/122"]),  # Hawsker-cum-Stainsacre (as stated in raw_record)
    ("High Stakesby", 94, ["QSB 1889 3/10/9/47"]),  # Ruswarp
    ("Abbey Farm", 87, ["QSB 1869 3/10/13/33"]),  # Hawsker-cum-Stainsacre
]

# Already-existing places that just needed linking.
EXISTING_PLACE_LINKS = [
    ("QSB 1889 4/10/11/80", "Robin Hood's Bay"),
    ("QSB 1888 4/10/10/23", "Sleights"),
]

# (occupation, involved_person id) for spouse-linked persons whose
# occupation raw_record states but the original extraction dropped.
OCCUPATION_FIXES = [
    (3451, "fisherman"),  # Robert Austin, QSB 1869 Q4/10/14-25
    (3453, "labourer"),  # Amos Craven, QSB 1889 4/10/11/48
    (3450, "jet worker"),  # William George Hansell, QSB 1889 4/10/11/58
]

# (reference_number, [(first_name, last_name), ...], role)
MISSING_CHILDREN = [
    ("QSB 1889 3/10/9/41", [("John", "Foster")], "child"),
    ("QSB 1889 3/10/9/58", [("Jane Elizabeth", "Dixon")], "child"),
    ("QSB 1889 3/10/9/42", [("Sarah", "Parkin")], "child"),
    ("QSB 1889 3/10/9/43", [("Caroline", "Howard")], "child"),
    ("QSB 1888 4/10/10/4", [("Minnie", "Walker")], "child"),
    # Surname inferred from their father, John Smith the elder -- raw_record
    # gives only first names ("his children John, Annie and Charles").
    ("QSB 1889 4/10/11/92", [("John", "Smith"), ("Annie", "Smith"), ("Charles", "Smith")], "child"),
]


def _get_conviction(session: Session, reference_number: str) -> SummaryConviction:
    conviction = session.exec(
        select(SummaryConviction).where(SummaryConviction.reference_number == reference_number)
    ).first()
    if conviction is None:
        raise ValueError(f"No conviction found for {reference_number!r}")
    return conviction


def _apply_retags(session: Session) -> list[str]:
    report = []
    for reference_number, old_leaf, new_leaf in REPLACEMENTS:
        conviction = _get_conviction(session, reference_number)
        old_type = get_or_create_offence_type(session, old_leaf)
        new_type = get_or_create_offence_type(session, new_leaf)

        old_link = session.exec(
            select(SummaryConvictionOffenceType).where(
                SummaryConvictionOffenceType.summary_conviction_id == conviction.id,
                SummaryConvictionOffenceType.offence_type_id == old_type.id,
            )
        ).first()
        new_link_exists = session.exec(
            select(SummaryConvictionOffenceType).where(
                SummaryConvictionOffenceType.summary_conviction_id == conviction.id,
                SummaryConvictionOffenceType.offence_type_id == new_type.id,
            )
        ).first()
        changed = False
        if old_link is not None:
            session.delete(old_link)
            changed = True
        if new_link_exists is None:
            session.add(
                SummaryConvictionOffenceType(
                    summary_conviction_id=conviction.id, offence_type_id=new_type.id
                )
            )
            changed = True
        if changed:
            report.append(f"{reference_number}: {old_leaf!r} -> {new_leaf!r}")

    for reference_number, add_leaf in ADDITIONS:
        conviction = _get_conviction(session, reference_number)
        add_type = get_or_create_offence_type(session, add_leaf)
        exists = session.exec(
            select(SummaryConvictionOffenceType).where(
                SummaryConvictionOffenceType.summary_conviction_id == conviction.id,
                SummaryConvictionOffenceType.offence_type_id == add_type.id,
            )
        ).first()
        if exists is None:
            session.add(
                SummaryConvictionOffenceType(
                    summary_conviction_id=conviction.id, offence_type_id=add_type.id
                )
            )
            report.append(f"{reference_number}: + {add_leaf!r}")
    return report


def _get_or_create_place(session: Session, name: str, parent_id: int) -> Place:
    existing = session.exec(
        select(Place).where(Place.name == name, Place.parent_id == parent_id)
    ).first()
    if existing:
        return existing
    place = Place(name=name, parent_id=parent_id, type="point")
    session.add(place)
    session.flush()
    return place


def _apply_places(session: Session) -> list[str]:
    report = []
    # Aislaby's place-tree parent id, looked up by name (not hardcoded like
    # the others, to avoid a wrong guess).
    aislaby_place = session.exec(
        select(Place).where(Place.name == "Aislaby", Place.parent_id == 345)
    ).first()

    for name, parent_id, refs in NEW_PLACES:
        actual_parent_id = aislaby_place.id if name == "Aislaby Street" else parent_id
        place = _get_or_create_place(session, name, actual_parent_id)
        for ref in refs:
            conviction = _get_conviction(session, ref)
            conviction.offence_location_id = place.id
            report.append(f"{ref}: + place {name!r}")

    for ref, place_name in EXISTING_PLACE_LINKS:
        place = session.exec(select(Place).where(Place.name == place_name)).first()
        conviction = _get_conviction(session, ref)
        conviction.offence_location_id = place.id
        report.append(f"{ref}: linked to existing place {place_name!r}")
    return report


def _apply_occupation_fixes(session: Session) -> list[str]:
    report = []
    for person_id, occupation in OCCUPATION_FIXES:
        person = session.get(Person, person_id)
        person.occupation = occupation
        report.append(f"Person #{person_id} ({person.first_name} {person.last_name}): occupation -> {occupation!r}")
    return report


def _apply_missing_children(session: Session) -> list[str]:
    report = []
    for reference_number, names, role in MISSING_CHILDREN:
        conviction = _get_conviction(session, reference_number)
        for first_name, last_name in names:
            p = Person(first_name=first_name, last_name=last_name, name_key=normalize_name(first_name, last_name))
            session.add(p)
            session.flush()
            session.add(InvolvedPerson(summary_conviction_id=conviction.id, person_id=p.id, role=role))
            report.append(f"{reference_number}: + {first_name} {last_name} (role={role})")
    return report


def _apply_individual_corrections(session: Session) -> list[str]:
    report = []

    # William Bradley: occupation "innkeeper of..." was inferred from his
    # address, not stated in raw_record at all -- clear to unstated.
    bradley = session.get(Defendant, 837)
    report.append(f"Defendant #837 (Bradley): occupation {bradley.occupation!r} -> None")
    bradley.occupation = None

    # Esther Mary Pottas: raw_record only says "under the age of 16 years",
    # not an exact age -- 15 was an invented precision.
    pottas = session.get(Person, 496)
    report.append(f"Person #496 (Pottas): age {pottas.age!r} -> None")
    pottas.age = None

    # Elizabeth Sneaton [Elizabeth Skinner]: the bracketed alternate name
    # was never captured -- added as an alias, same mechanism used for
    # every other defendant alt-name in this dataset.
    exists = session.exec(
        select(Alias).where(Alias.defendant_id == 868, Alias.alias_name == "Elizabeth Skinner")
    ).first()
    if exists is None:
        session.add(Alias(defendant_id=868, alias_name="Elizabeth Skinner"))
        report.append("Defendant #868 (Sneaton): + alias 'Elizabeth Skinner'")

    return report


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        report = []
        report += _apply_retags(session)
        report += _apply_places(session)
        report += _apply_occupation_fixes(session)
        report += _apply_missing_children(session)
        report += _apply_individual_corrections(session)
        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
