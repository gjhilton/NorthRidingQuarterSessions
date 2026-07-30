"""One-off fix for the remaining confirmed (non-contamination -- that was
handled separately by three rounds of relationships_and_details cleanup)
issues from batches 51-53 of the raw-text-vs-extraction audit. Each item
individually re-verified against the live database first.

Usage:
    python3 fix_batch_51_53_issues.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Alias, Defendant, SummaryConviction, SummaryConvictionOffenceType
from qsrecords.models.reference import Place
from qsrecords.offence_types import get_or_create_offence_type

REPLACEMENTS = [
    ("QSB 1883 2/10/11/11", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1872 1/10/13/21", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1883 2/10/11/71", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1872 1/10/13/31", "public order", "firearms offence"),
]

GAME_SPECIES = [
    ("QSB 1872 1/10/13/62", "hares"), ("QSB 1872 1/10/13/64", "hares"),
    ("QSB 1872 1/10/13/60", "salmon"), ("QSB 1872 1/10/13/45", "conies"),
    ("QSB 1883 2/10/11/56", "conies"), ("QSB 1883 1/10/11/14", "rabbit"),
]

ALIASES = [
    (5297, "MacFarlane"),  # Michael MacGuire otherwise MacFarlane
    (5301, "Thomas Thompson"),  # Thomas Pearson otherwise Thomas Thompson
    (5391, "Emily Butler"),  # Emily Devon alias Emily Butler
]

# Husband's occupation wrongly attributed to the wife defendant herself.
REVERSE_OCCUPATION_CLEARS = [5426, 5448, 5450, 5460]


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

        # Lealholm & Glaisdale Highway -- already exists, straying swine.
        lealholm_glaisdale = session.exec(
            select(Place).where(Place.name == "Lealholm & Glaisdale Highway")
        ).first()
        c = _get_conviction(session, "QSB 1872 1/10/13/42")
        c.offence_location_id = lealholm_glaisdale.id
        report.append("QSB 1872 1/10/13/42: offence_location -> 'Lealholm & Glaisdale Highway'")

        # Amos Major (QSB 1883 2/10/11/11): also has the same obstructing-
        # highway/resisting-constable retag applied above via the
        # conviction; nothing further needed here.

        # Robert Frank / Thomas Urwin's Michael... William Henry Readman
        # "carrying a gun without a licence": conviction_date is currently
        # wrong (predates offence_date, impossible) -- fix to 1883,
        # matching the neighbouring same-run records.
        c = _get_conviction(session, "QSB 1883 2/10/11/38")
        report.append(f"QSB 1883 2/10/11/38: conviction_date {c.conviction_date} -> 1883-02-06")
        from datetime import date

        c.conviction_date = date(1883, 2, 6)

        # Catherine Pearson: raw_record states no home township at all for
        # her (only the offence township, Whitby); location_id=4 (Whitby)
        # was invented rather than left null.
        catherine = session.get(Defendant, 5554)
        report.append(f"Defendant #5554 (Catherine Pearson): location_id {catherine.location_id} -> None")
        catherine.location_id = None

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
