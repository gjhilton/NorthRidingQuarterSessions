from sqlmodel import select

from qsrecords.models.core import SummaryConviction, SummaryConvictionOffenceType
from qsrecords.models.reference import OffenceCategory, OffenceType
from qsrecords.offence_types import (
    OFFENCE_TAXONOMY,
    SEED_OFFENCE_TYPES,
    UNCLASSIFIED,
    get_or_create_offence_type,
    list_offence_type_names,
    migrate_offence_taxonomy,
    seed_offence_taxonomy,
    seed_offence_types,
)


def test_seed_offence_types_inserts_all_once(session):
    seed_offence_types(session)
    seed_offence_types(session)  # idempotent re-seed
    rows = session.exec(select(OffenceType)).all()
    assert len(rows) == len(SEED_OFFENCE_TYPES)
    assert all(row.is_seeded for row in rows)


def test_seed_offence_taxonomy_assigns_every_leaf_a_category(session):
    seed_offence_taxonomy(session)
    rows = session.exec(select(OffenceType)).all()
    for row in rows:
        assert row.category_id is not None, row.name

    categories = session.exec(select(OffenceCategory)).all()
    assert len(categories) == len(OFFENCE_TAXONOMY)
    # Curated order preserved, not alphabetical -- Drink & Public Order
    # (the largest category) sorts first.
    ordered_names = [c.name for c in sorted(categories, key=lambda c: c.sort_order)]
    assert ordered_names[0] == "drink & public order"


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
    result = get_or_create_offence_type(session, "poisoning a well")
    assert result.is_seeded is False
    assert result.category_id is None


def test_list_offence_type_names_includes_previously_proposed_categories(session):
    # Regression test: extract_batch used to be given only the static
    # SEED_OFFENCE_TYPES, so a category an earlier batch proposed (like
    # "poisoning a well") was invisible to later batches, which then either
    # re-proposed a near-duplicate or force-fit the record into an unrelated
    # seeded category. list_offence_type_names must return the live table,
    # not the static list.
    seed_offence_types(session)
    get_or_create_offence_type(session, "poisoning a well")

    names = list_offence_type_names(session)

    assert "poisoning a well" in names
    assert set(SEED_OFFENCE_TYPES) <= set(names)


def test_list_offence_type_names_groups_by_category(session):
    seed_offence_types(session)
    get_or_create_offence_type(session, "poisoning a well")  # uncategorised proposal

    names = list_offence_type_names(session)

    # Every leaf under "Drink & Public Order" (the first category) sorts
    # before every leaf under "Maritime & Customs" (a later category) --
    # related terms cluster together in the flat list rather than being
    # scattered by seeded-vs-proposed status.
    assert names.index("drunkenness") < names.index("smuggling")
    assert names.index("drunk and disorderly") < names.index("customs offence")
    # Uncategorised proposals sort last.
    assert names.index("poisoning a well") > names.index("unclassified")


def test_migrate_offence_taxonomy_merges_duplicate_names_and_repoints_tags(session):
    seed_offence_taxonomy(session)
    # Simulate the pre-migration state: a duplicate name that predates the
    # taxonomy, tagged on a real conviction.
    duplicate = get_or_create_offence_type(session, "truancy")
    canonical = get_or_create_offence_type(session, "school non-attendance")
    assert duplicate.id != canonical.id

    conviction = SummaryConviction(
        raw_case_id=1,
        reference_number="REF-1",
        conviction_date_raw="1 Jan 1880",
        charge_description="not sending his son to school",
        raw_record="raw",
        archive_url="https://example.org/1",
    )
    session.add(conviction)
    session.flush()
    session.add(
        SummaryConvictionOffenceType(summary_conviction_id=conviction.id, offence_type_id=duplicate.id)
    )
    session.commit()

    migrate_offence_taxonomy(session)
    session.commit()

    assert session.exec(select(OffenceType).where(OffenceType.name == "truancy")).first() is None
    tags = session.exec(
        select(SummaryConvictionOffenceType).where(
            SummaryConvictionOffenceType.summary_conviction_id == conviction.id
        )
    ).all()
    assert [t.offence_type_id for t in tags] == [canonical.id]


def test_migrate_offence_taxonomy_survives_a_conviction_tagged_with_both_names(session):
    """A conviction already tagged with both the old and new name (e.g. one
    manual-batch pass used "truancy", another used "school non-attendance"
    for a different record, and by coincidence both ended up on the same
    conviction) must not violate the composite primary key when the old tag
    is re-pointed."""
    seed_offence_taxonomy(session)
    duplicate = get_or_create_offence_type(session, "truancy")
    canonical = get_or_create_offence_type(session, "school non-attendance")

    conviction = SummaryConviction(
        raw_case_id=2,
        reference_number="REF-2",
        conviction_date_raw="1 Jan 1880",
        charge_description="a charge",
        raw_record="raw",
        archive_url="https://example.org/2",
    )
    session.add(conviction)
    session.flush()
    session.add_all(
        [
            SummaryConvictionOffenceType(summary_conviction_id=conviction.id, offence_type_id=duplicate.id),
            SummaryConvictionOffenceType(summary_conviction_id=conviction.id, offence_type_id=canonical.id),
        ]
    )
    session.commit()

    migrate_offence_taxonomy(session)  # must not raise
    session.commit()

    tags = session.exec(
        select(SummaryConvictionOffenceType).where(
            SummaryConvictionOffenceType.summary_conviction_id == conviction.id
        )
    ).all()
    assert [t.offence_type_id for t in tags] == [canonical.id]


def test_migrate_offence_taxonomy_is_idempotent(session):
    seed_offence_taxonomy(session)
    get_or_create_offence_type(session, "truancy")
    migrate_offence_taxonomy(session)
    session.commit()

    before = {row.name for row in session.exec(select(OffenceType)).all()}
    migrate_offence_taxonomy(session)  # second call: nothing left to merge
    session.commit()
    after = {row.name for row in session.exec(select(OffenceType)).all()}

    assert before == after
