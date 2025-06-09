# python3 -m pytest test_analyse_module.py

import pytest
from analyse_module import analyse

@pytest.mark.parametrize(
    "input_string, expected_output",
    [
        ("Hello, world!", {"input_length": 13}),
        ("", {"input_length": 0}),
        ("Wang", {"input_length": 4}),
        ("12345", {"input_length": 5}),
    ]
)
def test_analyse(input_string, expected_output):
    assert analyse(input_string) == expected_output