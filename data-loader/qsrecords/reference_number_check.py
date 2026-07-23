"""Detects summary_conviction/raw_case rows whose reference_number
disagrees with the CalmView catalogue id embedded in their own archive_url.

Root cause: 01_list_resources.py's process_row() reads reference_number
from one HTML element (the search-results row's display-text cell) and the
archive_url from a different one (the row's link href) -- two separate
places in the same source page. raw.py already documented that these can
disagree ("11 duplicate reference_number values exist in the source CSV").
archive_url is authoritative (unique-constrained, and it's what the site's
own record-detail links resolve through); reference_number is occasionally
wrong at the source.

Detection is deliberately conservative: it flags mismatches for review
rather than silently rewriting reference_number to whatever archive_url
implies, since the two fields are formatted inconsistently across rows
(some carry a literal "Q" prefix on the quarter, some don't) and a fully
general reformatter risks introducing new drift. Fixing a specific
mismatch is a human (or human-reviewed script) decision -- see
fix_reference_number_mismatches.py for the two rows already reviewed and
corrected this way.
"""

import re
from urllib.parse import unquote


def canonical_tokens(reference_number: str) -> list[str]:
    """Splits a reference_number or a decoded CalmView catalogue id into a
    comparable token sequence: digits and quarter markers only, "QSB"/"Q"/
    "SB" literals dropped, and a leading "Q" stripped from a "Q4"-style
    quarter token so "QSB 1869 Q4/10/14-3" and "QSB 1872 4/10/10/19" tokenize
    the same way despite the inconsistent Q-prefix formatting."""
    raw_tokens = [t for t in re.split(r"[ /\-]", reference_number) if t]
    tokens = [t for t in raw_tokens if t not in ("QSB", "Q", "SB")]
    return [t[1:] if re.fullmatch(r"Q\d+", t) else t for t in tokens]


def canonical_tokens_from_archive_url(archive_url: str) -> list[str] | None:
    """Extracts and decodes the CalmView `id=` query parameter (e.g.
    "Q%2fSB%2f1872-Q4%2f10%2f10-119" -> "Q/SB/1872-Q4/10/10-119") and
    tokenizes it the same way as canonical_tokens(), so the two are
    directly comparable. Returns None if the URL has no `id` parameter."""
    match = re.search(r"id=([^&]+)", archive_url)
    if not match:
        return None
    return canonical_tokens(unquote(match.group(1)))


def reference_number_mismatch(reference_number: str, archive_url: str) -> bool:
    archive_tokens = canonical_tokens_from_archive_url(archive_url)
    if archive_tokens is None:
        return False
    return canonical_tokens(reference_number) != archive_tokens
