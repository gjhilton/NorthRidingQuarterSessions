# python3 -m pytest test_analyse_module.py

import pytest
from analyse_module import analyse

@pytest.mark.parametrize(
    "input_string, expected_output",
    [
        ("Summary conviction of William Waters of the township of Whitby jet worker for being drunk and riotous in BaxtergateOffence committed at the township of Whitby on 16 March 1873. Whitby Strand - case heard at Whitby", {"input_length": 213}),
        ]
)
def test_analyse(input_string, expected_output):
    assert analyse(input_string) == expected_output