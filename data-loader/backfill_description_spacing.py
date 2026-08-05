"""One-off (but safely re-runnable) backfill: repairs run-on text in
raw_case.description left by the pre-fix scraper (see
qsrecords.description_spacing / qsrecords.text.fix_run_on_spacing), and
re-syncs summary_conviction.raw_record from the corrected value. Idempotent
-- a second run changes nothing.

Usage:
    python3 backfill_description_spacing.py
"""

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.description_spacing import backfill_description_spacing


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        report = backfill_description_spacing(session)
        session.commit()

    print(f"Scanned {report.raw_case_scanned} raw_case rows.")
    print(f"Changed {report.raw_case_changed} descriptions, {report.insertions} total insertions.")
    print(f"Synced {report.raw_record_synced} summary_conviction.raw_record rows.")
    print(
        f"Residual boundary matches after fix: {report.residual_raw_matches} "
        f"({report.residual_mcmac_expected} expected Mc/Mac, "
        f"{report.residual_unexplained} unexplained)"
    )
    print()
    print("Sample before/after (first 8 changed rows):")
    for ref, before, after in report.samples:
        print(f"--- {ref} ---")
        print(f"  before: {before}")
        print(f"  after:  {after}")

    if report.residual_unexplained:
        print()
        print(
            f"WARNING: {report.residual_unexplained} unexplained residual matches -- "
            "inspect before trusting this run."
        )


if __name__ == "__main__":
    main()
