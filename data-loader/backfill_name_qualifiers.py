"""One-off (but safely re-runnable) backfill: corrects the handful of
Defendant/Person rows extracted before qsrecords.text.split_name_qualifier
existed, where a generational epithet ("the elder", "the younger", "junior",
...) ended up concatenated onto last_name (e.g. last_name="Smith the elder")
instead of split into the new name_qualifier column. mapping.py now does
this split at extraction time for everything ingested from here on; this
script fixes the rows that predate that fix.

name_key is recomputed from the cleaned last_name (see the name_qualifier
field's docstring in qsrecords/models/core.py for why that's correct rather
than identity-breaking: name_key is a coarse "every mention of this name"
index by design, and the qualifier being baked into last_name was actually
excluding these rows from that grouping incorrectly).

Idempotent -- split_name_qualifier no-ops (returns qualifier=None) on a
last_name that's already clean, so re-running after new records are added
only touches genuinely-affected new rows, and running it twice is a no-op
the second time.

Usage:
    python3 backfill_name_qualifiers.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, Person
from qsrecords.text import normalize_name, split_name_qualifier


def _backfill(session: Session, model) -> list[str]:
    fixed = []
    rows = session.exec(select(model)).all()
    for row in rows:
        cleaned_last_name, qualifier = split_name_qualifier(row.last_name)
        if qualifier is None:
            continue
        before = f"{row.first_name} {row.last_name}".strip()
        row.last_name = cleaned_last_name
        row.name_qualifier = qualifier
        row.name_key = normalize_name(row.first_name, cleaned_last_name)
        fixed.append(f"{model.__name__} #{row.id}: {before!r} -> {row.first_name} {cleaned_last_name} [{qualifier}]")
    return fixed


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        fixed = _backfill(session, Defendant) + _backfill(session, Person)
        session.commit()
    if fixed:
        print(f"Fixed {len(fixed)} row(s):")
        for line in fixed:
            print(f"  {line}")
    else:
        print("Nothing to fix.")


if __name__ == "__main__":
    main()
