import pytest
from sqlmodel import select

from qsrecords.manual_batch import MANUAL_PROVIDER, persist_manual_batch
from qsrecords.models.extraction_schema import ExtractedDefendant, ExtractedRecord
from qsrecords.models.raw import ExtractionAttempt, RawCase, RawCaseStatus


def _make_raw_case(session, **overrides):
    defaults = dict(
        archive_url="https://example.org/record?id=1",
        reference_number="QSB 1857 3/10/18/5",
        title="Summary conviction: Henry Raw",
        document_date_raw="28 Apr 1857",
        description="Summary conviction of Henry Raw...",
    )
    defaults.update(overrides)
    raw_case = RawCase(**defaults)
    session.add(raw_case)
    session.flush()
    return raw_case


def _make_extracted(**overrides):
    defaults = dict(
        reference_number="QSB 1857 3/10/18/5",
        offence_date_raw="26 March 1857",
        charge_description="assaulting Margaret Croft",
        offence_types=["assault"],
        offence_town="Whitby",
        court_location_town="Whitby",
        defendants=[ExtractedDefendant(first_name="Henry", last_name="Raw")],
        overall_confidence="high",
    )
    defaults.update(overrides)
    return ExtractedRecord(**defaults)


def test_persists_and_marks_raw_case_done(session):
    raw_case = _make_raw_case(session)
    count = persist_manual_batch(
        session, {raw_case.id: _make_extracted()}, batch_id="manual-parse-test-1"
    )
    session.flush()

    assert count == 1
    session.refresh(raw_case)
    assert raw_case.status == RawCaseStatus.DONE
    assert raw_case.last_attempted_at is not None


def test_writes_extraction_attempt_with_manual_provenance(session):
    raw_case = _make_raw_case(session)
    persist_manual_batch(
        session, {raw_case.id: _make_extracted()}, batch_id="manual-parse-test-2", model="claude-sonnet-5"
    )
    session.flush()

    attempt = session.exec(
        select(ExtractionAttempt).where(ExtractionAttempt.raw_case_id == raw_case.id)
    ).one()
    assert attempt.batch_id == "manual-parse-test-2"
    assert attempt.provider == MANUAL_PROVIDER
    assert attempt.model == "claude-sonnet-5"
    assert attempt.success is True


def test_persists_multiple_records_in_one_call(session):
    raw_case_1 = _make_raw_case(session, archive_url="https://example.org/1")
    raw_case_2 = _make_raw_case(
        session, archive_url="https://example.org/2", reference_number="QSB 1857 3/10/18/6"
    )

    count = persist_manual_batch(
        session,
        {
            raw_case_1.id: _make_extracted(),
            raw_case_2.id: _make_extracted(reference_number="QSB 1857 3/10/18/6"),
        },
        batch_id="manual-parse-test-3",
    )

    assert count == 2


def test_raises_if_raw_case_not_pending(session):
    raw_case = _make_raw_case(session, status=RawCaseStatus.DONE)

    with pytest.raises(ValueError, match="not pending"):
        persist_manual_batch(
            session, {raw_case.id: _make_extracted()}, batch_id="manual-parse-test-4"
        )
