"""Data-quality / research reports over the extracted database.

Not a pipeline step -- run any time, as often as you like (read-only,
no cost). Surfaces two things worth periodic human review:

1. Names that recur across cases, in any role (defendant, victim, witness,
   ...) -- candidates for manual cross-case identity resolution, which is
   deliberately out of scope for the extraction pipeline itself. v3's
   unified Person table means this is one list now, not a defendant/
   involved-person split.
2. Crime types the LLM proposed that haven't been folded into the curated
   taxonomy yet (see qsrecords.offence_types.OFFENCE_TAXONOMY) -- either a
   genuinely new proposal, or a near-duplicate of an existing leaf that
   should be folded into it via OFFENCE_TAXONOMY's merge list.

Usage:
    python3 report.py [--min-occurrences N]
"""

import argparse

from qsrecords.config import Settings
from qsrecords.db import get_session
from qsrecords.reports import case_references, repeated_names, unreviewed_crime_types


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
        print(f"=== Person names appearing >= {args.min_occurrences} times ===")
        rows = repeated_names(session, args.min_occurrences)
        if not rows:
            print("  (none yet)")
        for name_key, count in rows:
            print(f"  {name_key} ({count}x)")
            for record_number, conviction_date in case_references(session, name_key):
                print(f"    - {record_number} ({conviction_date})")

        print("\n=== Crime types with no taxonomy category assigned ===")
        crime_type_rows = unreviewed_crime_types(session)
        if not crime_type_rows:
            print("  (none yet)")
        for name, count in crime_type_rows:
            print(f"  {name} ({count} case(s))")


if __name__ == "__main__":
    main()
