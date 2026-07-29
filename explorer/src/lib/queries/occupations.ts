import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";
import type { CategoryCount } from "@/lib/queries/chartShapes";
import { DEFENDANT_ROLE } from "@/lib/queries/personFragments";

// Occupation-shaped queries for /occupations. Split out of trends.ts once
// that file grew into a de facto dashboard -- see gender.ts for the
// occupation-by-sex breakdown (kept there since it's fundamentally a
// gender finding) and trends.ts/patterns.ts/justice.ts for the rest.

// occupation is a controlled vocabulary now (get-or-create on a normalized
// name -- see data-loader/qsrecords/models/reference.py::Occupation),
// replacing the old free-text defendant.occupation column that had
// fragmented into 405 raw strings. That means no more LOWER(TRIM(...))
// grouping key -- occupation.id is already the canonical dedup key -- but
// it does mean a defendant can hold more than one occupation at once
// (person_occupation isn't capped at one). DESIGN CALL (not fully
// specified by the port brief): each occupation a defendant holds is
// counted separately here (a defendant with 2 occupations contributes to
// both bars), rather than picking one occupation per person -- this only
// changes the numbers for the small number of people with >1 recorded
// occupation, and "count every stated occupation" seemed truer to the data
// than arbitrarily picking one. Flagged in the port report.
export function topOccupations(limit = 12): CategoryCount[] {
  return getDb()
    .prepare(
      `
      SELECT o.name AS label, COUNT(*) AS count
      FROM summary_conviction_person scp
      JOIN person_occupation po ON po.person_id = scp.person_id
      JOIN occupation o ON o.id = po.occupation_id
      WHERE scp.role = '${DEFENDANT_ROLE}'
      GROUP BY o.id
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
        o.id AS occ_key,
        o.name AS occupation,
        COALESCE(cat.name, 'unclassified') AS category,
        COUNT(*) AS count
      FROM summary_conviction_person scp
      JOIN person_occupation po ON po.person_id = scp.person_id
      JOIN occupation o ON o.id = po.occupation_id
      LEFT JOIN summary_conviction_crime_type scct ON scct.summary_conviction_id = scp.summary_conviction_id
      LEFT JOIN crime_type leaf ON leaf.id = scct.crime_type_id
      LEFT JOIN crime_type cat ON cat.id = leaf.parent_id
      WHERE scp.role = '${DEFENDANT_ROLE}'
      GROUP BY occ_key, category
      `
    )
    .all() as { occ_key: number; occupation: string; category: string; count: number }[];

  const occTotals = new Map<number, number>();
  const occLabels = new Map<number, string>();
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
