import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from text_cleanup import fix_run_on_spacing


def test_inserts_period_space_at_lowercase_uppercase_boundary():
    assert fix_run_on_spacing("himselfOffence") == "himself. Offence"


def test_inserts_period_space_at_digit_uppercase_boundary():
    assert fix_run_on_spacing("on 20 May 1881Whitby Strand") == "on 20 May 1881. Whitby Strand"


def test_fixes_full_documented_example():
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


def test_noop_when_already_period_space_separated():
    text = "not giving a good account of himself. Offence committed at Ellerby."
    assert fix_run_on_spacing(text) == text


def test_noop_on_dash_separated_seam():
    text = "Whitby Strand Petty Sessional division - case heard at Whitby"
    assert fix_run_on_spacing(text) == text


def test_does_not_touch_mc_surname():
    assert fix_run_on_spacing("convicted James McDonald of theft") == "convicted James McDonald of theft"


def test_does_not_touch_mac_surname():
    assert fix_run_on_spacing("convicted James MacGuire of theft") == "convicted James MacGuire of theft"


def test_does_not_touch_apostrophe_name():
    assert fix_run_on_spacing("convicted James O'Brien of theft") == "convicted James O'Brien of theft"


def test_handles_none_and_empty():
    assert fix_run_on_spacing(None) is None
    assert fix_run_on_spacing("") == ""


def test_idempotent_on_second_pass():
    original = "himselfOffence committed at Ellerby on 20 May 1881Whitby Strand"
    once = fix_run_on_spacing(original)
    twice = fix_run_on_spacing(once)
    assert once == twice


def test_double_boundary_in_one_string():
    assert fix_run_on_spacing("aBcD") == "a. Bc. D"
