"""One-off fix for named places that appear in raw_record text but were
never captured in any structured field -- found via a raw-text-vs-
extraction audit. Each entry was individually verified against raw_record
and, where a comparable already-correct sibling record existed, checked
against it (see comments below) -- this is a fixed list of confirmed
additions, not a heuristic pass.

Each new place is added as BOTH a legacy `street` row (town_id-scoped,
matching every other street already in the database) and a `place` row
(under the correct township in the place tree), then linked from the
specific summary_conviction/defendant rows that name it. Existing
street/place rows are reused wherever the record's own named feature
already has one (the two highway records, and Goldsbrough).

Idempotent -- get_or_create-style lookups by name, and every link is set
unconditionally to the target id (a no-op if already correct), so
re-running is harmless.

Usage:
    python3 fix_missing_offence_locations.py
"""

from sqlmodel import Session, select

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.models.core import Defendant, SummaryConviction
from qsrecords.models.reference import Place, Street
from qsrecords.text import normalize_key


def _get_conviction(session: Session, reference_number: str) -> SummaryConviction:
    conviction = session.exec(
        select(SummaryConviction).where(SummaryConviction.reference_number == reference_number)
    ).first()
    if conviction is None:
        raise ValueError(f"No conviction found for {reference_number!r}")
    return conviction


def _get_or_create_street(session: Session, name: str, town_id: int) -> Street:
    key = normalize_key(name)
    existing = session.exec(
        select(Street).where(Street.name == key, Street.town_id == town_id)
    ).first()
    if existing:
        return existing
    street = Street(name=key, town_id=town_id)
    session.add(street)
    session.flush()
    return street


def _get_or_create_place(session: Session, name: str, parent_id: int) -> Place:
    existing = session.exec(
        select(Place).where(Place.name == name, Place.parent_id == parent_id)
    ).first()
    if existing:
        return existing
    # type="point": none of these have known coordinates yet, same as most
    # other leaf-level yards/streets already in the tree (see Place's own
    # docstring -- "point" just means "no better geometry than a dot").
    place = Place(name=name, parent_id=parent_id, type="point")
    session.add(place)
    session.flush()
    return place


def _link_offence_location(session: Session, reference_number: str, place_id: int) -> None:
    # offence_location_town_id/offence_location_street_id (the old flat
    # Town/Street pair) still physically exist in the database but aren't
    # modelled on SummaryConviction anymore and have zero live consumers in
    # explorer/ (confirmed by grep) -- offence_location_id, the place-tree
    # link, is the only field that actually matters here.
    conviction = _get_conviction(session, reference_number)
    conviction.offence_location_id = place_id


