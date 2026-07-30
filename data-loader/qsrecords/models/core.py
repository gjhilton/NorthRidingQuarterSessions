"""Normalized ERD tables -- v3 unified schema (see the schema redesign
plan for the full reasoning behind every field: originally at
/Users/gjh/.claude/plans/humming-painting-pearl.md, and
court-records-erd.md for the current diagram).

The single biggest structural change from v2: `defendant` and `person`
were the same kind of thing -- a human named in a record -- artificially
split into two tables because "defendant" was modelled as a different
*kind* of entity instead of a *role* on a conviction. They're merged here
into one `Person` table; "defendant" is now just a `role` value on
`SummaryConvictionPerson`, alongside victim/informant/witness/etc.

`age` doesn't exist here at all -- a database spanning 1808-1889 can't
store a bare number for "age" without the date it applied to (it's a
rate-of-change-with-calendar-time value, not a fact, and silently means
nothing once separated from the date it was stated). `birth_year` is
derived once at migration time instead, and is time-invariant.

Derived date fields the v2 schema stored (offence_day_of_week/
day_of_month/year) are dropped entirely -- fully computable from
offence_date at query time, don't store what can drift out of sync. Same
principle killed `name_key` (a pure function of first_name/last_name,
manually populated with nothing keeping it in sync if the name fields
were ever edited) and `case.title` staying -- checked and confirmed NOT
derivable, so it's kept as a real column.
"""

from datetime import date
from typing import Optional

from sqlalchemy import CheckConstraint, UniqueConstraint
from sqlmodel import Field, SQLModel


class SummaryConviction(SQLModel, table=True):
    __tablename__ = "summary_conviction"

    id: Optional[int] = Field(default=None, primary_key=True)
    # NOT unique: 11 duplicate record_numbers exist in the source archive.
    record_number: str = Field(index=True)
    # From the old raw_case.title -- checked (including multi-defendant
    # cases) and confirmed NOT mechanically derivable from other columns,
    # unlike almost everything else raw_case held (which was ~95%
    # duplicate of this table already). Kept as a real stored column.
    title: Optional[str] = None

    conviction_date: Optional[date] = None
    # conviction_date_raw dropped: a conviction is always a single precise
    # court-sitting day, and the raw text is already fully preserved in
    # raw_record -- a separate column was a redundant extract.
    offence_date: Optional[date] = None
    # offence_date_raw KEPT, unlike conviction_date_raw: an offence can be
    # an unstructured range/period ("for the rest of the week", "over six
    # months") with no single correct DATE value -- this is the only place
    # that fuller statement survives.
    offence_date_raw: Optional[str] = None
    offence_time: Optional[str] = None  # anchored by offence_date on this same row

    charge_description: str
    # sentencing dropped: populated in 1 of 6,231 rows in the old schema,
    # and not an extraction gap -- the archive's Summary Conviction
    # descriptions essentially never record the punishment handed down.
    raw_record: str

    # offence_location_id/court_location_id/petty_sessional_division_id
    # (and the old table PettySessionalDivision) all moved OFF this table
    # -- see SummaryConvictionLocation. A conviction may in theory involve
    # more than one offence location; capping at fixed columns was the
    # same artificial-cap mistake corrected for occupation/relationship.

    # crime_type_id/crime_type_2_id moved OFF this table -- see
    # SummaryConvictionCrimeType. Verified max 2 simultaneous charges in
    # the old data, but that's not a reason to hard-cap the column count.

    # monetary_value_raw, game_species, correction_note,
    # of_especial_interest: all dropped. monetary_value_raw/game_species
    # were redundant extracts of raw_record; correction_note documented
    # *why* a field was overridden (not recoverable elsewhere once
    # dropped, but cut anyway on explicit instruction);
    # of_especial_interest wasn't actually used for anything.

    # Also dropped vs. the v2 schema: offence_day_of_week/day_of_month/
    # year (derivable from offence_date), extraction_confidence/
    # uncertain_fields (LLM self-assessment, not trusted), raw_case_id
    # (raw_case table itself is dropped).


class Person(SQLModel, table=True):
    __tablename__ = "person"

    id: Optional[int] = Field(default=None, primary_key=True)

    first_name: Optional[str] = None
    # e.g. "Jameson" in "Edward Jameson Ayre" -- previously concatenated
    # into first_name (931 of 10,202 v2 rows had a compound first_name),
    # conflating two distinct facts into one field.
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    # "the elder" / "the younger" / "junior" -- disambiguates two people
    # sharing a name, NOT a rank/office indicator (see `title` below).
    name_postfix: Optional[str] = None
    # "Sir" / "Rev." / "Lady" / "Dr." etc. Uncontrolled free text, same
    # treatment as name_postfix: rare (2 confirmed people corpus-wide:
    # Sir George Elliott, Sir Charles Mark Palmer) but a confirmed real
    # bug when unhandled -- Palmer's title was silently dropped in 10 of
    # 12 mentions, Elliott's was inconsistently duplicated into free text
    # in some rows and mis-parsed into last_name in others. Not a
    # CHECK/lookup-table candidate: descriptive metadata, not a
    # filtering/aggregation dimension.
    title: Optional[str] = None
    sex: Optional[str] = None

    # DERIVED ONCE at migration time as summary_conviction.offence_year -
    # age, via the one conviction each person row is linked to (person
    # rows are never deduplicated across convictions, so this join is
    # always unambiguous). Stable and time-invariant, unlike age itself --
    # "age at time of any given conviction" is a query
    # (summary_conviction.offence_year - birth_year), never a stored fact.
    birth_year: Optional[int] = None

    # relationships_and_details (renamed `notes` mid-design, then dropped
    # entirely): its whole justification was "narrative colour that
    # doesn't fit a structured field" -- but that colour is already fully
    # preserved verbatim in raw_record. occupation/relationship_type/
    # related_to_name/related_person_id/spouse_person_id all moved off
    # this table too -- see PersonOccupation/PersonRelationship. A person
    # can genuinely hold more than one of each simultaneously (verified:
    # a stepson was *also* the person his stepfather illegally employed --
    # a single relationship_type column could only ever hold one of those
    # two true, simultaneous facts). marital_status and prior_convictions:
    # both dropped on explicit instruction.

    home_location_id: Optional[int] = Field(default=None, foreign_key="location.id")
    # Comma-joined if 2 (verified max 2 aliases per person, 25 rows total
    # corpus-wide in v2) -- replaces the old separate Alias table.
    alias: Optional[str] = None

    __table_args__ = (
        CheckConstraint("sex IS NULL OR sex IN ('male','female')"),
    )


