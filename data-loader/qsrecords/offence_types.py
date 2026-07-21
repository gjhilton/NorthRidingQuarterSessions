"""Offence type seeding and get-or-create normalization.

v1 left `offence_type` as uncontrolled LLM free text: near-duplicate variants
("possession of short weights" / "possession of inaccurate weights" /
"possession of a false and defective two-pound weight") and, in the worst
cases, values that just restated the record type ("Summary conviction" is
not an offence category). This module seeds a canonical vocabulary (drawn
from the archive's own bundle-level category descriptions) and defensively
redirects the exact junk value already observed in production data to a
sentinel. Fuzzy deduplication of new LLM-proposed near-duplicates is
deferred to a later manual review pass (`WHERE is_seeded = 0`), not blocked
on here.
"""

from sqlmodel import Session, select

from qsrecords.models.reference import OffenceType
from qsrecords.text import normalize_key

UNCLASSIFIED = "unclassified"

SEED_OFFENCE_TYPES: list[str] = [
    "drunkenness",
    "assault",
    "illegal gambling",
    "malicious damage",
    "vagrancy",
    "cruelty to animals",
    "non-attendance of children at school",
    "poaching",
    "using false weights or measures",
    "licensing offence",
    "trespass",
    "theft",
    "breach of the peace",
    "highway obstruction",
    UNCLASSIFIED,
]

# Junk values seen in real v1 output that must never become a real category.
_REJECTED_VALUES = {"summary conviction", "conviction", ""}


def seed_offence_types(session: Session) -> None:
    """Idempotently insert the canonical seed list (get-or-create per name)."""
    for name in SEED_OFFENCE_TYPES:
        get_or_create_offence_type(session, name, is_seeded=True)


def list_offence_type_names(session: Session) -> list[str]:
    """Every offence type the model should be shown as a candidate category,
    seeded and previously-proposed alike.

    Passing only SEED_OFFENCE_TYPES here (as extract_batch used to) means the
    model can never reuse a category an earlier batch proposed and had
    accepted (e.g. "straying animals") -- it has no way to know that
    category already exists, so it either re-proposes a near-duplicate or,
    worse, force-fits the record into an unrelated seeded category instead.
    Querying the live table closes that gap. Seeded names are listed first
    (stable, most load-bearing categories), then proposed ones
    alphabetically.
    """
    rows = session.exec(
        select(OffenceType).order_by(OffenceType.is_seeded.desc(), OffenceType.name)
    ).all()
    return [row.name for row in rows]


def get_or_create_offence_type(
    session: Session, raw_name: str, is_seeded: bool = False
) -> OffenceType:
    key = normalize_key(raw_name or "")
    if key in _REJECTED_VALUES:
        key = UNCLASSIFIED

    existing = session.exec(select(OffenceType).where(OffenceType.name == key)).first()
    if existing:
        return existing

    offence_type = OffenceType(name=key, is_seeded=is_seeded)
    session.add(offence_type)
    session.flush()
    return offence_type
