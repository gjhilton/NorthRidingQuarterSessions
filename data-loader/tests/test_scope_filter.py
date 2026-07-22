from qsrecords.models.core import (
    Defendant,
    Person,
    InvolvedPerson,
    SummaryConviction,
    SummaryConvictionDefendant,
)
from qsrecords.models.raw import RawCase
from qsrecords.scope_filter import (
    OUT_OF_SCOPE_REFERENCE_NUMBERS,
    find_out_of_scope_convictions,
    remove_out_of_scope_convictions,
)

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
        raw_record="raw",
        archive_url=raw_case.archive_url,
    )
    defaults.update(overrides)
    conviction = SummaryConviction(**defaults)
    session.add(conviction)
    session.flush()
    return conviction


def test_out_of_scope_conviction_is_removed_with_dependents(session):
    out_of_scope_ref = OUT_OF_SCOPE_REFERENCE_NUMBERS[0]
    raw_case = _make_raw_case(session, reference_number=out_of_scope_ref)
    conviction = _make_conviction(session, raw_case, reference_number=out_of_scope_ref)
    defendant = Defendant(first_name="Thomas", last_name="Whitby", name_key="thomas whitby")
    session.add(defendant)
    session.flush()
    session.add(
        SummaryConvictionDefendant(summary_conviction_id=conviction.id, defendant_id=defendant.id)
    )
    person = Person(first_name="Jane", last_name="Doe", name_key="jane doe")
    session.add(person)
    session.flush()
    session.add(
        InvolvedPerson(summary_conviction_id=conviction.id, person_id=person.id, role="witness")
    )
    session.flush()

    removed = remove_out_of_scope_convictions(session)
    session.flush()

    assert removed == [out_of_scope_ref]
    assert session.get(SummaryConviction, conviction.id) is None
    assert session.get(RawCase, raw_case.id) is None
    assert session.get(Defendant, defendant.id) is None
    assert session.get(Person, person.id) is None


def test_in_scope_conviction_is_left_alone(session):
    raw_case = _make_raw_case(session, reference_number="QSB 1880 1/10/1")
    conviction = _make_conviction(session, raw_case, reference_number="QSB 1880 1/10/1")

    removed = remove_out_of_scope_convictions(session)

    assert removed == []
    assert session.get(SummaryConviction, conviction.id) is not None


def test_idempotent_on_second_run(session):
    out_of_scope_ref = OUT_OF_SCOPE_REFERENCE_NUMBERS[1]
    raw_case = _make_raw_case(session, reference_number=out_of_scope_ref)
    _make_conviction(session, raw_case, reference_number=out_of_scope_ref)

    first_run = remove_out_of_scope_convictions(session)
    session.flush()
    second_run = remove_out_of_scope_convictions(session)

    assert first_run == [out_of_scope_ref]
    assert second_run == []


def test_find_out_of_scope_convictions_matches_reference_numbers_only(session):
    matching_ref = OUT_OF_SCOPE_REFERENCE_NUMBERS[2]
    matching_raw_case = _make_raw_case(session, reference_number=matching_ref)
    _make_conviction(session, matching_raw_case, reference_number=matching_ref)

    non_matching_raw_case = _make_raw_case(session, reference_number="QSB 1880 2/10/2")
    _make_conviction(session, non_matching_raw_case, reference_number="QSB 1880 2/10/2")

    found = find_out_of_scope_convictions(session)

    assert [c.reference_number for c in found] == [matching_ref]
