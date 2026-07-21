from sqlmodel import select

from qsrecords.models.reference import OffenceType
from qsrecords.offence_types import (
    SEED_OFFENCE_TYPES,
    UNCLASSIFIED,
    get_or_create_offence_type,
    list_offence_type_names,
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


def test_list_offence_type_names_includes_previously_proposed_categories(session):
    # Regression test: extract_batch used to be given only the static
    # SEED_OFFENCE_TYPES, so a category an earlier batch proposed (like
    # "straying animals") was invisible to later batches, which then either
    # re-proposed a near-duplicate or force-fit the record into an unrelated
    # seeded category. list_offence_type_names must return the live table,
    # not the static list.
    seed_offence_types(session)
    get_or_create_offence_type(session, "straying animals")

    names = list_offence_type_names(session)

    assert "straying animals" in names
    assert set(SEED_OFFENCE_TYPES) <= set(names)


def test_list_offence_type_names_orders_seeded_before_proposed(session):
    seed_offence_types(session)
    get_or_create_offence_type(session, "smuggling")

    names = list_offence_type_names(session)

    assert names.index("smuggling") > names.index(SEED_OFFENCE_TYPES[0])
