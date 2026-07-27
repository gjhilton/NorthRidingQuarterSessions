import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";
import { buildPlaceIndex, resolveAncestorByName, type PlaceNode } from "@/lib/placeTree";

export interface Option {
  id: number;
  name: string;
}

// Bounds the From/To date pickers to dates that actually occur in the
// data (1808-12-14..1889-09-30) -- native date inputs don't otherwise stop
// someone picking, say, 1750 or 2030 and getting a silently-empty result.
export function getOffenceDateRange(): { min: string | null; max: string | null } {
  return getDb()
    .prepare(`SELECT MIN(offence_date) AS min, MAX(offence_date) AS max FROM summary_conviction`)
    .get() as { min: string | null; max: string | null };
}

// Same idea as getOffenceDateRange(), for the separate Sentence date
// fieldset (1809-01-08..1889-10-01) -- offence and conviction dates aren't
// the same range (a case can be tried into the following year).
export function getConvictionDateRange(): { min: string | null; max: string | null } {
  return getDb()
    .prepare(`SELECT MIN(conviction_date) AS min, MAX(conviction_date) AS max FROM summary_conviction`)
    .get() as { min: string | null; max: string | null };
}

// Every distinct number of defendants a conviction actually has (1..6 in
// practice -- the overwhelming majority are 1) -- drives the Offenders
// count filter's options.
export function listDefendantCounts(): number[] {
  return getDb()
    .prepare(
      `
      SELECT DISTINCT n FROM (
        SELECT COUNT(scd.defendant_id) AS n
        FROM summary_conviction sc
        LEFT JOIN summary_conviction_defendant scd ON scd.summary_conviction_id = sc.id
        GROUP BY sc.id
      )
      WHERE n > 0
      ORDER BY n
      `
    )
    .all()
    .map((r) => (r as { n: number }).n);
}

// Loads the place tree once for both listTowns()/listOffenceStreets() below
// -- each offence location is resolved up to its containing town/parish by
// walking the tree (see lib/placeTree.ts), using the old `town` table's own
// names as the recognized "town-level" vocabulary (still accurate, just no
// longer the canonical location field -- see queries/map.ts's header
// comment for the fuller rationale, shared by every place this pattern is
// used).
function loadPlacesAndTownNames(): { byId: Map<number, PlaceNode>; townNames: Set<string> } {
  const places = getDb().prepare(`SELECT id, name, parent_id FROM place`).all() as PlaceNode[];
  const townNames = new Set(
    (getDb().prepare(`SELECT name FROM town`).all() as { name: string }[]).map((r) => r.name.toLowerCase())
  );
  return { byId: buildPlaceIndex(places), townNames };
}

