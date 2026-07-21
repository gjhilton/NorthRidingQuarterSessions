"""Normalized ERD tables (see court-records-erd.md).

Field names match the ERD (relationships_and_details), fixing v1's drift to
"other_details" in the extraction Pydantic schema. Derived date fields
(offence_day_of_week/day_of_month/year) are always computed in Python from a
single parsed date (see qsrecords.dates) and never sourced from the LLM.
"""

from datetime import date
from typing import Optional

from sqlalchemy import CheckConstraint
from sqlmodel import Field, SQLModel


class SummaryConviction(SQLModel, table=True):
    __tablename__ = "summary_conviction"

    id: Optional[int] = Field(default=None, primary_key=True)
    raw_case_id: int = Field(foreign_key="raw_case.id", unique=True, index=True)
    reference_number: str = Field(index=True)

    conviction_date: Optional[date] = None
    conviction_date_raw: str
    offence_date: Optional[date] = None
    offence_date_raw: Optional[str] = None

    # Derived from offence_date's single parsed `date` object — never LLM output.
    offence_day_of_week: Optional[str] = None
    offence_day_of_month: Optional[int] = None
    offence_year: Optional[int] = None
    offence_time: Optional[str] = None

    charge_description: str
    sentencing: Optional[str] = None
    raw_record: str

    offence_location_town_id: Optional[int] = Field(default=None, foreign_key="town.id")
    offence_location_street_id: Optional[int] = Field(default=None, foreign_key="street.id")
    court_location_town_id: Optional[int] = Field(default=None, foreign_key="town.id")
    archive_url: str

    # Self-reported by the LLM at extraction time (see
    # qsrecords.models.extraction_schema.ExtractedRecord) -- not a measure of
    # correctness, just the model's own signal about which records/fields
    # deserve a second look before being relied on.
    extraction_confidence: Optional[str] = None
    uncertain_fields: Optional[str] = None  # comma-separated field names, or None

    petty_sessional_division_id: Optional[int] = Field(
        default=None, foreign_key="petty_sessional_division.id"
    )
    monetary_value_raw: Optional[str] = None  # e.g. "value 6d", "one-shillingsworth"
    game_species: Optional[str] = None  # poaching offences only, e.g. "conies", "salmon"

    # Different from uncertain_fields: uncertain_fields flags "I'm not sure
    # about this", correction_note is for "the text explicitly says X, I'm
    # confident X is wrong, and I've recorded Y instead" -- e.g. an
    # offence_town that contradicts a street name attested nowhere else in
    # the corpus except that one town. Always explains what the source said
    # and why it was overridden, so the departure from a literal reading is
    # never silent. Rare by design -- most apparent contradictions should
    # just be extracted literally and flagged via uncertain_fields instead.
    correction_note: Optional[str] = None

    # Self-reported by the LLM/human extractor (see ExtractedRecord.of_especial_interest)
    # -- flags unusually colourful or notable cases for surfacing on the homepage.
    of_especial_interest: bool = Field(default=False)


class Defendant(SQLModel, table=True):
    __tablename__ = "defendant"

    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    sex: Optional[str] = None
    age: Optional[int] = None
    marital_status: Optional[str] = None
    relationship_type: Optional[str] = None  # e.g. "wife", "servant" -- pairs with related_to_name
    related_to_name: Optional[str] = None
    occupation: Optional[str] = None
    relationships_and_details: Optional[str] = None
    prior_convictions: Optional[str] = None
    town_id: Optional[int] = Field(default=None, foreign_key="town.id")
    street_id: Optional[int] = Field(default=None, foreign_key="street.id")
    # Normalized "first last" key — retrieval hook for "every mention of this
    # name", NOT a merge/dedup key. See models/reference.py docstring for the
    # analogous-but-different Town/Street/OffenceType dedup behavior.
    name_key: str = Field(index=True)


class Alias(SQLModel, table=True):
    __tablename__ = "alias"

    id: Optional[int] = Field(default=None, primary_key=True)
    defendant_id: int = Field(foreign_key="defendant.id", index=True)
    alias_name: str


class Person(SQLModel, table=True):
    __tablename__ = "person"

    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = None
    marital_status: Optional[str] = None
    relationship_type: Optional[str] = None
    related_to_name: Optional[str] = None
    occupation: Optional[str] = None
    relationships_and_details: Optional[str] = None
    town_id: Optional[int] = Field(default=None, foreign_key="town.id")
    street_id: Optional[int] = Field(default=None, foreign_key="street.id")
    name_key: str = Field(index=True)


class SummaryConvictionDefendant(SQLModel, table=True):
    __tablename__ = "summary_conviction_defendant"

    summary_conviction_id: int = Field(foreign_key="summary_conviction.id", primary_key=True)
    defendant_id: int = Field(foreign_key="defendant.id", primary_key=True)


class SummaryConvictionOffenceType(SQLModel, table=True):
    """Many-to-many: a conviction is usually one offence, but occasionally
    charges two genuinely distinct offences at once (e.g. "assaulting and
    resisting a constable" = assault + resisting a constable)."""

    __tablename__ = "summary_conviction_offence_type"

    summary_conviction_id: int = Field(foreign_key="summary_conviction.id", primary_key=True)
    offence_type_id: int = Field(foreign_key="offence_type.id", primary_key=True)


class InvolvedPerson(SQLModel, table=True):
    __tablename__ = "involved_persons"

    id: Optional[int] = Field(default=None, primary_key=True)  # surrogate PK: role may be null
    summary_conviction_id: int = Field(foreign_key="summary_conviction.id", index=True)
    person_id: int = Field(foreign_key="person.id", index=True)
    role: Optional[str] = None


class RelatedConviction(SQLModel, table=True):
    """Self-referential link: two convictions judged to stem from the same
    underlying event -- one arrest producing several same-day charges
    against one defendant, a mutual assault charged from both sides, a
    group incident (joint theft, poaching trip, riot) producing several
    convictions. Informal by design: built from patterns noticed reading
    records or detected heuristically (see qsrecords.related_convictions),
    not a formal legal grouping -- `note` always explains the basis for
    the link so it can be judged, not just trusted.

    Conceptually symmetric (A relates to B same as B relates to A) but
    stored as one row per pair with the lower id first, enforced by the
    CHECK constraint, so a pair is never stored twice in both directions.
    Always go through qsrecords.related_convictions.link_convictions()
    rather than constructing this directly, since it does that ordering."""

    __tablename__ = "related_conviction"
    __table_args__ = (CheckConstraint("summary_conviction_id_a < summary_conviction_id_b"),)

    summary_conviction_id_a: int = Field(foreign_key="summary_conviction.id", primary_key=True)
    summary_conviction_id_b: int = Field(foreign_key="summary_conviction.id", primary_key=True)
    note: Optional[str] = None
