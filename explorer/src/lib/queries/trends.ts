import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";

// Change-over-time aggregates for /trends. All server-only, build-time
// (better-sqlite3) -- the dataset is fixed, so there's nothing here that
// needs client-side querying.

export interface YearSeries {
  years: number[];
  seriesKeys: string[];
  data: Record<string, number | string>[];
}

function topNSeriesByYear(
  rows: { year: number; name: string; count: number }[],
  topN: number
): YearSeries {
  const totals = new Map<string, number>();
  for (const r of rows) totals.set(r.name, (totals.get(r.name) ?? 0) + r.count);

  const topNames = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name]) => name);
  const topSet = new Set(topNames);
  const seriesKeys = [...topNames, "Other"];

  const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => a - b);
  const byYear = new Map<number, Record<string, number | string>>(
    years.map((year) => [year, { year, ...Object.fromEntries(seriesKeys.map((k) => [k, 0])) }])
  );

  for (const r of rows) {
    const key = topSet.has(r.name) ? r.name : "Other";
    const point = byYear.get(r.year)!;
    point[key] = (point[key] as number) + r.count;
  }

  return { years, seriesKeys, data: [...byYear.values()] };
}

export function offenceTypeByYear(topN = 6): YearSeries {
  const rows = getDb()
    .prepare(
      `
      SELECT sc.offence_year AS year, COALESCE(ot.name, 'Unclassified') AS name, COUNT(*) AS count
      FROM summary_conviction sc
      LEFT JOIN summary_conviction_offence_type scot ON scot.summary_conviction_id = sc.id
      LEFT JOIN offence_type ot ON ot.id = scot.offence_type_id
      WHERE sc.offence_year IS NOT NULL
      GROUP BY year, name
      `
    )
    .all() as { year: number; name: string; count: number }[];
  return topNSeriesByYear(rows, topN);
}

// Category-level equivalent of offenceTypeByYear -- groups by
// offence_category rather than the 55-leaf offence_type vocabulary. This is
// the default "Offence type composition over time" view: 17 curated
// categories (see data-loader/qsrecords/offence_types.py's
// OFFENCE_TAXONOMY) read far more legibly in a top-N+Other stacked chart
// than 55 fragmented leaves ever could. A conviction with no offence_type
// tagged, or a tagged leaf with no category (an uncategorised proposal --
// see quality.unreviewedOffenceTypes), falls into "Unclassified" rather
// than being silently dropped.
export function offenceCategoryByYear(topN = 8): YearSeries {
  const rows = getDb()
    .prepare(
      `
      SELECT sc.offence_year AS year, COALESCE(oc.name, 'unclassified') AS name, COUNT(*) AS count
      FROM summary_conviction sc
      LEFT JOIN summary_conviction_offence_type scot ON scot.summary_conviction_id = sc.id
      LEFT JOIN offence_type ot ON ot.id = scot.offence_type_id
      LEFT JOIN offence_category oc ON oc.id = ot.category_id
      WHERE sc.offence_year IS NOT NULL
      GROUP BY year, oc.name
      `
    )
    .all() as { year: number; name: string; count: number }[];
  return topNSeriesByYear(
    rows.map((r) => ({ ...r, name: titleCase(r.name) })),
    topN
  );
}

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

export interface GenderYearPoint {
  year: number;
  count: number; // percent female -- named `count` so it drops straight into the existing YearTrend chart
}

export function femalePercentByYear(): GenderYearPoint[] {
  const rows = getDb()
    .prepare(
      `
      SELECT sc.offence_year AS year, LOWER(d.sex) AS sex, COUNT(*) AS count
      FROM summary_conviction sc
      JOIN summary_conviction_defendant scd ON scd.summary_conviction_id = sc.id
      JOIN defendant d ON d.id = scd.defendant_id
      WHERE sc.offence_year IS NOT NULL AND d.sex IS NOT NULL AND TRIM(d.sex) != ''
      GROUP BY year, sex
      `
    )
    .all() as { year: number; sex: string; count: number }[];

  const byYear = new Map<number, { female: number; total: number }>();
  for (const r of rows) {
    const e = byYear.get(r.year) ?? { female: 0, total: 0 };
    e.total += r.count;
    if (r.sex === "female") e.female += r.count;
    byYear.set(r.year, e);
  }

  return [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, e]) => ({ year, count: Math.round((e.female / e.total) * 1000) / 10 }));
}

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export interface CategoryCount {
  label: string;
  count: number;
}

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

