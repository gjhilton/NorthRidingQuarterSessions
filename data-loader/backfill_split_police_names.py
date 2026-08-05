"""One-off (but safely re-runnable) identity split: when the same name_key
is shared by a police officer (Person.is_police) and an offender
(Defendant), that is almost certainly two different real people who happen
to share a common name (a working constable turns up as the informant on
many cases; an unrelated person of the same name gets charged with
something once) -- not one person who is both. Left alone, they'd show up
merged on a single /people/<name> page.

For each such name_key, every Person row flagged is_police=1 under that
name_key is given its own name_key (the original name plus a " police"
suffix -- plain words only, no punctuation, so it stays compatible with
slug.ts's space-to-underscore URL scheme). The Defendant rows, and any
non-police Person rows, keep the original name_key untouched.

This does NOT attempt to further split multiple *police officers* who
happen to share a name from each other, or multiple *offenders* who happen
to share a name from each other -- only the specific police-vs-offender
collision, which is the one confirmed case where the two groups are
essentially certain not to be the same person (an on-duty constable's
official role and an unrelated criminal charge are not the same event).
The explorer surfaces the split identities to each other via a same-name
cross-reference computed from the name text at query time (see
peopleNetwork.ts) rather than a stored link here -- nothing to migrate if
that display logic changes later.

Idempotent -- only touches name_keys that still collide; re-running after
new data is added only affects newly-introduced collisions.

Usage:
    python3 backfill_split_police_names.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, Person


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        offender_name_keys = set(
            session.exec(select(Defendant.name_key).distinct()).all()
        )
        police_rows = session.exec(
            select(Person).where(Person.is_police == True)  # noqa: E712
        ).all()

        split = []
        for row in police_rows:
            if row.name_key in offender_name_keys and not row.name_key.endswith(" police"):
                before = row.name_key
                row.name_key = f"{row.name_key} police"
                split.append(f"Person #{row.id} ({row.first_name} {row.last_name}): {before!r} -> {row.name_key!r}")

        session.commit()

    if split:
        print(f"Split {len(split)} police Person row(s) onto their own name_key:")
        for line in split:
            print(f"  {line}")
    else:
        print("Nothing to split.")


if __name__ == "__main__":
    main()
