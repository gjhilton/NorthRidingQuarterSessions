from datetime import date

from sqlmodel import select

from qsrecords.models.core import (
    Person,
    RelatedConviction,
    SummaryConviction,
    SummaryConvictionLocation,
    SummaryConvictionPerson,
)
from qsrecords.models.reference import Location
from qsrecords.related_convictions import (
    backfill_related_convictions,
    detect_same_defendant_same_date_clusters,
    detect_shared_incident_clusters,
    link_convictions,
)

_next_id = iter(range(1, 10_000))


def _make_conviction(session, **overrides):
    defaults = dict(
        record_number=f"REF-{next(_next_id)}",
        charge_description="a charge",
        raw_record="raw",
    )
    defaults.update(overrides)
    conviction = SummaryConviction(**defaults)
    session.add(conviction)
    session.flush()
    return conviction


def _make_defendant(session, first_name="John", last_name="Smith", **overrides):
    defaults = dict(first_name=first_name, last_name=last_name)
    defaults.update(overrides)
    person = Person(**defaults)
    session.add(person)
    session.flush()
    return person


def _attach(session, conviction, person, role="defendant"):
    session.add(
        SummaryConvictionPerson(
            summary_conviction_id=conviction.id, person_id=person.id, role=role
        )
    )
    session.flush()


def test_link_convictions_normalises_order(session):
    c1 = _make_conviction(session)
    c2 = _make_conviction(session)

    created = link_convictions(session, c2.id, c1.id, note="test")
    session.flush()

    assert created is True
    row = session.exec(select(RelatedConviction)).one()
    assert row.summary_conviction_id_a == min(c1.id, c2.id)
    assert row.summary_conviction_id_b == max(c1.id, c2.id)
    assert row.note == "test"


def test_link_convictions_is_idempotent(session):
    c1 = _make_conviction(session)
    c2 = _make_conviction(session)

    first = link_convictions(session, c1.id, c2.id, note="a")
    session.flush()
    second = link_convictions(session, c2.id, c1.id, note="b")
    session.flush()

    assert first is True
    assert second is False


def test_link_convictions_noop_for_same_id(session):
    c1 = _make_conviction(session)

    created = link_convictions(session, c1.id, c1.id)

    assert created is False


def test_detects_same_defendant_same_date_cluster(session):
    smith = _make_defendant(session)
    c1 = _make_conviction(session, offence_date=date(1880, 1, 1))
    c2 = _make_conviction(session, offence_date=date(1880, 1, 1))
    c3 = _make_conviction(session, offence_date=date(1880, 1, 2))
    _attach(session, c1, smith)
    _attach(session, c2, smith)
    _attach(session, c3, smith)

    clusters = detect_same_defendant_same_date_clusters(session)

    matching = [c for c in clusters if set(c) == {c1.id, c2.id}]
    assert len(matching) == 1


def test_same_defendant_same_date_ignores_non_defendant_roles(session):
    """A witness sharing a name and date with a defendant elsewhere isn't
    the "same defendant, same arrest" pattern this detector targets."""
    smith = _make_defendant(session)
    c1 = _make_conviction(session, offence_date=date(1880, 1, 1))
    c2 = _make_conviction(session, offence_date=date(1880, 1, 1))
    _attach(session, c1, smith, role="defendant")
    _attach(session, c2, smith, role="witness")

    clusters = detect_same_defendant_same_date_clusters(session)

    assert not any(set(c) == {c1.id, c2.id} for c in clusters)


def test_detects_shared_incident_cluster_requires_two_defendants(session):
    location = Location(name="church street")
    session.add(location)
    session.flush()

    smith = _make_defendant(session, first_name="John", last_name="Smith")
    jones = _make_defendant(session, first_name="Mary", last_name="Jones")

    c1 = _make_conviction(
        session,
        offence_date=date(1880, 1, 1),
        charge_description="throwing stones",
    )
    c2 = _make_conviction(
        session,
        offence_date=date(1880, 1, 1),
        charge_description="throwing stones",
    )
    for c in (c1, c2):
        session.add(
            SummaryConvictionLocation(
                summary_conviction_id=c.id, location_id=location.id, role="location of offence"
            )
        )
    session.flush()
    _attach(session, c1, smith)
    _attach(session, c2, jones)

    clusters = detect_shared_incident_clusters(session)

    matching = [c for c in clusters if set(c) == {c1.id, c2.id}]
    assert len(matching) == 1


def test_shared_incident_cluster_excludes_single_defendant_groups(session):
    location = Location(name="church street")
    session.add(location)
    session.flush()

    smith = _make_defendant(session)

    c1 = _make_conviction(
        session,
        offence_date=date(1880, 1, 1),
        charge_description="being drunk",
    )
    c2 = _make_conviction(
        session,
        offence_date=date(1880, 1, 1),
        charge_description="being drunk",
    )
    for c in (c1, c2):
        session.add(
            SummaryConvictionLocation(
                summary_conviction_id=c.id, location_id=location.id, role="location of offence"
            )
        )
    session.flush()
    _attach(session, c1, smith)
    _attach(session, c2, smith)

    clusters = detect_shared_incident_clusters(session)

    assert not any(set(c) == {c1.id, c2.id} for c in clusters)


def test_shared_incident_cluster_ignores_court_location_role(session):
    """Two unrelated convictions merely heard at the same court on the same
    day, with the same charge wording by coincidence, shouldn't cluster --
    only the offence location counts here."""
    location = Location(name="whitby petty sessions")
    session.add(location)
    session.flush()

    smith = _make_defendant(session, first_name="John", last_name="Smith")
    jones = _make_defendant(session, first_name="Mary", last_name="Jones")

    c1 = _make_conviction(session, offence_date=date(1880, 1, 1), charge_description="drunkenness")
    c2 = _make_conviction(session, offence_date=date(1880, 1, 1), charge_description="drunkenness")
    for c in (c1, c2):
        session.add(
            SummaryConvictionLocation(
                summary_conviction_id=c.id, location_id=location.id, role="court location"
            )
        )
    session.flush()
    _attach(session, c1, smith)
    _attach(session, c2, jones)

    clusters = detect_shared_incident_clusters(session)

    assert not any(set(c) == {c1.id, c2.id} for c in clusters)


def test_backfill_creates_links_and_is_idempotent(session):
    smith = _make_defendant(session)
    c1 = _make_conviction(session, offence_date=date(1880, 1, 1))
    c2 = _make_conviction(session, offence_date=date(1880, 1, 1))
    _attach(session, c1, smith)
    _attach(session, c2, smith)
    session.commit()

    first_count = backfill_related_convictions(session)
    session.commit()
    second_count = backfill_related_convictions(session)

    assert first_count >= 1
    assert second_count == 0
