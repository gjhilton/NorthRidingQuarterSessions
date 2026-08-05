"""One-off fix for the remaining confirmed issues from batches 26-30 of the
raw-text-vs-extraction audit. As before, most flagged dropped-spouse-
occupations and one Bridge End case were already fixed by earlier scripts
(stale pre-fix batch export); only genuinely new items are here, each
re-verified against the live database first.

Usage:
    python3 fix_batch_26_30_issues.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, SummaryConviction, SummaryConvictionOffenceType
from qsrecords.models.reference import Place
from qsrecords.offence_types import get_or_create_offence_type

REPLACEMENTS = [
    ("QSB 1867 1/10/16/45", "poaching", "fishing offence"),
    ("QSB 1874 3/10/8/2", "breach of the peace", "indecent behaviour"),
    ("QSB 1866 4/10/15/2", "breach of the peace", "indecent behaviour"),
    ("QSB 1874 2/10/9/18", "licensing offence", "dog licence offence"),
    ("QSB 1874 2/10/9/19", "licensing offence", "dog licence offence"),
    ("QSB 1874 2/10/9/20", "licensing offence", "dog licence offence"),
    ("QSB 1874 2/10/9/21", "licensing offence", "dog licence offence"),
    ("QSB 1874 2/10/9/22", "licensing offence", "dog licence offence"),
]

ADDITIONS = [("QSB 1874 3/10/8/2", "prostitution")]


def _get_conviction(session: Session, reference_number: str) -> SummaryConviction:
    conviction = session.exec(
        select(SummaryConviction).where(SummaryConviction.reference_number == reference_number)
    ).first()
    if conviction is None:
        raise ValueError(f"No conviction found for {reference_number!r}")
    return conviction


def _apply_retags(session: Session) -> list[str]:
    report = []
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
        new_exists = session.exec(
            select(SummaryConvictionOffenceType).where(
                SummaryConvictionOffenceType.summary_conviction_id == conviction.id,
                SummaryConvictionOffenceType.offence_type_id == new_type.id,
            )
        ).first()
        changed = False
        if old_link is not None:
            session.delete(old_link)
            changed = True
        if new_exists is None:
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
    return report


def _get_or_create_place(session: Session, name: str, parent_id: int) -> Place:
    existing = session.exec(
        select(Place).where(Place.name == name, Place.parent_id == parent_id)
    ).first()
    if existing:
        return existing
    place = Place(name=name, parent_id=parent_id, type="point")
    session.add(place)
    session.flush()
    return place


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        report = _apply_retags(session)

        WHITBY_PLACE = 4
        AISLABY_PLACE = 1

        bridge_place = session.exec(select(Place).where(Place.name == "The Bridge")).first()
        for ref in ["QSB 1861 3/10/17/1", "QSB 1886 4/10/10/48"]:
            c = _get_conviction(session, ref)
            c.offence_location_id = bridge_place.id
            report.append(f"{ref}: offence_location -> 'The Bridge'")

        # "riding a horse furiously in the Old Market Place and Bridge
        # Street" -- both named; Old Market Place was already captured,
        # Bridge Street (a real, separately-named street) was dropped.
        # Keep the more specific of the two rather than picking one: Bridge
        # Street is where the record's own charge_description places the
        # emphasis (last-named, and matches the existing "Bridge Street"
        # place already used elsewhere), so it becomes the recorded
        # offence_location; Old Market Place stays visible in raw_record.
        bridge_street = session.exec(select(Place).where(Place.name == "Bridge Street")).first()
        c = _get_conviction(session, "QSB 1864 4/10/16/18")
        c.offence_location_id = bridge_street.id
        report.append("QSB 1864 4/10/16/18: offence_location -> 'Bridge Street' (also names Old Market Place)")

        aislaby_egton_highway = _get_or_create_place(
            session, "Aislaby and Egton Highway", AISLABY_PLACE
        )
        c = _get_conviction(session, "QSB 1874 3/10/8/34")
        c.offence_location_id = aislaby_egton_highway.id
        report.append("QSB 1874 3/10/8/34: + place 'Aislaby and Egton Highway'")

        # Thomas White: raw_record states his home township (Whitby) but
        # it was never captured on his defendant record.
        thomas_white = session.get(Defendant, 2847)
        thomas_white.location_id = WHITBY_PLACE
        report.append("Defendant #2847 (Thomas White): location -> 'Whitby'")

        # George Watson (QSB 1886 3/10/10/23): "of New Way Ghaut" is his
        # own residence (correctly on his defendant record already) --
        # raw_record gives no more specific offence location than the
        # Whitby School Board district itself, so offence_location
        # shouldn't also point at his home yard (cf. sibling QSB 1886
        # 3/10/10/1, which keeps these separate correctly).
        c = _get_conviction(session, "QSB 1886 3/10/10/23")
        c.offence_location_id = WHITBY_PLACE
        report.append("QSB 1886 3/10/10/23: offence_location -> 'Whitby' (was wrongly the defendant's own residence)")

        c = _get_conviction(session, "QSB 1864 1/10/16/12")
        c.correction_note = (
            "Offence date given as 30 December 1863, but this postdates the "
            "conviction date of 1 December 1863 -- flagged [sic] in the original"
        )
        report.append("QSB 1864 1/10/16/12: + correction_note")

        c = _get_conviction(session, "QSB 1866 4/10/15/28")
        c.correction_note = 'Endorsed "1 August 1866"'
        report.append("QSB 1866 4/10/15/28: + correction_note")

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
