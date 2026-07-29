"""One-off fix for a systemic extraction bug found via the raw-text-vs-
extraction audit: single-defendant "not sending [child] to school"
convictions had offence_location_id set to the SAME specific place as the
defendant's own residence (a yard, street, or hamlet) -- but raw_record
never names a specific offence location for these, only ever "Offence
committed in the [X] School Board district" (a generic administrative
district, not a place with street-level precision). The defendant's own
address is correctly captured on their own record; duplicating it onto
offence_location overstates the precision of where the "offence" (a
paperwork/attendance failure, not a located incident) actually occurred.

Scope: convictions where charge_description matches "not sending ... to
school", there's exactly one defendant, offence_location_id equals that
defendant's own location_id, AND that place is not already a township-
level node (many single-defendant truancy cases legitimately have no
place more specific than the township itself, e.g. "of the township of
Whitby" with nothing narrower given -- those are correct and untouched).
For the remainder, offence_location_id is reset to the nearest township-
level ancestor of the current (wrongly-specific) place, walking up the
place tree.

Idempotent -- re-running only affects rows still matching the query above;
once fixed, offence_location_id no longer equals the defendant's own
(specific) location_id, so a second run is a no-op.

Usage:
    python3 fix_truancy_offence_location.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, SummaryConviction, SummaryConvictionDefendant
from qsrecords.models.reference import Place

ROOT_PARENT_ID = 345  # "North Riding of Yorkshire" -- every township is a direct child of this.


def _township_ancestor(session: Session, place_id: int) -> Place:
    place = session.get(Place, place_id)
    while place.parent_id is not None and place.parent_id != ROOT_PARENT_ID:
        place = session.get(Place, place.parent_id)
    return place


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    report = []
    with get_session(settings.db_path) as session:
        convictions = session.exec(
            select(SummaryConviction).where(
                SummaryConviction.charge_description.contains("not sending"),
                SummaryConviction.charge_description.contains("school"),
                SummaryConviction.offence_location_id.is_not(None),
            )
        ).all()

        for conviction in convictions:
            defendant_ids = session.exec(
                select(SummaryConvictionDefendant.defendant_id).where(
                    SummaryConvictionDefendant.summary_conviction_id == conviction.id
                )
            ).all()
            if len(defendant_ids) != 1:
                continue
            defendant = session.get(Defendant, defendant_ids[0])
            if defendant.location_id != conviction.offence_location_id:
                continue

            current_place = session.get(Place, conviction.offence_location_id)
            if current_place.parent_id == ROOT_PARENT_ID:
                continue  # already township-level -- correct as-is

            township = _township_ancestor(session, conviction.offence_location_id)
            conviction.offence_location_id = township.id
            report.append(
                f"{conviction.reference_number}: offence_location {current_place.name!r} -> {township.name!r} "
                f"(defendant's own residence kept at {current_place.name!r})"
            )

        session.commit()

    print(f"Fixed {len(report)} truancy conviction(s):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
