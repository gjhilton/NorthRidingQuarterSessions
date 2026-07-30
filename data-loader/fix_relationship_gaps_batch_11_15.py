"""One-off fix for genuine family/employment relationship_type gaps found
while auditing batches 11-15 of the relationship-extraction sweep. Each item
individually re-verified against the live database and raw_record first.

Usage:
    python3 fix_relationship_gaps_batch_11_15.py
"""

from sqlmodel import Session

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Person

# person_id -> (relationship_type, related_to_name)
PERSON_UPDATES = {
    739: ("daughter", "Thomas Dixon"),              # Jane Elizabeth Dixon, QSB 1888 2/10/11/17
    635: ("son", "Robert Pennock"),                 # Robert Pennock (son), QSB 1888 3/10/10/6
    636: ("son", "William Ruehorn"),                # William Ruehorn (son), QSB 1888 3/10/10/7
    614: ("employee", "Robert Hutton"),              # William Barrett, QSB 1888 4/10/10/111
    617: ("stepson", "William Robert Laidler"),      # Joseph Readman, QSB 1888 4/10/10/112
    620: ("stepson", "William Robert Laidler"),      # Thomas William Readman, QSB 1888 4/10/10/113
}


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    report = []
    with get_session(settings.db_path) as session:
        for person_id, (relationship_type, related_to_name) in PERSON_UPDATES.items():
            p = session.get(Person, person_id)
            report.append(
                f"Person #{person_id} ({p.first_name} {p.last_name}): "
                f"+ relationship_type={relationship_type!r}, related_to_name={related_to_name!r}"
            )
            p.relationship_type = relationship_type
            p.related_to_name = related_to_name

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
