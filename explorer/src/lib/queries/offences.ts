// Server-only (better-sqlite3, build-time) -- the whole offence taxonomy
// and every conviction tagged against it is enumerable at build time, same
// "prerender everything, no client-side query needed" reasoning as
// conviction detail pages (see convictions/[reference]/page.tsx's own
// comment) -- an offence type's membership doesn't depend on user input.
import "server-only";
import { getDb } from "@/lib/db";
import { personNamesExpr } from "@/lib/queries/personFragments";

export const OFFENCE_PAGE_SIZE = 25;

export interface OffenceTypeListRow {
  id: number;
  name: string;
  count: number;
}

// Alphabetical, not by count -- this is the master index, a reader scans it
// for a specific offence, not "what's most common" (that's what Trends is
// for).
// "Leaf" crime_type rows only (parent_id IS NOT NULL) -- the old offence_type
// table's equivalent; a top-level crime_type row (parent_id IS NULL) is a
// category, not an individually-browsable offence type.
export function listOffenceTypesAlphabetical(): OffenceTypeListRow[] {
  return getDb()
    .prepare(
      `
      SELECT ct.id, ct.name, COUNT(scct.summary_conviction_id) AS count
      FROM crime_type ct
      LEFT JOIN summary_conviction_crime_type scct ON scct.crime_type_id = ct.id
      WHERE ct.parent_id IS NOT NULL
      GROUP BY ct.id
      ORDER BY ct.name
      `
    )
    .all() as OffenceTypeListRow[];
}

export interface OffenceCategoryGroup {
  category: string;
  types: OffenceTypeListRow[];
}

// For the master /offences listing -- types grouped under their category,
// categories in the taxonomy's own defined order (offence_category.sort_order),
// types alphabetical within each category. listOffenceTypesAlphabetical
// (flat, no category) stays as the generateStaticParams source for the
// detail routes, which don't care about grouping.
export function listOffenceTypesByCategory(): OffenceCategoryGroup[] {
  const rows = getDb()
    .prepare(
      `
      SELECT leaf.id, leaf.name, cat.name AS category, cat.sort_order,
        COUNT(scct.summary_conviction_id) AS count
      FROM crime_type leaf
      JOIN crime_type cat ON cat.id = leaf.parent_id
      LEFT JOIN summary_conviction_crime_type scct ON scct.crime_type_id = leaf.id
      GROUP BY leaf.id
      ORDER BY cat.sort_order, leaf.name
      `
    )
    .all() as (OffenceTypeListRow & { category: string; sort_order: number })[];

  const groups: OffenceCategoryGroup[] = [];
  for (const row of rows) {
    const last = groups[groups.length - 1];
    const entry = { id: row.id, name: row.name, count: row.count };
    if (last && last.category === row.category) last.types.push(entry);
    else groups.push({ category: row.category, types: [entry] });
  }
  return groups;
}

export function getOffenceTypeDetail(id: number): { id: number; name: string } | undefined {
  return getDb().prepare(`SELECT id, name FROM crime_type WHERE id = ?`).get(id) as
    | { id: number; name: string }
    | undefined;
}

export function getOffenceTypeConvictionCount(id: number): number {
  const row = getDb()
    .prepare(`SELECT COUNT(*) AS count FROM summary_conviction_crime_type WHERE crime_type_id = ?`)
    .get(id) as { count: number };
  return row.count;
}

export interface OffenceConvictionRow {
  reference_number: string;
  conviction_date: string | null;
  offence_date: string | null;
  offence_date_raw: string | null;
  defendant_names: string | null;
}

// Earliest-first, same convention as the Locations page's own offence
// tables -- see ConvictionsTable/getPlaceConvictions. `record_number` is
// aliased back to `reference_number` -- that's the column's new name in
// the DB, but every consumer (ConvictionsTable, referenceSlug, etc.) still
// expects `reference_number`, and none of those are in this port's scope.
// conviction_date_raw dropped entirely (not just renamed) -- see
// data-loader/qsrecords/models/core.py's SummaryConviction docstring.
export function getOffenceTypeConvictions(id: number, page: number): OffenceConvictionRow[] {
  return getDb()
    .prepare(
      `
      SELECT sc.record_number AS reference_number, sc.conviction_date,
        sc.offence_date, sc.offence_date_raw,
        ${personNamesExpr()} AS defendant_names
      FROM summary_conviction sc
      JOIN summary_conviction_crime_type scct ON scct.summary_conviction_id = sc.id
      WHERE scct.crime_type_id = ?
      ORDER BY sc.offence_date IS NULL, sc.offence_date ASC
      LIMIT ? OFFSET ?
      `
    )
    .all(id, OFFENCE_PAGE_SIZE, (page - 1) * OFFENCE_PAGE_SIZE) as OffenceConvictionRow[];
}
