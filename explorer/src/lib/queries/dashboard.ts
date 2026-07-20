import { getDb } from "@/lib/db";

export interface NameCount {
  name: string;
  count: number;
}

export interface YearCount {
  year: number;
  count: number;
}

export interface Totals {
  convictions: number;
  defendants: number;
  involvedPersons: number;
  earliestYear: number | null;
  latestYear: number | null;
}

export function offenceTypeBreakdown(limit = 15): NameCount[] {
  return getDb()
    .prepare(
      `
      SELECT COALESCE(ot.name, 'Unclassified') AS name, COUNT(*) AS count
      FROM summary_conviction sc
      LEFT JOIN offence_type ot ON ot.id = sc.offence_type_id
      GROUP BY name
      ORDER BY count DESC
      LIMIT ?
      `
    )
    .all(limit) as NameCount[];
}

export function convictionsByYear(): YearCount[] {
  return getDb()
    .prepare(
      `
      SELECT offence_year AS year, COUNT(*) AS count
      FROM summary_conviction
      WHERE offence_year IS NOT NULL
      GROUP BY offence_year
      ORDER BY offence_year
      `
    )
    .all() as YearCount[];
}

export function convictionsByTown(limit = 15): NameCount[] {
  return getDb()
    .prepare(
      `
      SELECT t.name AS name, COUNT(*) AS count
      FROM summary_conviction sc
      JOIN town t ON t.id = sc.offence_location_town_id
      GROUP BY t.name
      ORDER BY count DESC
      LIMIT ?
      `
    )
    .all(limit) as NameCount[];
}

export function getTotals(): Totals {
  const db = getDb();
  const { convictions } = db
    .prepare(`SELECT COUNT(*) AS convictions FROM summary_conviction`)
    .get() as { convictions: number };
  const { defendants } = db
    .prepare(`SELECT COUNT(*) AS defendants FROM defendant`)
    .get() as { defendants: number };
  const { involvedPersons } = db
    .prepare(`SELECT COUNT(*) AS involvedPersons FROM involved_persons`)
    .get() as { involvedPersons: number };
  const { earliestYear, latestYear } = db
    .prepare(
      `SELECT MIN(offence_year) AS earliestYear, MAX(offence_year) AS latestYear FROM summary_conviction`
    )
    .get() as { earliestYear: number | null; latestYear: number | null };

  return { convictions, defendants, involvedPersons, earliestYear, latestYear };
}
