"""One-off fix for the remaining confirmed issues from batches 36-40 of the
raw-text-vs-extraction audit (the Bridge/Bridge End conflation pattern for
this range was already closed by a whole-database sweep, not per-batch --
see the 24-row bulk UPDATE run directly before this script). Each item here
was individually re-verified against the live database first; a handful of
flagged truancy-location and dropped-occupation items turned out to already
be fixed by earlier scripts and are skipped.

Usage:
    python3 fix_batch_36_40_issues.py
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
    SummaryConvictionDefendant,
    SummaryConvictionOffenceType,
)
from qsrecords.models.reference import Place
from qsrecords.offence_types import get_or_create_offence_type
from qsrecords.text import normalize_name

REPLACEMENTS = [
    ("QSB 1885 2/10/12/20", "licensing offence", "dog licence offence"),
    ("QSB 1885 2/10/12/23", "licensing offence", "dog licence offence"),
    ("QSB 1885 2/10/12/29", "licensing offence", "dog licence offence"),
    ("QSB 1885 2/10/12/30", "licensing offence", "dog licence offence"),
    ("QSB 1885 1/10/12/17", "poaching", "fishing offence"),
    ("QSB 1885 1/10/12/30", "poaching", "fishing offence"),
    ("QSB 1885 1/10/12/31", "poaching", "fishing offence"),
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

        # "drunk and riotous in the Old Market Place and Baxtergate" --
        # both real, already-existing places; Baxtergate (last-named)
        # picked as the recorded offence_location, matching the same
        # last-named-of-two convention used for the earlier Old Market
        # Place/Bridge Street case.
        baxtergate = session.exec(select(Place).where(Place.name == "Baxtergate")).first()
        c = _get_conviction(session, "QSB 1865 2/10/14/6")
        c.offence_location_id = baxtergate.id
        report.append("QSB 1865 2/10/14/6: offence_location -> 'Baxtergate' (also names Old Market Place)")

        # Margaret Burns: "hawker" is her husband James Burns's occupation
        # (already correctly on his own spouse-linked record), not hers.
        margaret = session.get(Defendant, 3932)
        report.append(f"Defendant #3932 (Margaret Burns): occupation {margaret.occupation!r} -> None")
        margaret.occupation = None

        # Robert Brown alias Makins.
        if session.exec(
            select(Alias).where(Alias.defendant_id == 3980, Alias.alias_name == "Makins")
        ).first() is None:
            session.add(Alias(defendant_id=3980, alias_name="Makins"))
            report.append("Defendant #3980 (Robert Brown): + alias 'Makins'")

        # Robert Huddleston Waters: "of Dumple Street, Scarborough" --
        # Scarborough is outside this project's usual North Riding/Whitby
        # place tree; the wrong Whitby street "Friargate" was substituted.
        # Cleared rather than inventing a Scarborough sub-tree on a single
        # out-of-area record.
        waters = session.get(Defendant, 3977)
        report.append(f"Defendant #3977 (Waters): location 'Friargate' -> None (Scarborough, outside this project's place tree)")
        waters.location_id = None

        # "Ward's Yard" -- distinct spelling from the already-existing
        # "Wades Yard" (different surname, Ward vs Wade), same reasoning
        # as Landsend Road vs Sandsend Road: not assumed to be the same
        # place just because they sound similar.
        wards_yard = _get_or_create_place(session, "Ward's Yard", WHITBY_PLACE)
        c = _get_conviction(session, "QSB 1873 1/10/13/52")
        c.offence_location_id = wards_yard.id
        report.append("QSB 1873 1/10/13/52: offence_location 'Wades Yard' -> \"Ward's Yard\" (distinct place)")

        # Lavinia Jameson wife of [blank] Jameson, jet worker: the
        # relationship was never captured at all (relationship_type/
        # related_to_name both empty), so the systemic spouse backfill
        # never saw this row. Backfilled by hand here: occupation moves
        # off Lavinia onto a new spouse Person (surname only, matching the
        # same "single-token related name" handling used elsewhere).
        lavinia = session.get(Defendant, 4049)
        report.append(f"Defendant #4049 (Lavinia Jameson): occupation {lavinia.occupation!r} -> None")
        lavinia.occupation = None
        lavinia.relationship_type = "wife"
        lavinia.related_to_name = "Jameson"
        spouse = Person(first_name=None, last_name="Jameson", name_key=normalize_name(None, "Jameson"))
        session.add(spouse)
        session.flush()
        conviction_ids = session.exec(
            select(SummaryConvictionDefendant.summary_conviction_id).where(
                SummaryConvictionDefendant.defendant_id == lavinia.id
            )
        ).all()
        for conviction_id in conviction_ids:
            session.add(
                InvolvedPerson(
                    summary_conviction_id=conviction_id, person_id=spouse.id, role="spouse of offender"
                )
            )
        lavinia.spouse_person_id = spouse.id
        report.append(f"Defendant #4049 (Lavinia Jameson): + spouse Person #{spouse.id} ('Jameson', occupation jet worker)")
        spouse.occupation = "jet worker"

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
