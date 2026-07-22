from qsrecords.description_spacing import backfill_description_spacing
from qsrecords.models.core import SummaryConviction
from qsrecords.models.raw import RawCase

_next_id = iter(range(1, 10_000))


def _make_raw_case(session, **overrides):
    n = next(_next_id)
    defaults = dict(
        archive_url=f"https://example.org/{n}",
        reference_number=f"REF-{n}",
        title="Summary conviction: a defendant",
        document_date_raw="1 Jan 1880",
        description="a description",
        status="done",
    )
    defaults.update(overrides)
    raw_case = RawCase(**defaults)
    session.add(raw_case)
    session.flush()
    return raw_case


def _make_conviction(session, raw_case, **overrides):
    defaults = dict(
        raw_case_id=raw_case.id,
        reference_number=raw_case.reference_number,
        conviction_date_raw="1 Jan 1880",
        charge_description="a charge",
        raw_record=raw_case.description,
        archive_url=raw_case.archive_url,
    )
    defaults.update(overrides)
    conviction = SummaryConviction(**defaults)
    session.add(conviction)
    session.flush()
    return conviction


def test_fixes_raw_case_description_and_syncs_raw_record(session):
    run_on = "himselfOffence committed at Ellerby on 20 May 1881Whitby Strand"
    raw_case = _make_raw_case(session, description=run_on)
    conviction = _make_conviction(session, raw_case, raw_record=run_on)

    report = backfill_description_spacing(session)
    session.flush()

    expected = "himself. Offence committed at Ellerby on 20 May 1881. Whitby Strand"
    assert raw_case.description == expected
    assert conviction.raw_record == expected
    assert report.raw_case_changed == 1
    assert report.raw_record_synced == 1
    assert report.residual_unexplained == 0


def test_leaves_already_clean_text_alone(session):
    clean = "Summary conviction. Offence committed at Whitby."
    raw_case = _make_raw_case(session, description=clean)
    _make_conviction(session, raw_case, raw_record=clean)

    report = backfill_description_spacing(session)

    assert raw_case.description == clean
    assert report.raw_case_changed == 0
    assert report.raw_record_synced == 0


def test_does_not_touch_mc_surname(session):
    text = "convicted James McDonald of theft at WhitbyOffence committed 1 May 1880"
    raw_case = _make_raw_case(session, description=text)
    _make_conviction(session, raw_case, raw_record=text)

    report = backfill_description_spacing(session)

    assert "McDonald" in raw_case.description
    assert report.residual_unexplained == 0
    assert report.residual_mcmac_expected >= 1


def test_idempotent_on_second_run(session):
    run_on = "himselfOffence committed at Ellerby"
    raw_case = _make_raw_case(session, description=run_on)
    _make_conviction(session, raw_case, raw_record=run_on)

    first = backfill_description_spacing(session)
    session.flush()
    second = backfill_description_spacing(session)

    assert first.raw_case_changed == 1
    assert second.raw_case_changed == 0
    assert second.raw_record_synced == 0
