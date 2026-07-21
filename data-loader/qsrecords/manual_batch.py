"""Persistence helper for records extracted manually (Claude reading raw_record
text directly in a session, no API call) rather than through the automated
extraction_runner/provider pipeline.

Every one-off manual-parse batch script was retyping the same ~20 lines --
session/engine wiring, the persist-and-mark-done loop, and the
ExtractionAttempt audit row -- with the batch_id/provider/model triplet as
the one place a typo could go unnoticed. This centralises that so a batch
script only has to build the RECORDS dict and call run_manual_batch().

Kept separate from qsrecords.mapping: mapping.py is the LLM-wire-contract ->
normalized-DB-rows translation used by every provenance path; this module is
specifically about the manual-session provenance path's bookkeeping around
that translation (marking raw_case DONE, writing the audit trail).
"""

import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Optional, Union

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.mapping import persist_extracted_record
from qsrecords.models.extraction_schema import ExtractedRecord
from qsrecords.models.raw import ExtractionAttempt, RawCase, RawCaseStatus

MANUAL_PROVIDER = "claude-code-session"
DEFAULT_MODEL = "claude-sonnet-5"


def persist_manual_batch(
    session: Session,
    records: dict[int, ExtractedRecord],
    batch_id: str,
    model: str = DEFAULT_MODEL,
) -> int:
    """Persist one manually-extracted record per (raw_case_id -> ExtractedRecord)
    entry: runs it through the same persist_extracted_record mapping the
    automated pipeline uses, marks the raw_case DONE, and writes a
    provider='claude-code-session' ExtractionAttempt audit row tagged with
    batch_id, so this provenance always stays distinguishable from real API
    extractions. Does not commit -- caller controls the transaction.

    Raises if a raw_case is not PENDING, since that almost always means the
    batch (or part of it) already ran -- re-running would silently create
    duplicate defendant/offence_type rows.
    """
    for raw_case_id, extracted in records.items():
        raw_case = session.exec(select(RawCase).where(RawCase.id == raw_case_id)).one()
        if raw_case.status != RawCaseStatus.PENDING:
            raise ValueError(
                f"raw_case {raw_case_id} ({raw_case.reference_number}) is not "
                f"pending (status={raw_case.status!r}) -- already processed?"
            )
        persist_extracted_record(session, raw_case, extracted)
        raw_case.status = RawCaseStatus.DONE
        raw_case.last_attempted_at = datetime.now(UTC)
        session.add(raw_case)
        session.add(
            ExtractionAttempt(
                raw_case_id=raw_case_id,
                batch_id=batch_id,
                provider=MANUAL_PROVIDER,
                model=model,
                success=True,
                raw_response=None,
            )
        )
    return len(records)


def run_manual_batch(
    records: dict[int, ExtractedRecord],
    batch_id: str,
    model: str = DEFAULT_MODEL,
    db_path: Optional[Path] = None,
) -> int:
    """Convenience wrapper for standalone batch scripts: resolves the DB path
    (defaulting to Settings.from_env(), same as every other entry point),
    opens a session, persists, and commits. This is the one call a manual
    batch script needs to make."""
    path = db_path or Settings.from_env().db_path
    init_db(path)
    with get_session(path) as session:
        count = persist_manual_batch(session, records, batch_id, model=model)
        session.commit()
    return count


def load_records_from_json(path: Union[str, Path]) -> dict[int, ExtractedRecord]:
    """Loads a {raw_case_id (string key) -> ExtractedRecord-shaped object}
    JSON file, as produced for save_manual_batch.py. JSON has no integer
    keys, so raw_case_id is a string in the file and converted here."""
    with open(path) as f:
        raw = json.load(f)
    return {int(raw_case_id): ExtractedRecord.model_validate(data) for raw_case_id, data in raw.items()}
