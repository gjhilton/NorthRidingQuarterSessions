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
