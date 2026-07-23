"""Row filtering and name/place-name normalization helpers.

The v1 pipeline filtered "Summary conviction" records by reading whitby.csv
line-by-line as raw text and substring-matching. This module does the same
logical filter but against properly-parsed CSV fields, and documents why the
match must stay case-sensitive: some bundle-level rows describe "summary
convictions" (lowercase, plural) in prose, and a case-insensitive match would
pull those in as false positives.
"""

import re

_SUMMARY_CONVICTION_MARKER = "Summary conviction"

_WHITESPACE_RE = re.compile(r"\s+")


def is_summary_conviction_row(title: str, description: str) -> bool:
    """True if this row is an individual Summary Conviction record.

    Matches the exact case-sensitive substring "Summary conviction" against
    title OR description (not just title alone), since at least one real
    record has a typo dropping the word "conviction" from its title but
    still carries it correctly in the description.
    """
    haystack = f"{title or ''}{description or ''}"
    return _SUMMARY_CONVICTION_MARKER in haystack


def normalize_key(value: str) -> str:
    """Lowercase, whitespace-collapsed form used as a dedup/lookup key."""
    return _WHITESPACE_RE.sub(" ", value.strip()).lower()


def normalize_name(first_name: str | None, last_name: str | None) -> str:
    """Normalized 'first last' key for grouping mentions of the same name.

    Used for Defendant/Person.name_key so all occurrences of e.g. "John
    Smith" (regardless of case/whitespace) can be retrieved with a single
    equality query, without attempting to merge/deduplicate the underlying
    rows (see the plan's discussion of why cross-case identity resolution
    is out of scope).
    """
    parts = [p for p in (first_name, last_name) if p]
    return normalize_key(" ".join(parts))


# Generational epithets the source record sometimes appends straight onto a
# surname (e.g. "Smith the elder") -- not part of the surname itself, and
# wrongly read as one produces nonsense like "SMITH THE ELDER" as a
# formatted name. Longest-first so "the elder" doesn't shadow a longer match
# (none currently overlap, but keeps this safe if more variants are added).
_NAME_QUALIFIER_RE = re.compile(
    r"\s+(the elder|the younger|senior|junior|snr|jnr)$", re.IGNORECASE
)


def split_name_qualifier(last_name: str | None) -> tuple[str | None, str | None]:
    """Splits a trailing generational epithet off last_name, if present.

    Returns (cleaned_last_name, qualifier) -- qualifier is None, and
    last_name returned unchanged, when there's nothing to split off.
    Call this at extraction time (mapping.py) so last_name never gets a
    qualifier baked into it in the first place; also used by the one-off
    backfill correcting the handful of rows extracted before this existed.
    """
    if not last_name:
        return last_name, None
    match = _NAME_QUALIFIER_RE.search(last_name)
    if not match:
        return last_name, None
    cleaned = last_name[: match.start()].strip()
    return (cleaned or None), match.group(1).lower()


# A lowercase letter or digit immediately followed by an uppercase letter,
# with zero separating characters, is the signature left by the pre-fix
# scraper's `td_tag.text.strip()` (no separator= passed to BeautifulSoup's
# .text, which silently drops <br> tags to zero width instead of a space --
# see scraper/02_fetch_resources.py::extract_field, fixed to use
# get_text(separator=". ") going forward). This concatenated originally-
# separate clauses with nothing between them, e.g. "...himselfOffence
# committed..." or "...on 20 May 1881Whitby Strand...". This function
# repairs already-scraped text where the original <br> positions are gone.
_RUN_ON_BOUNDARY_RE = re.compile(r"[a-z0-9][A-Z]")


def fix_run_on_spacing(text: str | None) -> str | None:
    """Insert '. ' at zero-separator lower/digit->upper boundaries left by
    the pre-fix scraper's unseparated BeautifulSoup .text extraction.

    Only fires when there is NO character between the two letters, so any
    seam that's already punctuated or even just space/dash-separated is a
    no-op -- this repairs the exact concatenation bug, nothing broader.
    Target punctuation ". " confirmed against a legacy v1 artifact
    (data/structured/QSB_1803_1-10-3-6.json) that already has it right, and
    against the live archive HTML itself (the source cells use <br /><br />
    between clauses, i.e. a full break, not a mid-sentence line wrap).

    Excludes Mc-/Mac- surnames (McDonald, MacGuire, ...): a lowercase 'c'
    immediately preceded by 'M' or 'Ma' is genuine capitalization, not a
    lost sentence boundary -- the only known systematic false-positive
    class in this corpus (verified: 171 Mc[A-Z] + 22 Mac[A-Z] occurrences,
    all genuine surnames, zero false negatives introduced by excluding
    them).

    Idempotent: once ". " is inserted the two original characters are no
    longer adjacent, so re-running on already-fixed text is a no-op.
    """
    if not text:
        return text

    def _replace(match: re.Match) -> str:
        pos = match.start()
        lower, upper = match.group(0)
        if lower == "c" and (text[pos - 1 : pos] == "M" or text[pos - 2 : pos] == "Ma"):
            return match.group(0)
        return f"{lower}. {upper}"

    return _RUN_ON_BOUNDARY_RE.sub(_replace, text)


def iter_run_on_boundaries(text: str | None):
    """Public re-scan hook for backfill residual-checks (splits leftover
    matches into expected-Mc/Mac vs. genuinely unexplained) -- exposed here
    so callers don't need to reach for the "private" _RUN_ON_BOUNDARY_RE."""
    if not text:
        return []
    return list(_RUN_ON_BOUNDARY_RE.finditer(text))
