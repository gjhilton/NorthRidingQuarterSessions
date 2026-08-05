"""One-off (but safely re-runnable) backfill: turns the spouse named in
Defendant/Person.related_to_name (wherever relationship_type == "wife" --
the only spousal value the extraction ever produced; there are no "husband"
rows) into a real Person row, linked structurally via the new
spouse_person_id column, instead of leaving that name as unlinked text.

For each qualifying row:
  - related_to_name is split into first/last name (last whitespace-separated
    token is the surname; a single-token name like "Thompson" becomes a
    surname-only Person with first_name=None).
  - If an InvolvedPerson already exists on the same conviction whose Person
    has the same first+last name (case-insensitive), that existing Person is
    reused as the spouse -- e.g. several records already separately
    extracted the husband as his own involved_persons entry with a role
    like "husband of defendant"/"husband of victim"/"husband". Without this
    check the first version of this script created a second, mostly-empty
    duplicate Person for the same real mention instead of recognizing the
    one already there (see fix_duplicate_spouse_entries.py, which repaired
    the 15 rows this produced before the check existed).
  - Otherwise, a new Person row is created for the spouse, attached to the
    same conviction(s) as the origin row via a new InvolvedPerson, with a
    role that records whose spouse they are: "spouse of offender" (origin
    is a Defendant), or, when the origin is a Person, "spouse of
    victim"/"spouse of police officer"/"spouse of involved person"
    depending on that origin Person's own role on the same conviction.
  - origin_row.spouse_person_id is set to the (reused or new) Person's id.

related_to_name/relationship_type on the origin row are left untouched --
they're the original extracted text and remain the provenance for the new
row, not something this script edits or removes.

Idempotent -- only rows with spouse_person_id IS NULL are considered, so
re-running after new records are added only touches genuinely new rows.

Usage:
    python3 backfill_spouses.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, InvolvedPerson, Person, SummaryConvictionDefendant
from qsrecords.text import normalize_name


def _split_related_name(raw: str) -> tuple[str | None, str]:
    tokens = raw.split()
    if len(tokens) <= 1:
        return None, raw.strip()
    return " ".join(tokens[:-1]), tokens[-1]


def _classify_person_role(existing_role: str | None) -> str:
    role = (existing_role or "").lower()
    if "police" in role:
        return "spouse of police officer"
    if "victim" in role:
        return "spouse of victim"
    return "spouse of involved person"


def _is_wife_row(relationship_type: str | None, related_to_name: str | None) -> bool:
    return (
        relationship_type is not None
        and relationship_type.strip().lower() == "wife"
        and related_to_name is not None
        and related_to_name.strip() != ""
    )


def _find_existing_match(
    session: Session, conviction_id: int, first_name: str | None, last_name: str
) -> Person | None:
    candidates = session.exec(
        select(Person)
        .join(InvolvedPerson, InvolvedPerson.person_id == Person.id)
        .where(InvolvedPerson.summary_conviction_id == conviction_id)
    ).all()
    for candidate in candidates:
        if (candidate.last_name or "").strip().lower() != last_name.strip().lower():
            continue
        if (candidate.first_name or "").strip().lower() != (first_name or "").strip().lower():
            continue
        return candidate
    return None


def _backfill_defendants(session: Session) -> list[str]:
    fixed = []
    rows = session.exec(
        select(Defendant).where(Defendant.spouse_person_id.is_(None))
    ).all()
    for row in rows:
        if not _is_wife_row(row.relationship_type, row.related_to_name):
            continue
        first_name, last_name = _split_related_name(row.related_to_name.strip())

        conviction_ids = session.exec(
            select(SummaryConvictionDefendant.summary_conviction_id).where(
                SummaryConvictionDefendant.defendant_id == row.id
            )
        ).all()

        spouse = None
        for conviction_id in conviction_ids:
            spouse = _find_existing_match(session, conviction_id, first_name, last_name)
            if spouse:
                break

        if spouse is None:
            spouse = Person(
                first_name=first_name,
                last_name=last_name,
                name_key=normalize_name(first_name, last_name),
            )
            session.add(spouse)
            session.flush()
            for conviction_id in conviction_ids:
                session.add(
                    InvolvedPerson(
                        summary_conviction_id=conviction_id,
                        person_id=spouse.id,
                        role="spouse of offender",
                    )
                )

        row.spouse_person_id = spouse.id
        fixed.append(
            f"Defendant #{row.id} ({row.first_name} {row.last_name}): "
            f"wife of -> Person #{spouse.id} ({first_name} {last_name})"
        )
    return fixed


def _backfill_persons(session: Session) -> list[str]:
    fixed = []
    rows = session.exec(select(Person).where(Person.spouse_person_id.is_(None))).all()
    for row in rows:
        if not _is_wife_row(row.relationship_type, row.related_to_name):
            continue
        first_name, last_name = _split_related_name(row.related_to_name.strip())

        own_involvements = session.exec(
            select(InvolvedPerson).where(InvolvedPerson.person_id == row.id)
        ).all()

        spouse = None
        for involvement in own_involvements:
            spouse = _find_existing_match(
                session, involvement.summary_conviction_id, first_name, last_name
            )
            if spouse:
                break

        if spouse is None:
            spouse = Person(
                first_name=first_name,
                last_name=last_name,
                name_key=normalize_name(first_name, last_name),
            )
            session.add(spouse)
            session.flush()
            for involvement in own_involvements:
                session.add(
                    InvolvedPerson(
                        summary_conviction_id=involvement.summary_conviction_id,
                        person_id=spouse.id,
                        role=_classify_person_role(involvement.role),
                    )
                )

        row.spouse_person_id = spouse.id
        fixed.append(
            f"Person #{row.id} ({row.first_name} {row.last_name}): "
            f"wife of -> Person #{spouse.id} ({first_name} {last_name})"
        )
    return fixed


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        fixed = _backfill_defendants(session) + _backfill_persons(session)
        session.commit()
    if fixed:
        print(f"Created {len(fixed)} spouse Person record(s):")
        for line in fixed:
            print(f"  {line}")
    else:
        print("Nothing to fix.")


if __name__ == "__main__":
    main()
