"""Mocked tests for the provider adapters -- until now, extract_batch() had
been verified only via live (paid) API calls. These exercise the real
parsing/reconciliation path with a fake SDK client, no network or cost."""

from types import SimpleNamespace
from unittest.mock import MagicMock, patch

from qsrecords.llm.base import ExtractionError
from qsrecords.models.extraction_schema import ExtractionBatchInput

VALID_BATCH_JSON = (
    '{"records": [{"reference_number": "R1", "charge_description": "assault", '
    '"offence_types": ["assault"], "defendants": [{"first_name": "John", "last_name": "Smith"}], '
    '"overall_confidence": "high"}]}'
)


def _make_input(reference_number="R1"):
    return ExtractionBatchInput(
        raw_case_id=1,
        reference_number=reference_number,
        title="Summary conviction: John Smith",
        description="Summary conviction of John Smith for assault.",
        archive_url="https://example.org/1",
    )


def test_openai_provider_extract_batch_parses_real_response_shape():
    with patch("qsrecords.llm.openai_provider.OpenAI") as MockOpenAI:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = SimpleNamespace(
            choices=[SimpleNamespace(message=SimpleNamespace(content=VALID_BATCH_JSON))]
        )
        MockOpenAI.return_value = mock_client

        from qsrecords.llm.openai_provider import OpenAIProvider

        provider = OpenAIProvider(model="gpt-4o-2024-08-06")
        outcomes, raw_response = provider.extract_batch([_make_input()], ["assault"])

        assert raw_response == VALID_BATCH_JSON
        assert len(outcomes) == 1
        assert outcomes[0].reference_number == "R1"
        assert outcomes[0].defendants[0].last_name == "Smith"

        # response_format=json_object is what avoids the schema-complexity
        # wall -- assert the actual call shape, not just the parsed result.
        _, kwargs = mock_client.chat.completions.create.call_args
        assert kwargs["response_format"] == {"type": "json_object"}


def test_openai_provider_raises_on_empty_content():
    with patch("qsrecords.llm.openai_provider.OpenAI") as MockOpenAI:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = SimpleNamespace(
            choices=[SimpleNamespace(message=SimpleNamespace(content=None))]
        )
        MockOpenAI.return_value = mock_client

        from qsrecords.llm.openai_provider import OpenAIProvider

        provider = OpenAIProvider(model="gpt-4o-2024-08-06")
        try:
            provider.extract_batch([_make_input()], ["assault"])
            assert False, "expected RuntimeError"
        except RuntimeError:
            pass


def test_openai_provider_missing_record_becomes_extraction_error():
    with patch("qsrecords.llm.openai_provider.OpenAI") as MockOpenAI:
        mock_client = MagicMock()
        # Model was asked for R1 and R2 but only returns R1.
        mock_client.chat.completions.create.return_value = SimpleNamespace(
            choices=[SimpleNamespace(message=SimpleNamespace(content=VALID_BATCH_JSON))]
        )
        MockOpenAI.return_value = mock_client

        from qsrecords.llm.openai_provider import OpenAIProvider

        provider = OpenAIProvider(model="gpt-4o-2024-08-06")
        outcomes, _ = provider.extract_batch([_make_input("R1"), _make_input("R2")], ["assault"])

        assert outcomes[0].reference_number == "R1"
        assert isinstance(outcomes[1], ExtractionError)
        assert outcomes[1].reference_number == "R2"


def test_anthropic_provider_extract_batch_parses_real_response_shape():
    with patch("qsrecords.llm.anthropic_provider.Anthropic") as MockAnthropic:
        mock_client = MagicMock()
        mock_client.messages.create.return_value = SimpleNamespace(
            content=[SimpleNamespace(type="text", text=VALID_BATCH_JSON)]
        )
        MockAnthropic.return_value = mock_client

        from qsrecords.llm.anthropic_provider import AnthropicProvider

        provider = AnthropicProvider(model="claude-opus-4-8")
        outcomes, raw_response = provider.extract_batch([_make_input()], ["assault"])

        assert raw_response == VALID_BATCH_JSON
        assert outcomes[0].reference_number == "R1"

        # Assert the system prompt is sent with a cache_control breakpoint --
        # see qsrecords.llm.anthropic_provider's module comment on why.
        _, kwargs = mock_client.messages.create.call_args
        assert kwargs["system"][0]["cache_control"] == {"type": "ephemeral"}


def test_anthropic_provider_raises_on_no_text_content():
    with patch("qsrecords.llm.anthropic_provider.Anthropic") as MockAnthropic:
        mock_client = MagicMock()
        mock_client.messages.create.return_value = SimpleNamespace(content=[])
        MockAnthropic.return_value = mock_client

        from qsrecords.llm.anthropic_provider import AnthropicProvider

        provider = AnthropicProvider(model="claude-opus-4-8")
        try:
            provider.extract_batch([_make_input()], ["assault"])
            assert False, "expected RuntimeError"
        except RuntimeError:
            pass
