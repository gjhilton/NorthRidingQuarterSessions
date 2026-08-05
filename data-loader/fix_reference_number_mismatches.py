"""One-off (but safely re-runnable) fix for the two reference_number values
found (via qsrecords.reference_number_check) to disagree with their own
archive_url's CalmView catalogue id -- see that module's docstring for the
root cause (the source page's display-text cell and link href can disagree)
and reference_number_check.py's docstring for why this doesn't auto-correct
arbitrary future mismatches.

One of the two (raw_case #1635 / summary_conviction #4462) had wrongly
collided with an unrelated genuine "QSB 1872 4/10/10/19" record as a result
-- fixing it also resolves that collision, which is what surfaced this in
the first place while building reference-number-based conviction URLs.

First runs the general detector across the whole table and prints anything
found, so a future re-scrape reintroducing a similar mismatch is surfaced
rather than silently missed -- it only *applies* the two corrections below,
which were manually verified against archivesunlocked.northyorks.gov.uk.

Idempotent -- each correction only applies if the row still holds the
known-bad value; already-fixed rows are skipped and reported as such.

Usage:
    python3 fix_reference_number_mismatches.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import SummaryConviction
from qsrecords.models.raw import RawCase
from qsrecords.reference_number_check import reference_number_mismatch

# (raw_case_id, summary_conviction_id, bad_reference_number, corrected_reference_number)
KNOWN_CORRECTIONS = [
    (1635, 4462, "QSB 1872 4/10/10/19", "QSB 1872 4/10/10/119"),
    (4363, 2961, "QSB 1886 4/10/10/774", "QSB 1886 4/10/10/74"),
]


def _scan_for_mismatches(session: Session) -> list[str]:
    found = []
    for row in session.exec(select(RawCase)).all():
        if reference_number_mismatch(row.reference_number, row.archive_url):
            found.append(f"raw_case #{row.id}: {row.reference_number!r} vs {row.archive_url}")
    return found


def _apply_corrections(session: Session) -> list[str]:
    fixed = []
    for raw_case_id, summary_conviction_id, bad, good in KNOWN_CORRECTIONS:
        raw_case = session.get(RawCase, raw_case_id)
        if raw_case is not None and raw_case.reference_number == bad:
            raw_case.reference_number = good
            fixed.append(f"raw_case #{raw_case_id}: {bad!r} -> {good!r}")

        conviction = session.get(SummaryConviction, summary_conviction_id)
        if conviction is not None and conviction.reference_number == bad:
            conviction.reference_number = good
            fixed.append(f"summary_conviction #{summary_conviction_id}: {bad!r} -> {good!r}")
    return fixed


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        mismatches = _scan_for_mismatches(session)
        print(f"Scanned raw_case: {len(mismatches)} reference_number/archive_url mismatch(es) found.")
        for line in mismatches:
            print(f"  {line}")

        fixed = _apply_corrections(session)
        session.commit()
    if fixed:
        print(f"\nApplied {len(fixed)} correction(s):")
        for line in fixed:
            print(f"  {line}")
    else:
        print("\nNothing to fix (already applied).")


if __name__ == "__main__":
    main()
