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
is not an offence category. Only pick a category if the text actually supports its \
defining criteria -- e.g. "illegal gambling" requires the text to mention stakes, \
wagering, or a betting game (like pitch and toss); a game with no mention of \
betting is not gambling just because another record in this batch is. If nothing \
in the list genuinely fits, propose a new category rather than stretching an \
existing one to cover it.
- charge_description, sentencing, offence_time, offence_town, offence_street, \
court_location_town, defendants, involved_persons: extracted as described in the \
schema. Leave a field null/empty if the information isn't present in the text -- \
do not guess or hallucinate. court_location_town specifically: only fill this in \
if the text contains an explicit statement of where the case was heard (e.g. \
"Case heard at Whitby", "case heard in the division of X"). Do not default to \
Whitby, to the offence_town, or to the court town of other records in this same \
batch -- a record with no such statement gets court_location_town: null, even if \
every other record in the batch was heard at the same place.
- petty_sessional_division: the named historic administrative division/wapentake \
the case was heard under, if stated (e.g. "Whitby Strand", "Ryedale") -- just the \
name, not the words "Petty Sessional division" or "wapentake" themselves. This is \
distinct from court_location_town.
- monetary_value_raw: for theft or damage offences only, the raw value/worth \
exactly as stated (e.g. "value 6d", "one-shillingsworth", "value of 1s"). Null if \
no amount is given.
- game_species: for poaching-type offences only, the SPECIFIC species mentioned \
exactly as written (e.g. "conies", "salmon", "pheasant", "hares"). The generic \
legal term "game" on its own, with no species named, is NOT a species -- leave \
game_species null in that case rather than writing "game". Null for every other \
offence type too.
- For each defendant and involved person -- age: ONLY if an exact age in years is \
explicitly stated (e.g. "aged 11 years"). Never estimate or infer an age from \
occupation, relationships, or any other context.
- For each defendant and involved person -- marital_status: only if stated or \
directly implied by a specific term in the text ("singlewoman"/"spinster" -> \
single, "widow"/"widower" -> widowed, "wife of"/"husband of" -> married). Leave \
null otherwise -- do not infer marital status from a surname or from context alone.
- For each defendant and involved person -- relationship_type and related_to_name: \
if this person is identified in relation to another named person, capture the \
relationship term the text itself uses (e.g. "wife", "husband", "widow", "son", \
"daughter", "stepson", "servant", "master", "employer", "apprentice" -- use \
whatever term appears, do not force it into this list) plus the other person's \
name in related_to_name. Both null if no such relationship is stated.
- overall_confidence: "high" if the text was clear throughout, "medium" if one or \
two fields were uncertain (damaged text, ambiguous handwriting transcription, an \
inference rather than something stated outright), "low" if you had to guess at \
multiple fields or the record as a whole is hard to make sense of. Be honest and \
critical here -- this is read by a human deciding which records to double-check \
against the original source, so it is more useful wrong in the direction of \
under- than over-confidence.
- uncertain_fields: list the specific field names behind a "medium" or "low" \
overall_confidence (e.g. "offence_date_raw", "defendants[0].occupation"). Leave \
empty for "high" confidence.

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
        self, records: Sequence[ExtractionBatchInput], offence_types: Sequence[str]
    ) -> tuple[list[ExtractionOutcome], str]:
        """Extract structured data for a batch of records.

        offence_types is the full current candidate list (seeded +
        previously-proposed -- see offence_types.list_offence_type_names),
        not the static seed list, so the model can reuse a category an
        earlier batch proposed instead of re-proposing a near-duplicate or
        force-fitting into an unrelated seeded one.

        Returns (outcomes, raw_response_text): exactly one outcome per input
        record (matched by reference_number, not position), plus the full
        raw text the model returned for this call -- stored verbatim on
        every ExtractionAttempt row for this batch (success or failure) so a
        bad response can be debugged without re-calling the LLM. Raises only
        on transport-level failure (auth/network/rate-limit/refusal) --
        per-record content problems (e.g. a record the model couldn't make
        sense of) should become an ExtractionError entry, not an exception.
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
