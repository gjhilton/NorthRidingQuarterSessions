"""Offence type seeding, taxonomy, and get-or-create normalization.

v1 left `offence_type` as uncontrolled LLM free text: near-duplicate variants
("possession of short weights" / "possession of inaccurate weights" /
"possession of a false and defective two-pound weight") and, in the worst
cases, values that just restated the record type ("Summary conviction" is
not an offence category). This module seeds a canonical vocabulary (drawn
from the archive's own bundle-level category descriptions) and defensively
redirects the exact junk value already observed in production data to a
sentinel. Fuzzy deduplication of new LLM-proposed near-duplicates is
deferred to a later manual review pass, not blocked on here.

v2 adds a taxonomy: get_or_create_offence_type's exact-string matching has
no synonym awareness, so an extended manual-entry pass grew the vocabulary
from a curated 15-item seed list to 91 near-duplicate-laden strings (e.g.
six different spellings of "child not sent to school": "education offence",
"school attendance offence", "truancy", "failure to send child to school",
"non-attendance of children at school", plus a wrongly-named
"education/employment offence" that's actually about illegal child
*employment*, not truancy). OFFENCE_TAXONOMY is the single source of truth
for the fix: a curated (category, [(canonical leaf, [old names to merge
into it])]) structure, seeded via seed_offence_taxonomy and applied to
already-existing duplicate rows via migrate_offence_taxonomy.

Every merge below was verified against real charge_description text before
being included, not inferred from name similarity alone -- some very
similar-looking names turned out to cover genuinely distinct offences
(`obstruction`, 97 records, turned out to mean *highway* obstruction
-- "obstructing Church Street", "placing drapery goods on the footway" --
completely different from `obstructing police`/`resisting a constable`,
which are about resisting an officer). `animal offence`/`animal damage`
were an earlier example of this same mixed-content problem, later
actually resolved rather than left as unmerged residual leaves: their
records split cleanly into `cruelty to animals` (ill-treating/torturing)
and a new `allowing an animal to worry livestock` leaf (a dog causing
damage to someone else's livestock -- not the same offence as generic
property damage).

v3 unified schema: OffenceCategory + OffenceType (a two-table pair) merge
into one self-referential `CrimeType` tree, mirroring Location's shape --
`parent_id IS NULL` marks a top-level category, non-NULL marks a leaf filed
under that category. The two old get-or-create functions (one per table)
collapse into a single get_or_create_crime_type(session, name, parent_id).
Distinguishing "a top-level category row" from "a leaf nobody has
categorised yet" (both have parent_id IS NULL) relies on is_seeded: every
row seed_offence_taxonomy creates -- category AND leaf alike -- is
is_seeded=True; a bare LLM-proposed name created via get_or_create_crime_type
with no parent defaults to is_seeded=False. So "parent_id IS NULL AND
is_seeded" is the category/leaf tell, not parent_id alone. This convention
only holds because nothing else in this module ever creates an
is_seeded=True row without immediately giving it the right parent_id.
"""

from sqlalchemy.orm import aliased
from sqlmodel import Session, select

from qsrecords.models.core import SummaryConvictionCrimeType
from qsrecords.models.reference import CrimeType
from qsrecords.text import normalize_key

UNCLASSIFIED = "unclassified"

