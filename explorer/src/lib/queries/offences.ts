// Server-only (better-sqlite3, build-time) -- the whole offence taxonomy
// and every conviction tagged against it is enumerable at build time, same
// "prerender everything, no client-side query needed" reasoning as
// conviction detail pages (see convictions/[reference]/page.tsx's own
// comment) -- an offence type's membership doesn't depend on user input.
import "server-only";
import { getDb } from "@/lib/db";
import { DEFENDANT_NAMES_EXPR } from "@/lib/queries/sqlFragments";

export const OFFENCE_PAGE_SIZE = 25;

export interface OffenceTypeListRow {
  id: number;
  name: string;
  count: number;
}

// Alphabetical, not by count -- this is the master index, a reader scans it
// for a specific offence, not "what's most common" (that's what Trends is
// for).
export function listOffenceTypesAlphabetical(): OffenceTypeListRow[] {
  return getDb()
    .prepare(
      `
      SELECT ot.id, ot.name, COUNT(scot.summary_conviction_id) AS count
      FROM offence_type ot
      LEFT JOIN summary_conviction_offence_type scot ON scot.offence_type_id = ot.id
      GROUP BY ot.id
      ORDER BY ot.name
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
      SELECT ot.id, ot.name, oc.name AS category, oc.sort_order,
        COUNT(scot.summary_conviction_id) AS count
      FROM offence_type ot
      JOIN offence_category oc ON oc.id = ot.category_id
      LEFT JOIN summary_conviction_offence_type scot ON scot.offence_type_id = ot.id
      GROUP BY ot.id
      ORDER BY oc.sort_order, ot.name
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
  return getDb().prepare(`SELECT id, name FROM offence_type WHERE id = ?`).get(id) as
    | { id: number; name: string }
    | undefined;
}

export function getOffenceTypeConvictionCount(id: number): number {
  const row = getDb()
    .prepare(`SELECT COUNT(*) AS count FROM summary_conviction_offence_type WHERE offence_type_id = ?`)
    .get(id) as { count: number };
  return row.count;
}

export interface OffenceConvictionRow {
  reference_number: string;
  conviction_date: string | null;
  conviction_date_raw: string;
  offence_date: string | null;
  offence_date_raw: string | null;
  defendant_names: string | null;
}

// Earliest-first, same convention as the Locations page's own offence
// tables -- see ConvictionsTable/getPlaceConvictions.
export function getOffenceTypeConvictions(id: number, page: number): OffenceConvictionRow[] {
  return getDb()
    .prepare(
      `
      SELECT sc.reference_number, sc.conviction_date, sc.conviction_date_raw,
        sc.offence_date, sc.offence_date_raw,
        ${DEFENDANT_NAMES_EXPR} AS defendant_names
      FROM summary_conviction sc
      JOIN summary_conviction_offence_type scot ON scot.summary_conviction_id = sc.id
      WHERE scot.offence_type_id = ?
      ORDER BY sc.offence_date IS NULL, sc.offence_date ASC
      LIMIT ? OFFSET ?
      `
    )
    .all(id, OFFENCE_PAGE_SIZE, (page - 1) * OFFENCE_PAGE_SIZE) as OffenceConvictionRow[];
}
