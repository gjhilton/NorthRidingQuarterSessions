"""Read-only data-quality / research queries over the extracted database.

Not part of the extraction pipeline -- these support two follow-up workflows
mentioned in the plan but not automated: reviewing which names recur across
cases (a starting point for manual cross-case identity resolution, which is
deliberately out of scope for the extraction itself -- see
qsrecords.models.core), and reviewing which crime types the LLM proposed
beyond the seed list (qsrecords.offence_types).

v3 unified schema note: Defendant and Person used to be separate tables,
so "repeated defendant names" and "repeated involved-person names" were two
distinct queries. They're merged into one Person table now -- a name
recurring as a defendant in one case and a witness in another is still the
same real-world recurrence worth flagging, so repeated_names()/
case_references() below deliberately don't split by role at all. This is a
genuine simplification, not just a rename: two near-identical functions
collapsed into one.

Grouping is done in Python (fetch every Person row, normalize, count) rather
than as a SQL GROUP BY on a computed expression -- at this data scale
(~10,000 person rows) that's simpler to read and keeps the normalization
logic in exactly one place (qsrecords.text.normalize_name), rather than
re-expressing the same rule as a second, SQL-flavoured implementation.
"""

from typing import Sequence

from sqlmodel import Session, func, select

from qsrecords.models.core import (
    Person,
    SummaryConviction,
    SummaryConvictionCrimeType,
    SummaryConvictionPerson,
)
from qsrecords.models.reference import CrimeType
from qsrecords.text import normalize_name


def repeated_names(session: Session, min_occurrences: int = 2) -> Sequence[tuple[str, int]]:
    """(name_key, occurrence_count) for person names (any role -- defendant,
    victim, witness, informant, ...) appearing in more than one mention,
    most-repeated first. Doesn't imply these are the same real person --
    just flags candidates for manual review."""
    rows = session.exec(select(Person.first_name, Person.last_name)).all()

    counts: dict[str, int] = {}
    for first_name, last_name in rows:
        name_key = normalize_name(first_name, last_name)
        if not name_key:
            continue
        counts[name_key] = counts.get(name_key, 0) + 1

    repeated = [(name_key, count) for name_key, count in counts.items() if count >= min_occurrences]
    repeated.sort(key=lambda row: row[1], reverse=True)
    return repeated


def case_references(session: Session, name_key: str) -> Sequence[tuple[str, object]]:
    """(record_number, conviction_date) for every case a person name_key
    appears in, in any role -- the detail behind a repeated_names() row."""
    rows = session.exec(
        select(
            SummaryConviction.record_number,
            SummaryConviction.conviction_date,
            Person.first_name,
            Person.last_name,
        )
        .join(SummaryConvictionPerson, SummaryConvictionPerson.summary_conviction_id == SummaryConviction.id)
        .join(Person, Person.id == SummaryConvictionPerson.person_id)
        .order_by(SummaryConviction.conviction_date)
    ).all()

    return [
        (record_number, conviction_date)
        for record_number, conviction_date, first_name, last_name in rows
        if normalize_name(first_name, last_name) == name_key
    ]


def unreviewed_crime_types(session: Session) -> Sequence[tuple[str, int]]:
    """(name, case_count) for crime types the LLM proposed that have never
    been folded into the curated taxonomy (is_seeded=False), most-used
    first -- the review queue for manual categorisation, per
    qsrecords.offence_types.OFFENCE_TAXONOMY.

    v3 note: CrimeType merges the old OffenceCategory/OffenceType pair into
    one self-referential tree, so "no category assigned" (the old
    category_id IS NULL check) is no longer a meaningful test on its own --
    a top-level category itself also has parent_id IS NULL. is_seeded is
    the right flag here instead: it exists specifically to distinguish
    curated-seed rows (categories and their reviewed leaves alike) from
    LLM-proposed ones, which is exactly "unreviewed" for this report's
    purposes -- regardless of whether the proposal happens to already sit
    under a parent.

    A conviction charging this offence alongside another (e.g. "assault" +
    "resisting a constable") counts once here regardless -- this counts
    convictions, not crime-type mentions."""
    return session.exec(
        select(CrimeType.name, func.count(func.distinct(SummaryConvictionCrimeType.summary_conviction_id)))
        .join(
            SummaryConvictionCrimeType,
            SummaryConvictionCrimeType.crime_type_id == CrimeType.id,
            isouter=True,
        )
        .where(CrimeType.is_seeded.is_(False))
        .group_by(CrimeType.name)
        .order_by(func.count(func.distinct(SummaryConvictionCrimeType.summary_conviction_id)).desc())
    ).all()
