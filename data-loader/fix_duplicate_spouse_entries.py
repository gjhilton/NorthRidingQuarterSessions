"""One-off (but safely re-runnable) fix for a bug in backfill_spouses.py:
that script always created a brand-new Person row for the spouse named in
relationship_type/related_to_name, even on the (rare, ~14-row) cases where
the same person was already separately captured as their own
involved_persons entry on the same conviction, with a role already
describing the relationship in its own words ("husband of defendant",
"husband of victim", "husband", ...). Those cases ended up with the same
real person listed twice on one conviction: once as the original,
correctly-detailed entry, and again as a synthetic, mostly-empty duplicate
with a role like "spouse of offender".

For each such pair (matched by first_name+last_name, case-insensitive, on
the same conviction, where exactly one of the two involved_persons roles
is one of this script's own "spouse of ..." labels):
  - The origin Defendant/Person row's spouse_person_id is repointed from
    the synthetic duplicate onto the original, already-detailed Person row.
  - The synthetic duplicate's InvolvedPerson row and Person row are deleted.

The original row's role text is left untouched -- "husband of defendant" is
more specific than "spouse of offender" would be, not less, so there's
nothing to improve there.

Idempotent -- only touches rows that still have a live "spouse of ..."
duplicate; safe to re-run.

Usage:
    python3 fix_duplicate_spouse_entries.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, InvolvedPerson, Person

SPOUSE_ROLE_PREFIX = "spouse of "


def find_duplicates(session: Session):
    synthetic_involvements = session.exec(
        select(InvolvedPerson).where(InvolvedPerson.role.like(f"{SPOUSE_ROLE_PREFIX}%"))
    ).all()

    fixes = []
    for synth_ip in synthetic_involvements:
        synth_person = session.get(Person, synth_ip.person_id)
        if synth_person is None:
            continue
        siblings = session.exec(
            select(InvolvedPerson).where(
                InvolvedPerson.summary_conviction_id == synth_ip.summary_conviction_id,
                InvolvedPerson.person_id != synth_person.id,
            )
        ).all()
        for sibling_ip in siblings:
            if sibling_ip.role and sibling_ip.role.startswith(SPOUSE_ROLE_PREFIX):
                continue
            original_person = session.get(Person, sibling_ip.person_id)
            if original_person is None:
                continue
            if (original_person.first_name or "").strip().lower() != (
                synth_person.first_name or ""
            ).strip().lower():
                continue
            if (original_person.last_name or "").strip().lower() != (
                synth_person.last_name or ""
            ).strip().lower():
                continue
            fixes.append((synth_ip, synth_person, original_person))
            break
    return fixes


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        fixes = find_duplicates(session)

        report = []
        for synth_ip, synth_person, original_person in fixes:
            for model in (Defendant, Person):
                rows = session.exec(
                    select(model).where(model.spouse_person_id == synth_person.id)
                ).all()
                for row in rows:
                    row.spouse_person_id = original_person.id

            report.append(
                f"{synth_person.first_name} {synth_person.last_name}: "
                f"repointed spouse_person_id -> Person #{original_person.id}, "
                f"deleted duplicate Person #{synth_person.id} / InvolvedPerson #{synth_ip.id}"
            )
            session.delete(synth_ip)
            session.delete(synth_person)

        session.commit()

    if report:
        print(f"Fixed {len(report)} duplicate spouse entr{'y' if len(report) == 1 else 'ies'}:")
        for line in report:
            print(f"  {line}")
    else:
        print("Nothing to fix.")


if __name__ == "__main__":
    main()
