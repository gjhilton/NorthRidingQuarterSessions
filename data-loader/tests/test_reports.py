from qsrecords.models.core import (
    Person,
    SummaryConviction,
    SummaryConvictionCrimeType,
    SummaryConvictionPerson,
)
from qsrecords.models.reference import CrimeType
from qsrecords.reports import case_references, repeated_names, unreviewed_crime_types


_next_id = iter(range(1, 10_000))


def _make_conviction(session, record_number):
    conviction = SummaryConviction(
        record_number=record_number,
        charge_description="a charge",
        raw_record="raw",
    )
    session.add(conviction)
    session.flush()
    return conviction


def test_repeated_names_only_returns_names_at_or_above_threshold(session):
    c1 = _make_conviction(session, "REF-1")
    c2 = _make_conviction(session, "REF-2")
    smith_1 = Person(first_name="John", last_name="Smith")
    smith_2 = Person(first_name="John", last_name="Smith")
    jones = Person(first_name="Mary", last_name="Jones")
    session.add_all([smith_1, smith_2, jones])
    session.flush()
    session.add(SummaryConvictionPerson(summary_conviction_id=c1.id, person_id=smith_1.id, role="defendant"))
    session.add(SummaryConvictionPerson(summary_conviction_id=c2.id, person_id=smith_2.id, role="defendant"))
    session.add(SummaryConvictionPerson(summary_conviction_id=c1.id, person_id=jones.id, role="witness"))
    session.commit()

    rows = repeated_names(session, min_occurrences=2)
    assert rows == [("john smith", 2)]


def test_repeated_names_spans_any_role(session):
    """A name recurring once as a defendant and once as a victim is still a
    real recurrence worth flagging -- the merged Person table no longer
    distinguishes "defendant names" from "involved-person names"."""
    c1 = _make_conviction(session, "REF-1")
    c2 = _make_conviction(session, "REF-2")
    palmer_defendant = Person(first_name="Charles", last_name="Palmer")
    palmer_victim = Person(first_name="Charles", last_name="Palmer")
    session.add_all([palmer_defendant, palmer_victim])
    session.flush()
    session.add(
        SummaryConvictionPerson(summary_conviction_id=c1.id, person_id=palmer_defendant.id, role="defendant")
    )
    session.add(
        SummaryConvictionPerson(summary_conviction_id=c2.id, person_id=palmer_victim.id, role="victim")
    )
    session.commit()

    rows = repeated_names(session, min_occurrences=2)
    assert rows == [("charles palmer", 2)]


def test_case_references_lists_all_cases_for_a_name(session):
    c1 = _make_conviction(session, "REF-1")
    c2 = _make_conviction(session, "REF-2")
    smith_1 = Person(first_name="John", last_name="Smith")
    smith_2 = Person(first_name="John", last_name="Smith")
    session.add_all([smith_1, smith_2])
    session.flush()
    session.add(SummaryConvictionPerson(summary_conviction_id=c1.id, person_id=smith_1.id, role="defendant"))
    session.add(SummaryConvictionPerson(summary_conviction_id=c2.id, person_id=smith_2.id, role="witness"))
    session.commit()

    refs = {r for r, _ in case_references(session, "john smith")}
    assert refs == {"REF-1", "REF-2"}


def test_unreviewed_crime_types_excludes_seeded(session):
    category = CrimeType(name="drink & disorder", is_seeded=True, parent_id=None, sort_order=0)
    session.add(category)
    session.flush()
    categorised = CrimeType(name="drunkenness", is_seeded=True, parent_id=category.id)
    uncategorised = CrimeType(name="poisoning a well", is_seeded=False)
    session.add_all([categorised, uncategorised])
    session.flush()

    c1 = _make_conviction(session, "REF-1")
    session.add(
        SummaryConvictionCrimeType(summary_conviction_id=c1.id, crime_type_id=uncategorised.id)
    )
    session.commit()

    rows = unreviewed_crime_types(session)
    assert rows == [("poisoning a well", 1)]


def test_unreviewed_crime_types_counts_convictions_not_mentions(session):
    """A conviction carrying two crime types (e.g. assault + an
    uncategorised proposal) still counts once for the uncategorised
    proposal, not twice -- this counts convictions, not (conviction,
    crime_type) pairs."""
    category = CrimeType(name="assault & resisting authority", is_seeded=True, parent_id=None, sort_order=0)
    session.add(category)
    session.flush()
    seeded = CrimeType(name="assault", is_seeded=True, parent_id=category.id)
    proposed = CrimeType(name="poisoning a well", is_seeded=False)
    session.add_all([seeded, proposed])
    session.flush()

    c1 = _make_conviction(session, "REF-1")
    session.add_all(
        [
            SummaryConvictionCrimeType(summary_conviction_id=c1.id, crime_type_id=seeded.id),
            SummaryConvictionCrimeType(summary_conviction_id=c1.id, crime_type_id=proposed.id),
        ]
    )
    session.commit()

    rows = unreviewed_crime_types(session)
    assert rows == [("poisoning a well", 1)]
