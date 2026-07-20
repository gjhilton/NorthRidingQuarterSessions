"""LLM wire contract — deliberately NOT 1:1 with the normalized DB schema.

This is the schema handed to OpenAI/Anthropic as a structured-output target.
It excludes every field that v1 asked the LLM to produce and got wrong:

- `conviction_date` isn't here at all — it's already clean in whitby.csv's
  document_date column and is parsed deterministically in csv_ingest/mapping.
- `offence_day_of_week`, `offence_day_of_month`, `offence_year` aren't here
  either — they're derived in Python from the single parsed `offence_date`,
  so they can never be mutually inconsistent (a real v1 bug: offence_date
  "4 Nov 1834" alongside a day-of-month of 2).

Town/street/offence_type are extracted as free strings (not FK ids) — the
mapping layer (qsrecords.mapping) is what turns these into normalized rows.
"""

from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator


class ExtractionBatchInput(BaseModel):
    """One outbound record sent to the LLM. No conviction_date/document_date_raw."""

    raw_case_id: int
    reference_number: str
    title: str
    description: str
    archive_url: str


class ExtractedDefendant(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    sex: Optional[Literal["male", "female"]] = None
    occupation: Optional[str] = None
    relationships_and_details: Optional[str] = None
    prior_convictions: Optional[str] = None
    town: Optional[str] = None
    street: Optional[str] = None
    aliases: list[str] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def blank_strings_to_none(cls, data):
        return _blank_strings_to_none(data)


class ExtractedInvolvedPerson(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    occupation: Optional[str] = None
    relationships_and_details: Optional[str] = None
    role: Optional[str] = None
    town: Optional[str] = None
    street: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def blank_strings_to_none(cls, data):
        return _blank_strings_to_none(data)


class ExtractedRecord(BaseModel):
    # Echoed back verbatim — the join key back to RawCase/ExtractionBatchInput.
    # Matching is done by this value, never by list position (a model can
    # drop or reorder items in a batch response).
    reference_number: str

    offence_date_raw: Optional[str] = None
    offence_time: Optional[str] = None
    charge_description: str
    sentencing: Optional[str] = None
    offence_type: str
    offence_town: Optional[str] = None
    offence_street: Optional[str] = None
    court_location_town: Optional[str] = None
    defendants: list[ExtractedDefendant]
    involved_persons: list[ExtractedInvolvedPerson] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def blank_strings_to_none(cls, data):
        return _blank_strings_to_none(data)


class ExtractionBatchOutput(BaseModel):
    records: list[ExtractedRecord]


def _blank_strings_to_none(data):
    """Coerce "" -> None for scalar string fields, regardless of which model
    emitted the batch. Fixes v1's inconsistent-null-convention bug, where
    some records used null for missing optionals and others used ""/[]."""
    if not isinstance(data, dict):
        return data
    return {
        key: (None if isinstance(value, str) and value.strip() == "" else value)
        for key, value in data.items()
    }
