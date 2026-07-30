"""One-off backfill triggered by a user question the database couldn't
answer well: "how many cases involved child offenders?". age was only ever
populated for 22 of 6,482 defendant rows even though raw_record explicitly
states an age far more often than that -- found by scanning the whole
corpus for "aged" (36 records total, a small and fully hand-checked set,
not a heuristic sweep). Each entry below was individually verified against
raw_record before being added here; two of the 36 (Percy Chapman, and the
six children in QSB 1884 3/10/11/61) were already fixed by an earlier
batch-audit pass and aren't repeated here. Apprentice-desertion records
("an apprentice... deserting") that never state an actual age are excluded
-- nothing to record.

As agreed: record every age precisely (people can be involved in multiple
cases across different years, so age is per-mention, not a fixed property
of the person), then derive is_child (Defendant/Person.is_child) from
age < 16 for anyone with a recorded age. A few records give no exact
number, only a categorical "aged under 16 years" -- those get is_child=True
directly, with age left null rather than guessed at.

Usage:
    python3 backfill_is_child.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, Person

# (defendant_id, age)
DEFENDANT_AGES = [
    (1385, 9), (1386, 15), (1387, 12), (1388, 11), (1389, 12), (1390, 9),  # QSB 1868 4/10/15/12
    (1396, 13), (1397, 14), (1398, 12),  # QSB 1868 4/10/15/14
    (1416, 13), (1417, 9), (1418, 14), (1419, 11),  # QSB 1868 4/10/15/20
    (1680, 14),  # QSB 1868 3/10/15/22, Elizabeth Lamb
    (3875, 10),  # QSB 1885 2/10/12/17, John William Robinson
    (3925, 11),  # QSB 1873 2/10/10/26, Richard Dryden
    (5140, 14),  # QSB 1872 2/10/15/1, Emily Moffatt
    (5220, 11),  # QSB 1872 2/10/15/2, Ann Anderson
    (5952, 13),  # QSB 1882 3/10/10/59, William Harvey
    (5954, 14),  # QSB 1882 3/10/10/60, George Watson
]

# (person_id, age)
PERSON_AGES = [
    (40, 10), (41, 7), (42, 5),  # QSB 1845 1/10/70, Dorothy/William/Jane Harrison
    (497, 9),  # QSB 1869 3/10/13/31, Mary Jane Garbutt
    (570, 4),  # QSB 1875 3/10/10/73, Henry Hartley
    (853, 8),  # QSB 1888 1/10/10/40, John William Johnson
    (884, 5),  # QSB 1868 2/10/16/30, Sarah Wilson Cunvin
    (1166, 10),  # QSB 1874 4/10/9/61, Frederick Collinwood
    (1226, 6),  # QSB 1874 4/10/9/162, William McGuire
    (1480, 12),  # QSB 1864 4/10/16/27, Thomas Short
    (1532, 13),  # QSB 1886 4/10/10/3, George Griffin
    (2096, 10),  # QSB 1873 2/10/9/57, John Dale
    (2153, 13),  # QSB 1873 2/10/10/26, Mary Ellen Parker
    (2274, 2),  # QSB 1884 4/10/11/24, Christopher Steel
    (2874, 10),  # QSB 1872 1/10/13/2, James Harrison
    (2896, 8),  # QSB 1872 1/10/13/1, James Reeves
    (3140, 13),  # QSB 1882 4/10/13/109, Samuel Trueman
    (3190, 13),  # QSB 1871 1/10/9/34, James Lawrence
    (3354, 6),  # QSB 1881 4/10/12/73, Hannah Wheatman
]

# Categorical "aged under 16 years", no exact number given.
PERSON_IS_CHILD_NO_AGE = [3825, 3826, 3827]  # QSB 1889 4/10/11/92, John/Annie/Charles Smith


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    report = []
    with get_session(settings.db_path) as session:
        for defendant_id, age in DEFENDANT_AGES:
            d = session.get(Defendant, defendant_id)
            d.age = age
            report.append(f"Defendant #{defendant_id} ({d.first_name} {d.last_name}): age -> {age}")

        for person_id, age in PERSON_AGES:
            p = session.get(Person, person_id)
            p.age = age
            report.append(f"Person #{person_id} ({p.first_name} {p.last_name}): age -> {age}")

        for person_id in PERSON_IS_CHILD_NO_AGE:
            p = session.get(Person, person_id)
            p.is_child = True
            report.append(f"Person #{person_id} ({p.first_name} {p.last_name}): is_child -> True (no exact age given)")

        # Derive is_child from age for every row with a recorded age --
        # covers the rows just set above plus every pre-existing age value
        # (including ones set by earlier, one-off fixes in this same
        # audit pass).
        for d in session.exec(select(Defendant).where(Defendant.age < 16, Defendant.is_child == False)).all():  # noqa: E712
            d.is_child = True
            report.append(f"Defendant #{d.id} ({d.first_name} {d.last_name}, age {d.age}): is_child -> True")
        for p in session.exec(select(Person).where(Person.age < 16, Person.is_child == False)).all():  # noqa: E712
            p.is_child = True
            report.append(f"Person #{p.id} ({p.first_name} {p.last_name}, age {p.age}): is_child -> True")

        session.commit()

    print(f"Applied {len(report)} update(s):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
