from qsrecords.text import (
    fix_run_on_spacing,
    is_summary_conviction_row,
    iter_run_on_boundaries,
    normalize_key,
    normalize_name,
)


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


def test_fix_run_on_spacing_inserts_period_space_at_lowercase_uppercase_boundary():
    assert fix_run_on_spacing("himselfOffence") == "himself. Offence"


def test_fix_run_on_spacing_inserts_period_space_at_digit_uppercase_boundary():
    assert fix_run_on_spacing("on 20 May 1881Whitby Strand") == "on 20 May 1881. Whitby Strand"


def test_fix_run_on_spacing_fixes_full_documented_example():
    original = (
        "not giving a good account of himselfOffence committed at the "
        "township of Ellerby on 20 May 1881Whitby Strand Petty Sessional "
        "division - case heard at Whitby"
    )
    expected = (
        "not giving a good account of himself. Offence committed at the "
        "township of Ellerby on 20 May 1881. Whitby Strand Petty Sessional "
        "division - case heard at Whitby"
    )
    assert fix_run_on_spacing(original) == expected


def test_fix_run_on_spacing_noop_when_already_period_space_separated():
    text = "not giving a good account of himself. Offence committed at Ellerby."
    assert fix_run_on_spacing(text) == text


def test_fix_run_on_spacing_noop_on_dash_separated_seam():
    text = "Whitby Strand Petty Sessional division - case heard at Whitby"
    assert fix_run_on_spacing(text) == text


def test_fix_run_on_spacing_does_not_touch_mc_surname():
    assert fix_run_on_spacing("convicted James McDonald of theft") == "convicted James McDonald of theft"


def test_fix_run_on_spacing_does_not_touch_mac_surname():
    assert fix_run_on_spacing("convicted James MacGuire of theft") == "convicted James MacGuire of theft"


def test_fix_run_on_spacing_does_not_touch_apostrophe_name():
    assert fix_run_on_spacing("convicted James O'Brien of theft") == "convicted James O'Brien of theft"


def test_fix_run_on_spacing_handles_none_and_empty():
    assert fix_run_on_spacing(None) is None
    assert fix_run_on_spacing("") == ""


def test_fix_run_on_spacing_idempotent_on_second_pass():
    original = "himselfOffence committed at Ellerby on 20 May 1881Whitby Strand"
    once = fix_run_on_spacing(original)
    twice = fix_run_on_spacing(once)
    assert once == twice


def test_fix_run_on_spacing_handles_double_boundary_in_one_string():
    assert fix_run_on_spacing("aBcD") == "a. Bc. D"


def test_iter_run_on_boundaries_finds_matches():
    matches = iter_run_on_boundaries("himselfOffence")
    assert len(matches) == 1
    assert matches[0].group(0) == "fO"


def test_iter_run_on_boundaries_handles_none():
    assert iter_run_on_boundaries(None) == []
