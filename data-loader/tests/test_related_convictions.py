from datetime import date

from sqlmodel import select

from qsrecords.models.core import (
    Defendant,
    RelatedConviction,
    SummaryConviction,
    SummaryConvictionDefendant,
)
from qsrecords.models.reference import Street
from qsrecords.related_convictions import (
    backfill_related_convictions,
    detect_same_defendant_same_date_clusters,
    detect_shared_incident_clusters,
    link_convictions,
)

_next_raw_case_id = iter(range(1, 10_000))


def _make_conviction(session, **overrides):
    defaults = dict(
        raw_case_id=next(_next_raw_case_id),
        reference_number=f"REF-{next(_next_raw_case_id)}",
        conviction_date_raw="1 Jan 1880",
        charge_description="a charge",
        raw_record="raw",
        archive_url=f"https://example.org/{next(_next_raw_case_id)}",
    )
    defaults.update(overrides)
    conviction = SummaryConviction(**defaults)
    session.add(conviction)
    session.flush()
    return conviction


def _make_defendant(session, name_key="john smith", **overrides):
    defaults = dict(first_name="John", last_name="Smith", name_key=name_key)
    defaults.update(overrides)
    defendant = Defendant(**defaults)
    session.add(defendant)
    session.flush()
    return defendant


def _attach(session, conviction, defendant):
    session.add(
        SummaryConvictionDefendant(
            summary_conviction_id=conviction.id, defendant_id=defendant.id
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


def test_detects_shared_incident_cluster_requires_two_defendants(session):
    street = Street(name="church street", town_id=None)
    session.add(street)
    session.flush()

    smith = _make_defendant(session, name_key="john smith")
    jones = _make_defendant(session, first_name="Mary", last_name="Jones", name_key="mary jones")

    c1 = _make_conviction(
        session,
        offence_date=date(1880, 1, 1),
        offence_location_street_id=street.id,
        charge_description="throwing stones",
    )
    c2 = _make_conviction(
        session,
        offence_date=date(1880, 1, 1),
        offence_location_street_id=street.id,
        charge_description="throwing stones",
    )
    _attach(session, c1, smith)
    _attach(session, c2, jones)

    clusters = detect_shared_incident_clusters(session)

    matching = [c for c in clusters if set(c) == {c1.id, c2.id}]
    assert len(matching) == 1


def test_shared_incident_cluster_excludes_single_defendant_groups(session):
    street = Street(name="church street", town_id=None)
    session.add(street)
    session.flush()

    smith = _make_defendant(session, name_key="john smith")

    c1 = _make_conviction(
        session,
        offence_date=date(1880, 1, 1),
        offence_location_street_id=street.id,
        charge_description="being drunk",
    )
    c2 = _make_conviction(
        session,
        offence_date=date(1880, 1, 1),
        offence_location_street_id=street.id,
        charge_description="being drunk",
    )
    _attach(session, c1, smith)
    _attach(session, c2, smith)

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
