import pytest

from qsrecords.llm.base import build_system_prompt, parse_batch_response
from qsrecords.models.extraction_schema import ExtractionBatchOutput


def _minimal_valid_json():
    return (
        '{"records": [{"reference_number": "R1", "charge_description": "c", '
        '"offence_type": "assault", "defendants": [], "overall_confidence": "high"}]}'
    )


def test_parse_batch_response_parses_clean_json():
    result = parse_batch_response(_minimal_valid_json())
    assert isinstance(result, ExtractionBatchOutput)
    assert result.records[0].reference_number == "R1"


def test_parse_batch_response_strips_json_fenced_markdown():
    fenced = f"```json\n{_minimal_valid_json()}\n```"
    result = parse_batch_response(fenced)
    assert result.records[0].reference_number == "R1"


def test_parse_batch_response_strips_bare_fenced_markdown():
    fenced = f"```\n{_minimal_valid_json()}\n```"
    result = parse_batch_response(fenced)
    assert result.records[0].reference_number == "R1"


def test_parse_batch_response_tolerates_surrounding_whitespace():
    result = parse_batch_response(f"\n\n  {_minimal_valid_json()}  \n")
    assert result.records[0].reference_number == "R1"


def test_parse_batch_response_raises_on_malformed_json():
    with pytest.raises(Exception):
        parse_batch_response("not json at all")


def test_parse_batch_response_raises_on_valid_json_wrong_shape():
    # Valid JSON, but doesn't match ExtractionBatchOutput's schema.
    with pytest.raises(Exception):
        parse_batch_response('{"unexpected": "shape"}')


def test_build_system_prompt_embeds_offence_types_and_schema():
    prompt = build_system_prompt(["drunkenness", "poaching"])
    assert "drunkenness" in prompt
    assert "poaching" in prompt
    # The JSON schema for ExtractionBatchOutput should be embedded verbatim
    # so the model can see the exact shape it's asked to produce.
    assert "reference_number" in prompt
    assert "defendants" in prompt
