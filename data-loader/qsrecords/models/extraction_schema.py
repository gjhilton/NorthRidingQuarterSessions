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
    age: Optional[int] = Field(
        default=None,
        description="Only if an exact age in years is explicitly stated (e.g. "
        "'aged 11 years'). Do not estimate or infer from occupation/context.",
    )
    marital_status: Optional[Literal["single", "married", "widowed"]] = Field(
        default=None,
        description="Only if stated or directly implied by a term in the text "
        "(e.g. 'singlewoman'/'spinster' -> single, 'widow'/'widower' -> widowed, "
        "'wife of'/'husband of' -> married). Leave null if not indicated.",
    )
    relationship_type: Optional[str] = Field(
        default=None,
        description="If this person is identified in relation to another named "
        "person, the relationship term the text uses -- e.g. 'wife', 'husband', "
        "'widow', 'son', 'daughter', 'stepson', 'servant', 'master', 'employer', "
        "'apprentice'. Use whatever term the source actually uses, don't force it "
        "into a fixed list. Pair with related_to_name.",
    )
    related_to_name: Optional[str] = Field(
        default=None,
        description="The name of the person relationship_type is relative to "
        "(e.g. 'Thomas Castello' for relationship_type='wife'). Null if "
        "relationship_type is null.",
    )
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
    age: Optional[int] = Field(
        default=None,
        description="Only if an exact age in years is explicitly stated. Do not "
        "estimate or infer.",
    )
    marital_status: Optional[Literal["single", "married", "widowed"]] = Field(
        default=None,
        description="Same rules as ExtractedDefendant.marital_status.",
    )
    relationship_type: Optional[str] = Field(
        default=None,
        description="Same rules as ExtractedDefendant.relationship_type.",
    )
    related_to_name: Optional[str] = Field(
        default=None,
        description="Same rules as ExtractedDefendant.related_to_name.",
    )
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
    petty_sessional_division: Optional[str] = Field(
        default=None,
        description="The named historic administrative division/wapentake the "
        "case was heard under (e.g. 'Whitby Strand', 'Ryedale') -- just the "
        "name itself, not the words 'Petty Sessional division' or 'wapentake'. "
        "Distinct from court_location_town (the specific town).",
    )
    monetary_value_raw: Optional[str] = Field(
        default=None,
        description="The raw value/worth stated for stolen or damaged property, "
        "exactly as written (e.g. 'value 6d', 'one-shillingsworth', 'value of "
        "1s'). Only for theft/damage offences where an amount is explicitly "
        "given -- do not compute or convert it.",
    )
    game_species: Optional[str] = Field(
        default=None,
        description="For poaching-type offences only: the specific SPECIES "
        "mentioned, exactly as written (e.g. 'conies', 'salmon', 'pheasant', "
        "'hares'). The generic legal term 'game' alone, with no species named, "
        "is not a species -- leave this null in that case. Null for all other "
        "offence types too.",
    )
    defendants: list[ExtractedDefendant]
    involved_persons: list[ExtractedInvolvedPerson] = Field(default_factory=list)

    overall_confidence: Literal["high", "medium", "low"] = Field(
        description="Your overall confidence in this extraction. Use 'low' if "
        "the source text was ambiguous, damaged/illegible, or you had to guess "
        "at multiple fields; 'medium' if one or two fields were uncertain; "
        "'high' if the text was clear throughout."
    )
    uncertain_fields: list[str] = Field(
        default_factory=list,
        description="Names of the specific fields you were not confident about, "
        "if any -- e.g. 'offence_date_raw', 'sentencing', 'defendants[0].occupation'. "
        "Empty if overall_confidence is 'high'.",
    )
    correction_note: Optional[str] = Field(
        default=None,
        description="Different from uncertain_fields, which is for 'I'm not "
        "sure about this'. This is for the rarer case where the text states "
        "something you are confident is actually wrong, and you've recorded "
        "the corrected value instead of extracting it literally -- e.g. an "
        "internal contradiction within this one record (a person described "
        "as both someone's current wife and a widow in the same sentence). "
        "Only use this with a specific, well-evidenced reason you can state "
        "in the note itself (what the text said, and why you believe it's "
        "wrong) -- not a general hunch. You are extracting one record in "
        "isolation and can't see the rest of the archive, so do not use this "
        "for 'this seems unusual compared to what I'd expect' -- that's what "
        "uncertain_fields is for. Leave null in every other case.",
    )

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
