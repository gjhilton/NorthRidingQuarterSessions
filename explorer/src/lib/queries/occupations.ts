import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";
import type { CategoryCount } from "@/lib/queries/chartShapes";

// Occupation-shaped queries for /occupations. Split out of trends.ts once
// that file grew into a de facto dashboard -- see gender.ts for the
// occupation-by-sex breakdown (kept there since it's fundamentally a
// gender finding) and trends.ts/patterns.ts/justice.ts for the rest.

export function topOccupations(limit = 12): CategoryCount[] {
  return getDb()
    .prepare(
      `
      SELECT MIN(TRIM(occupation)) AS label, COUNT(*) AS count
      FROM defendant
      WHERE occupation IS NOT NULL AND TRIM(occupation) != ''
      GROUP BY LOWER(TRIM(occupation))
      ORDER BY count DESC
      LIMIT ?
      `
    )
    .all(limit) as CategoryCount[];
}

export interface OccupationCategoryMatrix {
  occupations: string[]; // row headers, most-prosecuted occupation first
  categories: string[]; // column headers, incl. trailing "Other"
  cells: Record<string, Record<string, number>>; // cells[occupation][category]
  rowTotals: Record<string, number>;
}

// Cross-tab answering "did different occupations get prosecuted for
// different things" -- topOccupations() above answers "which occupations
// appear most" but has no offence dimension at all. Counts (occupation,
// category) pairs at the conviction-defendant level, same convention as
// genderOffenceRows: a conviction with multiple defendants or offence-type
// tags contributes multiple rows.
export function occupationByOffenceCategory(
  topOccupationsN = 10,
  topCategories = 6
): OccupationCategoryMatrix {
  const rows = getDb()
    .prepare(
      `
      SELECT
        LOWER(TRIM(d.occupation)) AS occ_key,
        MIN(TRIM(d.occupation)) AS occupation,
        COALESCE(oc.name, 'unclassified') AS category,
        COUNT(*) AS count
      FROM defendant d
      JOIN summary_conviction_defendant scd ON scd.defendant_id = d.id
      LEFT JOIN summary_conviction_offence_type scot ON scot.summary_conviction_id = scd.summary_conviction_id
      LEFT JOIN offence_type ot ON ot.id = scot.offence_type_id
      LEFT JOIN offence_category oc ON oc.id = ot.category_id
      WHERE d.occupation IS NOT NULL AND TRIM(d.occupation) != ''
      GROUP BY occ_key, category
      `
    )
    .all() as { occ_key: string; occupation: string; category: string; count: number }[];

  const occTotals = new Map<string, number>();
  const occLabels = new Map<string, string>();
  const catTotals = new Map<string, number>();
  for (const r of rows) {
    occTotals.set(r.occ_key, (occTotals.get(r.occ_key) ?? 0) + r.count);
    occLabels.set(r.occ_key, r.occupation);
    catTotals.set(r.category, (catTotals.get(r.category) ?? 0) + r.count);
  }

  const occupations = [...occTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topOccupationsN)
    .map(([key]) => occLabels.get(key)!);
  const occKeyToLabel = new Set(occupations);

  const topCatNames = [...catTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topCategories)
    .map(([name]) => name);
  const topCatSet = new Set(topCatNames);
  const categories = [...topCatNames.map(titleCase), "Other"];

  const cells: Record<string, Record<string, number>> = {};
  const rowTotals: Record<string, number> = {};
  for (const label of occupations) {
    cells[label] = Object.fromEntries(categories.map((c) => [c, 0]));
    rowTotals[label] = 0;
  }

  for (const r of rows) {
    const label = occLabels.get(r.occ_key)!;
    if (!occKeyToLabel.has(label)) continue;
    const catLabel = topCatSet.has(r.category) ? titleCase(r.category) : "Other";
    cells[label][catLabel] += r.count;
    rowTotals[label] += r.count;
  }

  return { occupations, categories, cells, rowTotals };
}
