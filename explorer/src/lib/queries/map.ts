import "server-only";
import { getDb } from "@/lib/db";

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
