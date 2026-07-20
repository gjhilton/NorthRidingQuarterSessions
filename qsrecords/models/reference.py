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


class OffenceType(SQLModel, table=True):
    __tablename__ = "offence_type"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    is_seeded: bool = Field(default=False)  # True = curated seed list, False = LLM-proposed
