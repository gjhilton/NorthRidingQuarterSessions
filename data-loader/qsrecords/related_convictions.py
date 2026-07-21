"""Links between convictions judged to stem from the same underlying event.

Two detection heuristics, both deliberately conservative (false negatives
are fine -- a missed link is just not shown; false positives would assert
a connection that didn't exist):

- same_defendant_same_date: the same defendant name_key convicted on the
  same offence_date, almost always multiple charges from one arrest (e.g.
  drunk AND resisting the constable who arrested them). The one real risk
  is a common name coinciding by chance -- the link's note says exactly
  what matched, so this is a suggestion the UI can show, not an assertion
  of certainty.
- shared_incident: different defendants, but the same offence_date, same
  offence_location_street_id, and identical charge_description text --
  strong evidence of one recorded event producing several convictions
  (a riot, a group poaching trip, several people separately charged with
  obstructing the same street on the same day). Requires the street to be
  known (street_id IS NOT NULL) and at least 2 distinct defendants, since
  matching on date+street alone would catch unrelated people who just
  happened to both be drunk on the same well-trafficked street.
"""

from itertools import combinations
from typing import Optional

from sqlmodel import Session, select

from qsrecords.models.core import (
    Defendant,
    RelatedConviction,
    SummaryConviction,
    SummaryConvictionDefendant,
)


def link_convictions(session: Session, id_a: int, id_b: int, note: Optional[str] = None) -> bool:
    """Records that id_a and id_b are related. Order-independent and
    idempotent -- returns False (no-op) if already linked or if id_a ==
    id_b, True if a new link was created."""
    if id_a == id_b:
        return False
    lo, hi = (id_a, id_b) if id_a < id_b else (id_b, id_a)
    existing = session.get(RelatedConviction, (lo, hi))
    if existing:
        return False
    session.add(RelatedConviction(summary_conviction_id_a=lo, summary_conviction_id_b=hi, note=note))
    return True


def detect_same_defendant_same_date_clusters(session: Session) -> list[list[int]]:
    """Groups of summary_conviction ids sharing a defendant name_key and an
    offence_date, group size > 1."""
    rows = session.exec(
        select(Defendant.name_key, SummaryConviction.offence_date, SummaryConviction.id)
        .join(SummaryConvictionDefendant, SummaryConvictionDefendant.defendant_id == Defendant.id)
        .join(SummaryConviction, SummaryConviction.id == SummaryConvictionDefendant.summary_conviction_id)
        .where(SummaryConviction.offence_date.is_not(None))
    ).all()

    groups: dict[tuple[str, object], set[int]] = {}
    for name_key, offence_date, conviction_id in rows:
        groups.setdefault((name_key, offence_date), set()).add(conviction_id)

    return [sorted(ids) for ids in groups.values() if len(ids) > 1]


def detect_shared_incident_clusters(session: Session) -> list[list[int]]:
    """Groups of summary_conviction ids sharing offence_date +
    offence_location_street_id + exact charge_description text, involving
    at least 2 distinct defendants, group size > 1."""
    rows = session.exec(
        select(
            SummaryConviction.offence_date,
            SummaryConviction.offence_location_street_id,
            SummaryConviction.charge_description,
            SummaryConviction.id,
        ).where(
            SummaryConviction.offence_date.is_not(None),
            SummaryConviction.offence_location_street_id.is_not(None),
        )
    ).all()

    groups: dict[tuple, set[int]] = {}
    for offence_date, street_id, charge_description, conviction_id in rows:
        key = (offence_date, street_id, charge_description)
        groups.setdefault(key, set()).add(conviction_id)

    candidates = [sorted(ids) for ids in groups.values() if len(ids) > 1]

    # Require at least 2 distinct defendants across the group -- otherwise
    # this is the same_defendant_same_date case (or an id already covered
    # by it), not a distinct multi-person incident.
    result = []
    for ids in candidates:
        defendant_ids = set(
            session.exec(
                select(SummaryConvictionDefendant.defendant_id).where(
                    SummaryConvictionDefendant.summary_conviction_id.in_(ids)
                )
            ).all()
        )
        if len(defendant_ids) > 1:
            result.append(ids)
    return result


def backfill_related_convictions(session: Session) -> int:
    """Runs both detectors and links every pair within each detected
    cluster. Idempotent (link_convictions no-ops on existing pairs).
    Returns the number of new links created."""
    created = 0

    for ids in detect_same_defendant_same_date_clusters(session):
        note = "Same defendant and same offence date -- likely multiple charges from one arrest."
        for id_a, id_b in combinations(ids, 2):
            if link_convictions(session, id_a, id_b, note=note):
                created += 1

    for ids in detect_shared_incident_clusters(session):
        note = (
            "Same offence date, street, and charge wording, different defendants -- "
            "likely several convictions from one recorded incident."
        )
        for id_a, id_b in combinations(ids, 2):
            if link_convictions(session, id_a, id_b, note=note):
                created += 1

    return created
