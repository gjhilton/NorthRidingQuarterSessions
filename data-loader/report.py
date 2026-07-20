"""Data-quality / research reports over the extracted database.

Not a pipeline step -- run any time, as often as you like (read-only,
no cost). Surfaces two things worth periodic human review:

1. Names that recur across cases (candidates for manual cross-case identity
   resolution -- deciding whether two mentions are the same real person is
   deliberately out of scope for the extraction pipeline itself).
2. Offence categories the LLM proposed beyond the seed list, so near-
   duplicates ("possession of short weights" vs "possession of inaccurate
   weights") can be reviewed and merged by hand.

Usage:
    python3 report.py [--min-occurrences N]
"""

import argparse

from qsrecords.config import Settings
from qsrecords.db import get_session
from qsrecords.reports import (
    defendant_case_references,
    person_case_references,
    repeated_defendant_names,
    repeated_person_names,
    unreviewed_offence_types,
)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--min-occurrences",
        type=int,
        default=2,
        help="Only show names appearing at least this many times (default: 2).",
    )
    args = parser.parse_args()

    settings = Settings.from_env()

    with get_session(settings.db_path) as session:
        print(f"=== Defendant names appearing >= {args.min_occurrences} times ===")
        defendant_rows = repeated_defendant_names(session, args.min_occurrences)
        if not defendant_rows:
            print("  (none yet)")
        for name_key, count in defendant_rows:
            print(f"  {name_key} ({count}x)")
            for reference_number, conviction_date in defendant_case_references(session, name_key):
                print(f"    - {reference_number} ({conviction_date})")

        print(f"\n=== Involved-person names appearing >= {args.min_occurrences} times ===")
        person_rows = repeated_person_names(session, args.min_occurrences)
        if not person_rows:
            print("  (none yet)")
        for name_key, count in person_rows:
            print(f"  {name_key} ({count}x)")
            for reference_number, conviction_date in person_case_references(session, name_key):
                print(f"    - {reference_number} ({conviction_date})")

        print("\n=== LLM-proposed offence types not yet reviewed (is_seeded=0) ===")
        offence_rows = unreviewed_offence_types(session)
        if not offence_rows:
            print("  (none yet)")
        for name, count in offence_rows:
            print(f"  {name} ({count} case(s))")


if __name__ == "__main__":
    main()
