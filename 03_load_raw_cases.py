"""Step 3: stage Summary Conviction rows from data/whitby.csv into SQLite.

Replaces 03_postprocess_resources.py, which wrote one .txt file per record
under data/summary_convictions/ (filename = sanitized reference_number) and
silently dropped one of every pair of records sharing a reference_number
(11 such collisions exist in the source data, confirmed via direct
inspection). Rows are staged here as `raw_case` rows keyed on the CSV's
`url` column instead, which is unique across all 9,497 rows.

Usage:
    python3 03_load_raw_cases.py [--csv-path data/whitby.csv]
"""

import argparse
from pathlib import Path

from qsrecords.config import Settings
from qsrecords.csv_ingest import load_raw_cases
from qsrecords.db import get_session, init_db


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv-path", default="data/whitby.csv")
    args = parser.parse_args()

    settings = Settings.from_env()
    init_db(settings.db_path)

    with get_session(settings.db_path) as session:
        inserted, skipped = load_raw_cases(session, Path(args.csv_path))

    print(f"Inserted {inserted} new raw_case rows, skipped {skipped} already-loaded rows.")


if __name__ == "__main__":
    main()
