"""One-off fix for the remaining confirmed (non-contamination) issues from
batch 54 of the raw-text-vs-extraction audit.

Usage:
    python3 fix_batch_54_issues.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, SummaryConviction, SummaryConvictionOffenceType
from qsrecords.models.reference import Place
from qsrecords.offence_types import get_or_create_offence_type

REPLACEMENTS = [
    ("QSB 1871 4/10/13/95", "public order", "furious/reckless driving"),
    ("QSB 1871 4/10/13/96", "public order", "furious/reckless driving"),
    ("QSB 1871 4/10/13/91", "public order", "furious/reckless driving"),
    ("QSB 1871 4/10/13/146", "public order", "furious/reckless driving"),
    ("QSB 1871 4/10/13/142", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1871 4/10/13/158", "obstructing the highway", "obstructing/resisting a constable"),
    ("QSB 1871 4/10/13/13", "obstructing the highway", "obstructing/resisting a constable"),
]

MONETARY_VALUES = [
    ("QSB 1871 4/10/13/4", "£2"),
    ("QSB 1871 4/10/13/151", "1s"),
    ("QSB 1882 4/10/13/16", "5s"),
]

REVERSE_OCCUPATION_CLEARS = [5566, 5604]  # Ann Green (miner), Martha Dixon (jet worker)


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

        for reference_number, value in MONETARY_VALUES:
            c = _get_conviction(session, reference_number)
            c.monetary_value_raw = value
            report.append(f"{reference_number}: + monetary_value_raw {value!r}")

        for defendant_id in REVERSE_OCCUPATION_CLEARS:
            d = session.get(Defendant, defendant_id)
            report.append(f"Defendant #{defendant_id} ({d.first_name}): occupation {d.occupation!r} -> None")
            d.occupation = None

        muncasters_yard = session.exec(select(Place).where(Place.name == "Muncaster's Yard")).first()
        c = _get_conviction(session, "QSB 1871 4/10/13/166")
        c.offence_location_id = muncasters_yard.id
        report.append("QSB 1871 4/10/13/166: offence_location -> \"Muncaster's Yard\"")

        # George Jackson: defendant.location_id is already correctly "West
        # Barnby" (raw: "of West Barnby in the township of Barnby") -- the
        # bug is offence_location_id wrongly saying "East Barnby" for this
        # truancy case. Per the established truancy-location convention,
        # offence_location should roll up to the township level, not
        # duplicate a specific residence -- "Barnby" isn't its own
        # top-level place in the tree as currently built (West/East Barnby
        # both sit under Lythe), so Lythe is the correct township-level
        # value here, not a guess at a new "Barnby" node.
        lythe = session.exec(select(Place).where(Place.name == "Lythe", Place.parent_id == 345)).first()
        jackson_conviction = _get_conviction(session, "QSB 1882 4/10/13/19")
        report.append("QSB 1882 4/10/13/19: offence_location 'East Barnby' -> 'Lythe' (defendant's own West Barnby residence already correct)")
        jackson_conviction.offence_location_id = lythe.id

        abbey_plain = session.exec(select(Place).where(Place.name == "Abbey Plain")).first()
        c = _get_conviction(session, "QSB 1883 1/10/11/79")
        c.offence_location_id = abbey_plain.id
        report.append("QSB 1883 1/10/11/79: offence_location -> 'Abbey Plain'")

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
