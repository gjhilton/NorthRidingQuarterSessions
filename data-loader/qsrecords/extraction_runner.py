"""Orchestrates one batch of extraction: select pending -> call provider ->
map -> persist -> update status. This function IS the resumability
mechanism -- no marker files, just a `status` column query.

Per-record (not whole-batch) failure granularity: if a batch of 25 comes
back with 22 successes and 3 problems, only those 3 raw_case rows get
attempt_count incremented and stay pending for retry; the 22 successes are
marked done and are never reprocessed, even if the whole run is re-invoked.

A per-record SQLAlchemy savepoint (session.begin_nested()) isolates one
record's mapping failure from the rest of the batch: without it, a
constraint violation on record 23 would force a session.rollback() that
discards the already-mapped rows for records 1-22 too.
"""

import time
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlmodel import Session, select

from qsrecords.llm.base import ExtractionError, ExtractionProvider
from qsrecords.mapping import persist_extracted_record
from qsrecords.models.extraction_schema import ExtractionBatchInput
from qsrecords.models.raw import ExtractionAttempt, RawCase, RawCaseStatus


@dataclass
class RunStats:
    processed: int
    succeeded: int
    failed: int


def count_pending(session: Session) -> int:
    return len(session.exec(select(RawCase.id).where(RawCase.status == RawCaseStatus.PENDING)).all())


def get_pending_inputs(session: Session, limit: Optional[int] = None) -> list[ExtractionBatchInput]:
    """Fetch pending raw_case rows (up to `limit`, or all pending if None) as
    ExtractionBatchInput, for cost estimation before a run starts."""
    stmt = select(RawCase).where(RawCase.status == RawCaseStatus.PENDING).order_by(RawCase.id)
    if limit is not None:
        stmt = stmt.limit(limit)
    rows = session.exec(stmt).all()
    return [
        ExtractionBatchInput(
            raw_case_id=rc.id,
            reference_number=rc.reference_number,
            title=rc.title,
            description=rc.description,
            archive_url=rc.archive_url,
        )
        for rc in rows
    ]


def _record_failure(
    session: Session,
    raw_case: RawCase,
    batch_id: str,
    provider: ExtractionProvider,
    error_message: str,
    max_attempts: int,
    raw_response: Optional[str] = None,
    duration_ms: Optional[int] = None,
) -> None:
    raw_case.attempt_count += 1
    raw_case.last_attempted_at = datetime.utcnow()
    raw_case.status = (
        RawCaseStatus.FAILED
        if raw_case.attempt_count >= max_attempts
        else RawCaseStatus.PENDING
    )
    session.add(raw_case)
    session.add(
        ExtractionAttempt(
            raw_case_id=raw_case.id,
            batch_id=batch_id,
            provider=provider.name,
            model=provider.model,
            success=False,
            error_message=error_message,
            raw_response=raw_response,
            duration_ms=duration_ms,
        )
    )


def run(
    session: Session,
    provider: ExtractionProvider,
    batch_size: int,
    max_attempts: int,
) -> RunStats:
    batch = session.exec(
        select(RawCase)
        .where(RawCase.status == RawCaseStatus.PENDING)
        .order_by(RawCase.id)
        .limit(batch_size)
    ).all()

    if not batch:
        return RunStats(processed=0, succeeded=0, failed=0)

    inputs = [
        ExtractionBatchInput(
            raw_case_id=rc.id,
            reference_number=rc.reference_number,
            title=rc.title,
            description=rc.description,
            archive_url=rc.archive_url,
        )
        for rc in batch
    ]
    batch_id = uuid4().hex

    start = time.monotonic()
    try:
        outcomes, raw_response = provider.extract_batch(inputs)
    except Exception as exc:
        duration_ms = int((time.monotonic() - start) * 1000)
        # Whole-batch transport failure (auth/network/rate-limit): every row
        # in the batch gets one failed attempt, no partial silent loss. No
        # raw_response -- the call itself failed, there's no response text.
        for raw_case in batch:
            _record_failure(
                session, raw_case, batch_id, provider, str(exc), max_attempts,
                raw_response=None, duration_ms=duration_ms,
            )
        session.commit()
        return RunStats(processed=len(batch), succeeded=0, failed=len(batch))
    duration_ms = int((time.monotonic() - start) * 1000)

    succeeded = 0
    failed = 0
    for raw_case, outcome in zip(batch, outcomes):
        if isinstance(outcome, ExtractionError):
            _record_failure(
                session, raw_case, batch_id, provider, outcome.error_message, max_attempts,
                raw_response=raw_response, duration_ms=duration_ms,
            )
            failed += 1
            continue

        try:
            with session.begin_nested():
                persist_extracted_record(session, raw_case, outcome)
        except Exception as exc:
            _record_failure(
                session, raw_case, batch_id, provider, f"mapping error: {exc}", max_attempts,
                raw_response=raw_response, duration_ms=duration_ms,
            )
            failed += 1
            continue

        raw_case.status = RawCaseStatus.DONE
        raw_case.last_attempted_at = datetime.utcnow()
        session.add(raw_case)
        session.add(
            ExtractionAttempt(
                raw_case_id=raw_case.id,
                batch_id=batch_id,
                provider=provider.name,
                model=provider.model,
                success=True,
                raw_response=raw_response,
                duration_ms=duration_ms,
            )
        )
        succeeded += 1

    session.commit()
    return RunStats(processed=len(batch), succeeded=succeeded, failed=failed)
