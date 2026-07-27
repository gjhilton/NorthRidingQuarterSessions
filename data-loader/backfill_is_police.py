"""One-off (but safely re-runnable) backfill: sets Defendant/Person.is_police
from occupation text and, for Person, from involved_persons.role too.

involved_persons.role is almost never the literal string "police" -- the
informant on a case was very often a constable performing their duty, but
role just says "informant" regardless (see the Martin Dickinson case: role
"informant" on every one of his cases, occupation "sergeant of police" /
"inspector of police"). Role text alone badly undercounts police, so this
reads occupation instead: any occupation containing "police" or
"constable" covers every variant actually seen in the data (police
constable, sergeant/inspector/superintendent of police, constable for the
North Riding, special constable, ...). Also covers the rare case of an
involved_persons.role of literally "police"/"police officer" with no
occupation text at all.

Idempotent -- re-running only sets is_police=1 on rows that still read 0;
never sets it back to 0 (a later hand-correction of occupation text can
always flip a false positive off directly).

Usage:
    python3 backfill_is_police.py
"""

from sqlalchemy import text

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db

OCCUPATION_PATTERN = "%police%"
CONSTABLE_PATTERN = "%constable%"


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        defendant_result = session.execute(
            text(
                """
                UPDATE defendant SET is_police = 1
                WHERE is_police = 0
                  AND (LOWER(occupation) LIKE :police OR LOWER(occupation) LIKE :constable)
                """
            ),
            {"police": OCCUPATION_PATTERN, "constable": CONSTABLE_PATTERN},
        )
        person_result = session.execute(
            text(
                """
                UPDATE person SET is_police = 1
                WHERE is_police = 0
                  AND (
                    LOWER(occupation) LIKE :police OR LOWER(occupation) LIKE :constable
                    OR id IN (
                      SELECT person_id FROM involved_persons
                      WHERE LOWER(TRIM(role)) IN ('police', 'police officer')
                    )
                  )
                """
            ),
            {"police": OCCUPATION_PATTERN, "constable": CONSTABLE_PATTERN},
        )
        session.commit()
    print(f"Defendant rows flagged is_police: {defendant_result.rowcount}")
    print(f"Person rows flagged is_police: {person_result.rowcount}")


if __name__ == "__main__":
    main()
