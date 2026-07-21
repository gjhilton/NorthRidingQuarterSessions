// Client-safe: no import of @/lib/db (better-sqlite3). Deliberately client-
// side, like onThisDay.ts -- picking a random row on every page load (rather
// than baking one fixed pick into the static build) needs to run in the
// browser.
import type { DbLike } from "@/lib/dbTypes";

export interface EspecialInterestRow {
  id: number;
  reference_number: string;
  offence_date: string | null;
  conviction_date: string | null;
  charge_description: string;
}

export function randomEspecialInterest(db: DbLike): EspecialInterestRow | null {
  const row = db
    .prepare(
      `
      SELECT id, reference_number, offence_date, conviction_date, charge_description
      FROM summary_conviction
      WHERE of_especial_interest = 1
      ORDER BY RANDOM()
      LIMIT 1
      `
    )
    .get() as EspecialInterestRow | undefined;
  return row ?? null;
}
