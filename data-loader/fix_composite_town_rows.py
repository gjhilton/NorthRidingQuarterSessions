"""One-off (but safely re-runnable) cleanup for a bug in the town table:
29 rows are malformed "sub-location, parish" composite strings (e.g.
"grosmont, eskdaleside", "tate hill, whitby") instead of a proper
town+street pair. Every one is live-referenced by 1-5 defendant/person
rows (not orphaned -- see delete_orphaned_streets.py for that separate,
already-fixed bug).

Found while researching the explorer's /places parish taxonomy and
confirmed against ~1889 civil parish geography (VCH North Riding vol 2,
Bulmer's 1890 Directory) before any row was touched, per the project's
"figure out the geography first" rule for this area.

Four kinds of fix, decided per-row from the real evidence (raw_record
text, existing street rows, VCH parish structure) rather than guessed:

1. MERGE_INTO_TOWN: the sub-location is itself a real place that already
   has a clean town row (e.g. "grosmont, eskdaleside" -> town "grosmont").
   Reassign defendant/person town_id, delete the malformed row.
2. MERGE_INTO_STREET: the sub-location is a street/point that already
   exists as a Street row under the correct town (e.g. "tate hill,
   whitby" -> town "whitby" + existing street "tate hill"). Reassign
   town_id + street_id, delete the malformed row.
3. CREATE_STREET_AND_MERGE: same as (2) but no matching Street row exists
   yet -- create one, then reassign.
4. RENAME_IN_PLACE: a distant place (Stockton-on-Tees, Yarmouth) with no
   existing clean row to merge into -- just drop the ", county"/", county
   durham" suffix on the row itself, no reassignment needed.

Two deliberate non-merges worth noting:
- "dale house, hinderwell" is NOT merged into the existing "dale house"
  street under Borrowby, despite the name match -- the record itself
  (QSB 1888 2/10/11/6) says "in the township of Hinderwell", and Borrowby/
  Hinderwell are neighbouring parishes with "Dale House" a common farm
  name, so this gets its own new Street row under Hinderwell instead.
- "sleights, eskdaleside" and "sleights, eskdaleside-cum-ugglebarnby" both
  land on one new "sleights" street under the eskdaleside-cum-ugglebarnby
  town_id (the confirmed 1889 civil parish name) rather than under either
  original malformed row's parent -- but note ESKDALESIDE /
  ESKDALESIDE-CUM-UGGLEBARNBY / UGGLEBARNBY are themselves three separate
  town rows that VCH confirms are one civil parish (united 1885) and
  still need consolidating in a later, separate migration; this script
  doesn't attempt that larger merge.

Usage:
    python3 fix_composite_town_rows.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, Person
from qsrecords.models.reference import Street, Town

# malformed town.name -> existing clean town.name to merge into
MERGE_INTO_TOWN: dict[str, str] = {
    "briggswath, aislaby": "briggswath",
    "grosmont, eskdaleside": "grosmont",
    "grosmont, eskdaleside-cum-ugglebarnby": "grosmont",
    "robin hood's bay, fylingdales": "robin hood's bay",
    "runswick, hinderwell": "runswick",
    "staithes, hinderwell": "staithes",
    "darlington, county durham": "darlington",
}

# malformed town.name -> (target town.name, existing target street.name)
MERGE_INTO_STREET: dict[str, tuple[str, str]] = {
    "argument's yard, whitby": ("whitby", "arguments yard"),
    "arguments yard, whitby": ("whitby", "arguments yard"),
    "boulby bank, whitby": ("whitby", "boulby bank"),
    "renwicks yard, whitby": ("whitby", "renwick's yard"),
    "tate hill, whitby": ("whitby", "tate hill"),
    "the cragg, whitby": ("whitby", "the cragg"),
    "stonegate, glaisdale": ("glaisdale", "stonegate"),
    "staithes lane end, hinderwell": ("hinderwell", "staithes lane end"),
}

# malformed town.name -> (target town.name, new street.name to create)
CREATE_STREET_AND_MERGE: dict[str, tuple[str, str]] = {
    "cappleman's yard, whitby": ("whitby", "cappleman's yard"),
    "cliff lane, whitby": ("whitby", "cliff lane"),
    "meads yard, whitby": ("whitby", "meads yard"),
    "cote bank, egton": ("egton", "cote bank"),
    "houlsyke, glaisdale": ("glaisdale", "houlsyke"),
    "tofts farm, barnby": ("barnby", "tofts farm"),
    "hag house, ugglebarnby": ("ugglebarnby", "hag house"),
    "19 lands, lythe": ("lythe", "lands"),
    "dale house, hinderwell": ("hinderwell", "dale house"),
    "sleights, eskdaleside": ("eskdaleside-cum-ugglebarnby", "sleights"),
    "sleights, eskdaleside-cum-ugglebarnby": ("eskdaleside-cum-ugglebarnby", "sleights"),
    "william street, scarborough": ("scarborough", "william street"),
}

# malformed town.name -> corrected town.name, renamed in place (no merge target exists)
RENAME_IN_PLACE: dict[str, str] = {
    "stockton on tees, county durham": "stockton on tees",
    "yarmouth, norfolk": "yarmouth",
}


def _get_town(session: Session, name: str) -> Town | None:
    return session.exec(select(Town).where(Town.name == name)).first()


def _get_street(session: Session, town_id: int, name: str) -> Street | None:
    return session.exec(select(Street).where(Street.town_id == town_id, Street.name == name)).first()


def _reassign(session: Session, malformed_town: Town, town_id: int, street_id: int | None) -> int:
    count = 0
    for defendant in session.exec(select(Defendant).where(Defendant.town_id == malformed_town.id)).all():
        defendant.town_id = town_id
        defendant.street_id = street_id
        session.add(defendant)
        count += 1
    for person in session.exec(select(Person).where(Person.town_id == malformed_town.id)).all():
        person.town_id = town_id
        person.street_id = street_id
        session.add(person)
        count += 1
    return count


def fix_composite_town_rows(session: Session) -> list[str]:
    """Returns a human-readable log line per row actually changed."""
    log: list[str] = []

    for malformed_name, target_town_name in MERGE_INTO_TOWN.items():
        malformed = _get_town(session, malformed_name)
        if malformed is None:
            continue
        target = _get_town(session, target_town_name)
        if target is None:
            log.append(f"SKIPPED {malformed_name!r}: target town {target_town_name!r} not found")
            continue
        n = _reassign(session, malformed, target.id, street_id=None)
        session.delete(malformed)
        log.append(f"{malformed_name!r} -> town {target_town_name!r} ({n} rows reassigned)")

    for malformed_name, (target_town_name, target_street_name) in MERGE_INTO_STREET.items():
        malformed = _get_town(session, malformed_name)
        if malformed is None:
            continue
        target_town = _get_town(session, target_town_name)
        if target_town is None:
            log.append(f"SKIPPED {malformed_name!r}: target town {target_town_name!r} not found")
            continue
        target_street = _get_street(session, target_town.id, target_street_name)
        if target_street is None:
            log.append(
                f"SKIPPED {malformed_name!r}: target street {target_street_name!r} "
                f"under {target_town_name!r} not found"
            )
            continue
        n = _reassign(session, malformed, target_town.id, target_street.id)
        session.delete(malformed)
        log.append(
            f"{malformed_name!r} -> town {target_town_name!r} / street {target_street_name!r} "
            f"({n} rows reassigned)"
        )

    for malformed_name, (target_town_name, new_street_name) in CREATE_STREET_AND_MERGE.items():
        malformed = _get_town(session, malformed_name)
        if malformed is None:
            continue
        target_town = _get_town(session, target_town_name)
        if target_town is None:
            log.append(f"SKIPPED {malformed_name!r}: target town {target_town_name!r} not found")
            continue
        new_street = _get_street(session, target_town.id, new_street_name)
        created = False
        if new_street is None:
            new_street = Street(name=new_street_name, town_id=target_town.id)
            session.add(new_street)
            session.flush()  # assign new_street.id before we use it below
            created = True
        n = _reassign(session, malformed, target_town.id, new_street.id)
        session.delete(malformed)
        log.append(
            f"{malformed_name!r} -> town {target_town_name!r} / "
            f"street {new_street_name!r} ({'created' if created else 'reused'}) "
            f"({n} rows reassigned)"
        )

    for malformed_name, corrected_name in RENAME_IN_PLACE.items():
        malformed = _get_town(session, malformed_name)
        if malformed is None:
            continue
        malformed.name = corrected_name
        session.add(malformed)
        log.append(f"{malformed_name!r} -> renamed in place to {corrected_name!r}")

    return log


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        log = fix_composite_town_rows(session)
        session.commit()
    for line in log:
        print(f"  {line}")
    print(f"{len(log)} row(s) processed.")


if __name__ == "__main__":
    main()
