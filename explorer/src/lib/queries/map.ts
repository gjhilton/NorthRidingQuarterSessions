import "server-only";
import { getDb } from "@/lib/db";

export interface TownCaseCount {
  name: string;
  count: number;
}

// Unlike dashboard.ts's convictionsByTown (top N for a bar chart), the map
// needs every town with at least one case, not just the busiest ones.
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
