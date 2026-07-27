"""One-off fix for the remaining confirmed issues from batches 11-15 of the
raw-text-vs-extraction audit (most of that batch's issues -- ~300 dropped
spouse occupations -- were already handled by
backfill_spouse_occupations.py; this covers everything else). Each entry
individually verified against raw_record.

Includes a new place: "The Bridge" / "Bridge End", Whitby's swing bridge
over the Esk -- 19 records said "drunk and disorderly on the Bridge" but
were linked to "Bridge Street" (a different, real, separately-named
street), and one had no street link at all.

Usage:
    python3 fix_batch_11_15_issues.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import (
    Alias,
    Defendant,
    InvolvedPerson,
    Person,
    SummaryConviction,
    SummaryConvictionOffenceType,
)
from qsrecords.models.reference import Place
from qsrecords.offence_types import get_or_create_offence_type

REPLACEMENTS = [
    ("QSB 1869 2/10/13/27", "malicious/property damage", "workhouse offence"),
    ("QSB 1875 3/10/10/27", "licensing offence", "dog licence offence"),
    ("QSB 1875 3/10/10/26", "licensing offence", "dog licence offence"),
    ("QSB 1868 4/10/15/25", "breach of the peace", "indecent behaviour"),
    ("QSB 1888 3/10/10/44", "breach of the peace", "disorderly behaviour"),
    ("QSB 1868 4/10/15/55", "breach of the peace", "indecent behaviour"),
    ("QSB 1868 4/10/15/56", "breach of the peace", "indecent behaviour"),
    ("QSB 1868 4/10/15/61", "breach of the peace", "indecent behaviour"),
]

ADDITIONS = [
    ("QSB 1875 3/10/10/24", "refusal to quit licensed premises"),
    ("QSB 1868 4/10/15/25", "prostitution"),
]

BRIDGE_REFS = [
    "QSB 1875 4/10/10/72", "QSB 1888 3/10/10/11", "QSB 1875 2/10/10/2",
    "QSB 1888 3/10/10/12", "QSB 1875 2/10/10/40", "QSB 1888 3/10/10/30",
    "QSB 1875 1/10/10/4", "QSB 1877 3/10/11/27", "QSB 1887 4/10/11/71",
    "QSB 1887 4/10/11/77", "QSB 1887 2/10/10/46", "QSB 1887 2/10/10/47",
    "QSB 1885 4/10/12/104", "QSB 1873 4/10/11/13", "QSB 1884 1/10/10/24",
    "QSB 1883 3/10/9/33", "QSB 1881 4/10/12/15",
]
BRIDGE_END_REFS = ["QSB 1874 4/10/9/130", "QSB 1874 3/10/8/21"]


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

        # "the Bridge" / "Bridge End": Whitby's swing bridge -- distinct
        # from the separately-named "Bridge Street" these records were
        # (wrongly) pointed at.
        bridge_place = _get_or_create_place(session, "The Bridge", WHITBY_PLACE)
        for ref in BRIDGE_REFS:
            conviction = _get_conviction(session, ref)
            conviction.offence_location_id = bridge_place.id
            report.append(f"{ref}: offence_location -> 'The Bridge'")

        bridge_end_place = _get_or_create_place(session, "Bridge End", WHITBY_PLACE)
        for ref in BRIDGE_END_REFS:
            conviction = _get_conviction(session, ref)
            conviction.offence_location_id = bridge_end_place.id
            report.append(f"{ref}: offence_location -> 'Bridge End'")

        # Edward Jameson Ayre [James]: bracketed alternate name.
        exists = session.exec(
            select(Alias).where(Alias.defendant_id == 1128, Alias.alias_name == "James")
        ).first()
        if exists is None:
            session.add(Alias(defendant_id=1128, alias_name="James"))
            report.append("Defendant #1128 (Ayre): + alias 'James'")

        # "[blank] Karraffa": sex=male was asserted with no textual basis
        # (raw_record gives no name, pronoun, or other gender indicator).
        karraffa = session.get(Defendant, 1138)
        report.append(f"Defendant #1138 (Karraffa): sex {karraffa.sex!r} -> None")
        karraffa.sex = None

        # Mary Ann Seddon: occupation "watchmaker" belongs to her husband
        # Henry (grammatically, per "wife of Henry Seddon ... watchmaker"),
        # not to her -- her own occupation is never stated.
        seddon = session.get(Defendant, 1593)
        report.append(f"Defendant #1593 (M.A. Seddon): occupation {seddon.occupation!r} -> None")
        seddon.occupation = None

        # Mary Elizabeth Forden: raw_record explicitly calls her Thomas
        # Paylor's "agent", a more specific and accurate role than the
        # generic "witness" she was tagged with.
        forden = session.get(InvolvedPerson, 569)
        report.append(f"InvolvedPerson #569 (Forden): role {forden.role!r} -> 'agent'")
        forden.role = "agent"

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
