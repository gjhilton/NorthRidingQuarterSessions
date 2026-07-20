"""Pluggable LLM extraction provider interface.

Runtime-selectable (CLI flag / env var — see qsrecords.llm.factory), not
hardcoded, per the project's stated requirement.

Both providers ask the model for plain JSON text (rather than relying on
vendor-enforced schema-constrained decoding) and validate the response with
Pydantic afterwards. This wasn't the original design -- both vendors offer
native structured-output modes that constrain generation to a JSON schema,
which is what was tried first. Anthropic's `output_format=` rejected our
schema live with "Schema is too complex": vendor structured-output features
compile the schema into a token-level grammar, and ExtractionBatchOutput's
nesting (batch -> record -> defendant/involved_person, each with many
nullable fields) exceeded that grammar's size limit. Since OpenAI's
`response_format=json_schema` strict mode compiles a schema the same shape
against a similarly-strict internal limit, both providers use this looser
"ask for JSON, validate after" approach for consistency rather than leaving
one provider on a native mode that works today but may hit the same wall.
"""

import json
from typing import Protocol, Sequence, Union

from pydantic import BaseModel

from qsrecords.models.extraction_schema import (
    ExtractedRecord,
    ExtractionBatchInput,
    ExtractionBatchOutput,
)

SYSTEM_PROMPT = """You are an assistant that extracts structured data from historical \
English Quarter Sessions summary conviction records (18th-19th century).

For each record given, return one entry in `records` with:
- reference_number: echoed back EXACTLY as given, so it can be matched back up.
- offence_date_raw: the date the OFFENCE was committed, as a short raw string \
exactly as it appears in the text (e.g. "16 June 1864"). Do NOT compute the day \
of week, day of month, or year yourself -- only extract the raw date text.
- offence_type: pick the closest matching category from this list, or propose a \
new short, canonical, lowercase, singular category if none fit: {offence_types}. \
NEVER return "summary conviction" or the record title as the offence_type -- that \
is not an offence category.
- charge_description, sentencing, offence_time, offence_town, offence_street, \
court_location_town, defendants, involved_persons: extracted as described in the \
schema. Leave a field null/empty if the information isn't present in the text -- \
do not guess or hallucinate.

If a record is missing from the input, do not invent one. Return exactly one \
entry per input record, matched by reference_number.

Respond with ONLY a single JSON object matching this JSON Schema -- no markdown \
code fences, no explanation, no text before or after the JSON:

{json_schema}"""


def build_system_prompt(offence_types: Sequence[str]) -> str:
    schema = json.dumps(ExtractionBatchOutput.model_json_schema())
    return SYSTEM_PROMPT.format(offence_types=", ".join(offence_types), json_schema=schema)


def parse_batch_response(text: str) -> ExtractionBatchOutput:
    """Parse+validate a model's raw text response into ExtractionBatchOutput.

    Defensively strips markdown code fences in case a model wraps its JSON
    despite being told not to. Raises (json.JSONDecodeError or
    pydantic.ValidationError) on anything unparseable -- callers treat that
    as a whole-batch transport-level failure, same as a network error.
    """
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.startswith("json"):
            cleaned = cleaned[len("json"):]
        cleaned = cleaned.strip()
    return ExtractionBatchOutput.model_validate(json.loads(cleaned))


class ExtractionError(BaseModel):
    reference_number: str
    error_message: str


ExtractionOutcome = Union[ExtractedRecord, ExtractionError]


class ExtractionProvider(Protocol):
    name: str
    model: str

    def extract_batch(
        self, records: Sequence[ExtractionBatchInput]
    ) -> list[ExtractionOutcome]:
        """Extract structured data for a batch of records.

        Returns exactly one outcome per input record (matched by
        reference_number, not position). Raises only on transport-level
        failure (auth/network/rate-limit/refusal) -- per-record content
        problems (e.g. a record the model couldn't make sense of) should
        become an ExtractionError entry, not an exception.
        """
        ...


def build_batch_prompt(records: Sequence[ExtractionBatchInput]) -> str:
    lines = []
    for record in records:
        lines.append(
            f"reference_number: {record.reference_number}\n"
            f"title: {record.title}\n"
            f"description: {record.description}\n"
        )
    return "\n---\n".join(lines)


def reconcile_batch_output(
    records: Sequence[ExtractionBatchInput], extracted_records: list[ExtractedRecord]
) -> list[ExtractionOutcome]:
    """Match extracted records back to inputs by reference_number.

    Any input record with no matching output (dropped/never returned by the
    model) becomes an ExtractionError, rather than silently vanishing.
    """
    by_reference = {r.reference_number: r for r in extracted_records}
    outcomes: list[ExtractionOutcome] = []
    for record in records:
        matched = by_reference.get(record.reference_number)
        if matched is None:
            outcomes.append(
                ExtractionError(
                    reference_number=record.reference_number,
                    error_message="Model did not return a record for this reference_number.",
                )
            )
        else:
            outcomes.append(matched)
    return outcomes
