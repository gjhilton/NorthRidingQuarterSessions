from sqlalchemy import text

from qsrecords.models.core import (
    Person,
    SummaryConviction,
    SummaryConvictionLocation,
    SummaryConvictionPerson,
)
from qsrecords.models.reference import Location
from qsrecords.views import create_views

_next_id = iter(range(1, 10_000))


def _make_location(session, name, parent_id=None):
    location = Location(name=name, parent_id=parent_id)
    session.add(location)
    session.flush()
    return location


def _make_conviction(session, record_number):
    conviction = SummaryConviction(
        record_number=record_number,
        charge_description="a charge",
        raw_record="raw",
    )
    session.add(conviction)
    session.flush()
    return conviction


def _tag_location(session, conviction, location, role):
    session.add(
        SummaryConvictionLocation(
            summary_conviction_id=conviction.id, location_id=location.id, role=role
        )
    )
    session.flush()


def test_view_includes_case_with_whitby_offence_location(session):
    whitby = _make_location(session, "whitby")
    other = _make_location(session, "pickering")
    create_views(session)

    included = _make_conviction(session, "REF-1")
    _tag_location(session, included, whitby, "location of offence")
    _tag_location(session, included, other, "court location")

    excluded = _make_conviction(session, "REF-2")
    _tag_location(session, excluded, other, "location of offence")
    _tag_location(session, excluded, other, "court location")
    session.commit()

    rows = session.execute(text("SELECT record_number FROM whitby_connected_conviction")).all()
    refs = {r[0] for r in rows}
    assert included.record_number in refs
    assert excluded.record_number not in refs


def test_view_includes_case_via_whitby_subtree_descendant(session):
    """A location nested under Whitby in the tree (e.g. a specific street)
    counts the same as Whitby itself."""
    whitby = _make_location(session, "whitby")
    baxtergate = _make_location(session, "baxtergate", parent_id=whitby.id)
    create_views(session)

    included = _make_conviction(session, "REF-1")
    _tag_location(session, included, baxtergate, "location of offence")
    session.commit()

    rows = session.execute(text("SELECT record_number FROM whitby_connected_conviction")).all()
    refs = {r[0] for r in rows}
    assert included.record_number in refs


def test_view_excludes_court_only_whitby_connection(session):
    # A case heard at Whitby but with no other tie to the town must NOT match.
    whitby = _make_location(session, "whitby")
    elsewhere = _make_location(session, "guisborough")
    create_views(session)

    court_only = _make_conviction(session, "REF-3")
    _tag_location(session, court_only, elsewhere, "location of offence")
    _tag_location(session, court_only, whitby, "court location")
    session.commit()

    rows = session.execute(text("SELECT record_number FROM whitby_connected_conviction")).all()
    refs = {r[0] for r in rows}
    assert court_only.record_number not in refs


def test_in_scope_view_includes_court_only_whitby_connection(session):
    # The same case IS in-scope though -- Whitby Petty Sessions jurisdiction
    # over surrounding townships is squarely in scope.
    whitby = _make_location(session, "whitby")
    elsewhere = _make_location(session, "guisborough")
    create_views(session)

    court_only = _make_conviction(session, "REF-3")
    _tag_location(session, court_only, elsewhere, "location of offence")
    _tag_location(session, court_only, whitby, "court location")
    session.commit()

    rows = session.execute(text("SELECT record_number FROM whitby_in_scope_conviction")).all()
    refs = {r[0] for r in rows}
    assert court_only.record_number in refs


def test_view_includes_case_via_defendant_home_location(session):
    whitby = _make_location(session, "whitby")
    elsewhere = _make_location(session, "roxby")
    create_views(session)

    conviction = _make_conviction(session, "REF-4")
    _tag_location(session, conviction, elsewhere, "location of offence")
    defendant = Person(first_name="John", last_name="Smith", home_location_id=whitby.id)
    session.add(defendant)
    session.flush()
    session.add(
        SummaryConvictionPerson(summary_conviction_id=conviction.id, person_id=defendant.id, role="defendant")
    )
    session.commit()

    rows = session.execute(text("SELECT record_number FROM whitby_connected_conviction")).all()
    refs = {r[0] for r in rows}
    assert conviction.record_number in refs


def test_view_includes_case_via_involved_person_home_location(session):
    whitby = _make_location(session, "whitby")
    elsewhere = _make_location(session, "aislaby")
    create_views(session)

    conviction = _make_conviction(session, "REF-5")
    _tag_location(session, conviction, elsewhere, "location of offence")
    person = Person(first_name="Jane", last_name="Doe", home_location_id=whitby.id)
    session.add(person)
    session.flush()
    session.add(
        SummaryConvictionPerson(summary_conviction_id=conviction.id, person_id=person.id, role="witness")
    )
    session.commit()

    rows = session.execute(text("SELECT record_number FROM whitby_connected_conviction")).all()
    refs = {r[0] for r in rows}
    assert conviction.record_number in refs
