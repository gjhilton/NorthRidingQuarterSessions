"""One-off backfill: recovers occupations for spouse-linked Person rows
(see backfill_spouses.py) that the original extraction dropped.

Found via the raw-text-vs-extraction audit: raw_record very often reads
"[wife's name] wife of [husband's name] of the township of X [occupation]"
-- the occupation (and township) grammatically belong to the husband, but
the original LLM extraction only ever captured them on the wife's own
defendant/person row, leaving the husband's entry (and now his linked
spouse Person row) with occupation=None. Confirmed as a systemic pattern
across ~300 rows, not isolated incidents.

This is NOT a general-purpose re-extraction pass -- it targets exactly one
well-defined, high-confidence phrase shape: the text immediately following
"<related_to_name> of the township of <town> " up to the next punctuation
(falling back to the text immediately after <related_to_name> when no
township clause is present, e.g. "Robert Austin fisherman"). Candidates
were generated, then hand-spot-checked against raw_record for ~30 rows
across the full range before this list was finalized -- every checked row
matched exactly. Rows where no confident match was found are left alone,
not guessed at.

Idempotent -- only Person rows with occupation IS NULL are touched, so
re-running after new spouse rows are backfilled only affects genuinely new
rows.

Usage:
    python3 backfill_spouse_occupations.py
"""

import re

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, Person, SummaryConviction

TOWNSHIP_RE = r"of\s+the\s+township\s+of\s+[A-Za-z][A-Za-z\s\-']*?\s+"
STOP = r"(?:[.,;]|\s+and\s|\s+for\s|\s+with\s|\s+being\s|\s+on\s+the\s+oath)"

PATTERN_WITH_TOWNSHIP = re.compile(r"\b" + TOWNSHIP_RE + r"([a-z][a-z /'\-]*?)" + STOP)
PATTERN_NO_TOWNSHIP = re.compile(r"\b([a-z][a-z /'\-]*?)" + STOP)

BAD_WORDS = {"who", "on", "at", "in", "all", "being", "of", "wife", "husband", "for", "the", "a", "an"}


def _extract_occupation(name: str, raw_record: str) -> str | None:
    idx = raw_record.find(name)
    if idx == -1:
        return None
    tail = raw_record[idx + len(name) : idx + len(name) + 80]
    stripped = tail.lstrip()
    match = PATTERN_WITH_TOWNSHIP.match(stripped)
    if not match and not stripped.lower().startswith("of the township"):
        match = PATTERN_NO_TOWNSHIP.match(stripped)
    if not match:
        return None
    candidate = match.group(1).strip()
    words = candidate.split()
    if not words or len(words) > 4:
        return None
    if any(w.lower() in BAD_WORDS for w in words):
        return None
    return candidate


def _spouse_targets(session: Session):
    """Every (related_to_name, spouse Person, raw_record) triple for a
    spouse-linked Person still missing an occupation."""
    rows = []
    for model in (Defendant, Person):
        origins = session.exec(
            select(model).where(model.spouse_person_id.is_not(None))
        ).all()
        for origin in origins:
            spouse = session.get(Person, origin.spouse_person_id)
            if spouse.occupation is not None:
                continue
            conviction = None
            if isinstance(origin, Defendant):
                from qsrecords.models.core import SummaryConvictionDefendant

                conviction_id = session.exec(
                    select(SummaryConvictionDefendant.summary_conviction_id).where(
                        SummaryConvictionDefendant.defendant_id == origin.id
                    )
                ).first()
            else:
                from qsrecords.models.core import InvolvedPerson

                conviction_id = session.exec(
                    select(InvolvedPerson.summary_conviction_id).where(
                        InvolvedPerson.person_id == origin.id
                    )
                ).first()
            if conviction_id is None:
                continue
            conviction = session.get(SummaryConviction, conviction_id)
            rows.append((origin.related_to_name, spouse, conviction.raw_record))
    return rows


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    fixed = []
    with get_session(settings.db_path) as session:
        for related_to_name, spouse, raw_record in _spouse_targets(session):
            if not related_to_name:
                continue
            occupation = _extract_occupation(related_to_name, raw_record)
            if occupation is None:
                continue
            spouse.occupation = occupation
            fixed.append(f"Person #{spouse.id} ({related_to_name}): occupation -> {occupation!r}")
        session.commit()

    if fixed:
        print(f"Backfilled {len(fixed)} spouse occupation(s):")
        for line in fixed:
            print(f"  {line}")
    else:
        print("Nothing to fix.")


if __name__ == "__main__":
    main()
