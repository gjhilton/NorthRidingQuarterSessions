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

export function especialInterestCount(): number {
  const { count } = getDb()
    .prepare(`SELECT COUNT(*) AS count FROM summary_conviction WHERE of_especial_interest = 1`)
    .get() as { count: number };
  return count;
}

export interface FieldCoverage {
  field: string;
  filled: number;
  total: number;
  pct: number;
}

// Fields that are easy to assume are reliably populated just because
// they're in the schema, but in practice are rarely stated in the source
// archivist's summary at all -- see About's "Field coverage" section. Not
// an exhaustive list of every nullable column, just the ones a researcher
// is likely to build on without checking first.
export function fieldCoverage(): FieldCoverage[] {
  const db = getDb();
  const { convictionTotal } = db
    .prepare(`SELECT COUNT(*) AS convictionTotal FROM summary_conviction`)
    .get() as { convictionTotal: number };
  const { defendantTotal } = db
    .prepare(`SELECT COUNT(*) AS defendantTotal FROM defendant`)
    .get() as { defendantTotal: number };

  function coverage(table: string, column: string, label: string, total: number): FieldCoverage {
    const { filled } = db
      .prepare(
        `SELECT COUNT(*) AS filled FROM ${table} WHERE ${column} IS NOT NULL AND TRIM(CAST(${column} AS TEXT)) != ''`
      )
      .get() as { filled: number };
    return { field: label, filled, total, pct: Math.round((filled / total) * 1000) / 10 };
  }

  return [
    coverage("summary_conviction", "sentencing", "Sentencing", convictionTotal),
    coverage(
      "summary_conviction",
      "petty_sessional_division_id",
      "Petty sessional division",
      convictionTotal
    ),
    coverage("summary_conviction", "monetary_value_raw", "Monetary value", convictionTotal),
    coverage("summary_conviction", "game_species", "Game species (poaching offences)", convictionTotal),
    coverage(
      "summary_conviction",
      "extraction_confidence",
      "Extraction confidence recorded",
      convictionTotal
    ),
    coverage("defendant", "occupation", "Defendant occupation", defendantTotal),
    coverage("defendant", "age", "Defendant age", defendantTotal),
    coverage("defendant", "marital_status", "Defendant marital status", defendantTotal),
    coverage("defendant", "relationship_type", "Defendant relationship (e.g. ‘wife of’)", defendantTotal),
  ];
}

export function relatedConvictionPairCount(): number {
  const { count } = getDb()
    .prepare(`SELECT COUNT(*) AS count FROM related_conviction`)
    .get() as { count: number };
  return count;
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
