from datetime import date

from sqlalchemy import text

from qsrecords.models.core import Defendant, Person, InvolvedPerson, SummaryConviction, SummaryConvictionDefendant
from qsrecords.models.reference import Town
from qsrecords.views import create_views


def _make_town(session, name):
    town = Town(name=name)
    session.add(town)
    session.flush()
    return town


_next_raw_case_id = iter(range(1, 10_000))


def _make_conviction(session, reference_number, offence_town_id=None, court_town_id=None):
    conviction = SummaryConviction(
        raw_case_id=next(_next_raw_case_id),
        reference_number=reference_number,
        conviction_date_raw="1 Jan 1850",
        charge_description="a charge",
        raw_record="raw",
        archive_url=f"https://example.org/{reference_number}",
        offence_location_town_id=offence_town_id,
        court_location_town_id=court_town_id,
    )
    session.add(conviction)
    session.flush()
    return conviction


def test_view_includes_case_with_whitby_offence_location(session):
    whitby = _make_town(session, "whitby")
    other = _make_town(session, "pickering")
    create_views(session)

    included = _make_conviction(session, "REF-1", offence_town_id=whitby.id, court_town_id=other.id)
    excluded = _make_conviction(session, "REF-2", offence_town_id=other.id, court_town_id=other.id)
    session.commit()

    rows = session.execute(text("SELECT reference_number FROM whitby_connected_conviction")).all()
    refs = {r[0] for r in rows}
    assert included.reference_number in refs
    assert excluded.reference_number not in refs


def test_view_excludes_court_only_whitby_connection(session):
    # A case heard at Whitby but with no other tie to the town must NOT match.
    whitby = _make_town(session, "whitby")
    elsewhere = _make_town(session, "guisborough")
    create_views(session)

    court_only = _make_conviction(session, "REF-3", offence_town_id=elsewhere.id, court_town_id=whitby.id)
    session.commit()

    rows = session.execute(text("SELECT reference_number FROM whitby_connected_conviction")).all()
    refs = {r[0] for r in rows}
    assert court_only.reference_number not in refs


def test_view_includes_case_via_defendant_town(session):
    whitby = _make_town(session, "whitby")
    elsewhere = _make_town(session, "roxby")
    create_views(session)

    conviction = _make_conviction(session, "REF-4", offence_town_id=elsewhere.id, court_town_id=elsewhere.id)
    defendant = Defendant(first_name="John", last_name="Smith", town_id=whitby.id, name_key="john smith")
    session.add(defendant)
    session.flush()
    session.add(SummaryConvictionDefendant(summary_conviction_id=conviction.id, defendant_id=defendant.id))
    session.commit()

    rows = session.execute(text("SELECT reference_number FROM whitby_connected_conviction")).all()
    refs = {r[0] for r in rows}
    assert conviction.reference_number in refs


def test_view_includes_case_via_involved_person_town(session):
    whitby = _make_town(session, "whitby")
    elsewhere = _make_town(session, "aislaby")
    create_views(session)

    conviction = _make_conviction(session, "REF-5", offence_town_id=elsewhere.id, court_town_id=elsewhere.id)
    person = Person(first_name="Jane", last_name="Doe", town_id=whitby.id, name_key="jane doe")
    session.add(person)
    session.flush()
    session.add(InvolvedPerson(summary_conviction_id=conviction.id, person_id=person.id, role="witness"))
    session.commit()

    rows = session.execute(text("SELECT reference_number FROM whitby_connected_conviction")).all()
    refs = {r[0] for r in rows}
    assert conviction.reference_number in refs
