"""One-off fix for the confirmed (non-contamination) issues from batches
56-60 of the raw-text-vs-extraction audit. Each item individually
re-verified against the live database and raw_record first.

Usage:
    python3 fix_batch_56_60_issues.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import (
    Defendant,
    InvolvedPerson,
    Person,
    SummaryConviction,
    SummaryConvictionOffenceType,
)
from qsrecords.models.reference import Place
from qsrecords.offence_types import get_or_create_offence_type
from qsrecords.text import normalize_name

# (reference_number, [old_leaves_to_remove], [new_leaves_to_add])
RETAGS = [
    ("QSB 1871 2/10/12/1", ["assaulting a police officer", "obstructing the highway"], ["obstructing/resisting a constable"]),
    ("QSB 1871 2/10/12/6", ["assaulting a police officer", "obstructing the highway"], ["obstructing/resisting a constable"]),
    ("QSB 1882 3/10/10/27", ["obstructing the highway"], ["obstructing/resisting a constable"]),
    ("QSB 1871 1/10/9/34", ["master and servant offence"], ["illegal child employment"]),
    ("QSB 1870 4/10/12/70", ["public order"], ["furious/reckless driving"]),
    ("QSB 1870 4/10/12/71", ["public order"], ["furious/reckless driving"]),
    ("QSB 1870 4/10/12/81", ["public order"], ["furious/reckless driving"]),
    ("QSB 1870 4/10/12/80", ["public order"], ["furious/reckless driving"]),
    ("QSB 1870 4/10/12/10", ["theft"], ["loitering/suspected person"]),
    ("QSB 1870 4/10/12/58", ["theft"], ["loitering/suspected person"]),
    ("QSB 1882 2/10/9/39", ["theft"], ["loitering/suspected person"]),
    ("QSB 1870 2/10/12/14", ["assaulting a police officer", "obstructing the highway"], ["obstructing/resisting a constable"]),
    ("QSB 1870 3/10/12/10", ["public order"], ["prostitution", "indecent behaviour"]),
    ("QSB 1870 3/10/12/11", ["public order"], ["prostitution", "indecent behaviour"]),
    ("QSB 1881 4/10/12/9", ["fraud/false pretences"], ["railway offence"]),
    ("QSB 1870 4/10/12/41", ["customs offence"], ["maritime offence"]),
    ("QSB 1870 4/10/12/68", ["obstructing the highway"], ["maritime offence"]),
    ("QSB 1882 2/10/9/56", ["licensing offence"], ["dog licence offence"]),
    ("QSB 1882 2/10/9/57", ["licensing offence"], ["dog licence offence"]),
    ("QSB 1882 2/10/9/58", ["licensing offence"], ["dog licence offence"]),
    ("QSB 1882 2/10/9/59", ["licensing offence"], ["dog licence offence"]),
    ("QSB 1882 2/10/9/74", ["licensing offence"], ["dog licence offence"]),
    ("QSB 1882 2/10/9/75", ["public order"], ["gaming/gambling offence"]),
    ("QSB 1882 2/10/9/76", ["public order"], ["gaming/gambling offence"]),
    ("QSB 1882 1/10/11/8", ["public order"], ["disorderly behaviour"]),
]

GAME_SPECIES = [
    ("QSB 1871 2/10/12/3", "conies"), ("QSB 1871 2/10/12/4", "conies"),
    ("QSB 1871 2/10/12/17", "conies"), ("QSB 1871 2/10/12/18", "conies"),
    ("QSB 1871 1/10/9/35", "salmon"), ("QSB 1871 1/10/9/36", "salmon"),
    ("QSB 1882 2/10/9/10", "hare"),
    ("QSB 1882 1/10/11/36", "conies"), ("QSB 1870 2/10/12/28", "conies"),
    ("QSB 1870 2/10/12/17", "conies"), ("QSB 1870 2/10/12/10", "conies"),
    ("QSB 1870 2/10/12/29", "conies"), ("QSB 1882 1/10/11/1", "conies"),
]

MONETARY_VALUES = [
    ("QSB 1882 4/10/13/99", "1s"), ("QSB 1882 3/10/10/61", "£1"),
    ("QSB 1870 4/10/12/9", "£2"), ("QSB 1870 4/10/12/28", "1s"),
    ("QSB 1870 2/10/12/26", "10s"), ("QSB 1870 2/10/12/25", "10s"),
]

# defendant_id -> age
DEFENDANT_AGES = {
    5952: 13,  # William Harvey, QSB 1882 3/10/10/59
    5954: 14,  # George Watson, QSB 1882 3/10/10/60
}

# person_id -> age (involved persons, not defendants)
PERSON_AGES = {
    3140: 13,  # Samuel Trueman, victim, QSB 1882 4/10/13/109
}

# Husband's occupation wrongly attributed to the wife defendant herself.
# (defendant_id, related_to_full_name)
REVERSE_OCCUPATION_CLEARS = [
    (6164, "William Heselwood"),  # Frances Heselwood, QSB 1870 3/10/12/32
    (6088, "George Johnson"),     # Sophia Johnson, QSB 1870 4/10/12/25
    (6026, "George Palmer"),      # Hannah Palmer, QSB 1870 4/10/12/26
    (6051, "Thomas Ward"),        # Mary Ward, QSB 1870 4/10/12/64
    (6089, "William Hansill"),    # Margaret Hansill, QSB 1882 2/10/9/55
]

OFFENCE_LOCATIONS = [
    ("QSB 1882 4/10/13/91", "Robin Hood's Bay"),
    ("QSB 1882 4/10/13/97", "The Sands"),  # id 229, under West Cliff/Whitby
    ("QSB 1881 4/10/12/17", "High Stakesby"),  # id 365, under Ruswarp
    ("QSB 1870 3/10/12/19", "Market Place"),  # id 30, under East Cliff/Whitby
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
        for reference_number, old_leaves, new_leaves in RETAGS:
            conviction = _get_conviction(session, reference_number)
            for old_leaf in old_leaves:
                old_type = get_or_create_offence_type(session, old_leaf)
                old_link = session.exec(
                    select(SummaryConvictionOffenceType).where(
                        SummaryConvictionOffenceType.summary_conviction_id == conviction.id,
                        SummaryConvictionOffenceType.offence_type_id == old_type.id,
                    )
                ).first()
                if old_link is not None:
                    session.delete(old_link)
            for new_leaf in new_leaves:
                new_type = get_or_create_offence_type(session, new_leaf)
                new_exists = session.exec(
                    select(SummaryConvictionOffenceType).where(
                        SummaryConvictionOffenceType.summary_conviction_id == conviction.id,
                        SummaryConvictionOffenceType.offence_type_id == new_type.id,
                    )
                ).first()
                if new_exists is None:
                    session.add(
                        SummaryConvictionOffenceType(
                            summary_conviction_id=conviction.id, offence_type_id=new_type.id
                        )
                    )
            report.append(f"{reference_number}: {old_leaves} -> {new_leaves}")

        for reference_number, species in GAME_SPECIES:
            c = _get_conviction(session, reference_number)
            c.game_species = species
            report.append(f"{reference_number}: + game_species {species!r}")

        for reference_number, value in MONETARY_VALUES:
            c = _get_conviction(session, reference_number)
            c.monetary_value_raw = value
            report.append(f"{reference_number}: + monetary_value_raw {value!r}")

        for defendant_id, age in DEFENDANT_AGES.items():
            d = session.get(Defendant, defendant_id)
            d.age = age
            d.is_child = True
            report.append(f"Defendant #{defendant_id} ({d.first_name} {d.last_name}): + age {age}, is_child=True")

        for person_id, age in PERSON_AGES.items():
            p = session.get(Person, person_id)
            p.age = age
            p.is_child = True
            report.append(f"Person #{person_id} ({p.first_name} {p.last_name}): + age {age}, is_child=True")

        for defendant_id, related_to_name in REVERSE_OCCUPATION_CLEARS:
            d = session.get(Defendant, defendant_id)
            report.append(
                f"Defendant #{defendant_id} ({d.first_name} {d.last_name}): occupation {d.occupation!r} -> None, "
                f"+ relationship_type 'wife', related_to_name {related_to_name!r}"
            )
            d.occupation = None
            d.relationship_type = "wife"
            d.related_to_name = related_to_name

        # Ellen Smith (QSB 1870 4/10/12/42): "wife of [blank] Smith" -- no
        # husband first name captured, same pattern as Elizabeth Armstrong
        # (batches 46-50) and Ann Miller before her. Occupation belongs to
        # the unnamed husband; create a synthetic spouse Person since none
        # was extracted on this conviction.
        ellen = session.get(Defendant, 6040)
        report.append(f"Defendant #6040 (Ellen Smith): occupation {ellen.occupation!r} -> None")
        ellen.occupation = None
        ellen.relationship_type = "wife"
        ellen.related_to_name = "Smith"
        spouse = Person(first_name=None, last_name="Smith", name_key=normalize_name(None, "Smith"))
        session.add(spouse)
        session.flush()
        conviction = _get_conviction(session, "QSB 1870 4/10/12/42")
        session.add(
            InvolvedPerson(summary_conviction_id=conviction.id, person_id=spouse.id, role="spouse of offender")
        )
        ellen.spouse_person_id = spouse.id
        report.append(f"Defendant #6040 (Ellen Smith): + spouse Person #{spouse.id} ('Smith')")

        for reference_number, place_name in OFFENCE_LOCATIONS:
            place = session.exec(select(Place).where(Place.name == place_name)).first()
            if place is None:
                raise ValueError(f"No place found named {place_name!r}")
            c = _get_conviction(session, reference_number)
            report.append(f"{reference_number}: offence_location -> {place_name!r}")
            c.offence_location_id = place.id

        # High Stakesby fix needs the Ruswarp-side node specifically (id
        # 365), not the West Cliff "High Stakesby Road" node (id 210) that
        # was wrongly linked -- disambiguate by parent since both are named
        # similarly.
        ruswarp_high_stakesby = session.exec(
            select(Place).where(Place.name == "High Stakesby", Place.parent_id == 94)
        ).first()
        c = _get_conviction(session, "QSB 1881 4/10/12/17")
        c.offence_location_id = ruswarp_high_stakesby.id

        whitby_the_sands = session.exec(
            select(Place).where(Place.name == "The Sands", Place.parent_id == 5)
        ).first()
        c = _get_conviction(session, "QSB 1882 4/10/13/97")
        c.offence_location_id = whitby_the_sands.id

        # QSB 1871 1/10/9/27: offence_date (1870-12-19) postdates
        # conviction_date (1870-11-22) -- impossible. Raw text itself
        # flags this with "[sic]". Companion cases heard the same session
        # day (QSB 1871 1/10/9/28, 1/10/9/31 -- same defendant John
        # Harland, same conviction_date) both give 19 November 1870,
        # strongly indicating "December" is a transcription error for
        # "November" -- documented, not silently corrected.
        c = _get_conviction(session, "QSB 1871 1/10/9/27")
        c.correction_note = (
            "Offence date is given in the record as 19 December [sic] 1870, which "
            "postdates the conviction date of 22 November 1870 -- almost certainly a "
            "transcription error for November (two companion cases against the same "
            "defendant, heard the same session, both give 19 November 1870) -- left "
            "as extracted rather than silently corrected"
        )
        report.append("QSB 1871 1/10/9/27: + correction_note")

        # QSB 1870 2/10/12/43: raw text itself flags the offence date with
        # "[sic]" ("21 July [sic] 1870"), and the extracted offence_date
        # (1870-07-21) postdates conviction_date (1870-03-05) -- impossible.
        # Documented rather than guessed at, per this session's policy.
        c = _get_conviction(session, "QSB 1870 2/10/12/43")
        c.correction_note = (
            "Offence date is given in the record as 21 July [sic] 1870 (the archive's "
            "own annotation flags this as suspect), and it postdates the conviction "
            "date of 5 March 1870 -- left as extracted rather than guessing a "
            "corrected date"
        )
        report.append("QSB 1870 2/10/12/43: + correction_note")

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
