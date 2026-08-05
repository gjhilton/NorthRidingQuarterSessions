"""One-off (but safely re-runnable) backfill for a parser gap in
qsrecords/dates.py: parse_historical_date's regex required an exact
"D Month YYYY" string and had no allowance for a leading day-of-week word,
so any offence_date_raw like "Sunday 19 July 1835" silently failed to
parse -- offence_date_raw was stored correctly, but offence_date/
offence_day_of_week/offence_day_of_month/offence_year were all left NULL.
Found via a raw-text-vs-extraction audit; confirmed to affect 27 of the
44 rows with a NULL offence_date. dates.py now strips a leading
day-of-week before matching (see _DAY_OF_WEEK_PREFIX_RE); this script
re-parses every row that failed under the old behaviour.

Idempotent -- only rows with offence_date IS NULL are considered, so
re-running is a no-op once everything parseable has been backfilled.

Usage:
    python3 backfill_offence_dates.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.dates import parse_historical_date
from qsrecords.db import get_session, init_db
from qsrecords.models.core import SummaryConviction


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    fixed = []
    with get_session(settings.db_path) as session:
        rows = session.exec(
            select(SummaryConviction).where(SummaryConviction.offence_date.is_(None))
        ).all()
        for row in rows:
            parsed = parse_historical_date(row.offence_date_raw)
            if parsed is None:
                continue
            row.offence_date = parsed.iso_date
            row.offence_day_of_week = parsed.day_of_week
            row.offence_day_of_month = parsed.day_of_month
            row.offence_year = parsed.year
            fixed.append(f"{row.reference_number}: {row.offence_date_raw!r} -> {parsed.iso_date}")
        session.commit()

    if fixed:
        print(f"Backfilled {len(fixed)} offence_date(s):")
        for line in fixed:
            print(f"  {line}")
    else:
        print("Nothing to fix.")


if __name__ == "__main__":
    main()
