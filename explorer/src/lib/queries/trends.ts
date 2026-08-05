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
      SELECT CAST(strftime('%Y', sc.offence_date) AS INTEGER) AS year,
        COALESCE(leaf.name, 'Unclassified') AS name, COUNT(*) AS count
      FROM summary_conviction sc
      LEFT JOIN summary_conviction_crime_type scct ON scct.summary_conviction_id = sc.id
      LEFT JOIN crime_type leaf ON leaf.id = scct.crime_type_id
      WHERE sc.offence_date IS NOT NULL
      GROUP BY year, name
      `
    )
    .all() as { year: number; name: string; count: number }[];
  return topNSeriesByYear(rows, topN);
}

// Category-level equivalent of offenceTypeByYear -- groups by the leaf's
// parent crime_type (a category, parent_id IS NULL) rather than the
// 55-leaf vocabulary. This is the default "Offence type composition over
// time" view: 17 curated categories (see
// data-loader/qsrecords/offence_types.py's OFFENCE_TAXONOMY) read far more
// legibly in a top-N+Other stacked chart than 55 fragmented leaves ever
// could. A conviction with no crime_type tagged, or a tagged leaf with no
// category (an uncategorised proposal -- see
// quality.unreviewedOffenceTypes), falls into "Unclassified" rather than
// being silently dropped.
export function offenceCategoryByYear(topN = 8): YearSeries {
  const rows = getDb()
    .prepare(
      `
      SELECT CAST(strftime('%Y', sc.offence_date) AS INTEGER) AS year,
        COALESCE(cat.name, 'unclassified') AS name, COUNT(*) AS count
      FROM summary_conviction sc
      LEFT JOIN summary_conviction_crime_type scct ON scct.summary_conviction_id = sc.id
      LEFT JOIN crime_type leaf ON leaf.id = scct.crime_type_id
      LEFT JOIN crime_type cat ON cat.id = leaf.parent_id
      WHERE sc.offence_date IS NOT NULL
      GROUP BY year, cat.name
      `
    )
    .all() as { year: number; name: string; count: number }[];
  return topNSeriesByYear(
    rows.map((r) => ({ ...r, name: titleCase(r.name) })),
    topN
  );
}