// Shared by the three gender x offence-type breakdowns below. Joins both
// summary_conviction_defendant and summary_conviction_offence_type, so a
// conviction with N defendants and M offence-type tags contributes N*M rows
// -- consistent with offenceTypeByYear's existing convention of counting
// (conviction, offence-type) tag-instances rather than distinct convictions,
// just extended to also multiply across defendants. Multi-defendant records
// are rare (~2.4% of the corpus) so this is a minor, accepted overcount, not
// a correctness bug.
type GenderOffenceRow = { year: number; sex: "male" | "female"; name: string; count: number };

function genderOffenceRows(): GenderOffenceRow[] {
  return getDb()
    .prepare(
      `
      SELECT sc.offence_year AS year, LOWER(d.sex) AS sex, COALESCE(ot.name, 'Unclassified') AS name, COUNT(*) AS count
      FROM summary_conviction sc
      JOIN summary_conviction_defendant scd ON scd.summary_conviction_id = sc.id
      JOIN defendant d ON d.id = scd.defendant_id
      LEFT JOIN summary_conviction_offence_type scot ON scot.summary_conviction_id = sc.id
      LEFT JOIN offence_type ot ON ot.id = scot.offence_type_id
      WHERE sc.offence_year IS NOT NULL AND d.sex IN ('male', 'female')
      GROUP BY year, sex, name
      `
    )
    .all() as GenderOffenceRow[];
}

// Category-level sibling of genderOffenceRows -- same shape, grouped by
// offence_category instead of the 55-leaf offence_type vocabulary. See
// offenceCategoryByYear above for why category-level is the more legible
// default view.
function genderOffenceCategoryRows(): GenderOffenceRow[] {
  const rows = getDb()
    .prepare(
      `
      SELECT sc.offence_year AS year, LOWER(d.sex) AS sex, COALESCE(oc.name, 'unclassified') AS name, COUNT(*) AS count
      FROM summary_conviction sc
      JOIN summary_conviction_defendant scd ON scd.summary_conviction_id = sc.id
      JOIN defendant d ON d.id = scd.defendant_id
      LEFT JOIN summary_conviction_offence_type scot ON scot.summary_conviction_id = sc.id
      LEFT JOIN offence_type ot ON ot.id = scot.offence_type_id
      LEFT JOIN offence_category oc ON oc.id = ot.category_id
      WHERE sc.offence_year IS NOT NULL AND d.sex IN ('male', 'female')
      GROUP BY year, sex, oc.name
      `
    )
    .all() as GenderOffenceRow[];
  return rows.map((r) => ({ ...r, name: titleCase(r.name) }));
}

export interface GenderYearSeries {
  seriesKeys: string[];
  male: YearSeries;
  female: YearSeries;
}

// The two charts (male composition, female composition) share one top-N
// category set -- selected by combined male+female volume -- so the same
// legend colour means the same offence type in both charts and "Other"
// isn't hiding a different mix of categories on each side.
function genderYearSeriesFromRows(rows: GenderOffenceRow[], topN: number): GenderYearSeries {
  const totals = new Map<string, number>();
  for (const r of rows) totals.set(r.name, (totals.get(r.name) ?? 0) + r.count);
  const topNames = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name]) => name);
  const topSet = new Set(topNames);
  const seriesKeys = [...topNames, "Other"];

  function buildFor(sex: "male" | "female"): YearSeries {
    const filtered = rows.filter((r) => r.sex === sex);
    const years = [...new Set(filtered.map((r) => r.year))].sort((a, b) => a - b);
    const byYear = new Map<number, Record<string, number | string>>(
      years.map((year) => [year, { year, ...Object.fromEntries(seriesKeys.map((k) => [k, 0])) }])
    );
    for (const r of filtered) {
      const key = topSet.has(r.name) ? r.name : "Other";
      const point = byYear.get(r.year)!;
      point[key] = (point[key] as number) + r.count;
    }
    return { years, seriesKeys, data: [...byYear.values()] };
  }

  return { seriesKeys, male: buildFor("male"), female: buildFor("female") };
}

export function offenceTypeByYearBySex(topN = 6): GenderYearSeries {
  return genderYearSeriesFromRows(genderOffenceRows(), topN);
}

export function offenceCategoryByYearBySex(topN = 8): GenderYearSeries {
  return genderYearSeriesFromRows(genderOffenceCategoryRows(), topN);
}

export interface GenderTrendPoint {
  year: number;
  male: number;
  female: number;
}

export interface OffenceGenderTrend {
  offenceType: string;
  total: number;
  points: GenderTrendPoint[];
}

