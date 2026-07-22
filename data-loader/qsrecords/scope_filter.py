"""Removes summary_conviction rows (and their raw_case, defendant, person,
alias, involved_persons, and junction-table rows) that the "whitby"
keyword scrape picked up by pure textual coincidence.

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

Idempotent: a reference_number already removed simply won't be found on a
second run.
"""

from sqlmodel import Session, select

from qsrecords.models.core import (
    Alias,
    Defendant,
    InvolvedPerson,
    Person,
    SummaryConviction,
    SummaryConvictionDefendant,
    SummaryConvictionOffenceType,
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
            SummaryConviction.reference_number.in_(OUT_OF_SCOPE_REFERENCE_NUMBERS)
        )
    ).all()


def remove_out_of_scope_convictions(session: Session) -> list[str]:
    """Returns the reference_numbers actually removed, for the caller to
    print/log -- never silent about a deletion."""
    removed = []
    for conviction in find_out_of_scope_convictions(session):
        removed.append(conviction.reference_number)
        raw_case_id = conviction.raw_case_id

        for scd in session.exec(
            select(SummaryConvictionDefendant).where(
                SummaryConvictionDefendant.summary_conviction_id == conviction.id
            )
        ).all():
            defendant = session.get(Defendant, scd.defendant_id)
            for alias in session.exec(
                select(Alias).where(Alias.defendant_id == defendant.id)
            ).all():
                session.delete(alias)
            session.delete(scd)
            session.delete(defendant)

        for ip in session.exec(
            select(InvolvedPerson).where(
                InvolvedPerson.summary_conviction_id == conviction.id
            )
        ).all():
            person = session.get(Person, ip.person_id)
            session.delete(ip)
            session.delete(person)

        for scot in session.exec(
            select(SummaryConvictionOffenceType).where(
                SummaryConvictionOffenceType.summary_conviction_id == conviction.id
            )
        ).all():
            session.delete(scot)

        session.delete(conviction)
        session.flush()

        for attempt in session.exec(
            select(ExtractionAttempt).where(ExtractionAttempt.raw_case_id == raw_case_id)
        ).all():
            session.delete(attempt)
        raw_case = session.get(RawCase, raw_case_id)
        if raw_case is not None:
            session.delete(raw_case)

    return removed
