import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";
import { topNSeriesByYear, type YearSeries } from "@/lib/queries/chartShapes";

// The "shape of the archive over time" queries for /trends itself. Gender,
// occupation, seasonal, and process-speed breakdowns each moved to their
// own thematic page/query file (queries/gender.ts, occupations.ts,
// patterns.ts, justice.ts) once this file grew into a de facto dashboard --
// see those files for the rest of what used to live here.

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
