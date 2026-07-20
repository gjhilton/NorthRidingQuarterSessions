from sqlmodel import select

from qsrecords.models.reference import OffenceType
from qsrecords.offence_types import (
    SEED_OFFENCE_TYPES,
    UNCLASSIFIED,
    get_or_create_offence_type,
    seed_offence_types,
)


def test_seed_offence_types_inserts_all_once(session):
    seed_offence_types(session)
    seed_offence_types(session)  # idempotent re-seed
    rows = session.exec(select(OffenceType)).all()
    assert len(rows) == len(SEED_OFFENCE_TYPES)
    assert all(row.is_seeded for row in rows)


def test_get_or_create_dedupes_case_and_whitespace_variants(session):
    a = get_or_create_offence_type(session, "Poaching")
    b = get_or_create_offence_type(session, "  poaching ")
    assert a.id == b.id
    assert len(session.exec(select(OffenceType)).all()) == 1


def test_summary_conviction_redirects_to_unclassified(session):
    # Regression test for the real v1 bug: offence_type was sometimes just
    # "Summary conviction" (the record type, not a real category).
    result = get_or_create_offence_type(session, "Summary conviction")
    assert result.name == UNCLASSIFIED


def test_new_llm_proposed_category_is_not_marked_seeded(session):
    result = get_or_create_offence_type(session, "smuggling")
    assert result.is_seeded is False
