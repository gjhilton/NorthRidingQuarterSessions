import "server-only";
import { getDb } from "@/lib/db";
import type { CategoryCount } from "@/lib/queries/chartShapes";

// Process-speed query for /justice. Moved out of trends.ts once that file
// grew into a de facto dashboard.

export interface LagYearPoint {
  year: number;
  count: number; // avg days -- named `count` so it drops straight into YearTrend/Sparkline
  n: number; // dated pairs behind this point, surfaced in chart tooltips
}

export interface LagStats {
  byYear: LagYearPoint[];
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
    .map(([year, e]) => ({ year, count: Math.round((e.sum / e.count) * 10) / 10, n: e.count }));

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
