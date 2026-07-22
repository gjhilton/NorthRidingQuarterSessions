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
