from typing import Sequence

from anthropic import Anthropic

from qsrecords.llm.base import (
    ExtractionOutcome,
    build_batch_prompt,
    build_system_prompt,
    parse_batch_response,
    reconcile_batch_output,
)
from qsrecords.models.extraction_schema import ExtractionBatchInput
from qsrecords.offence_types import SEED_OFFENCE_TYPES

MAX_TOKENS = 8192


class AnthropicProvider:
    name = "anthropic"

    def __init__(self, model: str):
        self.model = model
        self._client = Anthropic()

    def extract_batch(
        self, records: Sequence[ExtractionBatchInput]
    ) -> list[ExtractionOutcome]:
        system_prompt = build_system_prompt(SEED_OFFENCE_TYPES)
        # Plain text completion, not output_format= -- see qsrecords.llm.base
        # module docstring: Anthropic's schema-constrained decoding rejected
        # this schema live with "Schema is too complex" (grammar-size limit).
        message = self._client.messages.create(
            model=self.model,
            max_tokens=MAX_TOKENS,
            system=system_prompt,
            messages=[{"role": "user", "content": build_batch_prompt(records)}],
        )
        text_blocks = [block.text for block in message.content if block.type == "text"]
        if not text_blocks:
            raise RuntimeError("Anthropic returned no text content.")

        parsed = parse_batch_response("".join(text_blocks))
        return reconcile_batch_output(records, parsed.records)
