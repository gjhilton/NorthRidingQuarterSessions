"""One-off fix for the remaining confirmed issues from batches 21-25 of the
raw-text-vs-extraction audit. As with batches 11-25 before it, most flagged
dropped-spouse-occupations were already fixed by backfill_spouse_occupations.py
(the batch exports are a frozen pre-fix snapshot); each item here was
individually re-verified against the live database first.

Two items were investigated but NOT fixed here, on purpose:
  - QSB 1887 2/10/10/54 (Eliza Collins, "begging in Mickleby town street",
    home township Hinderwell): the generic "<town> town street" phrasing is
    the established non-issue convention, and Mickleby-vs-Hinderwell here
    plausibly reflects the same kind of real township/locality ambiguity
    already flagged (and left open) for the Runswick Bay/Hinderwell case --
    not resolved unilaterally.
  - QSB 1887 2/10/10/16 (James Smith, "begging in Dale House", township
    Borrowby): Dale House already exists in the place tree, hand-resolved
    earlier this session -- under Hinderwell. This record's own township is
    Borrowby, not Hinderwell, which conflicts with that earlier placement.
    Two real "Dale House"es, or the earlier placement needs revisiting --
    either way, a judgment call for manual review, not a mechanical fix.

Usage:
    python3 fix_batch_21_25_issues.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import (
    Alias,
    Defendant,
    Person,
    SummaryConviction,
    SummaryConvictionOffenceType,
)
from qsrecords.models.reference import Place
from qsrecords.offence_types import get_or_create_offence_type

REPLACEMENTS = [
    ("QSB 1867 3/10/11/23", "breach of the peace", "indecent behaviour"),
    ("QSB 1867 3/10/11/39", "breach of the peace", "indecent behaviour"),
    ("QSB 1867 1/10/16/1", "breach of the peace", "indecent behaviour"),
    ("QSB 1867 1/10/16/2", "breach of the peace", "indecent behaviour"),
    ("QSB 1868 1/10/14/6", "breach of the peace", "indecent behaviour"),
    ("QSB 1867 2/10/14/11", "breach of the peace", "disorderly behaviour"),
    ("QSB 1867 2/10/14/12", "breach of the peace", "disorderly behaviour"),
    ("QSB 1874 4/10/9/143", "breach of the peace", "disorderly behaviour"),
    ("QSB 1874 4/10/9/144", "breach of the peace", "disorderly behaviour"),
    ("QSB 1874 4/10/9/32", "poaching", "fishing offence"),
    ("QSB 1887 1/10/10/16", "poaching", "fishing offence"),
    ("QSB 1887 1/10/10/17", "poaching", "fishing offence"),
    ("QSB 1887 1/10/10/44", "poaching", "fishing offence"),
    ("QSB 1887 1/10/10/45", "poaching", "fishing offence"),
    ("QSB 1867 2/10/14/30", "public health offence", "public nuisance"),
    ("QSB 1867 2/10/14/34", "furious/reckless driving", "unclassified"),
    ("QSB 1887 3/10/10/44", "malicious/property damage", "workhouse offence"),
]

ADDITIONS = [
    ("QSB 1867 3/10/11/23", "prostitution"),
    ("QSB 1867 3/10/11/39", "prostitution"),
    ("QSB 1867 1/10/16/1", "prostitution"),
    ("QSB 1867 1/10/16/2", "prostitution"),
    ("QSB 1868 1/10/14/6", "prostitution"),
]

# (defendant_id, alias_name)
ALIASES = [
    (2508, "Tindale Harry"),
    (2511, "Baxter Joe"),
    (2493, "George Wilson"),
]

CORRECTION_NOTES = [
    ("QSB 1865 4/10/12/44", "Date endorsed as August, but September written in the text"),
    ("QSB 1887 2/10/10/51", "Endorsed 5 March 1887"),
    ("QSB 1887 1/10/10/46", "Endorsed 27 November 1886"),
]


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

        RUSWARP_PLACE = 94
        FYLINGDALES_PLACE = 126

        # "in the highway behind John Street", Ruswarp -- John Street
        # already exists as a place; link the conviction to it.
        john_street = session.exec(select(Place).where(Place.name == "John Street")).first()
        c = _get_conviction(session, "QSB 1874 4/10/9/139")
        c.offence_location_id = john_street.id
        report.append("QSB 1874 4/10/9/139: offence_location -> 'John Street'")

        # "the road between Robin Hood's Bay and Peak", Fylingdales -- a
        # new named road, same treatment as the other cross-town highways.
        rhb_peak_road = _get_or_create_place(
            session, "Robin Hood's Bay and Peak Road", FYLINGDALES_PLACE
        )
        c = _get_conviction(session, "QSB 1874 4/10/9/173")
        c.offence_location_id = rhb_peak_road.id
        report.append("QSB 1874 4/10/9/173: + place 'Robin Hood's Bay and Peak Road'")

        for defendant_id, alias_name in ALIASES:
            exists = session.exec(
                select(Alias).where(Alias.defendant_id == defendant_id, Alias.alias_name == alias_name)
            ).first()
            if exists is None:
                session.add(Alias(defendant_id=defendant_id, alias_name=alias_name))
                report.append(f"Defendant #{defendant_id}: + alias {alias_name!r}")

        for reference_number, note in CORRECTION_NOTES:
            c = _get_conviction(session, reference_number)
            c.correction_note = note
            report.append(f"{reference_number}: + correction_note")

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
