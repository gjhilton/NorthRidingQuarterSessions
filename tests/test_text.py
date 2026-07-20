from qsrecords.text import is_summary_conviction_row, normalize_key, normalize_name


def test_matches_on_description_when_title_has_typo():
    # Real record QSB 1885 3/10/11/12: title drops the word "conviction" but
    # the description still has it correctly.
    title = "Summary John Backhouse of Whitby"
    description = "Summary conviction of John Backhouse of Whitby for..."
    assert is_summary_conviction_row(title, description) is True


def test_does_not_match_lowercase_plural_bundle_description():
    # Bundle-level rows describe "summary convictions" (lowercase, plural) in
    # prose without being an individual conviction record themselves.
    title = "Quarter Sessions Bundle"
    description = "This bundle contains records of summary convictions for the area."
    assert is_summary_conviction_row(title, description) is False


def test_matches_exact_case_sensitive_marker():
    assert is_summary_conviction_row("Summary conviction: John Smith", "") is True


def test_normalize_key_collapses_case_and_whitespace():
    assert normalize_key("Whitby") == "whitby"
    assert normalize_key("  Whitby  ") == "whitby"
    assert normalize_key("New   Malton") == "new malton"


def test_normalize_name_joins_and_normalizes():
    assert normalize_name("John", "Smith") == "john smith"
    assert normalize_name("JOHN", "  Smith ") == "john smith"


def test_normalize_name_handles_missing_parts():
    assert normalize_name(None, "Smith") == "smith"
    assert normalize_name("John", None) == "john"
