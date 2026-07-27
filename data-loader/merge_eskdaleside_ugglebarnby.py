"""One-off (but safely re-runnable) merge of three town rows that are all
the same real civil parish: "eskdaleside", "ugglebarnby" and "eskdaleside
cum ugglebarnby". Eskdaleside (a chapelry) and Ugglebarnby (a township)
united as one civil parish, "Eskdaleside cum Ugglebarnby", in 1885 -- see
VCH North Riding vol 2 -- which is before this dataset's ~1889 end date,
so all three should be one town row, not three.

Found and confirmed while building the explorer's /places parish taxonomy
(explorer/scripts/places-taxonomy-v2.txt).

"eskdaleside cum ugglebarnby" (town.id 11) is kept as the canonical row
(it's the confirmed 1885-onward civil parish name). "eskdaleside" (33)
and "ugglebarnby" (58) are merged into it:

1. Any Street row that shares a name across two or more of the three
   town_ids (e.g. "sleights", "grosmont town street", "blue bank",
   "sleights town street") is a real duplicate -- reassign every
   defendant/person/summary_conviction reference from the duplicate(s)
   onto ONE surviving street row (preferring the one already under town
   11 where one exists), then delete the duplicate street row(s).
2. Every other Street row under town_id 33 or 58 just gets its town_id
   changed to 11 -- no name collision, so no data to merge, just
   re-homed.
3. Every defendant/person/summary_conviction row with town_id (or
   offence_location_town_id/court_location_town_id) 33 or 58 gets
   reassigned to 11.
4. Town rows 33 and 58 are deleted once empty.

Usage:
    python3 merge_eskdaleside_ugglebarnby.py
"""

from collections import defaultdict

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, Person, SummaryConviction
from qsrecords.models.reference import Street, Town

CANONICAL_TOWN_NAME = "eskdaleside-cum-ugglebarnby"
MERGED_TOWN_NAMES = ["eskdaleside", "ugglebarnby"]


def _reassign_street_refs(session: Session, old_street_id: int, new_street_id: int) -> int:
    count = 0
    for defendant in session.exec(select(Defendant).where(Defendant.street_id == old_street_id)).all():
        defendant.street_id = new_street_id
        session.add(defendant)
        count += 1
    for person in session.exec(select(Person).where(Person.street_id == old_street_id)).all():
        person.street_id = new_street_id
        session.add(person)
        count += 1
    for conviction in session.exec(
        select(SummaryConviction).where(SummaryConviction.offence_location_street_id == old_street_id)
    ).all():
        conviction.offence_location_street_id = new_street_id
        session.add(conviction)
        count += 1
    return count


def _reassign_town_refs(session: Session, old_town_id: int, new_town_id: int) -> int:
    count = 0
    for defendant in session.exec(select(Defendant).where(Defendant.town_id == old_town_id)).all():
        defendant.town_id = new_town_id
        session.add(defendant)
        count += 1
    for person in session.exec(select(Person).where(Person.town_id == old_town_id)).all():
        person.town_id = new_town_id
        session.add(person)
        count += 1
    for conviction in session.exec(
        select(SummaryConviction).where(SummaryConviction.offence_location_town_id == old_town_id)
    ).all():
        conviction.offence_location_town_id = new_town_id
        session.add(conviction)
        count += 1
    for conviction in session.exec(
        select(SummaryConviction).where(SummaryConviction.court_location_town_id == old_town_id)
    ).all():
        conviction.court_location_town_id = new_town_id
        session.add(conviction)
        count += 1
    return count


def merge_eskdaleside_ugglebarnby(session: Session) -> list[str]:
    log: list[str] = []

    canonical_town = session.exec(select(Town).where(Town.name == CANONICAL_TOWN_NAME)).first()
    merged_towns = [
        t
        for t in (session.exec(select(Town).where(Town.name == name)).first() for name in MERGED_TOWN_NAMES)
        if t is not None
    ]
    if canonical_town is None or not merged_towns:
        return log  # already merged (or nothing to merge) -- idempotent no-op

    town_ids = [canonical_town.id] + [t.id for t in merged_towns]

    # Group streets by name across all three towns to find duplicates.
    by_name: dict[str, list[Street]] = defaultdict(list)
    for street in session.exec(select(Street).where(Street.town_id.in_(town_ids))).all():
        by_name[street.name].append(street)

    for name, streets in by_name.items():
        if len(streets) < 2:
            continue
        # Prefer the copy already under the canonical town as the survivor.
        streets.sort(key=lambda s: 0 if s.town_id == canonical_town.id else 1)
        survivor, duplicates = streets[0], streets[1:]
        for dup in duplicates:
            n = _reassign_street_refs(session, dup.id, survivor.id)
            session.delete(dup)
            log.append(f"street {name!r}: merged street #{dup.id} (town {dup.town_id}) into #{survivor.id} ({n} rows reassigned)")

    # Everything else just gets re-homed onto the canonical town_id.
    for street in session.exec(select(Street).where(Street.town_id.in_([t.id for t in merged_towns]))).all():
        old_town_id = street.town_id
        street.town_id = canonical_town.id
        session.add(street)
        log.append(f"street {street.name!r}: re-homed from town {old_town_id} to {canonical_town.id}")

    for town in merged_towns:
        n = _reassign_town_refs(session, town.id, canonical_town.id)
        log.append(f"town {town.name!r} (#{town.id}): {n} defendant/person/conviction rows reassigned to #{canonical_town.id}")
        session.delete(town)
        log.append(f"town {town.name!r} (#{town.id}): deleted")

    return log


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        log = merge_eskdaleside_ugglebarnby(session)
        session.commit()
    for line in log:
        print(f"  {line}")
    print(f"{len(log)} change(s) made." if log else "Nothing to merge (already done).")


if __name__ == "__main__":
    main()
