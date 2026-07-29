"""One-off cleanup for a data-integrity bug found via a full raw-text-vs-
extraction audit: Defendant/Person.relationships_and_details -- a field
meant to hold content grounded in raw_record (e.g. "wife of Robert Jackson,
fisherman") -- was contaminated on 495 rows with modern cross-referencing
analysis ("possibly the same X later convicted..., see QSB Y") instead.
Traced via `git log -S` to ten already-committed "Manually process 100 more
records (d1-d10)" batches from an earlier session's manual-parse workflow:
whoever did that manual entry (per that workflow's own convention, Claude
reading raw_record directly) added helpful-looking cross-references into
this field instead of RelatedConviction.note, the field that already exists
for exactly this purpose (876 legitimate rows).

This script:
  1. For every contaminated row, extracts every "QSB <year> <bundle-path>"
     reference mentioned (handling comma-separated trailing item numbers
     that share a prefix, e.g. "QSB 1883 4/10/11/25, 26" -> two refs, and
     hyphenated ranges like "54-56" -> three refs).
  2. Resolves each extracted reference against summary_conviction.
     reference_number; unresolvable ones are logged, not guessed at.
  3. For each resolved (origin, target) pair with no existing
     RelatedConviction row, creates one with the full original
     contaminated text as its note (that text already explains the basis
     for the link -- see RelatedConviction's own docstring -- it just
     needs to live in the right field). Existing rows are left alone.
  4. Clears relationships_and_details to None on all 495 rows regardless
     of whether a citation was found/resolved -- the field should not
     hold this content either way.

Prints a full report: every row processed, what reference(s) it named,
which resolved to a new RelatedConviction row, which were already covered
by an existing row, and which couldn't be resolved (for manual follow-up).

Usage:
    python3 migrate_contaminated_relationship_notes.py
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
    SummaryConviction,
    SummaryConvictionDefendant,
)

CONTAMINATION_MARKERS = ["see QSB", "in this corpus"]

# "QSB 1883 4/10/11/25" -- year, then a bundle-path token with no
# whitespace/comma/semicolon/paren (covers both "1/10/10/79" and
# "Q4/10/14-110" style item paths).
REF_RE = re.compile(r"QSB\s+(\d{4})\s+([^\s,;()]+)")
# A bare trailing number/range after a comma, following a QSB reference
# already seen -- "26" or "54-56".
TRAILING_NUM_RE = re.compile(r"^\s*(\d+)(?:-(\d+))?\s*(?:[,;)].*)?$")


def _is_contaminated(text: str | None) -> bool:
    return bool(text) and any(marker in text for marker in CONTAMINATION_MARKERS)


def _extract_references(text: str) -> list[str]:
    """Every distinct 'QSB <year> <path>' reference mentioned, expanding
    comma-separated trailing numbers and hyphenated ranges that share the
    last-seen reference's own prefix/item-number position."""
    refs: list[str] = []
    for match in REF_RE.finditer(text):
        year, path = match.groups()
        refs.append(f"QSB {year} {path}")
        # path's last "/"-separated segment is the item number this
        # reference ends on -- comma-separated trailing bare numbers reuse
        # everything before that segment.
        prefix, _, _ = path.rpartition("/")
        tail = text[match.end():]
        comma_match = re.match(r"^\s*,\s*(\d+)(?:-(\d+))?", tail)
        while comma_match:
            lo = int(comma_match.group(1))
            hi = int(comma_match.group(2)) if comma_match.group(2) else lo
            for n in range(lo, hi + 1):
                refs.append(f"QSB {year} {prefix}/{n}" if prefix else f"QSB {year} {n}")
            tail = tail[comma_match.end():]
            comma_match = re.match(r"^\s*,\s*(\d+)(?:-(\d+))?", tail)
    return list(dict.fromkeys(refs))  # de-duplicated, order-preserving


def _origin_conviction_id(session: Session, model_name: str, row_id: int) -> int | None:
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

    migrated, already_linked, unresolved, cleared_only = [], [], [], []

    with get_session(settings.db_path) as session:
        targets: list[tuple[str, object]] = []
        for row in session.exec(select(Defendant)).all():
            if _is_contaminated(row.relationships_and_details):
                targets.append(("defendant", row))
        for row in session.exec(select(Person)).all():
            if _is_contaminated(row.relationships_and_details):
                targets.append(("person", row))

        for model_name, row in targets:
            text = row.relationships_and_details
            origin_conviction_id = _origin_conviction_id(session, model_name, row.id)
            refs = _extract_references(text)

            if not refs:
                cleared_only.append(f"{model_name} #{row.id}: no citation found -- {text!r}")
                row.relationships_and_details = None
                continue

            if origin_conviction_id is None:
                unresolved.append(f"{model_name} #{row.id}: no origin conviction found -- {text!r}")
                row.relationships_and_details = None
                continue

            for ref in refs:
                target_conviction = session.exec(
                    select(SummaryConviction).where(SummaryConviction.reference_number == ref)
                ).first()
                if target_conviction is None:
                    unresolved.append(f"{model_name} #{row.id}: reference {ref!r} did not resolve -- {text!r}")
                    continue

                id_a, id_b = sorted((origin_conviction_id, target_conviction.id))
                if id_a == id_b:
                    continue  # self-reference, nothing to link

                existing = session.get(RelatedConviction, (id_a, id_b))
                if existing is not None:
                    already_linked.append(f"{model_name} #{row.id}: {ref} already linked ({id_a},{id_b})")
                    continue

                session.add(RelatedConviction(summary_conviction_id_a=id_a, summary_conviction_id_b=id_b, note=text))
                migrated.append(f"{model_name} #{row.id}: + RelatedConviction ({id_a},{id_b}) note={text!r}")

            row.relationships_and_details = None

        session.commit()

    print(f"Migrated {len(migrated)} new RelatedConviction row(s):")
    for line in migrated:
        print(f"  {line}")
    print(f"\nAlready covered by an existing RelatedConviction row ({len(already_linked)}):")
    for line in already_linked:
        print(f"  {line}")
    print(f"\nUnresolved references, cleared anyway ({len(unresolved)}):")
    for line in unresolved:
        print(f"  {line}")
    print(f"\nNo citation at all, cleared ({len(cleared_only)}):")
    for line in cleared_only:
        print(f"  {line}")


if __name__ == "__main__":
    main()
