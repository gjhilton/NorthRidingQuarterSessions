"""One-off fix for the remaining confirmed issues from batches 16-20 of the
raw-text-vs-extraction audit. A large fraction of what those batches
flagged (dropped spouse occupations, earlier "the Bridge"/"Ruswarp Street"
misses, duplicate spouse entries) turned out to already be fixed -- the
batch JSON files are a frozen export taken before any fixes were applied,
so re-flagging is expected and each item here was individually re-checked
against the LIVE database before being included.

Usage:
    python3 fix_batch_16_20_issues.py
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
    ("QSB 1888 1/10/10/33", "breach of the peace", "indecent behaviour"),
    ("QSB 1888 1/10/10/34", "breach of the peace", "indecent behaviour"),
    ("QSB 1888 1/10/10/35", "breach of the peace", "indecent behaviour"),
    ("QSB 1868 2/10/16/20", "breach of the peace", "indecent behaviour"),
    ("QSB 1868 1/10/14/6", "breach of the peace", "indecent behaviour"),
    ("QSB 1868 1/10/14/19", "poaching", "fishing offence"),
    ("QSB 1868 1/10/14/22", "breach of the peace", "obstructing the highway"),
    ("QSB 1868 1/10/14/23", "breach of the peace", "obstructing the highway"),
    ("QSB 1875 1/10/10/47", "breach of the peace", "disorderly behaviour"),
    ("QSB 1875 1/10/10/51", "breach of the peace", "disorderly behaviour"),
    ("QSB 1868 4/10/1/5", "furious/reckless driving", "unclassified"),
    ("QSB 1877 3/10/11/72", "breach of the peace", "disorderly behaviour"),
    ("QSB 1877 3/10/11/31", "breach of the peace", "disorderly behaviour"),
    ("QSB 1877 1/10/11/35", "breach of the peace", "disorderly behaviour"),
    ("QSB 1877 1/10/11/39", "breach of the peace", "disorderly behaviour"),
    ("QSB 1877 1/10/11/40", "breach of the peace", "disorderly behaviour"),
    ("QSB 1877 1/10/11/41", "breach of the peace", "disorderly behaviour"),
    ("QSB 1877 1/10/11/43", "breach of the peace", "disorderly behaviour"),
]

ADDITIONS = [
    ("QSB 1868 2/10/16/20", "prostitution"),
    ("QSB 1868 1/10/14/6", "prostitution"),
]

BRIDGE_REFS = ["QSB 1888 1/10/10/6"]
BRIDGE_END_REFS = ["QSB 1868 2/10/16/9", "QSB 1887 4/10/11/94", "QSB 1887 4/10/11/95"]


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
        HINDERWELL_PLACE = 88

        bridge_place = session.exec(select(Place).where(Place.name == "The Bridge")).first()
        for ref in BRIDGE_REFS:
            conviction = _get_conviction(session, ref)
            conviction.offence_location_id = bridge_place.id
            report.append(f"{ref}: offence_location -> 'The Bridge'")

        bridge_end_place = session.exec(select(Place).where(Place.name == "Bridge End")).first()
        for ref in BRIDGE_END_REFS:
            conviction = _get_conviction(session, ref)
            conviction.offence_location_id = bridge_end_place.id
            report.append(f"{ref}: offence_location -> 'Bridge End'")

        runswick_bank_top = _get_or_create_place(session, "Runswick Bank Top", HINDERWELL_PLACE)
        conviction = _get_conviction(session, "QSB 1877 3/10/11/64")
        conviction.offence_location_id = runswick_bank_top.id
        report.append("QSB 1877 3/10/11/64: offence_location -> 'Runswick Bank Top'")

        whitby_rhb_highway = session.exec(
            select(Place).where(Place.name == "Whitby & Robin Hood's Bay Highway")
        ).first()
        conviction = _get_conviction(session, "QSB 1875 1/10/10/61")
        conviction.offence_location_id = whitby_rhb_highway.id
        report.append("QSB 1875 1/10/10/61: offence_location -> \"Whitby & Robin Hood's Bay Highway\"")

        # Cliff Lane: defendant's own residence, not an offence location --
        # a distinct real street from "Cliff Street"/"West Cliff"/"East
        # Cliff", all of which already exist as separate places.
        cliff_lane = _get_or_create_place(session, "Cliff Lane", WHITBY_PLACE)
        john_smith = session.get(Defendant, 2007)
        john_smith.location_id = cliff_lane.id
        report.append("Defendant #2007 (John Smith): location -> 'Cliff Lane'")

        # George Elliott: "Sir" is a title, not an occupation -- "baronet"
        # was invented.
        elliott = session.get(Person, 774)
        report.append(f"Person #774 (Elliott): occupation {elliott.occupation!r} -> None")
        elliott.occupation = None

        # John Cole "commonly called John Carling Cole": alternate name
        # never captured.
        if session.exec(
            select(Alias).where(Alias.defendant_id == 1657, Alias.alias_name == "John Carling Cole")
        ).first() is None:
            session.add(Alias(defendant_id=1657, alias_name="John Carling Cole"))
            report.append("Defendant #1657 (Cole): + alias 'John Carling Cole'")

        # Francis Chapman "alias Hook".
        if session.exec(
            select(Alias).where(Alias.defendant_id == 1789, Alias.alias_name == "Hook")
        ).first() is None:
            session.add(Alias(defendant_id=1789, alias_name="Hook"))
            report.append("Defendant #1789 (Chapman): + alias 'Hook'")

        # Spouse occupations the general regex backfill missed (no "of the
        # township of X" clause immediately before the occupation word).
        booth = session.get(Person, 3753)
        booth.occupation = "innkeeper"
        report.append("Person #3753 (John Booth): occupation -> 'innkeeper'")

        housley = session.get(Person, 3516)
        housley.occupation = "miner"
        report.append("Person #3516 (John Housley): occupation -> 'miner'")

        # Robert Jefferson: raw_record states his occupation directly
        # ("licensed victualler") and that the charge concerns HIS OWN
        # licensed premises -- "licensee" is more accurate than the
        # generic auto-generated "spouse of involved person" role.
        jefferson = session.get(Person, 3762)
        jefferson.occupation = "licensed victualler"
        jefferson_ip = session.exec(
            select(InvolvedPerson).where(
                InvolvedPerson.person_id == 3762,
                InvolvedPerson.summary_conviction_id == _get_conviction(session, "QSB 1877 3/10/11/72").id,
            )
        ).first()
        jefferson_ip.role = "licensee"
        report.append("Person #3762 (Robert Jefferson): occupation -> 'licensed victualler', role -> 'licensee'")

        # correction_note: raw_record's own bracketed archival annotations
        # about a date discrepancy, captured nowhere despite the field
        # existing for exactly this.
        c1 = _get_conviction(session, "QSB 1875 1/10/10/58")
        c1.correction_note = "Dated October in text, but endorsed November"
        report.append(f"{c1.reference_number}: + correction_note")

        c2 = _get_conviction(session, "QSB 1875 2/10/10/26")
        c2.correction_note = "Date of conviction is written as 13 January 1875 but endorsed as 30 January 1875"
        report.append(f"{c2.reference_number}: + correction_note")

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
