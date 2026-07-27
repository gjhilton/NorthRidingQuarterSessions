import "server-only";
import { getDb } from "@/lib/db";

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
  rawCaseTotal: number;
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
  const { rawCaseTotal } = db
    .prepare(`SELECT COUNT(*) AS rawCaseTotal FROM raw_case`)
    .get() as { rawCaseTotal: number };

  return { convictions, defendants, involvedPersons, earliestYear, latestYear, rawCaseTotal };
}
