import "server-only";
import { getDb } from "@/lib/db";

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
      LEFT JOIN offence_type ot ON ot.id = sc.offence_type_id
      WHERE sc.offence_year IS NOT NULL
      GROUP BY year, name
      `
    )
    .all() as { year: number; name: string; count: number }[];
  return topNSeriesByYear(rows, topN);
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
  return topNSeriesByYear(rows, topN);
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
