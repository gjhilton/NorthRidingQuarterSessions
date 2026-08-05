"""One-off (but safely re-runnable) cleanup of a naming artifact: many
Street rows are just a place name plus a spurious trailing "town street",
"street", or "town" (e.g. "sandsend town street", "grosmont town",
"aislaby street") where the record only ever meant "in [place]" generally
-- not a real, distinctly-named street. Per instruction: these should
lose the "town"/"street" suffix entirely.

Found by auditing every Street row matching:
  - "<x> town street" (or the bare "town street", which means the
    parent town's own name)
  - "<x> street" or "<x> town" where <x> is exactly the parent town's own
    name (e.g. "aislaby street" under town "aislaby")

For each matching row, in this order:
1. If the stripped name equals the parent town's own name, the row is
   folding all the way to the town itself -- reassign every
   defendant/person/summary_conviction reference to street_id=NULL (still
   under the same town_id) and delete the row.
2. Else if a Street row with the stripped name already exists under the
   SAME town_id, merge into it (reassign references, delete the
   duplicate).
3. Else, rename the row in place to the stripped name -- no collision to
   merge into yet.

Deliberately scoped to same-town_id fixes only. Several of these stripped
names collide with a DIFFERENT town's row for the same real place (e.g.
"hawsker" exists both under Whitby and under Hawsker-cum-Stainsacre,
"staithes"/"runswick"/"mickleby" exist both as their own town row and as
a street under Hinderwell) -- that's a separate, bigger, already-flagged
consolidation (same class of work as the Eskdaleside/Ugglebarnby merge)
and isn't attempted here.

Usage:
    python3 strip_town_street_suffix.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, Person, SummaryConviction
from qsrecords.models.reference import Street, Town


def _strip(name: str, town_name: str) -> str | None:
    if name == "town street":
        return town_name
    if name.endswith(" town street"):
        return name[: -len(" town street")]
    if name == f"{town_name} street" or name == f"{town_name} town":
        return town_name
    if name.endswith(" town") and name != "town":
        return name[: -len(" town")]
    return None


def _reassign_street_refs(session: Session, old_street_id: int, new_street_id: int | None) -> int:
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


def strip_town_street_suffix(session: Session) -> list[str]:
    log: list[str] = []
    towns_by_id = {t.id: t.name for t in session.exec(select(Town)).all()}

    for street in list(session.exec(select(Street)).all()):
        town_name = towns_by_id.get(street.town_id)
        if town_name is None:
            continue
        stripped = _strip(street.name, town_name)
        if stripped is None:
            continue

        if stripped == town_name:
            n = _reassign_street_refs(session, street.id, None)
            log.append(f"{street.name!r} (town {town_name!r}): folded to town-level ({n} rows), street deleted")
            session.delete(street)
            continue

        survivor = session.exec(
            select(Street).where(Street.town_id == street.town_id, Street.name == stripped)
        ).first()
        if survivor is not None:
            n = _reassign_street_refs(session, street.id, survivor.id)
            log.append(f"{street.name!r} (town {town_name!r}): merged into existing {stripped!r} ({n} rows)")
            session.delete(street)
        else:
            log.append(f"{street.name!r} (town {town_name!r}): renamed in place to {stripped!r}")
            street.name = stripped
            session.add(street)

    return log


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        log = strip_town_street_suffix(session)
        session.commit()
    for line in log:
        print(f"  {line}")
    print(f"{len(log)} row(s) processed." if log else "Nothing to do (already clean).")


if __name__ == "__main__":
    main()
