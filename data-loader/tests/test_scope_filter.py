from qsrecords.models.core import (
    Person,
    PersonRelationship,
    SummaryConviction,
    SummaryConvictionPerson,
)
from qsrecords.models.raw import RawCase
from qsrecords.models.reference import RelationshipType
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


def _make_conviction(session, record_number, **overrides):
    defaults = dict(
        record_number=record_number,
        charge_description="a charge",
        raw_record="raw",
    )
    defaults.update(overrides)
    conviction = SummaryConviction(**defaults)
    session.add(conviction)
    session.flush()
    return conviction


def test_out_of_scope_conviction_is_removed_with_dependents(session):
    out_of_scope_ref = OUT_OF_SCOPE_REFERENCE_NUMBERS[0]
    raw_case = _make_raw_case(session, reference_number=out_of_scope_ref)
    conviction = _make_conviction(session, out_of_scope_ref)
    defendant = Person(first_name="Thomas", last_name="Whitby")
    session.add(defendant)
    session.flush()
    session.add(
        SummaryConvictionPerson(summary_conviction_id=conviction.id, person_id=defendant.id, role="defendant")
    )
    witness = Person(first_name="Jane", last_name="Doe")
    session.add(witness)
    session.flush()
    session.add(
        SummaryConvictionPerson(summary_conviction_id=conviction.id, person_id=witness.id, role="witness")
    )
    session.flush()

    removed = remove_out_of_scope_convictions(session)
    session.flush()

    assert removed == [out_of_scope_ref]
    assert session.get(SummaryConviction, conviction.id) is None
    assert session.get(RawCase, raw_case.id) is None
    assert session.get(Person, defendant.id) is None
    assert session.get(Person, witness.id) is None


def test_in_scope_conviction_is_left_alone(session):
    _make_raw_case(session, reference_number="QSB 1880 1/10/1")
    conviction = _make_conviction(session, "QSB 1880 1/10/1")

    removed = remove_out_of_scope_convictions(session)

    assert removed == []
    assert session.get(SummaryConviction, conviction.id) is not None


def test_idempotent_on_second_run(session):
    out_of_scope_ref = OUT_OF_SCOPE_REFERENCE_NUMBERS[1]
    _make_raw_case(session, reference_number=out_of_scope_ref)
    _make_conviction(session, out_of_scope_ref)

    first_run = remove_out_of_scope_convictions(session)
    session.flush()
    second_run = remove_out_of_scope_convictions(session)

    assert first_run == [out_of_scope_ref]
    assert second_run == []


def test_find_out_of_scope_convictions_matches_record_numbers_only(session):
    matching_ref = OUT_OF_SCOPE_REFERENCE_NUMBERS[2]
    _make_raw_case(session, reference_number=matching_ref)
    _make_conviction(session, matching_ref)

    _make_raw_case(session, reference_number="QSB 1880 2/10/2")
    _make_conviction(session, "QSB 1880 2/10/2")

    found = find_out_of_scope_convictions(session)

    assert [c.record_number for c in found] == [matching_ref]


def test_person_shared_with_another_conviction_is_not_deleted(session):
    """A Person row still reachable from a different, in-scope conviction
    must survive removal of the out-of-scope one -- deleting it would
    silently discard data the other conviction still needs."""
    out_of_scope_ref = OUT_OF_SCOPE_REFERENCE_NUMBERS[3]
    _make_raw_case(session, reference_number=out_of_scope_ref)
    out_of_scope_conviction = _make_conviction(session, out_of_scope_ref)
    in_scope_conviction = _make_conviction(session, "QSB 1880 3/10/3")

    shared_person = Person(first_name="John", last_name="Smith")
    session.add(shared_person)
    session.flush()
    session.add(
        SummaryConvictionPerson(
            summary_conviction_id=out_of_scope_conviction.id, person_id=shared_person.id, role="witness"
        )
    )
    session.add(
        SummaryConvictionPerson(
            summary_conviction_id=in_scope_conviction.id, person_id=shared_person.id, role="witness"
        )
    )
    session.flush()

    remove_out_of_scope_convictions(session)
    session.flush()

    assert session.get(Person, shared_person.id) is not None
    assert session.get(SummaryConviction, in_scope_conviction.id) is not None


def test_person_still_targeted_by_a_relationship_is_not_deleted(session):
    """A person removed from their own (out-of-scope) conviction, but still
    the *target* of another surviving person's PersonRelationship, must not
    be deleted -- that would orphan the relationship's FK."""
    out_of_scope_ref = OUT_OF_SCOPE_REFERENCE_NUMBERS[4]
    _make_raw_case(session, reference_number=out_of_scope_ref)
    conviction = _make_conviction(session, out_of_scope_ref)

    husband = Person(first_name="John", last_name="Smith")
    session.add(husband)
    session.flush()
    session.add(
        SummaryConvictionPerson(summary_conviction_id=conviction.id, person_id=husband.id, role="husband")
    )

    rel_type = RelationshipType(name="wife")
    session.add(rel_type)
    session.flush()
    wife = Person(first_name="Jane", last_name="Smith")
    session.add(wife)
    session.flush()
    session.add(
        PersonRelationship(person_id=wife.id, relationship_type_id=rel_type.id, related_person_id=husband.id)
    )
    session.flush()

    remove_out_of_scope_convictions(session)
    session.flush()

    assert session.get(Person, husband.id) is not None
