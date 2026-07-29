"""Follow-up to migrate_contaminated_relationship_notes.py: that script left
43 references unresolved because they used a hyphenated range in the final
path segment (e.g. "QSB 1881 3/10/11/25-35", meaning items 25 through 35,
not one item literally named "25-35") -- ambiguous in general since some
real reference numbers also use a hyphen in that position (e.g. "Q4/10/14-
110"), but every one of these 43 sits in contaminated text explicitly
describing "one of N defendants ... see QSB ..." style ranges, so expanding
them here is safe.

Reads the pre-migration backup (contaminated_rows.txt, table|id|text per
line, captured before relationships_and_details was cleared) rather than
the live database, since that field is already cleared. Only adds
RelatedConviction rows that don't already exist; never touches
relationships_and_details (already handled).

Usage:
    python3 migrate_contaminated_relationship_notes_ranges.py
"""

import re

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import (
    Defendant,
    InvolvedPerson,
    Person,
    RelatedConviction,
    SummaryConvictionDefendant,
    SummaryConviction,
)

BACKUP_PATH = "/private/tmp/claude-501/-Users-gjh-GitHub-NorthRidingQuarterSessions/7a0ac88b-a922-4f34-868f-ecceb2dc9c9d/scratchpad/contaminated_rows.txt"

REF_RE = re.compile(r"QSB\s+(\d{4})\s+([^\s,;()]+)")


def _expand_range_refs(text: str) -> list[str]:
    refs: list[str] = []
    for match in REF_RE.finditer(text):
        year, path = match.groups()
        prefix, _, last = path.rpartition("/")
        range_match = re.fullmatch(r"(\d+)-(\d+)", last)
        if range_match and prefix:
            lo, hi = int(range_match.group(1)), int(range_match.group(2))
            if hi - lo <= 50:  # sanity guard against a false-positive real reference
                for n in range(lo, hi + 1):
                    refs.append(f"QSB {year} {prefix}/{n}")
                continue
        refs.append(f"QSB {year} {path}")

        tail = text[match.end():]
        comma_match = re.match(r"^\s*,\s*/?(\d+)(?:-(\d+))?", tail)
        while comma_match:
            lo = int(comma_match.group(1))
            hi = int(comma_match.group(2)) if comma_match.group(2) else lo
            for n in range(lo, hi + 1):
                refs.append(f"QSB {year} {prefix}/{n}" if prefix else f"QSB {year} {n}")
            tail = tail[comma_match.end():]
            comma_match = re.match(r"^\s*,\s*/?(\d+)(?:-(\d+))?", tail)
    return list(dict.fromkeys(refs))


def _origin_conviction_id(session: Session, model_name: str, row_id: int):
    if model_name == "defendant":
        return session.exec(
            select(SummaryConvictionDefendant.summary_conviction_id).where(
                SummaryConvictionDefendant.defendant_id == row_id
            )
        ).first()
    return session.exec(
        select(InvolvedPerson.summary_conviction_id).where(InvolvedPerson.person_id == row_id)
    ).first()


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)

    added, still_unresolved = [], []
    with get_session(settings.db_path) as session:
        with open(BACKUP_PATH, encoding="utf-8") as f:
            for line in f:
                model_name, row_id_str, text = line.rstrip("\n").split("|", 2)
                row_id = int(row_id_str)
                refs = _expand_range_refs(text)
                if not refs:
                    continue
                origin_id = _origin_conviction_id(session, model_name, row_id)
                if origin_id is None:
                    continue
                for ref in refs:
                    target = session.exec(
                        select(SummaryConviction).where(SummaryConviction.reference_number == ref)
                    ).first()
                    if target is None:
                        still_unresolved.append(f"{model_name} #{row_id}: {ref!r} -- {text!r}")
                        continue
                    id_a, id_b = sorted((origin_id, target.id))
                    if id_a == id_b:
                        continue
                    if session.get(RelatedConviction, (id_a, id_b)) is not None:
                        continue
                    session.add(
                        RelatedConviction(summary_conviction_id_a=id_a, summary_conviction_id_b=id_b, note=text)
                    )
                    added.append(f"{model_name} #{row_id}: + RelatedConviction ({id_a},{id_b}) via {ref}")
        session.commit()

    print(f"Added {len(added)} more RelatedConviction row(s):")
    for line in added:
        print(f"  {line}")
    print(f"\nStill unresolved ({len(still_unresolved)}):")
    for line in still_unresolved:
        print(f"  {line}")


if __name__ == "__main__":
    main()
