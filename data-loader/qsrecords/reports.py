"""Read-only data-quality / research queries over the extracted database.

Not part of the extraction pipeline -- these support two follow-up workflows
mentioned in the plan but not automated: reviewing which names recur across
cases (a starting point for manual cross-case identity resolution, which is
deliberately out of scope for the extraction itself -- see
qsrecords.models.core), and reviewing which offence categories the LLM
proposed beyond the seed list (qsrecords.offence_types).
"""

from typing import Sequence

from sqlmodel import Session, func, select

from qsrecords.models.core import (
    Defendant,
    InvolvedPerson,
    Person,
    SummaryConviction,
    SummaryConvictionDefendant,
    SummaryConvictionOffenceType,
)
from qsrecords.models.reference import OffenceType


def repeated_defendant_names(
    session: Session, min_occurrences: int = 2
) -> Sequence[tuple[str, int]]:
    """(name_key, occurrence_count) for defendant names appearing in more
    than one mention, most-repeated first. Doesn't imply these are the same
    real person -- just flags candidates for manual review."""
    return session.exec(
        select(Defendant.name_key, func.count(Defendant.id))
        .group_by(Defendant.name_key)
        .having(func.count(Defendant.id) >= min_occurrences)
        .order_by(func.count(Defendant.id).desc())
    ).all()


def repeated_person_names(
    session: Session, min_occurrences: int = 2
) -> Sequence[tuple[str, int]]:
    """Same as repeated_defendant_names, for involved persons (witnesses,
    victims, etc.) rather than defendants."""
    return session.exec(
        select(Person.name_key, func.count(Person.id))
        .group_by(Person.name_key)
        .having(func.count(Person.id) >= min_occurrences)
        .order_by(func.count(Person.id).desc())
    ).all()


def defendant_case_references(session: Session, name_key: str) -> Sequence[tuple[str, object]]:
    """(reference_number, conviction_date) for every case a defendant
    name_key appears in -- the detail behind a repeated_defendant_names row."""
    return session.exec(
        select(SummaryConviction.reference_number, SummaryConviction.conviction_date)
        .join(
            SummaryConvictionDefendant,
            SummaryConvictionDefendant.summary_conviction_id == SummaryConviction.id,
        )
        .join(Defendant, Defendant.id == SummaryConvictionDefendant.defendant_id)
        .where(Defendant.name_key == name_key)
        .order_by(SummaryConviction.conviction_date)
    ).all()


def person_case_references(session: Session, name_key: str) -> Sequence[tuple[str, object]]:
    """Same as defendant_case_references, for involved persons."""
    return session.exec(
        select(SummaryConviction.reference_number, SummaryConviction.conviction_date)
        .join(InvolvedPerson, InvolvedPerson.summary_conviction_id == SummaryConviction.id)
        .join(Person, Person.id == InvolvedPerson.person_id)
        .where(Person.name_key == name_key)
        .order_by(SummaryConviction.conviction_date)
    ).all()


def unreviewed_offence_types(session: Session) -> Sequence[tuple[str, int]]:
    """(name, case_count) for LLM-proposed offence types (is_seeded=False),
    most-used first -- the review queue for manual dedup/merge, per
    qsrecords.offence_types. A conviction charging this offence alongside
    another (e.g. "assault" + "resisting a constable") counts once here
    regardless -- this counts convictions, not offence mentions."""
    return session.exec(
        select(OffenceType.name, func.count(func.distinct(SummaryConviction.id)))
        .join(
            SummaryConvictionOffenceType,
            SummaryConvictionOffenceType.offence_type_id == OffenceType.id,
            isouter=True,
        )
        .join(
            SummaryConviction,
            SummaryConviction.id == SummaryConvictionOffenceType.summary_conviction_id,
            isouter=True,
        )
        .where(OffenceType.is_seeded == False)  # noqa: E712 -- SQLAlchemy needs `== False`, not `is False`
        .group_by(OffenceType.name)
        .order_by(func.count(func.distinct(SummaryConviction.id)).desc())
    ).all()
