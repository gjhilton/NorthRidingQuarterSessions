"""Staging table + extraction audit trail.

Replaces v1's file-based staging (one .txt per record in
data/summary_convictions/, one .json or __FAILED.json per record in
data/structured/) with DB rows. Idempotency/resumability becomes a status
column query instead of a filesystem existence check.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Column
from sqlalchemy import Enum as SAEnum
from sqlmodel import Field, SQLModel


class RawCaseStatus(str, Enum):
    PENDING = "pending"
    DONE = "done"
    FAILED = "failed"  # attempt_count hit max_attempts; parked for manual review


class RawCase(SQLModel, table=True):
    __tablename__ = "raw_case"

    id: Optional[int] = Field(default=None, primary_key=True)
    # True natural key: 11 duplicate reference_number values exist in the
    # source CSV (including one pair with genuinely different content), but
    # `url` is unique across all 9,497 rows.
    archive_url: str = Field(unique=True, index=True)
    reference_number: str = Field(index=True)
    title: str
    document_date_raw: str
    description: str
    # values_callable forces storage of "pending"/"done"/"failed" (the enum
    # .value), not SQLAlchemy's default of the member .name ("PENDING").
    status: RawCaseStatus = Field(
        default=RawCaseStatus.PENDING,
        sa_column=Column(
            SAEnum(RawCaseStatus, values_callable=lambda enum_cls: [e.value for e in enum_cls]),
            index=True,
            nullable=False,
        ),
    )
    attempt_count: int = Field(default=0)
    last_attempted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ExtractionAttempt(SQLModel, table=True):
    __tablename__ = "extraction_attempt"

    id: Optional[int] = Field(default=None, primary_key=True)
    raw_case_id: int = Field(foreign_key="raw_case.id", index=True)
    batch_id: str = Field(index=True)  # shared by every raw_case in one LLM call
    provider: str
    model: str
    attempted_at: datetime = Field(default_factory=datetime.utcnow)
    success: bool
    error_message: Optional[str] = None
    raw_response: Optional[str] = None
    duration_ms: Optional[int] = None
