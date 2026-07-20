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
    ) -> tuple[list[ExtractionOutcome], str]:
        system_prompt = build_system_prompt(SEED_OFFENCE_TYPES)
        # Plain text completion, not output_format= -- see qsrecords.llm.base
        # module docstring: Anthropic's schema-constrained decoding rejected
        # this schema live with "Schema is too complex" (grammar-size limit).
        #
        # cache_control marks this (identical-every-call) system prompt as
        # cacheable. NOTE: as of this writing the prompt is ~2,000 tokens,
        # below Anthropic's documented 4,096-token minimum cacheable prefix
        # for Opus-tier models -- so with the default claude-opus-4-8 this
        # currently has no effect (no error, just no cache hit). It's a
        # no-cost no-op today and starts paying off if the prompt grows past
        # that threshold, or against a model with a lower minimum.
        message = self._client.messages.create(
            model=self.model,
            max_tokens=MAX_TOKENS,
            system=[
                {
                    "type": "text",
                    "text": system_prompt,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[{"role": "user", "content": build_batch_prompt(records)}],
        )
        text_blocks = [block.text for block in message.content if block.type == "text"]
        if not text_blocks:
            raise RuntimeError("Anthropic returned no text content.")

        raw_text = "".join(text_blocks)
        parsed = parse_batch_response(raw_text)
        return reconcile_batch_output(records, parsed.records), raw_text
