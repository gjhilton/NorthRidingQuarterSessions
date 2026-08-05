"""One-off fix for genuine employment relationship_type gaps found while
auditing batches 31-35 of the relationship-extraction sweep. Each item
individually re-verified against the live database and raw_record first.

Usage:
    python3 fix_relationship_gaps_batch_31_35.py
"""

from sqlmodel import Session

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant

# defendant_id -> (relationship_type, related_to_name)
UPDATES = {
    3567: ("employee", "Christopher Mead"),                               # Robert Jeffles, QSB 1874 1/10/10/8
    3360: ("employee", "Charles Bagnall and Thomas Bagnall the younger"),  # Isaac Cheney, QSB 1866 1/10/15/32
    3455: ("servant", "William Hayes"),                                   # Eliza Jane Frankland ("servant in husbandry"), QSB 1875 2/10/10/60
}


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    report = []
    with get_session(settings.db_path) as session:
        for defendant_id, (relationship_type, related_to_name) in UPDATES.items():
            d = session.get(Defendant, defendant_id)
            d.relationship_type = relationship_type
            d.related_to_name = related_to_name
            report.append(
                f"Defendant #{defendant_id} ({d.first_name} {d.last_name}): "
                f"+ relationship_type={relationship_type!r}, related_to_name={related_to_name!r}"
            )
        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
