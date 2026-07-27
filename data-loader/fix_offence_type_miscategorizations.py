"""One-off (but safely re-runnable) fix for offence_type mistags found by
the batch-by-batch raw-text-vs-extraction audit (see the batch review notes
in the session this script came from). Each entry below was individually
checked against raw_record and against OFFENCE_TAXONOMY in
qsrecords/offence_types.py before being added here -- this is not a
heuristic pass, it's a fixed list of confirmed corrections.

REPLACEMENTS: remove the wrong leaf, add the right one (in addition to any
other leaf already tagged, which is left alone).
ADDITIONS: add a leaf the charge clearly also involves, without removing
anything already there.

Idempotent -- re-running only ever adds a missing leaf/removes a wrong one
still present; already-correct rows are untouched.

Usage:
    python3 fix_offence_type_miscategorizations.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import SummaryConviction, SummaryConvictionOffenceType
from qsrecords.offence_types import get_or_create_offence_type

REPLACEMENTS = [
    ("QSB 1889 2/10/10/16", "licensing offence", "firearms offence"),
    ("QSB 1889 2/10/10/29", "licensing offence", "dog licence offence"),
    ("QSB 1889 2/10/10/23", "malicious/property damage", "workhouse offence"),
    ("QSB 1889 2/10/10/24", "malicious/property damage", "workhouse offence"),
    ("QSB 1845 1/10/72", "unclassified", "failure to maintain family"),
    ("QSB 1839 3/10/30", "unclassified", "maritime offence"),
    ("QSB 1845 2/10/80", "licensing offence", "maritime offence"),
    ("QSB 1857 3/10/18/4", "vagrancy", "loitering/suspected person"),
    ("QSB 1839 3/10/37", "unclassified", "master and servant offence"),
    ("QSB 1839 3/10/38", "unclassified", "master and servant offence"),
    ("QSB 1824 2/10/10", "theft", "fraud/false pretences"),
    ("QSB 1833 3/10/18", "unclassified", "maritime offence"),
    ("QSB 1842 4/10/104", "vagrancy", "loitering/suspected person"),
    ("QSB 1870 2/10/12/7", "licensing offence", "public health offence"),
    ("QSB 1870 2/10/12/6", "licensing offence", "public health offence"),
    ("QSB 1857 4/10/18/2", "assault", "assaulting a police officer"),
    ("QSB 1857 4/10/18/3", "assault", "assaulting a police officer"),
    ("QSB 1857 4/10/18/14", "assault", "assaulting a police officer"),
]

ADDITIONS = [
    ("QSB 1824 3/10/4", "licensing offence"),
    ("QSB 1824 3/10/6", "licensing offence"),
]


def _get_conviction(session: Session, reference_number: str) -> SummaryConviction:
    conviction = session.exec(
        select(SummaryConviction).where(SummaryConviction.reference_number == reference_number)
    ).first()
    if conviction is None:
        raise ValueError(f"No conviction found for {reference_number!r}")
    return conviction


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    report = []
    with get_session(settings.db_path) as session:
        for reference_number, old_leaf, new_leaf in REPLACEMENTS:
            conviction = _get_conviction(session, reference_number)
            old_type = get_or_create_offence_type(session, old_leaf)
            new_type = get_or_create_offence_type(session, new_leaf)

            old_link = session.exec(
                select(SummaryConvictionOffenceType).where(
                    SummaryConvictionOffenceType.summary_conviction_id == conviction.id,
                    SummaryConvictionOffenceType.offence_type_id == old_type.id,
                )
            ).first()
            new_link_exists = session.exec(
                select(SummaryConvictionOffenceType).where(
                    SummaryConvictionOffenceType.summary_conviction_id == conviction.id,
                    SummaryConvictionOffenceType.offence_type_id == new_type.id,
                )
            ).first()

            changed = False
            if old_link is not None:
                session.delete(old_link)
                changed = True
            if new_link_exists is None:
                session.add(
                    SummaryConvictionOffenceType(
                        summary_conviction_id=conviction.id, offence_type_id=new_type.id
                    )
                )
                changed = True
            if changed:
                report.append(f"{reference_number}: {old_leaf!r} -> {new_leaf!r}")

        for reference_number, add_leaf in ADDITIONS:
            conviction = _get_conviction(session, reference_number)
            add_type = get_or_create_offence_type(session, add_leaf)
            exists = session.exec(
                select(SummaryConvictionOffenceType).where(
                    SummaryConvictionOffenceType.summary_conviction_id == conviction.id,
                    SummaryConvictionOffenceType.offence_type_id == add_type.id,
                )
            ).first()
            if exists is None:
                session.add(
                    SummaryConvictionOffenceType(
                        summary_conviction_id=conviction.id, offence_type_id=add_type.id
                    )
                )
                report.append(f"{reference_number}: + {add_leaf!r}")

        session.commit()

    if report:
        print(f"Fixed {len(report)} offence_type tag(s):")
        for line in report:
            print(f"  {line}")
    else:
        print("Nothing to fix.")


if __name__ == "__main__":
    main()
