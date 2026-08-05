"""Removes summary_conviction rows (and their raw_case, person, and
junction-table rows) that the "whitby" keyword scrape picked up by pure
textual coincidence.

qsrecords.views.whitby_in_scope_conviction is the reproducible rule that
*generated the candidate list* -- but the actual removal list below was
hand-reviewed record-by-record against that candidate list (see
OUT_OF_SCOPE_REVIEW.md at the repo root for the full log, reasoning, and
sign-off for every one of the 26 entries). All 26 candidates were
confirmed for removal, including one (QSB 1856 1/10/13/15) that matches no
town signal at all -- the offence describes a journey through Sleights (a
genuine Whitby-area village) the extraction didn't capture as a
structured town field, which was raised as a possible rule gap but
confirmed for removal anyway. That's exactly why this is a human-reviewed
constant, not a live query against the view -- the view finds candidates,
it doesn't get the final word.

Idempotent: a record_number already removed simply won't be found on a
second run.

v3 unified schema note: SummaryConviction.raw_case_id is gone (no more
direct FK from summary_conviction back to raw_case), so the raw_case/
extraction_attempt cleanup below joins on RawCase.reference_number ==
SummaryConviction.record_number instead -- the same key
migrate_to_unified_schema.py's Phase 7 already used to attach raw_case.title
onto summary_conviction during the schema migration, so it's a proven join.
Defendant/InvolvedPerson/Alias/Person(old, two separate tables) are also
gone -- both roles now live as Person rows reached via
SummaryConvictionPerson, so the person cleanup below deletes that junction
row and then the Person row itself, UNLESS the same person_id is still
reachable from some other (in-scope) conviction or is still the target of
another person's PersonRelationship -- same "don't delete a shared person"
care as the old code needed, just checked explicitly now that Person is a
single shared table for every role instead of two tables the old code could
lean on being naturally per-conviction-scoped.
"""

from sqlmodel import Session, select

from qsrecords.models.core import (
    Person,
    PersonOccupation,
    PersonRelationship,
    SummaryConviction,
    SummaryConvictionCrimeType,
    SummaryConvictionLocation,
    SummaryConvictionPerson,
)
from qsrecords.models.raw import ExtractionAttempt, RawCase

# See OUT_OF_SCOPE_REVIEW.md for the full record text, town breakdown, and
# flagged reason behind every one of these -- reviewed and confirmed one at
# a time with the project owner.
OUT_OF_SCOPE_REFERENCE_NUMBERS = [
    "QSB 1803 1/10/3/6",
    "QSB 1803 4/10/1",
    "QSB 1818 2/10/13",
    "QSB 1818 2/10/14",
    "QSB 1834 4/10/40",
    "QSB 1835 3/10/22",
    "QSB 1839 4/10/92",
    "QSB 1856 1/10/13/15",
    "QSB 1864 2/10/13/42",
    "QSB 1865 1/10/14/18",
    "QSB 1865 1/10/14/8",
    "QSB 1866 1/10/4/2",
    "QSB 1868 1/10/12/86",
    "QSB 1868 1/10/12/87",
    "QSB 1868 4/10/14/2",
    "QSB 1868 4/10/14/29",
    "QSB 1868 4/10/14/59",
    "QSB 1875 2/10/7/179",
    "QSB 1884 1/10/6/47",
    "QSB 1885 2/10/7/40",
    "QSB 1885 2/10/7/41",
    "QSB 1885 2/10/7/42",
    "QSB 1885 4/10/7/71",
    "QSB 1886 2/10/11/10",
    "QSB 1887 1/10/6/78",
    "QSB 1887 3/10/9/9",
]


def find_out_of_scope_convictions(session: Session) -> list[SummaryConviction]:
    return session.exec(
        select(SummaryConviction).where(
            SummaryConviction.record_number.in_(OUT_OF_SCOPE_REFERENCE_NUMBERS)
        )
    ).all()


def _remove_person_if_unshared(session: Session, person_id: int) -> None:
    """Deletes a Person row (and its own occupation/relationship rows) --
    unless it's still reachable from another conviction (shared, e.g. a
    person mistakenly attached twice) or still targeted by another person's
    PersonRelationship, in which case it's left entirely alone rather than
    orphaning that other reference."""
    still_on_another_conviction = session.exec(
        select(SummaryConvictionPerson).where(SummaryConvictionPerson.person_id == person_id)
    ).first()
    if still_on_another_conviction is not None:
        return

    still_targeted = session.exec(
        select(PersonRelationship).where(PersonRelationship.related_person_id == person_id)
    ).first()
    if still_targeted is not None:
        return

    for occupation in session.exec(
        select(PersonOccupation).where(PersonOccupation.person_id == person_id)
    ).all():
        session.delete(occupation)

    for relationship in session.exec(
        select(PersonRelationship).where(PersonRelationship.person_id == person_id)
    ).all():
        session.delete(relationship)

    person = session.get(Person, person_id)
    if person is not None:
        session.delete(person)


def remove_out_of_scope_convictions(session: Session) -> list[str]:
    """Returns the record_numbers actually removed, for the caller to
    print/log -- never silent about a deletion."""
    removed = []
    for conviction in find_out_of_scope_convictions(session):
        removed.append(conviction.record_number)

        person_links = session.exec(
            select(SummaryConvictionPerson).where(
                SummaryConvictionPerson.summary_conviction_id == conviction.id
            )
        ).all()
        person_ids = {link.person_id for link in person_links}
        for link in person_links:
            session.delete(link)
        session.flush()
        for person_id in person_ids:
            _remove_person_if_unshared(session, person_id)

        for location_link in session.exec(
            select(SummaryConvictionLocation).where(
                SummaryConvictionLocation.summary_conviction_id == conviction.id
            )
        ).all():
            session.delete(location_link)

        for crime_type_link in session.exec(
            select(SummaryConvictionCrimeType).where(
                SummaryConvictionCrimeType.summary_conviction_id == conviction.id
            )
        ).all():
            session.delete(crime_type_link)

        session.delete(conviction)
        session.flush()

        for raw_case in session.exec(
            select(RawCase).where(RawCase.reference_number == conviction.record_number)
        ).all():
            for attempt in session.exec(
                select(ExtractionAttempt).where(ExtractionAttempt.raw_case_id == raw_case.id)
            ).all():
                session.delete(attempt)
            session.delete(raw_case)

    return removed