class PersonOccupation(SQLModel, table=True):
    """Not capped at one (or two) -- a person can hold more than one
    occupation simultaneously, same reasoning as PersonRelationship."""

    __tablename__ = "person_occupation"

    person_id: int = Field(foreign_key="person.id", primary_key=True)
    occupation_id: int = Field(foreign_key="occupation.id", primary_key=True)


class PersonRelationship(SQLModel, table=True):
    """Not capped at one -- verified (the Joseph/Thomas William Readman
    stepson-and-illegally-employed pattern) that a person can hold more
    than one simultaneous relationship. related_person_id is REQUIRED,
    not a nullable text fallback -- consistent with this project's own
    pre-existing principle (every named individual should end up as its
    own row somewhere in the schema, not just a string on someone
    else's). Every relationship resolves to a real person row, even a
    minimal stub (just a surname, first_name null) when that's all the
    source gives -- always possible, since a relationship can't be stated
    at all without at least a name fragment to build a stub from.
    """

    __tablename__ = "person_relationship"

    id: Optional[int] = Field(default=None, primary_key=True)
    person_id: int = Field(foreign_key="person.id", index=True)
    relationship_type_id: int = Field(foreign_key="relationship_type.id", index=True)
    related_person_id: int = Field(foreign_key="person.id", index=True)

    __table_args__ = (CheckConstraint("related_person_id != person_id"),)


class SummaryConvictionPerson(SQLModel, table=True):
    """Merges the old SummaryConvictionDefendant + InvolvedPerson junction
    tables -- "defendant" is a `role` value here, not a separate table."""

    __tablename__ = "summary_conviction_person"

    id: Optional[int] = Field(default=None, primary_key=True)
    summary_conviction_id: int = Field(foreign_key="summary_conviction.id", index=True)
    person_id: int = Field(foreign_key="person.id", index=True)
    # 'defendant', plus the old InvolvedPerson.role vocabulary: victim,
    # informant, witness, spouse of offender, child, employer, etc.
    role: str = Field(index=True)

    __table_args__ = (
        UniqueConstraint("summary_conviction_id", "person_id", "role"),
    )


class SummaryConvictionLocation(SQLModel, table=True):
    """Replaces summary_conviction.offence_location_id/court_location_id/
    petty_sessional_division_id -- same shape as SummaryConvictionPerson,
    not capped. A conviction may have more than one "location of offence"
    row."""

    __tablename__ = "summary_conviction_location"

    id: Optional[int] = Field(default=None, primary_key=True)
    summary_conviction_id: int = Field(foreign_key="summary_conviction.id", index=True)
    location_id: int = Field(foreign_key="location.id", index=True)
    # 'location of offence', 'court location', 'petty sessional division'
    # -- spelled out in full rather than terse codes, so the role is
    # unambiguous on its own without needing to consult a legend.
    role: str = Field(index=True)

    __table_args__ = (
        UniqueConstraint("summary_conviction_id", "location_id", "role"),
    )


class SummaryConvictionCrimeType(SQLModel, table=True):
    """Replaces summary_conviction.crime_type_id/crime_type_2_id -- not
    capped, same reasoning as SummaryConvictionLocation/PersonOccupation."""

    __tablename__ = "summary_conviction_crime_type"

    summary_conviction_id: int = Field(foreign_key="summary_conviction.id", primary_key=True)
    crime_type_id: int = Field(foreign_key="crime_type.id", primary_key=True)


class RelatedConviction(SQLModel, table=True):
    """Self-referential link: two convictions judged to stem from the same
    underlying event -- one arrest producing several same-day charges
    against one defendant, a mutual assault charged from both sides, a
    group incident (joint theft, poaching trip, riot) producing several
    convictions. Informal by design: built from patterns noticed reading
    records or detected heuristically, not a formal legal grouping --
    `note` always explains the basis for the link so it can be judged, not
    just trusted. Real join table, not JSON on summary_conviction --
    unbounded cardinality (up to 11 links per conviction, verified) rules
    that out, same as PersonRelationship/PersonOccupation.

    Conceptually symmetric (A relates to B same as B relates to A) but
    stored as one row per pair with the lower id first, enforced by the
    CHECK constraint, so a pair is never stored twice in both directions.
    Always go through qsrecords.related_convictions.link_convictions()
    rather than constructing this directly, since it does that ordering.
    Table name unchanged from v2 -- only its two FK columns now point at
    the same summary_conviction table, which was never actually renamed
    (only the design plan's working name for it was "case").
    """

    __tablename__ = "related_conviction"
    __table_args__ = (CheckConstraint("summary_conviction_id_a < summary_conviction_id_b"),)

    summary_conviction_id_a: int = Field(foreign_key="summary_conviction.id", primary_key=True)
    summary_conviction_id_b: int = Field(foreign_key="summary_conviction.id", primary_key=True)
    note: Optional[str] = None
