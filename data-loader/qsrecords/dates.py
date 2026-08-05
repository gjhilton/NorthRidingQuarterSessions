"""Deterministic parsing of historical 'D Month YYYY' date strings.

Replaces the v1 approach of asking an LLM to both extract a date and derive
day-of-week/day-of-month/year from it (which produced internally inconsistent
results, e.g. offence_date "4 Nov 1834" alongside offence_day_of_month: 2).
Here the three derived fields are always read off a single parsed `date`
object, so they can never disagree with each other.
"""

import re
from dataclasses import dataclass
from datetime import date
from typing import Optional

MONTH_LOOKUP: dict[str, int] = {
    "jan": 1, "january": 1,
    "feb": 2, "february": 2,
    "mar": 3, "march": 3,
    "apr": 4, "april": 4,
    "may": 5,
    "jun": 6, "june": 6,
    "jul": 7, "july": 7,
    "aug": 8, "august": 8,
    "sep": 9, "sept": 9, "september": 9,
    "oct": 10, "october": 10,
    "nov": 11, "november": 11,
    "dec": 12, "december": 12,
}

# Matches "24 August 1802", "4 Nov 1834", "8 Jan 1809", "5 Feb 1887", etc.
_DATE_RE = re.compile(r"^\s*(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{4})\s*$")

_BRACKET_ANNOTATION_RE = re.compile(r"\[.*?\]")
_LETTER_DIGIT_BOUNDARY_RE = re.compile(r"([A-Za-z])(\d)")
# Many raw dates lead with the day of the week ("Sunday 19 July 1835") --
# stripped here rather than folded into _DATE_RE so that regex stays a pure
# "D Month YYYY" matcher. The day name itself is never trusted (day_of_week
# below is always recomputed from the parsed date, never read off this
# prefix), so a record whose stated weekday is wrong for its own date still
# parses correctly -- this only unblocks the day/month/year match.
_DAY_OF_WEEK_PREFIX_RE = re.compile(
    r"^(?:Mon|Tues?|Wed(?:nes)?|Thur?s?|Fri|Sat(?:ur)?|Sun)[A-Za-z]*\.?\s+", re.IGNORECASE
)


@dataclass(frozen=True)
class ParsedDate:
    iso_date: date
    day_of_week: str
    day_of_month: int
    year: int


def _clean(raw: str) -> str:
    """Strip archival annotations like '[sic]', a leading day-of-week
    ('Sunday 19 July 1835' -> '19 July 1835'), and fix 'Feb1887' -> 'Feb 1887'."""
    cleaned = _BRACKET_ANNOTATION_RE.sub("", raw)
    cleaned = _LETTER_DIGIT_BOUNDARY_RE.sub(r"\1 \2", cleaned)
    cleaned = " ".join(cleaned.split())
    cleaned = _DAY_OF_WEEK_PREFIX_RE.sub("", cleaned)
    return cleaned


def parse_historical_date(raw: Optional[str]) -> Optional[ParsedDate]:
    """Parse a single-day 'D Month YYYY' string into a ParsedDate.

    Returns None (never raises) for anything that isn't an unambiguous single
    day: date ranges ("14-18 May 1818"), month/year-only ("Oct 1888"),
    year-only ("1881"), or year ranges ("1872-1873"). The raw string should
    always be preserved alongside the (possibly-None) parsed result by the
    caller, so unparseable formats remain visible for later review rather
    than silently discarded.
    """
    if not raw:
        return None

    cleaned = _clean(raw)
    match = _DATE_RE.match(cleaned)
    if not match:
        return None

    day_str, month_str, year_str = match.groups()
    month = MONTH_LOOKUP.get(month_str.lower())
    if month is None:
        return None

    day = int(day_str)
    year = int(year_str)

    try:
        iso_date = date(year, month, day)
    except ValueError:
        return None

    return ParsedDate(
        iso_date=iso_date,
        day_of_week=iso_date.strftime("%A"),
        day_of_month=iso_date.day,
        year=iso_date.year,
    )
