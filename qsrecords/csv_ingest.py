"""whitby.csv -> RawCase rows.

Replaces v1's 03_postprocess_resources.py, which read the CSV line-by-line
as raw text and wrote one .txt file per matching record (filename = sanitized
reference_number). That design silently dropped records when reference_number
collided (11 real collisions exist, including one pair with genuinely
different content). Here rows are parsed with csv.DictReader and staged as
RawCase rows keyed on the CSV's `url` column, which is unique across all rows.
"""

import csv
from pathlib import Path

from sqlmodel import Session, select

from qsrecords.models.raw import RawCase
from qsrecords.text import is_summary_conviction_row


def load_raw_cases(session: Session, csv_path: Path) -> tuple[int, int]:
    """Ingest whitby.csv into `raw_case`. Returns (inserted, skipped_existing).

    Idempotent: re-running against the same CSV inserts nothing new, since
    each row is keyed on `archive_url` (unique in the source data).
    """
    inserted = 0
    skipped = 0

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = row.get("title", "")
            description = row.get("description", "")
            if not is_summary_conviction_row(title, description):
                continue

            url = row["url"]
            existing = session.exec(
                select(RawCase).where(RawCase.archive_url == url)
            ).first()
            if existing:
                skipped += 1
                continue

            session.add(
                RawCase(
                    archive_url=url,
                    reference_number=row["record_id"],
                    title=title,
                    document_date_raw=row.get("document_date", ""),
                    description=description,
                )
            )
            inserted += 1

    session.commit()
    return inserted, skipped