// Per-offence-type (or, via genderOffenceCategoryRows, per-category)
// male/female counts by year, for the single-category explorer -- one
// entry per top-N name, each with its own full year series (unlike
// genderYearSeriesFromRows, nothing here gets bucketed into "Other").
function genderTrendsFromRows(rows: GenderOffenceRow[], topN: number): OffenceGenderTrend[] {
  const byType = new Map<string, { total: number; byYear: Map<number, GenderTrendPoint> }>();
  for (const r of rows) {
    const entry = byType.get(r.name) ?? { total: 0, byYear: new Map() };
    entry.total += r.count;
    const point = entry.byYear.get(r.year) ?? { year: r.year, male: 0, female: 0 };
    point[r.sex] += r.count;
    entry.byYear.set(r.year, point);
    byType.set(r.name, entry);
  }

  return [...byType.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, topN)
    .map(([offenceType, entry]) => ({
      offenceType,
      total: entry.total,
      points: [...entry.byYear.values()].sort((a, b) => a.year - b.year),
    }));
}

export function offenceGenderTrendsByType(topN = 15): OffenceGenderTrend[] {
  return genderTrendsFromRows(genderOffenceRows(), topN);
}

// topN defaults to the full category count (17) -- unlike leaf offence
// types there are few enough categories that truncating the dropdown
// wouldn't save much and would just hide options.
export function offenceCategoryGenderTrends(topN = 20): OffenceGenderTrend[] {
  return genderTrendsFromRows(genderOffenceCategoryRows(), topN);
}

export interface OffenceGenderTotal {
  label: string;
  male: number;
  female: number;
  percentFemale: number;
}

// Whole-corpus male/female totals per offence type (or category), no time
// dimension -- the static comparison table.
function genderTotalsFromRows(rows: GenderOffenceRow[], topN: number): OffenceGenderTotal[] {
  const byType = new Map<string, { male: number; female: number }>();
  for (const r of rows) {
    const e = byType.get(r.name) ?? { male: 0, female: 0 };
    e[r.sex] += r.count;
    byType.set(r.name, e);
  }

  return [...byType.entries()]
    .map(([label, e]) => ({
      label,
      male: e.male,
      female: e.female,
      percentFemale: Math.round((e.female / (e.male + e.female)) * 1000) / 10,
    }))
    .sort((a, b) => b.male + b.female - (a.male + a.female))
    .slice(0, topN);
}

export function offenceTypeGenderTotals(topN = 15): OffenceGenderTotal[] {
  return genderTotalsFromRows(genderOffenceRows(), topN);
}

export function offenceCategoryGenderTotals(topN = 20): OffenceGenderTotal[] {
  return genderTotalsFromRows(genderOffenceCategoryRows(), topN);
}

export interface LagStats {
  byYear: GenderYearPoint[]; // { year, count } -- count here means avg days
  histogram: CategoryCount[];
}

export function offenceToConvictionLag(): LagStats {
  const rows = getDb()
    .prepare(
      `
      SELECT
        offence_year AS year,
        CAST(julianday(conviction_date) - julianday(offence_date) AS INTEGER) AS lagDays
      FROM summary_conviction
      WHERE offence_date IS NOT NULL AND conviction_date IS NOT NULL AND offence_year IS NOT NULL
      `
    )
    .all() as { year: number; lagDays: number }[];

  // A negative lag means the extracted offence/conviction dates are out of
  // order (data-entry noise, not a real "conviction before the offence") --
  // excluded rather than shown as a misleading data point.
  const valid = rows.filter((r) => r.lagDays >= 0);

  const byYearMap = new Map<number, { sum: number; count: number }>();
  for (const r of valid) {
    const e = byYearMap.get(r.year) ?? { sum: 0, count: 0 };
    e.sum += r.lagDays;
    e.count += 1;
    byYearMap.set(r.year, e);
  }
  const byYear = [...byYearMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, e]) => ({ year, count: Math.round((e.sum / e.count) * 10) / 10 }));

  const buckets: [string, (d: number) => boolean][] = [
    ["Same day", (d) => d === 0],
    ["1–7 days", (d) => d >= 1 && d <= 7],
    ["1–4 weeks", (d) => d > 7 && d <= 28],
    ["1–3 months", (d) => d > 28 && d <= 90],
    ["3+ months", (d) => d > 90],
  ];
  const histogram = buckets.map(([label, test]) => ({
    label,
    count: valid.filter((r) => test(r.lagDays)).length,
  }));

  return { byYear, histogram };
}
