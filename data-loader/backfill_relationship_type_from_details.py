"""Systemic backfill for a specific, mechanical gap found while auditing
family/employment relationships: many `person.relationships_and_details`
values already correctly say things like "son of the defendant" or
"daughter of the defendant" (written at original extraction time), but the
structured `relationship_type`/`related_to_name` fields were left null.

This is NOT a re-extraction from raw text -- it's reading a value the
pipeline already committed to relationships_and_details and mechanically
promoting it into the dedicated field, resolving "the defendant" against
the actual (single) defendant on the same conviction. Records with more
than one defendant are skipped and reported for manual review rather than
guessed at.

Usage:
    python3 backfill_relationship_type_from_details.py
"""

import re

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, InvolvedPerson, Person, SummaryConvictionDefendant

# Ordered (first match wins) -- "daughter"/"son" checked before generic "child".
PATTERNS = [
    (re.compile(r"\bson of the defendant\b", re.I), "son"),
    (re.compile(r"\bdaughter of the defendant\b", re.I), "daughter"),
    (re.compile(r"\bchild of the defendant\b", re.I), "child"),
    (re.compile(r"^wife of the defendant\b", re.I), "wife"),
    (re.compile(r"^husband of the defendant$", re.I), "husband"),
    (re.compile(r"\bmaster of the defendant\b", re.I), "master"),
    (re.compile(r"\bemployer of the defendant\b", re.I), "employer"),
]

# Explicitly excluded: too ambiguous to promote mechanically.
SKIP_DETAILS = {
    "surname marked [sic] in the original record -- possibly a family relation of the defendant",
}


def _relationship_type_for(details: str) -> str | None:
    if details in SKIP_DETAILS:
        return None
    for pattern, relationship_type in PATTERNS:
        if pattern.search(details):
            return relationship_type
    return None


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    report = []
    skipped = []
    with get_session(settings.db_path) as session:
        candidates = session.exec(
            select(Person).where(
                Person.relationship_type.is_(None),
                Person.relationships_and_details.is_not(None),
            )
        ).all()

        for person in candidates:
            relationship_type = _relationship_type_for(person.relationships_and_details)
            if relationship_type is None:
                continue

            conviction_ids = session.exec(
                select(InvolvedPerson.summary_conviction_id).where(InvolvedPerson.person_id == person.id)
            ).all()

            defendant_names = set()
            ok = True
            for conviction_id in conviction_ids:
                defendant_ids = session.exec(
                    select(SummaryConvictionDefendant.defendant_id).where(
                        SummaryConvictionDefendant.summary_conviction_id == conviction_id
                    )
                ).all()
                if len(defendant_ids) != 1:
                    ok = False
                    break
                defendant = session.get(Defendant, defendant_ids[0])
                full_name = " ".join(part for part in [defendant.first_name, defendant.last_name] if part)
                defendant_names.add(full_name)

            if not ok or len(defendant_names) != 1:
                skipped.append(f"Person #{person.id} ({person.first_name} {person.last_name}): "
                                f"{person.relationships_and_details!r} -- ambiguous defendant, skipped")
                continue

            related_to_name = next(iter(defendant_names))
            person.relationship_type = relationship_type
            person.related_to_name = related_to_name
            report.append(
                f"Person #{person.id} ({person.first_name} {person.last_name}): "
                f"+ relationship_type={relationship_type!r}, related_to_name={related_to_name!r} "
                f"(from relationships_and_details={person.relationships_and_details!r})"
            )

        session.commit()

    print(f"Applied {len(report)} fix(es):")
    for line in report:
        print(f"  {line}")
    if skipped:
        print(f"\nSkipped {len(skipped)} ambiguous case(s) for manual review:")
        for line in skipped:
            print(f"  {line}")


if __name__ == "__main__":
    main()
