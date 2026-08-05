"""One-off (but safely re-runnable) removal of summary_conviction records
that the "whitby" keyword scrape picked up by pure textual coincidence --
see qsrecords.scope_filter.OUT_OF_SCOPE_REFERENCE_NUMBERS and
OUT_OF_SCOPE_REVIEW.md (repo root) for the full review log. Idempotent --
a second run finds nothing left to remove.

Usage:
    python3 remove_out_of_scope_convictions.py
"""

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.scope_filter import remove_out_of_scope_convictions


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        removed = remove_out_of_scope_convictions(session)
        session.commit()

    print(f"Removed {len(removed)} out-of-scope conviction(s):")
    for reference_number in removed:
        print(f"  - {reference_number}")


if __name__ == "__main__":
    main()
