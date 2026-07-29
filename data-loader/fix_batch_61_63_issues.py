"""One-off fix for the confirmed (non-contamination) issues from batches
61-63 of the raw-text-vs-extraction audit -- the final batches. Each item
individually re-verified against the live database and raw_record first.

Usage:
    python3 fix_batch_61_63_issues.py
"""

from datetime import date

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, Person, SummaryConviction, SummaryConvictionOffenceType
from qsrecords.offence_types import get_or_create_offence_type

RETAGS = [
    ("QSB 1881 4/10/12/64", ["public order"], ["gaming/gambling offence"]),
    ("QSB 1881 4/10/12/65", ["public order"], ["gaming/gambling offence"]),
    ("QSB 1881 4/10/12/66", ["public order"], ["gaming/gambling offence"]),
    ("QSB 1881 4/10/12/67", ["public order"], ["gaming/gambling offence"]),
    ("QSB 1881 4/10/12/68", ["public order"], ["gaming/gambling offence"]),
    ("QSB 1881 4/10/12/69", ["public order"], ["gaming/gambling offence"]),
    ("QSB 1881 4/10/12/70", ["public order"], ["gaming/gambling offence"]),
    ("QSB 1881 4/10/12/71", ["public order"], ["gaming/gambling offence"]),
    ("QSB 1881 4/10/12/87", ["malicious/property damage"], ["straying animals"]),
    ("QSB 1881 4/10/12/88", ["malicious/property damage"], ["straying animals"]),
    ("QSB 1881 4/10/12/118", ["public order"], ["disorderly behaviour"]),
    ("QSB 1881 4/10/12/121", ["obstructing the highway"], ["obstructing/resisting a constable"]),
    ("QSB 1881 4/10/12/133", ["public order"], ["railway offence"]),
    ("QSB 1881 3/10/11/16", ["malicious/property damage"], ["straying animals"]),
    ("QSB 1881 3/10/11/23", ["public order"], ["indecent behaviour"]),
    ("QSB 1881 3/10/11/55", ["theft"], ["loitering/suspected person"]),
    ("QSB 1881 3/10/11/92", ["public order"], ["furious/reckless driving"]),
    ("QSB 1881 3/10/11/106", ["theft"], ["loitering/suspected person"]),
    ("QSB 1881 3/10/11/107", ["theft"], ["loitering/suspected person"]),
]

GAME_SPECIES = [
    ("QSB 1870 2/10/12/21", "hare"),
    ("QSB 1881 4/10/12/138", "rabbit"), ("QSB 1881 4/10/12/142", "rabbit"), ("QSB 1881 4/10/12/143", "rabbit"),
]

# defendant_id -> related-to full name (occupation belongs to the unnamed husband)
REVERSE_OCCUPATION_CLEARS = [
    (6439, "Lister"),      # Elizabeth Lister, QSB 1881 3/10/11/37 ("wife of [blank] Lister")
    (6440, "Stockwood"),   # Margaret Stockwood, QSB 1881 3/10/11/38 ("wife of [blank] Stockwood")
]

PERSON_AGES = {
    3354: 6,  # Hannah Wheatman, involved person, QSB 1881 4/10/12/73
}


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

        for defendant_id, husband_surname in REVERSE_OCCUPATION_CLEARS:
            d = session.get(Defendant, defendant_id)
            report.append(f"Defendant #{defendant_id} ({d.first_name} {d.last_name}): occupation {d.occupation!r} -> None")
            d.occupation = None
            d.relationship_type = "wife"
            d.related_to_name = husband_surname

        for person_id, age in PERSON_AGES.items():
            p = session.get(Person, person_id)
            p.age = age
            p.is_child = True
            report.append(f"Person #{person_id} ({p.first_name} {p.last_name}): + age {age}, is_child=True")

        # QSB 1881 3/10/11/44: raw text itself flags "17 [sic] May 1881" as
        # suspect, and the resulting offence_date postdates conviction_date
        # -- documented rather than guessed at.
        c = _get_conviction(session, "QSB 1881 3/10/11/44")
        c.correction_note = (
            "Offence date is given in the record as 17 [sic] May 1881 (the archive's "
            "own annotation flags this as suspect), and it postdates the conviction "
            "date of 10 May 1881 -- left as extracted rather than guessing a "
            "corrected date"
        )
        report.append("QSB 1881 3/10/11/44: + correction_note")

        # QSB 1881 3/10/11/96 (Margaret Ann Hansill): conviction_date was
        # never captured, but the companion case against her husband William
        # George Hansill (QSB 1881 3/10/11/97 -- same charge, same street,
        # same offence_date) gives 1881-05-31; cases against a married
        # couple for the same incident were consistently heard together
        # throughout this corpus, so this is filled in with high confidence
        # rather than left null.
        c = _get_conviction(session, "QSB 1881 3/10/11/96")
        c.conviction_date = date(1881, 5, 31)
        report.append("QSB 1881 3/10/11/96: + conviction_date 1881-05-31 (from companion case /97)")

        # QSB 1881 3/10/11/110: conviction_date 1881-05-11 postdated by
        # offence_date 1881-06-09 -- impossible. Every neighbouring record
        # in this same numeric run (/106-/109, /111) has conviction_date
        # 1881-06-11, indicating a month transposition (05 -> 06) rather
        # than a genuine outlier.
        c = _get_conviction(session, "QSB 1881 3/10/11/110")
        c.correction_note = (
            "Conviction date is given in the record as 11 May 1881, which predates "
            "the offence date of 9 June 1881 -- impossible, and inconsistent with "
            "every neighbouring record in this same session run (QSB 1881 3/10/11/106-109, "
            "111), all dated 11 June 1881 -- corrected to 11 June 1881 as an evident "
            "month transposition"
        )
        c.conviction_date = date(1881, 6, 11)
        report.append("QSB 1881 3/10/11/110: conviction_date 1881-05-11 -> 1881-06-11 (+ correction_note)")

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
