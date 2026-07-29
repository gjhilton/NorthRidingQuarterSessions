import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";
import { DEFENDANT_ROLE } from "@/lib/queries/personFragments";

// Every gender-shaped query for the /gender page. Split out of trends.ts
// once that file grew into a de facto dashboard -- see trends.ts for the
// non-gender "shape of the archive" queries and occupations.ts/patterns.ts/
// justice.ts for the rest.

export interface GenderYearPoint {
  year: number;
  count: number; // percent female -- named `count` so it drops straight into the existing YearTrend/Sparkline chart
  n: number; // records behind this point, surfaced in chart tooltips
}

export function femalePercentByYear(): GenderYearPoint[] {
  const rows = getDb()
    .prepare(
      `
      SELECT CAST(strftime('%Y', sc.offence_date) AS INTEGER) AS year, LOWER(p.sex) AS sex, COUNT(*) AS count
      FROM summary_conviction sc
      JOIN summary_conviction_person scp ON scp.summary_conviction_id = sc.id AND scp.role = '${DEFENDANT_ROLE}'
      JOIN person p ON p.id = scp.person_id
      WHERE sc.offence_date IS NOT NULL AND p.sex IS NOT NULL AND TRIM(p.sex) != ''
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
    .map(([year, e]) => ({ year, count: Math.round((e.female / e.total) * 1000) / 10, n: e.total }));
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
      SELECT CAST(strftime('%Y', sc.offence_date) AS INTEGER) AS year, LOWER(p.sex) AS sex,
        COALESCE(leaf.name, 'Unclassified') AS name, COUNT(*) AS count
      FROM summary_conviction sc
      JOIN summary_conviction_person scp ON scp.summary_conviction_id = sc.id AND scp.role = '${DEFENDANT_ROLE}'
      JOIN person p ON p.id = scp.person_id
      LEFT JOIN summary_conviction_crime_type scct ON scct.summary_conviction_id = sc.id
      LEFT JOIN crime_type leaf ON leaf.id = scct.crime_type_id
      WHERE sc.offence_date IS NOT NULL AND p.sex IN ('male', 'female')
      GROUP BY year, sex, name
      `
    )
    .all() as GenderOffenceRow[];
}

// Category-level sibling of genderOffenceRows -- same shape, grouped by the
// leaf's parent crime_type (a category, parent_id IS NULL) instead of the
// 55-leaf vocabulary. See offenceCategoryByYear in trends.ts for why
// category-level is the more legible default view.
function genderOffenceCategoryRows(): GenderOffenceRow[] {
  const rows = getDb()
    .prepare(
      `
      SELECT CAST(strftime('%Y', sc.offence_date) AS INTEGER) AS year, LOWER(p.sex) AS sex,
        COALESCE(cat.name, 'unclassified') AS name, COUNT(*) AS count
      FROM summary_conviction sc
      JOIN summary_conviction_person scp ON scp.summary_conviction_id = sc.id AND scp.role = '${DEFENDANT_ROLE}'
      JOIN person p ON p.id = scp.person_id
      LEFT JOIN summary_conviction_crime_type scct ON scct.summary_conviction_id = sc.id
      LEFT JOIN crime_type leaf ON leaf.id = scct.crime_type_id
      LEFT JOIN crime_type cat ON cat.id = leaf.parent_id
      WHERE sc.offence_date IS NOT NULL AND p.sex IN ('male', 'female')
      GROUP BY year, sex, cat.name
      `
    )
    .all() as GenderOffenceRow[];
  return rows.map((r) => ({ ...r, name: titleCase(r.name) }));
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
// entry per top-N name, each with its own full year series (nothing here
// gets bucketed into "Other").
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

export interface GenderOccupation {
  occupation: string;
  count: number;
}

// Top occupations within one sex -- contrasts sharply with the other sex's
// list (see /gender's page copy): occupations.ts's topOccupations() only
// shows the combined, male-dominated-by-volume ranking, which buries the
// female-specific pattern (street trading, "singlewoman"/"common
// prostitute" as occupation labels) entirely.
//
// occupation is now a controlled vocabulary (occupation.name, deduped at
// get-or-create time) rather than the old free-text defendant.occupation
// column, so this no longer needs the LOWER(TRIM(...))-keyed grouping the
// old free-text version did -- occupation.id is already the canonical key.
// A person can hold more than one occupation now (person_occupation isn't
// capped at one) -- same design call as occupations.ts's topOccupations():
// each occupation a defendant holds is counted separately here, so a
// defendant with 2 occupations contributes to both counts, consistent with
// the old column's one-row-per-mention counting for the common case of one
// occupation. Flagged in the port report, not silently decided.
export function occupationsBySex(sex: "male" | "female", limit = 12): GenderOccupation[] {
  return getDb()
    .prepare(
      `
      SELECT o.name AS occupation, COUNT(*) AS count
      FROM summary_conviction_person scp
      JOIN person p ON p.id = scp.person_id
      JOIN person_occupation po ON po.person_id = p.id
      JOIN occupation o ON o.id = po.occupation_id
      WHERE scp.role = '${DEFENDANT_ROLE}' AND p.sex = ?
      GROUP BY o.id
      ORDER BY count DESC
      LIMIT ?
      `
    )
    .all(sex, limit) as GenderOccupation[];
}