# (category name, [(canonical leaf name, [old/proposed names that merge into it])])
# in curated display order -- category sort_order and leaf order within a
# category both follow this list's order, largest/most load-bearing
# categories first. A leaf whose own canonical name was never a distinct
# old name (nothing to merge) just gets an empty merge list.
OFFENCE_TAXONOMY: list[tuple[str, list[tuple[str, list[str]]]]] = [
    # Redesigned wholesale from the original flat "Drink & Public Order"
    # (which lumped drink offences in with unrelated indecency/nuisance/
    # sabbath-breaking leaves just because they were all vaguely "public
    # order"-ish) -- every category below was checked against real
    # charge_description text for its weakest/smallest members before being
    # kept, merged, or split, not just judged by name. Two single-member
    # circular categories ("Public Health" containing only "public health
    # offence", "Miscellaneous Regulatory" as an undifferentiated grab-bag
    # of firearms/mining/militia) are gone; every category now has a real
    # multi-member theme.
    ("Drink & Disorder", [
        ("drunkenness", []),
        ("drunk and disorderly", []),
        ("breach of the peace", []),
        # Riotous/disorderly conduct with no drink involved -- distinct from
        # drunk and disorderly (that's specifically drink + disorder) and
        # from breach of the peace (threats, not disorderly conduct itself).
        # Split out from indecent behaviour: "being a common prostitute and
        # behaving riotously/in a disorderly manner" was previously tagged
        # indecent behaviour regardless of whether the record actually
        # described indecent conduct or just disorder.
        ("disorderly behaviour", []),
        ("public order", ["public order offence"]),
        # About the drunk patron's own conduct (refusing to leave when
        # told), not the licensee's regulatory compliance -- belongs here
        # with drunkenness/drunk and disorderly, not with Licensing &
        # Gaming's trading-without-a-licence/opening-hours/dog-licence
        # offences.
        ("refusal to quit licensed premises", []),
    ]),
    # Split out of the old "Drink & Public Order" -- indecency/immorality/
    # religious-order offences with no drink element at all.
    ("Public Morals", [
        # Renamed from "obscene language" to match the exact charge phrasing
        # ("using obscene/indecent/profane language") -- also absorbed 42
        # records that real charge_description text showed were purely this
        # charge (nothing else described) but had been inconsistently
        # tagged breach of the peace/public order by earlier extraction
        # passes.
        ("using obscene language", ["obscene language"]),
        ("indecent behaviour", []),
        ("indecent exposure", []),
        # The status element of "being a common prostitute and behaving
        # [indecently/riotously]" -- always tagged alongside whichever
        # behaviour leaf actually matches the record (indecent behaviour, in
        # this category, or disorderly behaviour, in Drink & Disorder).
        ("prostitution", []),
        # "Playing marbles on a Sunday" -- moral/religious-order offence,
        # nothing to do with drink.
        ("sabbath breaking", []),
    ]),
    ("Assault & Resisting Authority", [
        ("assault", ["attempted assault"]),
        ("assaulting a police officer", ["assault on a constable", "assault on police"]),
        ("obstructing/resisting a constable", ["obstructing police", "resisting a constable"]),
    ]),
    ("Transport", [
        ("obstructing the highway", ["obstruction", "highway obstruction"]),
        ("furious/reckless driving", ["furious driving", "highway offence"]),
        ("railway offence", ["fare evasion"]),
    ]),
    ("Property Offences", [
        ("theft", []),
        ("malicious/property damage", ["malicious damage", "property damage", "property offence"]),
        ("fraud/false pretences", ["fraud", "false pretences"]),
        ("trespass", []),
    ]),
    ("Poaching & Fishing", [
        ("poaching", ["game law offence"]),
        ("fishing offence", []),
    ]),
    ("Licensing & Gaming", [
        ("licensing offence", []),
        ("gaming/gambling offence", ["illegal gambling", "gaming", "gaming offence", "illegal lottery"]),
    ]),
    ("Vagrancy & Begging", [
        ("vagrancy", []),
        ("begging", []),
        ("causing children to beg", []),
        ("loitering/suspected person", ["loitering with intent", "suspected person"]),
        ("fortune telling", []),
    ]),
    ("Poor Law & Family Maintenance", [
        ("failure to maintain family", []),
        ("failure to maintain bastard children", []),
        ("refusing workhouse labour", []),
        ("workhouse offence", []),
    ]),
    ("Education", [
        (
            "school non-attendance",
            [
                "education offence",
                "school attendance offence",
                "truancy",
                "failure to send child to school",
                "non-attendance of children at school",
            ],
        ),
        ("illegal child employment", ["education/employment offence", "employment of children", "illegal employment of a child"]),
    ]),
    ("Employment Law", [
        (
            "master and servant offence",
            [
                "employment offence",
                "absconding from service",
                "service desertion",
                "desertion",
                "breach of service contract",
                "misconduct by apprentice",
                "absence from apprenticeship service",
            ],
        ),
    ]),
    # Merged with the old standalone "Public Health" (a single-member
    # category that just restated its own leaf's name) -- building
    # regulation, weights/measures, food safety, and public health were all
    # enforced the same way: a local-authority inspector (surveyor,
    # inspector of weights and measures, inspector of nuisances, inspector
    # of common lodging houses) checking compliance, a genuinely coherent
    # theme once you look at who's doing the enforcing.
    ("Trade & Public Health Regulation", [
        ("false weights or measures", ["using false weights or measures", "weights and measures", "weights and measures offence"]),
        ("unfit or adulterated food", ["food safety", "unwholesome food offence", "unfit food for sale", "selling adulterated goods"]),
        ("building regulation offence", []),
        ("public health offence", []),
    ]),
    ("Animals", [
        ("cruelty to animals", ["animal cruelty"]),
        ("straying animals", ["animal straying"]),
        ("animal disease offence", []),
        ("dog licence offence", []),
        ("allowing an animal to worry livestock", []),
    ]),
    # "public nuisance" moved in from the old "Drink & Public Order" --
    # sampled its charge_description text and 5 of 6 records are literally
    # harbour obstruction ("throwing rubbish into Whitby harbour",
    # "refusing to remove wreckage...after being given notice by the harbour
    # master"), reported by the harbour master, nothing to do with drink.
    ("Maritime, Customs & Harbour", [
        ("smuggling", []),
        ("customs offence", []),
        ("maritime offence", []),
        ("public nuisance", ["nuisance"]),
    ]),
    # New category, merged out of the old "Miscellaneous Regulatory" grab-
    # bag (which had no actual common thread between firearms/mining/
    # militia) -- firearms and mining share a real theme, physical-hazard
    # regulation (wanton firing near a public highway; unsafe blasting
    # practice under the Coal Mines Regulation Act). Militia moved to
    # Administrative & Public Duty instead, below.
    ("Public Safety", [
        ("firearms offence", []),
        ("mining offence", []),
    ]),
    # Militia moved in from the old "Miscellaneous Regulatory" -- failing a
    # civic duty owed to the state (militia service, reporting to police,
    # serving in a public office) is the same theme as this category's
    # existing members, not a firearms/mining physical-hazard matter.
    ("Administrative & Public Duty", [
        ("public office offence", ["misconduct in public office", "refusing civic office"]),
        ("penal servitude reporting offence", []),
        ("militia offence", []),
    ]),
    ("Unclassified", [
        (UNCLASSIFIED, []),
    ]),
]

