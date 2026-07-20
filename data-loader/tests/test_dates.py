from datetime import date

from qsrecords.dates import parse_historical_date


def test_parses_full_month_name():
    parsed = parse_historical_date("24 August 1802")
    assert parsed.iso_date == date(1802, 8, 24)
    assert parsed.day_of_month == 24
    assert parsed.year == 1802
    # 24 August 1802 was a Tuesday -- verified independently (not derived
    # from the function under test).
    assert parsed.day_of_week == "Tuesday"


def test_parses_abbreviated_month_name():
    parsed = parse_historical_date("4 Nov 1834")
    assert parsed.iso_date == date(1834, 11, 4)
    # These three fields are read off the same `iso_date`, so they can never
    # disagree with each other the way v1's LLM-derived fields sometimes did.
    assert parsed.day_of_month == 4
    assert parsed.year == 1834


def test_parses_single_digit_day():
    parsed = parse_historical_date("8 Jan 1809")
    assert parsed.iso_date == date(1809, 1, 8)


def test_strips_sic_annotation():
    parsed = parse_historical_date("3 Jan [sic] 1869")
    assert parsed.iso_date == date(1869, 1, 3)


def test_handles_missing_space_before_year():
    parsed = parse_historical_date("5 Feb1887")
    assert parsed.iso_date == date(1887, 2, 5)


def test_returns_none_for_date_range():
    assert parse_historical_date("14-18 May 1818") is None


def test_returns_none_for_month_year_only():
    assert parse_historical_date("Oct 1888") is None


def test_returns_none_for_year_only():
    assert parse_historical_date("1881") is None


def test_returns_none_for_year_range():
    assert parse_historical_date("1872-1873") is None


def test_returns_none_for_empty_or_none():
    assert parse_historical_date("") is None
    assert parse_historical_date(None) is None


def test_returns_none_for_invalid_month_name():
    assert parse_historical_date("24 Foo 1802") is None


def test_returns_none_for_impossible_calendar_date():
    assert parse_historical_date("31 Feb 1850") is None
