"""Deduped reference/lookup data: places and offence categories.

Unlike Defendant/Person (one row per mention, never merged), Town/Street/
OffenceType are genuinely deduplicated via get-or-create on a normalized
name, since these are small, stable vocabularies where a normalized-string
match is reliable.
"""

from typing import Optional

from sqlmodel import Field, SQLModel, UniqueConstraint


class Town(SQLModel, table=True):
    __tablename__ = "town"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)  # normalized (lowercase, trimmed)


class Street(SQLModel, table=True):
    __tablename__ = "street"
    __table_args__ = (UniqueConstraint("name", "town_id", name="uq_street_name_town"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    town_id: Optional[int] = Field(default=None, foreign_key="town.id")


class Place(SQLModel, table=True):
    """Replacement for the flat Town/Street pair: a single self-referencing
    tree, since real places nest to varying, not-always-two-level depth --
    region (e.g. "Esk Valley") > parish > village > road/point, sometimes
    fewer levels, sometimes more. A record with a location stores exactly
    one place_id, the single most-specific (leaf) node it's known to --
    since every node's ancestry is just parent_id walked upward, that one
    id is enough to recover the whole chain back to the root. Built by
    hand, one place at a time (see explorer/scripts/street-candidates.txt
    and the places taxonomy work), not inferred from the old Town/Street
    data.

    `type` is about how the node can be drawn on a map, not its place in
    the hierarchy -- a parish, a village and a specific yard can all be
    "point" if that's all the geolocation we have; "path" is for a road
    with real fetchable line geometry; "unmappable" is for things with no
    fixed location at all (an "X and Y highway" name, or a whole region
    like Esk Valley).
    """

    __tablename__ = "place"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    parent_id: Optional[int] = Field(default=None, foreign_key="place.id")
    type: str  # point | path | unmappable
    # Public: things worth surfacing to a reader (e.g. "the modern name for
    # this is Friargate"). Private: our own working notes (e.g. unverified
    # coordinates, provenance of a merge decision) -- not meant for display.
    notes_public: Optional[str] = None
    notes_private: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    # Only set when type == "path": a JSON-encoded list of [lat, lon] pairs
    # tracing the road's real line geometry (e.g. from Overpass/OSM), for
    # the handful of streets where that's been fetched -- see Baxtergate.
    path_geometry: Optional[str] = None


class OffenceCategory(SQLModel, table=True):
    """The taxonomy's top level (e.g. "Drink & Public Order", "Poaching &
    Fishing") -- never itself attached to a conviction, only grouping
    OffenceType leaves. Mirrors Town (the parent half of the Town/Street
    pair) rather than getting its own bespoke shape."""

    __tablename__ = "offence_category"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    # Curated display/grouping order (see qsrecords.offence_types.OFFENCE_TAXONOMY),
    # not alphabetical -- the largest, most load-bearing categories read first.
    sort_order: int = Field(default=0)


class OffenceType(SQLModel, table=True):
    __tablename__ = "offence_type"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    is_seeded: bool = Field(default=False)  # True = curated seed list, False = LLM-proposed
    # Nullable: a brand-new LLM/manual proposal can be inserted before anyone
    # has decided which category it belongs under (see
    # qsrecords.offence_types.migrate_offence_taxonomy for how existing rows
    # get backfilled, and reports.unreviewed_offence_types for the review
    # queue this leaves behind).
    category_id: Optional[int] = Field(default=None, foreign_key="offence_category.id")


class PettySessionalDivision(SQLModel, table=True):
    """The historic administrative/jurisdictional division a case was heard
    under (e.g. "whitby strand", "ryedale") -- distinct from the town a case
    was heard *in*. A bounded, repeated vocabulary like Town/OffenceType
    (dozens of divisions across the whole North Riding, not thousands), so
    it gets the same get-or-create dedup treatment rather than being stored
    as a free-text column."""

    __tablename__ = "petty_sessional_division"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
