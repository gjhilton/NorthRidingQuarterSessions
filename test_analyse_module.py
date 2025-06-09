# python3 -m pytest test_analyse_module.py

import pytest
from analyse_module import analyse

@pytest.mark.parametrize(
    "input_string, expected_output",
    [
        ("Hello, world!", {"input_length": 13, "first_character": "H"}),
        ("", {"input_length": 0, "first_character": None}),
        ("want", {"input_length": 4, "first_character": "9"}),
        ("12345", {"input_length": 5, "first_character": "1"}),
    ]
)
def test_analyse(input_string, expected_output):
    assert analyse(input_string) == expected_output