# Flattened, in taxonomy order: every canonical leaf name that should exist
# after seeding, with is_seeded=True (this supersedes the old flat
# SEED_OFFENCE_TYPES list -- every prior seed name still appears here,
# either as its own leaf or folded into one, see OFFENCE_TAXONOMY above).
SEED_OFFENCE_TYPES: list[str] = [
    leaf_name for _category, leaves in OFFENCE_TAXONOMY for leaf_name, _merge_from in leaves
]

# Junk values seen in real v1 output that must never become a real category.
_REJECTED_VALUES = {"summary conviction", "conviction", ""}


def get_or_create_crime_type(
    session: Session,
    raw_name: str,
    parent_id: int | None = None,
    is_seeded: bool = False,
) -> CrimeType:
    """Get-or-create against the unified CrimeType tree -- replaces the old
    get_or_create_offence_category/get_or_create_offence_type pair. Used for
    both top-level categories (parent_id=None) and leaves (parent_id=the
    category's id) since they're now the same table."""
    key = normalize_key(raw_name or "")
    if key in _REJECTED_VALUES:
        key = UNCLASSIFIED

    existing = session.exec(select(CrimeType).where(CrimeType.name == key)).first()
    if existing:
        return existing

    crime_type = CrimeType(name=key, parent_id=parent_id, is_seeded=is_seeded)
    session.add(crime_type)
    session.flush()
    return crime_type


def seed_offence_taxonomy(session: Session) -> None:
    """Idempotently insert every OFFENCE_TAXONOMY category and canonical
    leaf (get-or-create per name), and make sure every leaf's parent_id
    points at its category -- whether the leaf row already existed
    (pre-dating the taxonomy) or is being created fresh here."""
    for order, (category_name, leaves) in enumerate(OFFENCE_TAXONOMY):
        category = get_or_create_crime_type(session, category_name, parent_id=None, is_seeded=True)
        if category.sort_order != order:
            category.sort_order = order
            session.add(category)
        for leaf_name, _merge_from in leaves:
            crime_type = get_or_create_crime_type(
                session, leaf_name, parent_id=category.id, is_seeded=True
            )
            if crime_type.id == category.id:
                # Category and its own leaf share a normalized name (e.g.
                # the "Unclassified" category and its "unclassified" leaf)
                # -- CrimeType.name is unique across the whole tree, so
                # get_or_create_crime_type resolved both calls to the same
                # physical row. That row stays a top-level (parent_id=NULL)
                # node serving as both category and its own sole leaf;
                # setting its parent_id to itself would violate the
                # self-reference CHECK constraint.
                continue
            if crime_type.parent_id != category.id:
                crime_type.parent_id = category.id
                session.add(crime_type)
    session.flush()


