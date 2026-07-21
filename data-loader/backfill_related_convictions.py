"""One-off (but safely re-runnable) backfill: detects convictions likely
stemming from the same underlying event and links them via
qsrecords.related_convictions. See that module for the two detection
heuristics. Idempotent -- link_convictions no-ops on pairs already linked,
so re-running after new records are added only creates the new links.

Usage:
    python3 backfill_related_convictions.py
"""

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.related_convictions import backfill_related_convictions


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        created = backfill_related_convictions(session)
        session.commit()
    print(f"Created {created} new related_conviction links.")


if __name__ == "__main__":
    main()