// Every town/parish actually used as an offence location (directly or via
// a more specific descendant place), scoped to real usage so the ~90
// street/yard-level places that were never an offence location don't
// clutter the dropdown. Offence location specifically, not court location
// -- see browseList.ts's locationId filter, which this list needs to stay
// in sync with.
export function listTowns(): Option[] {
  const { byId, townNames } = loadPlacesAndTownNames();
  const rows = getDb()
    .prepare(
      `SELECT DISTINCT offence_location_id AS id FROM summary_conviction WHERE offence_location_id IS NOT NULL`
    )
    .all() as { id: number }[];

  const resolvedIds = new Set<number>();
  for (const { id } of rows) resolvedIds.add(resolveAncestorByName(id, byId, townNames).id);

  return [...resolvedIds]
    .map((id) => ({ id, name: titleCase(byId.get(id)!.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export interface StreetOption extends Option {
  townId: number;
}

// Every specific offence location more precise than its own town/parish
// (a street, or a yard nested deeper still), tagged with its resolved town
// so the UI can filter this one list client-side per selected town rather
// than round-tripping for each town change. Scoped to real usage for the
// same reason as listTowns() above.
export function listOffenceStreets(): StreetOption[] {
  const { byId, townNames } = loadPlacesAndTownNames();
  const rows = getDb()
    .prepare(
      `SELECT DISTINCT offence_location_id AS id FROM summary_conviction WHERE offence_location_id IS NOT NULL`
    )
    .all() as { id: number }[];

  const options: StreetOption[] = [];
  for (const { id } of rows) {
    const town = resolveAncestorByName(id, byId, townNames);
    if (town.id === id) continue; // tagged exactly at town level -- no street to show
    options.push({ id, name: titleCase(byId.get(id)!.name), townId: town.id });
  }
  return options.sort((a, b) => a.name.localeCompare(b.name));
}

// Curated sort_order (e.g. "Drink & Public Order" first), not alphabetical
// -- see data-loader/qsrecords/offence_types.py's OFFENCE_TAXONOMY. All 17
// categories have at least one real conviction (checked directly), so
// unlike listTowns()/listOffenceStreets() there's no unused-junk case to
// filter out here.
export function listOffenceCategories(): Option[] {
  return getDb()
    .prepare(`SELECT id, name FROM offence_category ORDER BY sort_order`)
    .all()
    .map((r) => {
      const row = r as Option;
      return { id: row.id, name: titleCase(row.name) };
    });
}

// Every distinct role a name (defendant or involved person) can be filtered
// by on the People page -- "offender" (the synthetic defendant role, not a
// real involved_persons.role value) pinned first since it's the most common
// and most likely to be picked, the real role text alphabetical after it.
// Blank/NULL roles are excluded -- there's nothing to pick.
export function listPersonRoles(): string[] {
  const rows = getDb()
    .prepare(
      `
      SELECT DISTINCT NULLIF(TRIM(role), '') AS role
      FROM involved_persons
      WHERE NULLIF(TRIM(role), '') IS NOT NULL
      ORDER BY role
      `
    )
    .all() as { role: string }[];
  return ["offender", ...rows.map((r) => r.role)];
}

// Every distinct leading surname letter across defendants and involved
// persons -- drives the People page's A-Z nav. Static/enumerable, unlike the
// filtered result set itself, so it's queried once here rather than derived
// client-side from whichever page of results happens to be loaded.
export function listPersonNameLetters(): string[] {
  const rows = getDb()
    .prepare(
      `
      SELECT DISTINCT UPPER(SUBSTR(COALESCE(last_name, first_name, name_key), 1, 1)) AS letter
      FROM (
        SELECT name_key, first_name, last_name FROM defendant
        UNION ALL
        SELECT name_key, first_name, last_name FROM person
      )
      WHERE name_key IS NOT NULL AND TRIM(name_key) != ''
      ORDER BY letter
      `
    )
    .all() as { letter: string }[];
  return rows.map((r) => r.letter);
}

// Every town used as a defendant's or involved person's own residence --
// distinct from listTowns() above, which is scoped to offence locations,
// not residence.
export function listResidenceTowns(): string[] {
  const rows = getDb()
    .prepare(
      `
      SELECT DISTINCT pl.name AS name
      FROM place pl
      WHERE pl.id IN (
        SELECT location_id FROM defendant WHERE location_id IS NOT NULL
        UNION
        SELECT location_id FROM person WHERE location_id IS NOT NULL
      )
      ORDER BY pl.name
      `
    )
    .all() as { name: string }[];
  return rows.map((r) => r.name);
}

// Every distinct occupation string across defendants and involved persons --
// real free text, not a curated taxonomy (unlike offence_type), so this list
// is as long and as messy as the underlying data actually is (~400 values).
export function listOccupations(): string[] {
  const rows = getDb()
    .prepare(
      `
      SELECT DISTINCT occupation FROM (
        SELECT NULLIF(TRIM(occupation), '') AS occupation FROM defendant
        UNION
        SELECT NULLIF(TRIM(occupation), '') AS occupation FROM person
      )
      WHERE occupation IS NOT NULL
      ORDER BY occupation
      `
    )
    .all() as { occupation: string }[];
  return rows.map((r) => r.occupation);
}

export interface OffenceTypeOption extends Option {
  categoryId: number | null;
}

// Flat, tagged with categoryId, so the UI can filter this one list
// client-side per selected category the same way listOffenceStreets() does
// for streets-per-town -- see data-loader/qsrecords/offence_types.py's
// OFFENCE_TAXONOMY for how the 55 leaves here were consolidated from an
// earlier 91-near-duplicate-string vocabulary.
export function listOffenceTypes(): OffenceTypeOption[] {
  return getDb()
    .prepare(
      `
      SELECT ot.id AS id, ot.name AS name, ot.category_id AS categoryId
      FROM offence_type ot
      LEFT JOIN offence_category oc ON oc.id = ot.category_id
      ORDER BY COALESCE(oc.sort_order, 999999), ot.name
      `
    )
    .all() as OffenceTypeOption[];
}
