import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";
import { topNSeriesByYear, type YearSeries } from "@/lib/queries/chartShapes";

export interface TownCaseCount {
  name: string;
  count: number;
}

// The map needs every town with at least one case plotted, not just a
// top-N slice.
export function allTownCaseCounts(): TownCaseCount[] {
  return getDb()
    .prepare(
      `
      SELECT t.name AS name, COUNT(*) AS count
      FROM summary_conviction sc
      JOIN town t ON t.id = sc.offence_location_town_id
      GROUP BY t.name
      ORDER BY count DESC
      `
    )
    .all() as TownCaseCount[];
}

// Moved from trends.ts -- geography content belongs with geography, not
// buried in the time-trends page.
export function townByYear(topN = 5): YearSeries {
  const rows = getDb()
    .prepare(
      `
      SELECT sc.offence_year AS year, t.name AS name, COUNT(*) AS count
      FROM summary_conviction sc
      JOIN town t ON t.id = sc.offence_location_town_id
      WHERE sc.offence_year IS NOT NULL
      GROUP BY year, name
      `
    )
    .all() as { year: number; name: string; count: number }[];
  return topNSeriesByYear(
    rows.map((r) => ({ ...r, name: titleCase(r.name) })),
    topN
  );
}

export interface StreetCaseCount {
  name: string;
  count: number;
}

// Scoped to streets whose *street* record belongs to Whitby (street.town_id,
// matching listStreets() in queries/streets.ts), not just any offence
// recorded while the conviction's town happened to be Whitby.
export function whitbyStreetCaseCounts(): StreetCaseCount[] {
  return getDb()
    .prepare(
      `
      SELECT s.name AS name, COUNT(*) AS count
      FROM summary_conviction sc
      JOIN street s ON s.id = sc.offence_location_street_id
      JOIN town t ON t.id = s.town_id
      WHERE t.name = 'whitby'
      GROUP BY s.name
      ORDER BY count DESC
      `
    )
    .all() as StreetCaseCount[];
}
