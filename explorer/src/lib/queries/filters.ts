import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";
import { buildTreeIndex, resolveAncestorByName, type MinimalTreeNode } from "@/lib/tree";
import { KNOWN_TOWN_LEVEL_NAMES } from "@/lib/knownTownLevelNames";
import { DEFENDANT_ROLE } from "@/lib/queries/personFragments";

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
        SELECT COUNT(*) AS n
        FROM summary_conviction sc
        LEFT JOIN summary_conviction_person scp
          ON scp.summary_conviction_id = sc.id AND scp.role = @defendantRole
        GROUP BY sc.id
      )
      WHERE n > 0
      ORDER BY n
      `
    )
    .all({ defendantRole: DEFENDANT_ROLE })
    .map((r) => (r as { n: number }).n);
}

// Loads the location tree once for both listTowns()/listOffenceStreets()
// below -- each offence location is resolved up to its containing
// town/parish by walking the tree (see lib/tree.ts), using the shared
// KNOWN_TOWN_LEVEL_NAMES list (lib/knownTownLevelNames.ts) to recognize
// which nodes are town-level -- v3's `location` model deliberately dropped
// the old `type` column, so there's no structural signal left in the tree
// itself for this. Previously queried the legacy `town` table directly
// here, independently of map.ts's own (verified-against-the-live-tree, and
// therefore more accurate) copy of the same list -- reconciled into one
// shared export rather than left to drift apart.
function loadLocations(): Map<number, MinimalTreeNode> {
  const locations = getDb().prepare(`SELECT id, name, parent_id FROM location`).all() as MinimalTreeNode[];
  return buildTreeIndex(locations);
}

// Every town/parish actually used as an offence location (directly or via
// a more specific descendant place), scoped to real usage so the ~90
// street/yard-level places that were never an offence location don't
// clutter the dropdown. Offence location specifically, not court location
// -- see browseList.ts's locationId filter, which this list needs to stay
// in sync with. Reads via summary_conviction_location now that a
// conviction's offence location isn't a scalar FK column any more.
export function listTowns(): Option[] {
  const byId = loadLocations();
  const rows = getDb()
    .prepare(
      `SELECT DISTINCT location_id AS id FROM summary_conviction_location WHERE role = 'location of offence'`
    )
    .all() as { id: number }[];

  const resolvedIds = new Set<number>();
  for (const { id } of rows) resolvedIds.add(resolveAncestorByName(id, byId, KNOWN_TOWN_LEVEL_NAMES).id);

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
  const byId = loadLocations();
  const rows = getDb()
    .prepare(
      `SELECT DISTINCT location_id AS id FROM summary_conviction_location WHERE role = 'location of offence'`
    )
    .all() as { id: number }[];

  const options: StreetOption[] = [];
  for (const { id } of rows) {
    const town = resolveAncestorByName(id, byId, KNOWN_TOWN_LEVEL_NAMES);
    if (town.id === id) continue; // tagged exactly at town level -- no street to show
    options.push({ id, name: titleCase(byId.get(id)!.name), townId: town.id });
  }
  return options.sort((a, b) => a.name.localeCompare(b.name));
}

// Curated sort_order (e.g. "Drink & Public Order" first), not alphabetical
// -- see data-loader/qsrecords/offence_types.py's OFFENCE_TAXONOMY.
// Top-level crime_type rows (parent_id IS NULL) are the categories, same
// as the old offence_category table.
export function listOffenceCategories(): Option[] {
  return getDb()
    .prepare(`SELECT id, name FROM crime_type WHERE parent_id IS NULL ORDER BY sort_order`)
    .all()
    .map((r) => {
      const row = r as Option;
      return { id: row.id, name: titleCase(row.name) };
    });
}

// Every distinct role a person can be filtered by on the People page --
// 'defendant' (the real stored role now, not a synthetic one -- see
// personFragments.ts's DEFENDANT_ROLE) pinned first since it's the most
// common and most likely to be picked, same ordering the old code gave its
// synthetic "offender" role. Displayed as "Offender" in the UI (see
// roles.ts) -- the value stays the literal DB string. Blank/NULL roles are
// excluded -- there's nothing to pick.
export function listPersonRoles(): string[] {
  const rows = getDb()
    .prepare(
      `
      SELECT DISTINCT role
      FROM summary_conviction_person
      WHERE NULLIF(TRIM(role), '') IS NOT NULL
      ORDER BY role
      `
    )
    .all() as { role: string }[];
  const roles = rows.map((r) => r.role);
  return [DEFENDANT_ROLE, ...roles.filter((r) => r !== DEFENDANT_ROLE)];
}

// Every distinct leading surname letter across every person mention --
// drives the People page's A-Z nav. Static/enumerable, unlike the filtered
// result set itself, so it's queried once here rather than derived
// client-side from whichever page of results happens to be loaded.
export function listPersonNameLetters(): string[] {
  const rows = getDb()
    .prepare(
      `
      SELECT DISTINCT UPPER(SUBSTR(COALESCE(last_name, first_name), 1, 1)) AS letter
      FROM person
      WHERE COALESCE(last_name, first_name) IS NOT NULL AND TRIM(COALESCE(last_name, first_name)) != ''
      ORDER BY letter
      `
    )
    .all() as { letter: string }[];
  return rows.map((r) => r.letter);
}

// Every location used as a person's own residence (person.home_location_id)
// -- distinct from listTowns() above, which is scoped to offence locations,
// not residence.
export function listResidenceTowns(): string[] {
  const rows = getDb()
    .prepare(
      `
      SELECT DISTINCT loc.name AS name
      FROM location loc
      WHERE loc.id IN (SELECT home_location_id FROM person WHERE home_location_id IS NOT NULL)
      ORDER BY loc.name
      `
    )
    .all() as { name: string }[];
  return rows.map((r) => r.name);
}

// Every occupation in the controlled vocabulary (see
// data-loader/qsrecords/models/reference.py::Occupation) -- unlike the old
// free-text defendant/person.occupation column, this is now a real lookup
// table, so listing it is a plain SELECT rather than a DISTINCT-over-free-text
// scan.
export function listOccupations(): string[] {
  const rows = getDb().prepare(`SELECT name FROM occupation ORDER BY name`).all() as { name: string }[];
  return rows.map((r) => r.name);
}

export interface OffenceTypeOption extends Option {
  categoryId: number | null;
}

// Flat, tagged with categoryId, so the UI can filter this one list
// client-side per selected category the same way listOffenceStreets() does
// for streets-per-town. Leaf crime_type rows only (parent_id IS NOT NULL) --
// a top-level row is a category, not an individually-selectable type.
export function listOffenceTypes(): OffenceTypeOption[] {
  return getDb()
    .prepare(
      `
      SELECT ct.id AS id, ct.name AS name, ct.parent_id AS categoryId
      FROM crime_type ct
      LEFT JOIN crime_type parent ON parent.id = ct.parent_id
      WHERE ct.parent_id IS NOT NULL
      ORDER BY COALESCE(parent.sort_order, 999999), ct.name
      `
    )
    .all() as OffenceTypeOption[];
}
