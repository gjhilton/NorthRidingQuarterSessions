import os
from typing import Sequence

from openai import OpenAI

from qsrecords.llm.base import (
    ExtractionOutcome,
    build_batch_prompt,
    build_system_prompt,
    parse_batch_response,
    reconcile_batch_output,
)
from qsrecords.models.extraction_schema import ExtractionBatchInput
from qsrecords.offence_types import SEED_OFFENCE_TYPES


class OpenAIProvider:
    name = "openai"

    def __init__(self, model: str):
        self.model = model
        # OPENAI_KEY is the legacy env var name v1's script used; fall back to
        # it if the SDK's standard OPENAI_API_KEY isn't set.
        api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_KEY")
        self._client = OpenAI(api_key=api_key)

    def extract_batch(
        self, records: Sequence[ExtractionBatchInput]
    ) -> list[ExtractionOutcome]:
        system_prompt = build_system_prompt(SEED_OFFENCE_TYPES)
        completion = self._client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": build_batch_prompt(records)},
            ],
            # Plain JSON mode (syntax-valid JSON only, no schema enforcement)
            # -- see qsrecords.llm.base module docstring for why this is used
            # instead of response_format=json_schema strict mode.
            response_format={"type": "json_object"},
        )
        content = completion.choices[0].message.content
        if not content:
            raise RuntimeError("OpenAI returned an empty response.")

        parsed = parse_batch_response(content)
        return reconcile_batch_output(records, parsed.records)
