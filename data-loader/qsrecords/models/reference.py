"""Deduped reference/lookup data: locations, offence types, occupations,
and relationship types.

Unlike Person (one row per mention, never merged), these are genuinely
deduplicated via get-or-create on a normalized name, since they're small,
stable vocabularies where a normalized-string match is reliable.
"""

from typing import Optional

from sqlmodel import Field, SQLModel

from sqlalchemy import CheckConstraint, UniqueConstraint


class Location(SQLModel, table=True):
    """A single self-referencing tree covering every location in the
    corpus, since real places nest to varying, not-always-two-level depth
    -- region (e.g. "Esk Valley") > parish > village > road/point,
    sometimes fewer levels, sometimes more, and now also absorbs the old
    PettySessionalDivision vocabulary as further nodes in the same tree
    (an administrative division is itself a place, not a separate kind of
    thing). A record with a location stores exactly one location_id, the
    single most-specific (leaf) node it's known to -- since every node's
    ancestry is just parent_id walked upward, that one id is enough to
    recover the whole chain back to the root.

    Every location is fundamentally a point (latitude/longitude, nullable
    if not known) with an optional path (path_geometry) layered on top for
    streets/roads with real line geometry -- there's no separate "kind"
    classification column; what a location *is* is read from the record
    itself (name, parent) rather than an enum, and how it's mapped is read
    from which of latitude/longitude/path_geometry are populated.
    """

    __tablename__ = "location"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    parent_id: Optional[int] = Field(default=None, foreign_key="location.id")
    # Public: things worth surfacing to a reader (e.g. "the modern name for
    # this is Friargate"). Private: our own working notes (e.g. unverified
    # coordinates, provenance of a merge decision) -- not meant for
    # display, and MUST NEVER be copied into the client-facing sql.js
    # database (see explorer/scripts/copy-db.mjs).
    notes_public: Optional[str] = None
    notes_private: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    # JSON-encoded [[lat, lon], ...] tracing a road's real line geometry
    # (e.g. from Overpass/OSM), for the handful of streets where that's
    # been fetched -- see Baxtergate. Deliberate exception to this
    # project's "prefer join tables over JSON" rule: a path is one atomic,
    # inherently-ordered geometric object consumed directly by the map
    # library, not a set of independently-meaningful relational facts.
    path_geometry: Optional[str] = None

    __table_args__ = (CheckConstraint("parent_id IS NULL OR parent_id != id"),)


class Occupation(SQLModel, table=True):
    """Controlled vocabulary replacing the old free-text Defendant/Person
    occupation column, which had fragmented into 405 distinct raw strings
    including real contamination (multi-fact concatenation, relationship
    info bundled in, wife/husband-occupation-swap leftovers) -- same
    fragmentation risk the offence-type taxonomy already had to fix once.
    """

    __tablename__ = "occupation"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    # Whether this occupation names a police rank (constable/sergeant/
    # inspector/superintendent, etc). A fact about the occupation itself,
    # not about each individual mention -- moved here from a per-person
    # is_police flag (verified: every is_police=true row already had one
    # of exactly 20 genuinely-police occupation strings).
    is_police: bool = Field(default=False)


class RelationshipType(SQLModel, table=True):
    """Flat vocabulary (not a tree -- small enough it doesn't warrant a
    category/leaf split the way CrimeType needs one): wife, husband, son,
    daughter, father, mother, brother, sister, cousin, stepson,
    stepdaughter, stepfather, stepmother, child, ward, guardian, employer,
    employee, servant, master, apprentice, agent, principal, co-partner,
    trustee, beneficiary, namesake.

    stepfather/stepmother/guardian/principal/beneficiary never appear as
    an extracted forward value -- they only exist as valid targets for
    RelationshipTypeReciprocal. namesake is not a family/employment tie --
    it records a positive, evidenced judgement that two same-named person
    rows are CONFIRMED DIFFERENT real individuals (found e.g. via an
    occupation-conflicts review: two incompatible occupations under the
    same name suggests two people). This does NOT reverse this project's
    standing "no identity merging" rule -- it's the opposite: explicitly
    flagging non-identity where evidence supports it.
    """

    __tablename__ = "relationship_type"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)


class RelationshipTypeReciprocal(SQLModel, table=True):
    """Answers "given this relationship_type, what's the correctly-gendered
    reverse word (the related person's relation back to this one)?" -- a
    son's reverse relation to his parent is "father" or "mother" depending
    on that parent's sex. Computed via (relationship_type, related
    person's sex) as a lookup, not stored per-row on PersonRelationship,
    which only ever stores one direction exactly as stated in the source
    (same "don't store what's derivable" principle as Person.birth_year).

    related_sex NULL means the reciprocal doesn't depend on the related
    person's sex (e.g. wife's reciprocal is always husband). Not every
    relationship_type has an entry here -- "master" is deliberately
    unmapped: its reciprocal is genuinely ambiguous ("servant" or
    "apprentice" depending on which relationship was actually stated),
    and sex doesn't disambiguate it.
    """

    __tablename__ = "relationship_type_reciprocal"

    # Surrogate PK, not a composite (relationship_type_id, related_sex) key:
    # SQLite implicitly makes every PRIMARY KEY column NOT NULL regardless
    # of the column's own nullability, which would break the NULL-means-
    # "sex-independent" rows. UNIQUE (below) allows multiple NULLs, unlike
    # PRIMARY KEY, so it gets the same "no duplicate mapping" guarantee
    # without that constraint.
    id: Optional[int] = Field(default=None, primary_key=True)
    relationship_type_id: int = Field(foreign_key="relationship_type.id", index=True)
    related_sex: Optional[str] = None
    reciprocal_relationship_type_id: int = Field(foreign_key="relationship_type.id")

    __table_args__ = (
        CheckConstraint("related_sex IS NULL OR related_sex IN ('male','female')"),
        UniqueConstraint("relationship_type_id", "related_sex"),
    )


class CrimeType(SQLModel, table=True):
    """Self-referencing tree merging the old OffenceCategory/OffenceType
    pair into one table, mirroring Location's shape instead of being a
    bespoke two-table pair. parent_id NULL = top-level category."""

    __tablename__ = "crime_type"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    parent_id: Optional[int] = Field(default=None, foreign_key="crime_type.id")
    is_seeded: bool = Field(default=False)  # True = curated seed list, False = LLM-proposed
    sort_order: int = Field(default=0)  # curated display order for top-level rows

    __table_args__ = (CheckConstraint("parent_id IS NULL OR parent_id != id"),)
