from sqlmodel import select

from qsrecords import extraction_runner
from qsrecords.llm.base import ExtractionError
from qsrecords.models.core import SummaryConviction
from qsrecords.models.extraction_schema import ExtractedDefendant, ExtractedRecord
from qsrecords.models.raw import ExtractionAttempt, RawCase, RawCaseStatus

from conftest import FakeProvider


def _seed_raw_cases(session, n):
    cases = []
    for i in range(n):
        rc = RawCase(
            archive_url=f"https://example.org/{i}",
            reference_number=f"QSB 1857 1/10/{i}",
            title="Summary conviction: Someone",
            document_date_raw="28 Apr 1857",
            description="Summary conviction of Someone...",
        )
        session.add(rc)
        cases.append(rc)
    session.commit()
    for rc in cases:
        session.refresh(rc)
    return cases


def _extracted_for(rc):
    return ExtractedRecord(
        reference_number=rc.reference_number,
        offence_date_raw="26 March 1857",
        charge_description="a charge",
        offence_type="assault",
        defendants=[ExtractedDefendant(first_name="A", last_name="B")],
    )


def test_all_succeed_marks_rows_done(session):
    cases = _seed_raw_cases(session, 3)
    provider = FakeProvider(plan=[[_extracted_for(rc) for rc in cases]])

    stats = extraction_runner.run(session, provider, batch_size=25, max_attempts=3)

    assert (stats.processed, stats.succeeded, stats.failed) == (3, 3, 0)
    for rc in cases:
        session.refresh(rc)
        assert rc.status == RawCaseStatus.DONE
    assert len(session.exec(select(SummaryConviction)).all()) == 3


def test_partial_failure_only_retries_failed_rows(session):
    cases = _seed_raw_cases(session, 3)
    outcomes = [
        _extracted_for(cases[0]),
        ExtractionError(reference_number=cases[1].reference_number, error_message="bad"),
        _extracted_for(cases[2]),
    ]
    provider = FakeProvider(plan=[outcomes])

    stats = extraction_runner.run(session, provider, batch_size=25, max_attempts=3)

    assert (stats.processed, stats.succeeded, stats.failed) == (3, 2, 1)
    session.refresh(cases[0])
    session.refresh(cases[1])
    session.refresh(cases[2])
    assert cases[0].status == RawCaseStatus.DONE
    assert cases[1].status == RawCaseStatus.PENDING
    assert cases[1].attempt_count == 1
    assert cases[2].status == RawCaseStatus.DONE

    # Re-running only picks up the still-pending row, not the two already done.
    provider2 = FakeProvider(plan=[[_extracted_for(cases[1])]])
    stats2 = extraction_runner.run(session, provider2, batch_size=25, max_attempts=3)
    assert stats2.processed == 1
    assert len(provider2.calls[0]) == 1
    assert provider2.calls[0][0].reference_number == cases[1].reference_number


def test_whole_batch_transport_error_bumps_every_row(session):
    cases = _seed_raw_cases(session, 2)
    provider = FakeProvider(plan=[RuntimeError("connection refused")])

    stats = extraction_runner.run(session, provider, batch_size=25, max_attempts=3)

    assert (stats.processed, stats.succeeded, stats.failed) == (2, 0, 2)
    for rc in cases:
        session.refresh(rc)
        assert rc.status == RawCaseStatus.PENDING
        assert rc.attempt_count == 1
    attempts = session.exec(select(ExtractionAttempt)).all()
    assert len(attempts) == 2
    assert all(not a.success for a in attempts)


def test_retry_cap_escalates_to_failed(session):
    cases = _seed_raw_cases(session, 1)
    provider = FakeProvider(plan=[RuntimeError("err")] * 3)

    for _ in range(3):
        extraction_runner.run(session, provider, batch_size=25, max_attempts=3)

    session.refresh(cases[0])
    assert cases[0].attempt_count == 3
    assert cases[0].status == RawCaseStatus.FAILED

    # A parked (failed) row is no longer picked up by future runs.
    stats = extraction_runner.run(
        session, FakeProvider(plan=[[]]), batch_size=25, max_attempts=3
    )
    assert stats.processed == 0


def test_no_pending_rows_is_a_noop(session):
    provider = FakeProvider(plan=[])
    stats = extraction_runner.run(session, provider, batch_size=25, max_attempts=3)
    assert (stats.processed, stats.succeeded, stats.failed) == (0, 0, 0)
    assert provider.calls == []
