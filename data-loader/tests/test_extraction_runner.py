from sqlmodel import select

from qsrecords import extraction_runner
from qsrecords.llm.base import ExtractionError
from qsrecords.models.core import SummaryConviction
from qsrecords.models.extraction_schema import ExtractedDefendant, ExtractedRecord
from qsrecords.models.raw import ExtractionAttempt, RawCase, RawCaseStatus
from qsrecords.offence_types import get_or_create_offence_type, seed_offence_types

from conftest import FakeProvider


def _seed_raw_case_with_date(session, reference_number, document_date_raw):
    rc = RawCase(
        archive_url=f"https://example.org/{reference_number}",
        reference_number=reference_number,
        title="Summary conviction: Someone",
        document_date_raw=document_date_raw,
        description="Summary conviction of Someone...",
    )
    session.add(rc)
    session.commit()
    session.refresh(rc)
    return rc


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
        offence_types=["assault"],
        defendants=[ExtractedDefendant(first_name="A", last_name="B")],
        overall_confidence="high",
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


def test_run_passes_live_offence_types_not_static_seed_list(session):
    # Regression test for the "straying animals" bug: extract_batch used to
    # be given only the static SEED_OFFENCE_TYPES, so a category an earlier
    # batch proposed and had accepted was invisible to this one.
    seed_offence_types(session)
    get_or_create_offence_type(session, "poisoning a well")
    cases = _seed_raw_cases(session, 1)
    provider = FakeProvider(plan=[[_extracted_for(rc) for rc in cases]])

    extraction_runner.run(session, provider, batch_size=25, max_attempts=3)

    assert "poisoning a well" in provider.offence_types_seen[0]


def test_successful_attempt_records_raw_response_and_duration(session):
    cases = _seed_raw_cases(session, 1)
    provider = FakeProvider(plan=[[_extracted_for(cases[0])]])

    extraction_runner.run(session, provider, batch_size=25, max_attempts=3)

    attempt = session.exec(select(ExtractionAttempt)).one()
    assert attempt.success is True
    assert attempt.raw_response == "fake raw response text"
    assert isinstance(attempt.duration_ms, int)
    assert attempt.duration_ms >= 0


def test_per_record_content_error_still_records_raw_response(session):
    cases = _seed_raw_cases(session, 1)
    outcomes = [ExtractionError(reference_number=cases[0].reference_number, error_message="bad")]
    provider = FakeProvider(plan=[outcomes])

    extraction_runner.run(session, provider, batch_size=25, max_attempts=3)

    attempt = session.exec(select(ExtractionAttempt)).one()
    assert attempt.success is False
    # The batch call itself succeeded (we got a response) -- only this
    # record's content was a problem -- so the raw response is still useful
    # to have on hand for debugging, unlike a whole-batch transport failure.
    assert attempt.raw_response == "fake raw response text"


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
    # No raw_response for a transport failure -- the call itself never
    # returned anything to record.
    assert all(a.raw_response is None for a in attempts)
    assert all(isinstance(a.duration_ms, int) for a in attempts)


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


def test_extract_year_handles_real_document_date_raw_variants():
    # Every one of these is a real value observed in raw_case.document_date_raw
    # -- too irregular to parse as a full date, but each has exactly one
    # unambiguous 4-digit year embedded in it.
    assert extraction_runner._extract_year("3 April 1875") == 1875
    assert extraction_runner._extract_year("5 Feb1887") == 1887
    assert extraction_runner._extract_year("3 Jan [sic] 1869") == 1869
    assert extraction_runner._extract_year("14-18 May 1818") == 1818
    assert extraction_runner._extract_year("Sep-Oct 1834") == 1834
    assert extraction_runner._extract_year("1881") == 1881
    assert extraction_runner._extract_year("undated") is None


def test_select_pending_stratified_interleaves_decades_not_id_order(session):
    # Seeded in id order 1810, 1880, 1820, 1870 -- if selection just followed
    # RawCase.id, the first two picks would be 1810 then 1880 (adjacent ids,
    # 70 years apart). Stratified selection should instead visit each decade
    # once before repeating any.
    rc_1810 = _seed_raw_case_with_date(session, "QSB A", "1 Jan 1810")
    rc_1880 = _seed_raw_case_with_date(session, "QSB B", "1 Jan 1880")
    rc_1820 = _seed_raw_case_with_date(session, "QSB C", "1 Jan 1820")
    rc_1870 = _seed_raw_case_with_date(session, "QSB D", "1 Jan 1870")

    selected = extraction_runner._select_pending_stratified(session, limit=None)

    assert [rc.reference_number for rc in selected] == ["QSB A", "QSB C", "QSB D", "QSB B"]
    assert {rc.id for rc in selected} == {rc_1810.id, rc_1880.id, rc_1820.id, rc_1870.id}


def test_select_pending_stratified_limit_still_spans_decades(session):
    for i in range(3):
        _seed_raw_case_with_date(session, f"QSB 1810 {i}", "1 Jan 1810")
    for i in range(3):
        _seed_raw_case_with_date(session, f"QSB 1880 {i}", "1 Jan 1880")

    selected = extraction_runner._select_pending_stratified(session, limit=2)

    decades = {(int(rc.document_date_raw[-4:]) // 10) * 10 for rc in selected}
    assert decades == {1810, 1880}


def test_select_pending_stratified_unparseable_date_gets_own_bucket(session):
    rc_dated = _seed_raw_case_with_date(session, "QSB dated", "1 Jan 1850")
    rc_undated = _seed_raw_case_with_date(session, "QSB undated", "undated")

    selected = extraction_runner._select_pending_stratified(session, limit=None)

    assert {rc.reference_number for rc in selected} == {"QSB dated", "QSB undated"}
    assert rc_dated.id in {rc.id for rc in selected}
    assert rc_undated.id in {rc.id for rc in selected}