def main() -> None:
    settings = Settings.from_env()
    init_db(settings.db_path)
    with get_session(settings.db_path) as session:
        # Town ids (legacy `town` table) and place-tree parent ids
        # (township-level `place` nodes), looked up once for readability.
        WHITBY_TOWN, WHITBY_PLACE = 1, 4
        RUSWARP_TOWN, RUSWARP_PLACE = 10, 94
        GLAISDALE_TOWN, GLAISDALE_PLACE = 13, 138
        EGTON_TOWN, EGTON_PLACE = 22, 112
        SNEATON_PLACE = 258
        HAWSKER_TOWN, HAWSKER_PLACE = 4, 87
        LYTHE_TOWN, LYTHE_PLACE = 5, 107

        # --- New yards, all in Whitby -- "behaving indecently in Bakehouse
        # Yard" (Lucy Jackson's convictions, the case that started this
        # audit), plus Well Yard, Muncaster's Yard, Kelly's Yard.
        for name, refs in [
            ("Bakehouse Yard", ["QSB 1881 3/10/11/23", "QSB 1881 3/10/11/24"]),
            ("Well Yard", ["QSB 1870 2/10/12/34"]),
            ("Muncaster's Yard", ["QSB 1871 4/10/13/166"]),
            ("Kelly's Yard", ["QSB 1881 3/10/11/39"]),
            ("Imperial Yard", []),  # linked below, as a defendant residence not an offence location
        ]:
            street = _get_or_create_street(session, name, WHITBY_TOWN)
            place = _get_or_create_place(session, name, WHITBY_PLACE)
            for ref in refs:
                _link_offence_location(session, ref, place.id)
            if name == "Imperial Yard":
                conviction = _get_conviction(session, "QSB 1889 4/10/11/16")
                # William Tose, the sole defendant on this conviction.
                from qsrecords.models.core import SummaryConvictionDefendant

                defendant_id = session.exec(
                    select(SummaryConvictionDefendant.defendant_id).where(
                        SummaryConvictionDefendant.summary_conviction_id == conviction.id
                    )
                ).first()
                d = session.get(Defendant, defendant_id)
                d.location_id = place.id

        # --- Named streets, proper nouns (not the generic "X town street"
        # phrasing, which is deliberately left alone -- see
        # strip_town_street_suffix.py).
        for name, town_id, town_place_id, refs in [
            ("Ruswarp Street", RUSWARP_TOWN, RUSWARP_PLACE,
             ["QSB 1839 4/10/93", "QSB 1868 3/10/15/11", "QSB 1868 3/10/15/12"]),
            ("Glaisdale Street", GLAISDALE_TOWN, GLAISDALE_PLACE,
             ["QSB 1869 Q4/10/14-110", "QSB 1869 Q4/10/14-82", "QSB 1870 1/10/14/6"]),
            ("Egton Street", EGTON_TOWN, EGTON_PLACE,
             ["QSB 1867 1/10/16/32", "QSB 1867 1/10/16/33", "QSB 1867 1/10/16/34"]),
        ]:
            street = _get_or_create_street(session, name, town_id)
            place = _get_or_create_place(session, name, town_place_id)
            for ref in refs:
                _link_offence_location(session, ref, place.id)

        # --- Sneaton Road: offence town is Ruswarp per both records (the
        # incident happened on the connecting road, not necessarily on
        # Sneaton Road itself), but Sneaton Road is the only named feature
        # given, so it's the most specific real place to link to.
        street = _get_or_create_street(session, "Sneaton Road", RUSWARP_TOWN)
        place = _get_or_create_place(session, "Sneaton Road", SNEATON_PLACE)
        for ref in ["QSB 1877 3/10/11/49", "QSB 1877 3/10/11/50"]:
            _link_offence_location(session, ref, place.id)

        # --- New Gardens footpath, Hawsker cum Stainsacre.
        street = _get_or_create_street(session, "New Gardens", HAWSKER_TOWN)
        place = _get_or_create_place(session, "New Gardens", HAWSKER_PLACE)
        for ref in ["QSB 1888 3/10/10/18", "QSB 1888 3/10/10/19", "QSB 1888 3/10/10/20"]:
            _link_offence_location(session, ref, place.id)

        # --- Overdale Plantation, Lythe -- a named woodland, not a street,
        # but the same "specific named place missing from every field"
        # gap, so it gets the same place-tree leaf treatment.
        street = _get_or_create_street(session, "Overdale Plantation", LYTHE_TOWN)
        place = _get_or_create_place(session, "Overdale Plantation", LYTHE_PLACE)
        _link_offence_location(session, "QSB 1845 2/10/76", place.id)

        # --- Goldsbrough: already exists as a `place` row (id 263,
        # "Goldsborough", under Lythe) -- offence_location_id was only
        # pointing at the township (Lythe) rather than this already-
        # existing, more specific place.
        goldsborough_place = session.exec(
            select(Place).where(Place.name == "Goldsborough", Place.parent_id == LYTHE_PLACE)
        ).first()
        _link_offence_location(session, "QSB 1870 1/10/14/50", goldsborough_place.id)

        # --- The two highway records: reuse the already-established place
        # row a correctly-extracted sibling record already uses for the
        # same named highway, rather than creating a duplicate.
        sibling_54 = _get_conviction(session, "QSB 1877 1/10/11/54")
        _link_offence_location(session, "QSB 1877 1/10/11/55", sibling_54.offence_location_id)
        hawsker_highway_place = session.exec(
            select(Place).where(Place.name == "Whitby & Hawsker Highway")
        ).first()
        _link_offence_location(session, "QSB 1877 1/10/11/14", hawsker_highway_place.id)

        session.commit()
    print("Done.")


if __name__ == "__main__":
    main()
