"""One-off fix for genuine family/employment relationship_type gaps found
while auditing batches 6-10 of the relationship-extraction sweep. Each item
individually re-verified against the live database and raw_record first.

Two kinds of gap found:
  - relationship_type/related_to_name missing on an ALREADY-extracted person
    row (batch 8's four truancy cases, batch 9's Minnie Walker, batch 10's
    Esther Mary Pottas)
  - the related child was never extracted as a Person/InvolvedPerson row at
    all (batch 10's three other truancy cases) -- created here, matching the
    established pattern for truancy children (role="child" on
    involved_persons, relationship_type="son"/"daughter" on the person).

Usage:
    python3 fix_relationship_gaps_batch_6_10.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import InvolvedPerson, Person, SummaryConviction
from qsrecords.text import normalize_name

# person_id -> (relationship_type, related_to_name)
EXISTING_PERSON_UPDATES = {
    3820: ("son", "James Foster"),           # John Foster, QSB 1889 3/10/9/41
    3822: ("daughter", "John Parkin"),       # Sarah Parkin, QSB 1889 3/10/9/42
    3823: ("daughter", "Thomas Howard"),     # Caroline Howard, QSB 1889 3/10/9/43
    3821: ("daughter", "James Dixon"),       # Jane Elizabeth Dixon, QSB 1889 3/10/9/58
    3824: ("daughter", "William George Walker"),  # Minnie Walker, QSB 1888 4/10/10/4
    496: ("employee", "Matthew Langdale"),   # Esther Mary Pottas, QSB 1888 4/10/10/32
}

# reference_number -> (first_name, last_name, relationship_type, related_to_name)
# -- these children were never extracted as Person rows at all.
NEW_CHILD_PERSONS = [
    ("QSB 1888 4/10/10/5", "Mary Ellen", "Atkinson", "daughter", "John Atkinson"),
    ("QSB 1888 4/10/10/23", "Amelia", "Smithies", "daughter", "Robinson Smithies"),
    ("QSB 1888 4/10/10/29", "William Vasey", "Watson", "son", "George Watson"),
]


def _get_conviction(session: Session, reference_number: str) -> SummaryConviction:
    conviction = session.exec(
        select(SummaryConviction).where(SummaryConviction.reference_number == reference_number)
    ).first()
    if conviction is None:
        raise ValueError(f"No conviction found for {reference_number!r}")
    return conviction


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    report = []
    with get_session(settings.db_path) as session:
        for person_id, (relationship_type, related_to_name) in EXISTING_PERSON_UPDATES.items():
            p = session.get(Person, person_id)
            report.append(
                f"Person #{person_id} ({p.first_name} {p.last_name}): "
                f"+ relationship_type={relationship_type!r}, related_to_name={related_to_name!r}"
            )
            p.relationship_type = relationship_type
            p.related_to_name = related_to_name

        for reference_number, first_name, last_name, relationship_type, related_to_name in NEW_CHILD_PERSONS:
            conviction = _get_conviction(session, reference_number)
            child = Person(
                first_name=first_name,
                last_name=last_name,
                name_key=normalize_name(first_name, last_name),
                relationship_type=relationship_type,
                related_to_name=related_to_name,
            )
            session.add(child)
            session.flush()
            session.add(
                InvolvedPerson(summary_conviction_id=conviction.id, person_id=child.id, role="child")
            )
            report.append(
                f"{reference_number}: + Person #{child.id} ({first_name} {last_name}), "
                f"relationship_type={relationship_type!r}, related_to_name={related_to_name!r}, role=child"
            )

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
