"""One-off (but safely re-runnable) tagging: identifies convictions matching
the "being drunk/disorderly on licensed premises and refusing to
leave/quit when asked" pattern (by the licensee or a constable) -- a
distinct statutory offence under the Licensing Acts that was previously
folded into the generic "licensing offence" leaf only inconsistently (36
of 228 identified this way) or left untagged for it entirely (192, tagged
only with drunkenness/drunk and disorderly/breach of the peace). See
qsrecords/offence_types.py's OFFENCE_TAXONOMY comment for why this became
its own "refusal to quit licensed premises" leaf rather than staying
folded into "licensing offence".

For every matching row: adds the new specific leaf (no-op if already
present) and removes the generic "licensing offence" tag if that's what
the row had instead (no-op if it never had it) -- so each matching
conviction ends up tagged with the specific leaf, not both the specific
and the generic version of the same thing. Leaves every OTHER
"licensing offence" tag alone (trading without a licence, opening outside
licensing hours, dog licences, etc. -- confirmed separately these are the
large majority, 295 of 331, of what's currently tagged "licensing
offence").

Usage:
    python3 tag_refusal_to_quit_licensed_premises.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import SummaryConviction, SummaryConvictionOffenceType
from qsrecords.models.reference import OffenceType

# Case-insensitive; matched against both charge_description and raw_record
# since either can carry the wording depending on how the record was
# extracted. "leave" and "quit" both appear across records; "licensed
# premises" and "public house" both appear as the premises description.
_REFUSAL_PATTERNS = ["refus%leave%", "refus%quit%"]
_PREMISES_PATTERNS = ["%licensed premises%", "%public house%"]


def find_matching_convictions(session: Session) -> list[SummaryConviction]:
    convictions = session.exec(select(SummaryConviction)).all()
    matches = []
    for c in convictions:
        text = f"{c.charge_description} {c.raw_record}".lower()
        has_refusal = any(
            _sql_like_to_substring_match(p, text) for p in _REFUSAL_PATTERNS
        )
        has_premises = any(
            _sql_like_to_substring_match(p, text) for p in _PREMISES_PATTERNS
        )
        if has_refusal and has_premises:
            matches.append(c)
    return matches


def _sql_like_to_substring_match(pattern: str, text: str) -> bool:
    """Mirrors the SQL LIKE '%refus%leave%' style pattern used to first
    identify this set, so the Python and SQL versions agree -- '%' is a
    wildcard, everything else must appear in order."""
    import re

    regex = ".*".join(re.escape(part) for part in pattern.split("%"))
    return re.search(regex, text) is not None


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        specific = session.exec(
            select(OffenceType).where(OffenceType.name == "refusal to quit licensed premises")
        ).one()
        generic = session.exec(
            select(OffenceType).where(OffenceType.name == "licensing offence")
        ).one()

        matches = find_matching_convictions(session)
        tagged = 0
        untagged_generic = 0
        for conviction in matches:
            existing_specific = session.get(
                SummaryConvictionOffenceType, (conviction.id, specific.id)
            )
            if existing_specific is None:
                session.add(
                    SummaryConvictionOffenceType(
                        summary_conviction_id=conviction.id, offence_type_id=specific.id
                    )
                )
                tagged += 1

            existing_generic = session.get(
                SummaryConvictionOffenceType, (conviction.id, generic.id)
            )
            if existing_generic is not None:
                session.delete(existing_generic)
                untagged_generic += 1

        session.commit()
    print(f"Matched {len(matches)} conviction(s).")
    print(f"Added 'refusal to quit licensed premises' to {tagged} row(s).")
    print(f"Removed the generic 'licensing offence' tag from {untagged_generic} row(s).")


if __name__ == "__main__":
    main()
