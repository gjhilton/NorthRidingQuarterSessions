from qsrecords.models.core import (
    Defendant,
    InvolvedPerson,
    Person,
    SummaryConviction,
    SummaryConvictionDefendant,
)
from qsrecords.models.reference import OffenceType
from qsrecords.reports import (
    defendant_case_references,
    person_case_references,
    repeated_defendant_names,
    repeated_person_names,
    unreviewed_offence_types,
)


_next_raw_case_id = iter(range(1, 10_000))


def _make_conviction(session, reference_number):
    conviction = SummaryConviction(
        raw_case_id=next(_next_raw_case_id),
        reference_number=reference_number,
        conviction_date_raw="1 Jan 1850",
        charge_description="a charge",
        raw_record="raw",
        archive_url=f"https://example.org/{reference_number}",
    )
    session.add(conviction)
    session.flush()
    return conviction


def test_repeated_defendant_names_only_returns_names_at_or_above_threshold(session):
    c1 = _make_conviction(session, "REF-1")
    c2 = _make_conviction(session, "REF-2")
    smith_1 = Defendant(first_name="John", last_name="Smith", name_key="john smith")
    smith_2 = Defendant(first_name="John", last_name="Smith", name_key="john smith")
    jones = Defendant(first_name="Mary", last_name="Jones", name_key="mary jones")
    session.add_all([smith_1, smith_2, jones])
    session.flush()
    session.add(SummaryConvictionDefendant(summary_conviction_id=c1.id, defendant_id=smith_1.id))
    session.add(SummaryConvictionDefendant(summary_conviction_id=c2.id, defendant_id=smith_2.id))
    session.add(SummaryConvictionDefendant(summary_conviction_id=c1.id, defendant_id=jones.id))
    session.commit()

    rows = repeated_defendant_names(session, min_occurrences=2)
    assert rows == [("john smith", 2)]


def test_defendant_case_references_lists_all_cases_for_a_name(session):
    c1 = _make_conviction(session, "REF-1")
    c2 = _make_conviction(session, "REF-2")
    smith_1 = Defendant(first_name="John", last_name="Smith", name_key="john smith")
    smith_2 = Defendant(first_name="John", last_name="Smith", name_key="john smith")
    session.add_all([smith_1, smith_2])
    session.flush()
    session.add(SummaryConvictionDefendant(summary_conviction_id=c1.id, defendant_id=smith_1.id))
    session.add(SummaryConvictionDefendant(summary_conviction_id=c2.id, defendant_id=smith_2.id))
    session.commit()

    refs = {r for r, _ in defendant_case_references(session, "john smith")}
    assert refs == {"REF-1", "REF-2"}


def test_repeated_person_names(session):
    c1 = _make_conviction(session, "REF-1")
    c2 = _make_conviction(session, "REF-2")
    palmer_1 = Person(first_name="Charles", last_name="Palmer", name_key="charles palmer")
    palmer_2 = Person(first_name="Charles", last_name="Palmer", name_key="charles palmer")
    session.add_all([palmer_1, palmer_2])
    session.flush()
    session.add(InvolvedPerson(summary_conviction_id=c1.id, person_id=palmer_1.id, role="landowner"))
    session.add(InvolvedPerson(summary_conviction_id=c2.id, person_id=palmer_2.id, role="landowner"))
    session.commit()

    rows = repeated_person_names(session, min_occurrences=2)
    assert rows == [("charles palmer", 2)]

    refs = {r for r, _ in person_case_references(session, "charles palmer")}
    assert refs == {"REF-1", "REF-2"}


def test_unreviewed_offence_types_excludes_seeded(session):
    seeded = OffenceType(name="drunkenness", is_seeded=True)
    proposed = OffenceType(name="straying animals", is_seeded=False)
    session.add_all([seeded, proposed])
    session.flush()

    c1 = _make_conviction(session, "REF-1")
    c1.offence_type_id = proposed.id
    session.add(c1)
    session.commit()

    rows = unreviewed_offence_types(session)
    assert rows == [("straying animals", 1)]
