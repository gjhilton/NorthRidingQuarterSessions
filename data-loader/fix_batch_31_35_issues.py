"""One-off fix for the remaining confirmed issues from batches 31-35 of the
raw-text-vs-extraction audit. As before, most flagged dropped-spouse-
occupations and some Bridge/dog-licence cases were already fixed earlier
(stale pre-fix batch export); each item here was individually re-verified
against the live database first.

New pattern fixed here: a handful of defendants had their HUSBAND's
occupation wrongly attributed to their own occupation field (the reverse
of the more common "dropped from husband's record" gap) -- e.g. "Mary Wray
wife of Cuthbert Wray ... fruiterer" ending up as Mary's own occupation.
Cleared to None; Cuthbert's own spouse-linked record already has it
correctly (from backfill_spouse_occupations.py).

QSB 1874 2/10/9/44 ("of the township of Ridley") is NOT fixed here --
"Thomas Ridley of the township of Ridley" reads as a plausible transcription
duplication of his own surname rather than a real, otherwise-unattested
North Riding township; left for manual review rather than inventing a place
on weak evidence.

Usage:
    python3 fix_batch_31_35_issues.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import (
    Alias,
    Defendant,
    SummaryConviction,
    SummaryConvictionDefendant,
    SummaryConvictionOffenceType,
)
from qsrecords.models.reference import Place
from qsrecords.offence_types import get_or_create_offence_type

REPLACEMENTS = [
    ("QSB 1866 1/10/15/42", "licensing offence", "animal disease offence"),
    ("QSB 1885 4/10/12/73", "poaching", "fishing offence"),
    ("QSB 1885 4/10/12/74", "poaching", "fishing offence"),
    ("QSB 1874 2/10/9/17", "licensing offence", "dog licence offence"),
    ("QSB 1874 2/10/9/88", "licensing offence", "dog licence offence"),
    ("QSB 1866 3/10/13/37", "poaching", "fishing offence"),
    ("QSB 1885 4/10/12/5", "poaching", "fishing offence"),
    ("QSB 1885 4/10/12/3", "drunk and disorderly", "disorderly behaviour"),
    ("QSB 1885 3/10/11/11", "licensing offence", "dog licence offence"),
    ("QSB 1874 1/10/10/83", "licensing offence", "dog licence offence"),
    ("QSB 1885 4/10/12/102", "licensing offence", "dog licence offence"),
    ("QSB 1885 4/10/12/109", "licensing offence", "dog licence offence"),
    ("QSB 1885 4/10/12/91", "poaching", "fishing offence"),
    ("QSB 1885 4/10/12/92", "poaching", "fishing offence"),
    ("QSB 1885 4/10/12/93", "poaching", "fishing offence"),
]


def _get_conviction(session: Session, reference_number: str) -> SummaryConviction:
    conviction = session.exec(
        select(SummaryConviction).where(SummaryConviction.reference_number == reference_number)
    ).first()
    if conviction is None:
        raise ValueError(f"No conviction found for {reference_number!r}")
    return conviction


def _apply_retags(session: Session) -> list[str]:
    report = []
    for reference_number, old_leaf, new_leaf in REPLACEMENTS:
        conviction = _get_conviction(session, reference_number)
        old_type = get_or_create_offence_type(session, old_leaf)
        new_type = get_or_create_offence_type(session, new_leaf)
        old_link = session.exec(
            select(SummaryConvictionOffenceType).where(
                SummaryConvictionOffenceType.summary_conviction_id == conviction.id,
                SummaryConvictionOffenceType.offence_type_id == old_type.id,
            )
        ).first()
        new_exists = session.exec(
            select(SummaryConvictionOffenceType).where(
                SummaryConvictionOffenceType.summary_conviction_id == conviction.id,
                SummaryConvictionOffenceType.offence_type_id == new_type.id,
            )
        ).first()
        changed = False
        if old_link is not None:
            session.delete(old_link)
            changed = True
        if new_exists is None:
            session.add(
                SummaryConvictionOffenceType(
                    summary_conviction_id=conviction.id, offence_type_id=new_type.id
                )
            )
            changed = True
        if changed:
            report.append(f"{reference_number}: {old_leaf!r} -> {new_leaf!r}")
    return report


def _get_or_create_place(session: Session, name: str, parent_id: int) -> Place:
    existing = session.exec(
        select(Place).where(Place.name == name, Place.parent_id == parent_id)
    ).first()
    if existing:
        return existing
    place = Place(name=name, parent_id=parent_id, type="point")
    session.add(place)
    session.flush()
    return place


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        report = _apply_retags(session)

        LYTHE_PLACE = 107

        bridge_place = session.exec(select(Place).where(Place.name == "The Bridge")).first()
        for ref in ["QSB 1885 4/10/12/69", "QSB 1885 4/10/12/22", "QSB 1885 4/10/12/83", "QSB 1885 4/10/12/84"]:
            c = _get_conviction(session, ref)
            c.offence_location_id = bridge_place.id
            report.append(f"{ref}: offence_location -> 'The Bridge'")

        bridge_end_place = session.exec(select(Place).where(Place.name == "Bridge End")).first()
        c = _get_conviction(session, "QSB 1885 4/10/12/94")
        c.offence_location_id = bridge_end_place.id
        report.append("QSB 1885 4/10/12/94: offence_location -> 'Bridge End'")

        # "Landsend Road" -- a real, distinct place from the already-
        # existing "Sandsend Road" (a different name, not a typo of it).
        landsend_road = _get_or_create_place(session, "Landsend Road", LYTHE_PLACE)
        c = _get_conviction(session, "QSB 1861 2/10/15/15")
        c.offence_location_id = landsend_road.id
        report.append("QSB 1861 2/10/15/15: + place 'Landsend Road' (distinct from Sandsend Road)")

        # John Smith otherwise Henry Lamb.
        lamb_conviction_id = _get_conviction(session, "QSB 1874 2/10/9/101").id
        henry_lamb_defendant_id = session.exec(
            select(SummaryConvictionDefendant.defendant_id).where(
                SummaryConvictionDefendant.summary_conviction_id == lamb_conviction_id
            )
        ).first()
        henry_lamb_defendant = session.get(Defendant, henry_lamb_defendant_id)
        if session.exec(
            select(Alias).where(
                Alias.defendant_id == henry_lamb_defendant.id, Alias.alias_name == "Henry Lamb"
            )
        ).first() is None:
            session.add(Alias(defendant_id=henry_lamb_defendant.id, alias_name="Henry Lamb"))
            report.append(f"Defendant #{henry_lamb_defendant.id} (John Smith): + alias 'Henry Lamb'")

        # Husband's occupation wrongly attributed to the wife defendant
        # herself -- their spouse-linked record already has it correctly.
        for defendant_id in (3520, 3547, 3565, 3539):
            d = session.get(Defendant, defendant_id)
            report.append(f"Defendant #{defendant_id} ({d.first_name} {d.last_name}): occupation {d.occupation!r} -> None")
            d.occupation = None

        for reference_number, note in [
            ("QSB 1863 2/10/15/13", "The memorandum is dated 17 January 1863 but endorsed as 17 February 1863"),
            ("QSB 1863 2/10/15/19", "Date endorsed as 24 February 1863"),
            ("QSB 1863 2/10/15/21", "Date endorsed as 17 February 1863"),
        ]:
            c = _get_conviction(session, reference_number)
            c.correction_note = note
            report.append(f"{reference_number}: + correction_note")

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
