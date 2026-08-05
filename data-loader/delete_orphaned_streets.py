"""One-off (but safely re-runnable) cleanup: deletes street rows that
nothing actually references. street.id is only ever pointed at by
defendant.street_id, person.street_id, and
summary_conviction.offence_location_street_id (confirmed against the full
schema) -- a street row with zero rows in all three is dead data, not a
place any extracted record is actually tied to.

Found while triaging the explorer's new /places pages: 4 of 346 street
rows were orphaned this way (3 in Pickering containing the word "whitby"
-- turned out to be unrelated dead rows, not a scraping keyword artifact,
since nothing in the corpus references them at all; 1 in Middlesbrough).

Usage:
    python3 delete_orphaned_streets.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, Person, SummaryConviction
from qsrecords.models.reference import Street


def find_orphaned_streets(session: Session) -> list[Street]:
    orphaned = []
    for street in session.exec(select(Street)).all():
        has_defendant = session.exec(
            select(Defendant).where(Defendant.street_id == street.id)
        ).first()
        has_person = session.exec(select(Person).where(Person.street_id == street.id)).first()
        has_conviction = session.exec(
            select(SummaryConviction).where(SummaryConviction.offence_location_street_id == street.id)
        ).first()
        if not has_defendant and not has_person and not has_conviction:
            orphaned.append(street)
    return orphaned


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        orphaned = find_orphaned_streets(session)
        for street in orphaned:
            print(f"  deleting street #{street.id}: {street.name!r} (town_id={street.town_id})")
            session.delete(street)
        session.commit()
    print(f"Deleted {len(orphaned)} orphaned street row(s).")


if __name__ == "__main__":
    main()
