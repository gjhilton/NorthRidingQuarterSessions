"""Backfill: repairs run-on text left by the pre-fix scraper's unseparated
BeautifulSoup .text extraction (see qsrecords.text.fix_run_on_spacing) in
already-loaded raw_case.description, and keeps summary_conviction.raw_record
in lockstep (it's supposed to be a verbatim copy of raw_case.description --
see mapping.py -- so it's re-derived by copy, never re-regexed
independently, to guarantee the two can never drift).

Idempotent: fix_run_on_spacing() is a no-op on already-fixed text, and the
raw_record sync is a no-op once it already equals raw_case.description.
"""

from dataclasses import dataclass, field

from sqlmodel import Session, select

from qsrecords.models.core import SummaryConviction
from qsrecords.models.raw import RawCase
from qsrecords.text import fix_run_on_spacing, iter_run_on_boundaries

_SAMPLE_LIMIT = 8


@dataclass
class DescriptionSpacingReport:
    raw_case_scanned: int = 0
    raw_case_changed: int = 0
    insertions: int = 0
    raw_record_synced: int = 0
    residual_raw_matches: int = 0  # still matches the raw boundary pattern
    residual_mcmac_expected: int = 0  # of those, Mc/Mac surnames (expected, safe)
    residual_unexplained: int = 0  # anything left over -- should be investigated
    samples: list[tuple[str, str, str]] = field(default_factory=list)  # (reference_number, before, after)


def backfill_description_spacing(session: Session) -> DescriptionSpacingReport:
    report = DescriptionSpacingReport()

    raw_cases = session.exec(select(RawCase)).all()
    for rc in raw_cases:
        report.raw_case_scanned += 1
        original = rc.description
        fixed = fix_run_on_spacing(original)
        if fixed != original:
            report.raw_case_changed += 1
            report.insertions += sum(
                1 for m in iter_run_on_boundaries(original) if not _is_mcmac(original, m.start())
            )
            if len(report.samples) < _SAMPLE_LIMIT:
                report.samples.append((rc.reference_number, original, fixed))
            rc.description = fixed

    session.flush()

    # SummaryConviction.raw_case_id was dropped in the v3 schema migration --
    # joined on record_number/reference_number instead, the same key
    # migrate_to_unified_schema.py and scope_filter.py already rely on.
    convictions = session.exec(
        select(SummaryConviction, RawCase).join(
            RawCase, RawCase.reference_number == SummaryConviction.record_number
        )
    ).all()
    for conviction, rc in convictions:
        if conviction.raw_record != rc.description:
            conviction.raw_record = rc.description
            report.raw_record_synced += 1

    session.flush()

    for rc in raw_cases:
        matches = iter_run_on_boundaries(rc.description)
        if not matches:
            continue
        report.residual_raw_matches += len(matches)
        for m in matches:
            if _is_mcmac(rc.description, m.start()):
                report.residual_mcmac_expected += 1
            else:
                report.residual_unexplained += 1

    return report


def _is_mcmac(text: str, pos: int) -> bool:
    return text[pos] == "c" and (text[pos - 1 : pos] == "M" or text[pos - 2 : pos] == "Ma")
