"""One-off fix for the remaining confirmed issues from batches 41-45 of the
raw-text-vs-extraction audit (the relationships_and_details contamination
found while reviewing these batches was handled separately, by
migrate_contaminated_relationship_notes*.py). Each item here individually
re-verified against the live database first.

Usage:
    python3 fix_batch_41_45_issues.py
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
from qsrecords.offence_types import get_or_create_offence_type
from qsrecords.text import normalize_name

REPLACEMENTS = [
    ("QSB 1873 4/10/11/159", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1873 4/10/11/160", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1873 4/10/11/108", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1873 4/10/11/111", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1873 4/10/11/141", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1884 4/10/11/97", "obstructing the highway", "maritime offence"),
]

GAME_SPECIES = [
    ("QSB 1884 2/10/13/22", "rabbits"),
    ("QSB 1873 4/10/11/4", "rabbit"),
    ("QSB 1873 4/10/11/116", "conies"),
    ("QSB 1873 4/10/11/117", "conies"),
    ("QSB 1872 4/10/10/108", "conies"),
    ("QSB 1873 4/10/11/135", "pheasant"),
    ("QSB 1872 4/10/10/50", "conies"),
]

CHILD_AGES = [
    (4439, 9), (4440, 11), (4441, 11), (4442, 11), (4443, 10), (4444, 12),
]

# (defendant_id, wrongly-attributed occupation) -- husband already has it
# correctly via backfill_spouse_occupations.py.
REVERSE_OCCUPATION_CLEARS = [4468, 4533, 4328, 4702]


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


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        report = _apply_retags(session)

        for reference_number, species in GAME_SPECIES:
            c = _get_conviction(session, reference_number)
            c.game_species = species
            report.append(f"{reference_number}: + game_species {species!r}")

        c = _get_conviction(session, "QSB 1884 3/10/11/61")
        c.monetary_value_raw = "7s 8d"
        report.append("QSB 1884 3/10/11/61: + monetary_value_raw '7s 8d'")
        for defendant_id, age in CHILD_AGES:
            d = session.get(Defendant, defendant_id)
            d.age = age
            report.append(f"Defendant #{defendant_id} ({d.first_name} {d.last_name}): age -> {age}")

        for defendant_id in REVERSE_OCCUPATION_CLEARS:
            d = session.get(Defendant, defendant_id)
            report.append(f"Defendant #{defendant_id} ({d.first_name} {d.last_name}): occupation {d.occupation!r} -> None")
            d.occupation = None

        # Margaret Elders, wife of [blank] Elders, stonemason: same pattern
        # as Lavinia Jameson (batch 36-40) -- relationship never captured
        # at extraction time, so the systemic spouse backfill never saw it.
        margaret = session.get(Defendant, 4736)
        report.append(f"Defendant #4736 (Margaret Elders): occupation {margaret.occupation!r} -> None")
        margaret.occupation = None
        margaret.relationship_type = "wife"
        margaret.related_to_name = "Elders"
        spouse = Person(first_name=None, last_name="Elders", name_key=normalize_name(None, "Elders"))
        session.add(spouse)
        session.flush()
        conviction_ids = session.exec(
            select(SummaryConvictionDefendant.summary_conviction_id).where(
                SummaryConvictionDefendant.defendant_id == margaret.id
            )
        ).all()
        for conviction_id in conviction_ids:
            session.add(
                InvolvedPerson(summary_conviction_id=conviction_id, person_id=spouse.id, role="spouse of offender")
            )
        margaret.spouse_person_id = spouse.id
        spouse.occupation = "stonemason"
        report.append(f"Defendant #4736 (Margaret Elders): + spouse Person #{spouse.id} ('Elders', occupation stonemason)")

        # Percy Chapman, aged nine.
        percy = session.get(Person, 2359)
        percy.age = 9
        report.append("Person #2359 (Percy Chapman): age -> 9")

        # Michael Moram/Moran: alternate surname spelling.
        if session.exec(
            select(Alias).where(Alias.defendant_id == 4579, Alias.alias_name == "Michael Moran")
        ).first() is None:
            session.add(Alias(defendant_id=4579, alias_name="Michael Moran"))
            report.append("Defendant #4579 (Michael Moram): + alias 'Michael Moran'")

        # [sic] date discrepancy: offence_date "10 November [sic] 1883"
        # postdates conviction_date 1883-10-13.
        c = _get_conviction(session, "QSB 1884 1/10/10/15")
        c.correction_note = (
            "Offence date given as 10 November [sic] 1883, but this postdates "
            "the conviction date of 13 October 1883 -- flagged [sic] in the original"
        )
        report.append("QSB 1884 1/10/10/15: + correction_note")

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
