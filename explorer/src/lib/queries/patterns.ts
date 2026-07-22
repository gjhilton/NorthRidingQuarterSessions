import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";
import type { CategoryCount } from "@/lib/queries/chartShapes";

// Seasonal/social-pattern queries for /patterns. dayOfWeekBreakdown moved
// here from trends.ts once that file grew into a de facto dashboard --
// seasonalityByCategory, defendantsPerConvictionByCategory, and
// gameSpeciesBreakdown are new, added alongside it since they're the same
// kind of "temporal/social rhythm" fact.

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function dayOfWeekBreakdown(): CategoryCount[] {
  const rows = getDb()
    .prepare(
      `
      SELECT offence_day_of_week AS day, COUNT(*) AS count
      FROM summary_conviction
      WHERE offence_day_of_week IS NOT NULL AND TRIM(offence_day_of_week) != ''
      GROUP BY day
      `
    )
    .all() as { day: string; count: number }[];

  const normalized = new Map<string, number>();
  for (const r of rows) {
    const key = r.day.trim();
    const canonical = DAY_ORDER.find((d) => d.toLowerCase() === key.toLowerCase()) ?? key;
    normalized.set(canonical, (normalized.get(canonical) ?? 0) + r.count);
  }

  return DAY_ORDER.map((day) => ({ label: day, count: normalized.get(day) ?? 0 }));
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export interface CategorySeasonality {
  category: string;
  total: number;
  months: { x: number; y: number }[]; // length 12, x = 1-12, Sparkline-ready
  peakMonth: string;
}

// The strongest finding from historian-persona exploration of this corpus:
// poaching convictions run 3-4x higher Sept-Dec (the actual English game
// season -- partridge opens Sept 1, pheasant Oct 1) than Jan-May, a
// distinct signature from the corpus's general summer peak (more outdoor
// activity/daylight/fairs). Grouping by top-N categories side by side is
// the point of this query -- it's built for the /patterns Sparkline grid,
// not a single chart.
export function seasonalityByCategory(topN = 8): CategorySeasonality[] {
  const rows = getDb()
    .prepare(
      `
      SELECT oc.name AS category, CAST(strftime('%m', sc.offence_date) AS INTEGER) AS month, COUNT(*) AS count
      FROM summary_conviction sc
      JOIN summary_conviction_offence_type scot ON scot.summary_conviction_id = sc.id
      JOIN offence_type ot ON ot.id = scot.offence_type_id
      JOIN offence_category oc ON oc.id = ot.category_id
      WHERE sc.offence_date IS NOT NULL
      GROUP BY category, month
      `
    )
    .all() as { category: string; month: number; count: number }[];

  const totals = new Map<string, number>();
  for (const r of rows) totals.set(r.category, (totals.get(r.category) ?? 0) + r.count);
  const topCategories = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([category]) => category);
  const topSet = new Set(topCategories);

  const byCategory = new Map<string, number[]>(topCategories.map((c) => [c, Array(12).fill(0)]));
  for (const r of rows) {
    if (!topSet.has(r.category)) continue;
    byCategory.get(r.category)![r.month - 1] += r.count;
  }

  return topCategories.map((category) => {
    const months = byCategory.get(category)!;
    const peakIndex = months.indexOf(Math.max(...months));
    return {
      category: titleCase(category),
      total: totals.get(category)!,
      months: months.map((y, i) => ({ x: i + 1, y })),
      peakMonth: MONTH_NAMES[peakIndex],
    };
  });
}

export interface CategoryGroupSize {
  category: string;
  avgDefendants: number;
  convictions: number;
}

// Average defendants per conviction, by category -- poaching (gang/party
// activity, historically) and property offences run noticeably higher than
// vagrancy/assault (almost always solo). minConvictions filters out tiny
// categories where one or two multi-defendant records would otherwise
// dominate the ranking on noise alone.
export function defendantsPerConvictionByCategory(minConvictions = 20): CategoryGroupSize[] {
  const rows = getDb()
    .prepare(
      `
      SELECT oc.name AS category, COUNT(DISTINCT sc.id) AS convictions,
             ROUND(AVG(dcount.n), 2) AS avgDefendants
      FROM summary_conviction sc
      JOIN summary_conviction_offence_type scot ON scot.summary_conviction_id = sc.id
      JOIN offence_type ot ON ot.id = scot.offence_type_id
      JOIN offence_category oc ON oc.id = ot.category_id
      JOIN (
        SELECT summary_conviction_id, COUNT(*) AS n
        FROM summary_conviction_defendant
        GROUP BY summary_conviction_id
      ) dcount ON dcount.summary_conviction_id = sc.id
      GROUP BY oc.name
      HAVING COUNT(DISTINCT sc.id) >= ?
      ORDER BY avgDefendants DESC
      `
    )
    .all(minConvictions) as { category: string; convictions: number; avgDefendants: number }[];

  return rows.map((r) => ({ ...r, category: titleCase(r.category) }));
}

export interface SpeciesCount {
  species: string;
  count: number;
}

export function gameSpeciesBreakdown(limit = 10): SpeciesCount[] {
  return getDb()
    .prepare(
      `
      SELECT MIN(TRIM(game_species)) AS species, COUNT(*) AS count
      FROM summary_conviction
      WHERE game_species IS NOT NULL AND TRIM(game_species) != ''
      GROUP BY LOWER(TRIM(game_species))
      ORDER BY count DESC
      LIMIT ?
      `
    )
    .all(limit) as SpeciesCount[];
}