def seed_offence_types(session: Session) -> None:
    """Back-compat alias -- taxonomy seeding now also seeds the flat leaf
    vocabulary, so existing callers (qsrecords.db.init_db, tests) don't need
    to change."""
    seed_offence_taxonomy(session)


def migrate_offence_taxonomy(session: Session) -> None:
    """One-time-per-database, idempotent merge of pre-taxonomy duplicate
    crime_type rows into their canonical leaf, per OFFENCE_TAXONOMY's merge
    lists. Must run after seed_offence_taxonomy (the canonical rows need to
    already exist).

    For each old name that still exists as its own (different) row: every
    summary_conviction_crime_type tag pointing at the old id is re-pointed
    at the canonical id -- using an existence check rather than a blind
    INSERT, since a conviction already tagged with both names would
    otherwise violate the (summary_conviction_id, crime_type_id) composite
    primary key -- then the now-orphaned old row is deleted. Nothing left to
    do on a second call: by then every old name's row is already gone.
    """
    canonical_by_name = {row.name: row for row in session.exec(select(CrimeType)).all()}

    for _category_name, leaves in OFFENCE_TAXONOMY:
        for leaf_name, merge_from in leaves:
            canonical = canonical_by_name.get(leaf_name)
            if canonical is None:
                continue  # seed_offence_taxonomy hasn't run; nothing to merge into
            for old_name in merge_from:
                old = canonical_by_name.get(normalize_key(old_name))
                if old is None or old.id == canonical.id:
                    continue

                tagged = session.exec(
                    select(SummaryConvictionCrimeType).where(
                        SummaryConvictionCrimeType.crime_type_id == old.id
                    )
                ).all()
                for tag in tagged:
                    already_tagged = session.get(
                        SummaryConvictionCrimeType,
                        (tag.summary_conviction_id, canonical.id),
                    )
                    if already_tagged is None:
                        session.add(
                            SummaryConvictionCrimeType(
                                summary_conviction_id=tag.summary_conviction_id,
                                crime_type_id=canonical.id,
                            )
                        )
                    session.delete(tag)
                session.flush()

                session.delete(old)
                del canonical_by_name[old.name]

    session.flush()


def list_offence_type_names(session: Session) -> list[str]:
    """Every crime type the model should be shown as a candidate category,
    seeded and previously-proposed alike -- top-level categories excluded,
    since a category name itself is never a valid charge tag.

    "Is this row a category" is answered by whether anything else in the
    tree has parent_id pointing at it (a category always has at least one
    leaf underneath), NOT by parent_id IS NULL alone -- "Unclassified" the
    category and "unclassified" the sentinel leaf normalize to the same
    name (CrimeType.name is unique across the whole tree), so they collapse
    to one physical row that stays parent_id IS NULL forever; a childless
    row like that is exactly a leaf, not a category, regardless of its own
    parent_id.

    Passing only seeded leaf names (as extract_batch used to) means the
    model can never reuse a category an earlier batch proposed and had
    accepted (e.g. "straying animals") -- it has no way to know that
    category already exists, so it either re-proposes a near-duplicate or,
    worse, force-fits the record into an unrelated seeded category instead.
    Querying the live table closes that gap.

    Ordered by category sort_order (uncategorised proposals last, then
    alphabetically among themselves) so related terms sit next to each
    other in the flat comma-joined prompt list -- e.g. every drink/public-
    order term together, every animal term together -- rather than
    "seeded first" order, which scattered a category's own siblings apart
    based on which happened to be seeded vs. later proposed.
    """
    Parent = aliased(CrimeType)
    Child = aliased(CrimeType)
    rows = session.exec(
        select(CrimeType.name, Parent.sort_order)
        .join(Parent, Parent.id == CrimeType.parent_id, isouter=True)
        .join(Child, Child.parent_id == CrimeType.id, isouter=True)
        .where(Child.id.is_(None))
        .order_by(
            Parent.sort_order.is_(None),
            Parent.sort_order,
            CrimeType.name,
        )
    ).all()
    return [name for name, _sort_order in rows]
