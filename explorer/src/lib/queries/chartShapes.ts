// Shapes and helpers shared across the query files that back the "Insights"
// pages (trends.ts, map.ts, occupations.ts, patterns.ts, justice.ts) --
// split out here once those pages stopped being one big trends.ts, since
// topNSeriesByYear and CategoryCount are each used from 2-3 of them.

export interface CategoryCount {
  label: string;
  count: number;
}

export interface YearSeries {
  years: number[];
  seriesKeys: string[];
  data: Record<string, number | string>[];
}

// Buckets an arbitrary (year, name, count) row set into the top-N names by
// total volume plus an "Other" catch-all, one data point per year with a
// value for every series key (0 where that year had no rows for that
// name) -- the shape StackedYearArea expects.
export function topNSeriesByYear(
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
