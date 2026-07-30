"""One-off fix for the remaining confirmed issues from batches 46-50 of the
raw-text-vs-extraction audit (the relationships_and_details contamination
found while reviewing these batches -- much more widespread than the
original 495-row sweep caught -- was handled separately by two follow-up
migration passes). Each item here individually re-verified against the
live database first.

Usage:
    python3 fix_batch_46_50_issues.py
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
    ("QSB 1872 4/10/10/140", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1872 3/10/10/31", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1872 3/10/10/2", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1872 2/10/15/5", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1872 2/10/15/51", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1872 2/10/15/83", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1883 4/10/11/60", "public health offence", "public nuisance"),
    ("QSB 1883 3/10/9/16", "public health offence", "animal disease offence"),
    ("QSB 1883 3/10/9/17", "public health offence", "animal disease offence"),
    ("QSB 1883 3/10/9/39", "licensing offence", "dog licence offence"),
    ("QSB 1883 3/10/9/68", "licensing offence", "dog licence offence"),
    ("QSB 1883 4/10/11/115", "obstructing the highway", "maritime offence"),
]

GAME_SPECIES = [
    ("QSB 1883 4/10/11/35", "conies"), ("QSB 1883 4/10/11/36", "conies"),
    ("QSB 1872 4/10/10/93", "salmon"), ("QSB 1872 4/10/10/88", "salmon"),
    ("QSB 1872 4/10/10/96", "salmon"), ("QSB 1872 4/10/10/91", "salmon"),
    ("QSB 1872 4/10/10/97", "salmon"), ("QSB 1872 4/10/10/94", "salmon"),
    ("QSB 1872 4/10/10/92", "salmon"), ("QSB 1872 4/10/10/87", "salmon"),
    ("QSB 1872 4/10/10/86", "salmon"), ("QSB 1883 4/10/11/106", "conies"),
    ("QSB 1872 3/10/10/57", "conies"), ("QSB 1872 3/10/10/55", "coney"),
    ("QSB 1883 4/10/11/116", "salmon"), ("QSB 1872 1/10/13/40", "hares"),
    ("QSB 1883 3/10/9/67", "hare"),
]

MONETARY_VALUES = [
    ("QSB 1872 4/10/10/151", "6d"), ("QSB 1872 4/10/10/47", "5s"),
    ("QSB 1883 4/10/11/46", "7d"), ("QSB 1883 4/10/11/47", "7d"),
    ("QSB 1883 4/10/11/56", "1s"), ("QSB 1883 4/10/11/57", "1s"),
    ("QSB 1872 4/10/10/159", "6d"), ("QSB 1884 1/10/10/98", "1s"),
    ("QSB 1883 4/10/11/102", "6d"), ("QSB 1883 4/10/11/103", "6d"),
    ("QSB 1883 4/10/11/104", "6d"), ("QSB 1872 3/10/10/76", "8s"),
    ("QSB 1883 4/10/11/112", "6d"), ("QSB 1883 4/10/11/113", "6d"),
]

ALIASES = [
    (4929, "Blackey"),  # George Toes alias Blackey
    (4981, "John Millburn"),  # William Bavin otherwise called John Millburn
    (4744, "Smith"),  # Henry William Claxton alias Smith
]

# Husband's occupation wrongly attributed to the wife defendant herself --
# the husband's own spouse-linked Person record already has it correctly
# via backfill_spouse_occupations.py.
REVERSE_OCCUPATION_CLEARS = [4921, 4937, 4986, 5023, 5028, 5056, 5081, 5083, 5102, 5132, 5133, 5152, 5150, 5234]


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

        for reference_number, species in GAME_SPECIES:
            c = _get_conviction(session, reference_number)
            c.game_species = species
            report.append(f"{reference_number}: + game_species {species!r}")

        for reference_number, value in MONETARY_VALUES:
            c = _get_conviction(session, reference_number)
            c.monetary_value_raw = value
            report.append(f"{reference_number}: + monetary_value_raw {value!r}")

        for defendant_id, alias_name in ALIASES:
            if session.exec(
                select(Alias).where(Alias.defendant_id == defendant_id, Alias.alias_name == alias_name)
            ).first() is None:
                session.add(Alias(defendant_id=defendant_id, alias_name=alias_name))
                report.append(f"Defendant #{defendant_id}: + alias {alias_name!r}")

        for defendant_id in REVERSE_OCCUPATION_CLEARS:
            d = session.get(Defendant, defendant_id)
            report.append(f"Defendant #{defendant_id} ({d.first_name}): occupation {d.occupation!r} -> None")
            d.occupation = None

        # Ann Miller (QSB 1872 4/10/10/3): also missing relationship_type,
        # despite marital_status='married' and the "wife of [blank] Miller"
        # construction in raw_record.
        ann = session.get(Defendant, 4921)
        ann.relationship_type = "wife"
        ann.related_to_name = "Miller"
        report.append("Defendant #4921 (Ann Miller): + relationship_type 'wife'")

        # Elizabeth Armstrong, wife of [blank] Armstrong, labourer -- same
        # pattern as Lavinia Jameson/Margaret Elders (batches 36-45): the
        # relationship was never captured at extraction time, so the
        # systemic spouse backfill never saw it.
        elizabeth = session.get(Defendant, 5216)
        report.append(f"Defendant #5216 (Elizabeth Armstrong): occupation {elizabeth.occupation!r} -> None")
        elizabeth.occupation = None
        elizabeth.relationship_type = "wife"
        elizabeth.related_to_name = "Armstrong"
        spouse = Person(first_name=None, last_name="Armstrong", name_key=normalize_name(None, "Armstrong"))
        session.add(spouse)
        session.flush()
        conviction_ids = session.exec(
            select(SummaryConvictionDefendant.summary_conviction_id).where(
                SummaryConvictionDefendant.defendant_id == elizabeth.id
            )
        ).all()
        for conviction_id in conviction_ids:
            session.add(
                InvolvedPerson(summary_conviction_id=conviction_id, person_id=spouse.id, role="spouse of offender")
            )
        elizabeth.spouse_person_id = spouse.id
        report.append(f"Defendant #5216 (Elizabeth Armstrong): + spouse Person #{spouse.id} ('Armstrong')")

        # Offence date literally reads "27 July 1833" in raw_record (no
        # [sic] annotation from the archive itself this time) but every
        # other detail (conviction_date 1883-07-28, defendant, charge)
        # places this in 1883 -- left as extracted rather than "corrected"
        # to a guessed value, per this session's consistent policy;
        # documented instead.
        c = _get_conviction(session, "QSB 1883 4/10/11/44")
        c.correction_note = (
            "Offence date is given in the record as 27 July 1833, but this is almost "
            "certainly a transcription error for 1883 (matching the conviction date "
            "of 28 July 1883) -- left as extracted rather than silently corrected"
        )
        report.append("QSB 1883 4/10/11/44: + correction_note")

        c = _get_conviction(session, "QSB 1872 2/10/15/30")
        c.correction_note = (
            "Victim's name is given as James Readman, but the record itself queries "
            "this with \"[recte Richardson?]\" -- possibly should read Richardson "
            "(the informant is James Richardson of Ruswarp on the same case)"
        )
        report.append("QSB 1872 2/10/15/30: + correction_note")

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
