import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";
import { buildTreeIndex, isWithin, resolveAncestorByName, type MinimalTreeNode } from "@/lib/tree";
import { KNOWN_TOWN_LEVEL_NAMES } from "@/lib/knownTownLevelNames";
import { topNSeriesByYear, type YearSeries } from "@/lib/queries/chartShapes";

// Both map pages used to source their pins from hand-compiled lookup tables
// (lib/townCoordinates.ts, lib/streetCoordinates.ts) keyed by the old flat
// town/street names -- a second, parallel, much less complete location
// system alongside the real place tree the rest of the site (Locations,
// polygon fetching) has been built on. This file replaces both: every point
// plotted here comes from location.latitude/longitude (or the nearest
// ancestor's, when a specific leaf has none of its own), and grouping is
// resolved by walking the tree (see lib/tree.ts) rather than joining the
// legacy town/street tables.

export interface MapPointRow {
  id: number;
  name: string;
  count: number;
  lat: number;
  lon: number;
}

interface LocationRow extends MinimalTreeNode {
  latitude: number | null;
  longitude: number | null;
}

// The stored role value for a summary_conviction_location row that marks
// where the offence itself happened -- see core.py's SummaryConvictionLocation.
const OFFENCE_LOCATION_ROLE = "location of offence";

// The whole tree is ~350 rows -- trivial to hold in memory and walk
// in-process rather than express each lookup as a recursive SQL CTE.
function loadPlaces(): Map<number, LocationRow> {
  const rows = getDb()
    .prepare(`SELECT id, name, parent_id, latitude, longitude FROM location`)
    .all() as LocationRow[];
  return buildTreeIndex(rows);
}

// Same anchor-point logic as scripts/generate-place-paths.mjs's findAnchor:
// walks upward until it finds a place with its own coordinate. Almost every
// leaf has one after this session's geolocation pass, but a handful of
// unmappable path-type places don't, so this still needs the fallback.
function findCoordinate(id: number, places: Map<number, LocationRow>): [number, number] | null {
  let current = places.get(id);
  while (current) {
    if (current.latitude != null && current.longitude != null) {
      return [current.latitude, current.longitude];
    }
    current = current.parent_id != null ? places.get(current.parent_id) : undefined;
  }
  return null;
}

// Every conviction's offence-location node id, from the new
// summary_conviction_location junction (role-scoped, replacing the old
// scalar offence_location_id column) -- shared by every query below that
// used to select straight off summary_conviction.
function offenceLocationCounts(): { id: number; count: number }[] {
  return getDb()
    .prepare(
      `SELECT location_id AS id, COUNT(*) AS count FROM summary_conviction_location
       WHERE role = '${OFFENCE_LOCATION_ROLE}' GROUP BY location_id`
    )
    .all() as { id: number; count: number }[];
}

// The map needs every town/parish with at least one case plotted, not just
// a top-N slice.
export function allTownCaseCounts(): MapPointRow[] {
  const places = loadPlaces();

  const rows = offenceLocationCounts();

  const grouped = new Map<number, number>();
  for (const { id, count } of rows) {
    const resolved = resolveAncestorByName(id, places, KNOWN_TOWN_LEVEL_NAMES);
    grouped.set(resolved.id, (grouped.get(resolved.id) ?? 0) + count);
  }

  const points: MapPointRow[] = [];
  for (const [id, count] of grouped) {
    const coord = findCoordinate(id, places);
    if (!coord) continue;
    const place = places.get(id)!;
    points.push({ id, name: titleCase(place.name), count, lat: coord[0], lon: coord[1] });
  }
  return points.sort((a, b) => b.count - a.count);
}

// How many cases have an offence location at all but no town/parish
// anywhere in their ancestry resolves to a coordinate -- drives the "N not
// plotted" caveat note, same purpose the old lookup-table gap count served,
// now measuring a real (much smaller) gap instead of "not yet hand-typed."
export function unmappedTownCaseCount(): number {
  const places = loadPlaces();
  const rows = offenceLocationCounts();
  let unmapped = 0;
  for (const { id, count } of rows) {
    const resolved = resolveAncestorByName(id, places, KNOWN_TOWN_LEVEL_NAMES);
    if (!findCoordinate(resolved.id, places)) unmapped += count;
  }
  return unmapped;
}

// Moved from trends.ts -- geography content belongs with geography, not
// buried in the time-trends page.
export function townByYear(topN = 5): YearSeries {
  const places = loadPlaces();

  const rows = getDb()
    .prepare(
      `SELECT scl.location_id AS id, CAST(strftime('%Y', sc.offence_date) AS INTEGER) AS year
       FROM summary_conviction sc
       JOIN summary_conviction_location scl ON scl.summary_conviction_id = sc.id AND scl.role = '${OFFENCE_LOCATION_ROLE}'
       WHERE sc.offence_date IS NOT NULL`
    )
    .all() as { id: number; year: number }[];

  const grouped = new Map<string, { year: number; name: string; count: number }>();
  for (const { id, year } of rows) {
    const resolved = resolveAncestorByName(id, places, KNOWN_TOWN_LEVEL_NAMES);
    const key = `${resolved.id}-${year}`;
    const existing = grouped.get(key);
    if (existing) existing.count += 1;
    else grouped.set(key, { year, name: titleCase(resolved.name), count: 1 });
  }

  return topNSeriesByYear([...grouped.values()], topN);
}

// Every offence location within Whitby's own subtree, at whatever depth it
// actually sits (streets are two levels below Whitby -- Whitby > district
// > street -- and a handful of yards go a level deeper still), each grouped
// by its own exact place rather than rolled up to a fixed depth. An earlier
// version of this tried to resolve everything to "the direct child of
// Whitby," which silently collapsed 142 real distinct streets down to the
// 3 intervening districts (East Cliff/West Cliff/Seafront) -- checked
// directly against the data before shipping either version, see the
// project's own audit notes.
export function whitbyStreetCaseCounts(): MapPointRow[] {
  const places = loadPlaces();
  const whitby = [...places.values()].find((p) => p.name.toLowerCase() === "whitby");
  if (!whitby) return [];
  const whitbyId = whitby.id;

  const rows = offenceLocationCounts();

  const points: MapPointRow[] = [];
  for (const { id, count } of rows) {
    if (id === whitbyId || !isWithin(id, whitbyId, places)) continue;
    const coord = findCoordinate(id, places);
    if (!coord) continue;
    points.push({ id, name: titleCase(places.get(id)!.name), count, lat: coord[0], lon: coord[1] });
  }
  return points.sort((a, b) => b.count - a.count);
}
