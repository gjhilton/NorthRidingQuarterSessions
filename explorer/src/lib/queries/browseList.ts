// Client-safe: no import of @/lib/db (better-sqlite3), so this can be
// bundled into the browser for BrowseExplorer's interactive search/filter
// without dragging a native module into the client bundle.
import type { DbLike } from "@/lib/dbTypes";
import { referenceToSlug } from "@/lib/referenceSlug";
import { buildPlaceIndex, descendantIds, type PlaceNode } from "@/lib/placeTree";

export const PAGE_SIZE = 25;

export type BrowseSortColumn =
  | "reference_number"
  | "offence_date"
  | "conviction_date"
  | "defendant_names"
  | "offence_type_names"
  | "location";

export interface BrowseFilters {
  q?: string;
  // A town/parish or a more specific place within it (a street, or a yard
  // nested deeper still) -- matches that place or anything in its subtree
  // (see lib/placeTree.ts's descendantIds), so selecting a town alone still
  // finds every conviction recorded against one of its streets. Replaced
  // the old townId+streetId pair (two separate legacy-table columns) now
  // that both resolve through the one place tree.
  locationId?: number;
  offenceCategoryId?: number;
  offenceTypeId?: number;
  dateFrom?: string;
  dateTo?: string;
  sentenceDateFrom?: string;
  sentenceDateTo?: string;
  sex?: "male" | "female";
  defendantCount?: number;
  sortBy?: BrowseSortColumn;
  sortDir?: "asc" | "desc";
  page: number;
  pageSize: number;
}

// Looked up rather than interpolating filters.sortBy directly, since it
// ultimately comes from client-controlled state (and, once URL-synced,
// straight from the query string) -- this keeps the ORDER BY clause to a
// fixed set of known-safe expressions.
const LOCATION_EXPR = "COALESCE(ot_place.name, court_place.name)";
// A plain sortable string (surname-first, comma-joined), computed directly
// in the ORDER BY rather than reusing the SELECTed defendant_names_json --
// that's a JSON array now (for per-defendant name formatting on display),
// which would sort by its raw text, not by name.
const DEFENDANT_SORT_EXPR = `(
  SELECT GROUP_CONCAT(TRIM(COALESCE(d3.last_name,'') || ' ' || COALESCE(d3.first_name,'')), ', ')
  FROM summary_conviction_defendant scd3
  JOIN defendant d3 ON d3.id = scd3.defendant_id
  WHERE scd3.summary_conviction_id = sc.id
)`;
// valueExpr is the column/expression actually being sorted; nullsExpr (when
// set) always sorts ascending so NULLs land last regardless of sort
// direction, rather than jumping to the top when a descending sort is
// applied to valueExpr.
const SORT_EXPRESSIONS: Record<BrowseSortColumn, { nullsExpr?: string; valueExpr: string }> = {
  reference_number: { valueExpr: "sc.reference_number" },
  offence_date: { nullsExpr: "sc.offence_date IS NULL", valueExpr: "sc.offence_date" },
  conviction_date: { nullsExpr: "sc.conviction_date IS NULL", valueExpr: "sc.conviction_date" },
  defendant_names: { nullsExpr: `${DEFENDANT_SORT_EXPR} IS NULL`, valueExpr: DEFENDANT_SORT_EXPR },
  offence_type_names: {
    nullsExpr: "offence_type_names IS NULL",
    valueExpr: "offence_type_names",
  },
  location: { nullsExpr: `${LOCATION_EXPR} IS NULL`, valueExpr: LOCATION_EXPR },
};

export interface BrowseDefendantName {
  first_name: string | null;
  last_name: string | null;
  occupation: string | null;
  name_qualifier: string | null;
}

export interface BrowseRow {
  id: number;
  reference_number: string;
  offence_date: string | null;
  offence_date_raw: string | null;
  conviction_date: string | null;
  conviction_date_raw: string;
  charge_description: string;
  offence_type_names: string | null;
  offence_town_name: string | null;
  court_town_name: string | null;
  defendant_names_json: string | null;
}

interface WhereClause {
  sql: string;
  params: Record<string, unknown>;
}

// The place tree is ~350 rows -- loaded fresh per call rather than cached,
// since this runs against whichever db (build-time better-sqlite3, or the
// browser's sql.js copy) the caller passed in.
function loadPlaceIndex(db: DbLike): Map<number, PlaceNode> {
  const rows = db.prepare(`SELECT id, name, parent_id FROM place`).all() as PlaceNode[];
  return buildPlaceIndex(rows);
}

function buildWhere(db: DbLike, filters: BrowseFilters): WhereClause {
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};

  if (filters.q) {
    clauses.push(`(
      sc.charge_description LIKE @q
      OR sc.reference_number LIKE @q
      OR sc.sentencing LIKE @q
      OR EXISTS (
        SELECT 1 FROM summary_conviction_offence_type scot2
        JOIN offence_type ot2 ON ot2.id = scot2.offence_type_id
        WHERE scot2.summary_conviction_id = sc.id AND ot2.name LIKE @q
      )
      OR EXISTS (
        SELECT 1 FROM summary_conviction_defendant scd2
        JOIN defendant d2 ON d2.id = scd2.defendant_id
        WHERE scd2.summary_conviction_id = sc.id AND d2.name_key LIKE @q
      )
      OR EXISTS (
        SELECT 1 FROM involved_persons ip2
        JOIN person p2 ON p2.id = ip2.person_id
        WHERE ip2.summary_conviction_id = sc.id AND p2.name_key LIKE @q
      )
    )`);
    params.q = `%${filters.q.toLowerCase()}%`;
  }
  if (filters.locationId) {
    // Matches the selected place or anything in its subtree -- a town
    // filter should still find convictions recorded against one of its
    // streets, not just ones tagged at the town exactly.
    const ids = descendantIds(filters.locationId, loadPlaceIndex(db));
    const placeholders = ids.map((_, i) => `@loc${i}`).join(",");
    clauses.push(`sc.offence_location_id IN (${placeholders})`);
    ids.forEach((id, i) => {
      params[`loc${i}`] = id;
    });
  }
  if (filters.offenceTypeId) {
    clauses.push(`EXISTS (
      SELECT 1 FROM summary_conviction_offence_type scot3
      WHERE scot3.summary_conviction_id = sc.id AND scot3.offence_type_id = @offenceTypeId
    )`);
    params.offenceTypeId = filters.offenceTypeId;
  } else if (filters.offenceCategoryId) {
    // Only applied when no specific leaf type is chosen -- offenceTypeId
    // alone already implies its category, so this is the "all subcategories
    // within this category" case, not an additional narrowing.
    clauses.push(`EXISTS (
      SELECT 1 FROM summary_conviction_offence_type scot3b
      JOIN offence_type ot3b ON ot3b.id = scot3b.offence_type_id
      WHERE scot3b.summary_conviction_id = sc.id AND ot3b.category_id = @offenceCategoryId
    )`);
    params.offenceCategoryId = filters.offenceCategoryId;
  }
  if (filters.dateFrom) {
    clauses.push(`sc.offence_date >= @dateFrom`);
    params.dateFrom = filters.dateFrom;
  }
  if (filters.dateTo) {
    clauses.push(`sc.offence_date <= @dateTo`);
    params.dateTo = filters.dateTo;
  }
  if (filters.sentenceDateFrom) {
    clauses.push(`sc.conviction_date >= @sentenceDateFrom`);
    params.sentenceDateFrom = filters.sentenceDateFrom;
  }
  if (filters.sentenceDateTo) {
    clauses.push(`sc.conviction_date <= @sentenceDateTo`);
    params.sentenceDateTo = filters.sentenceDateTo;
  }
  if (filters.sex) {
    clauses.push(`EXISTS (
      SELECT 1 FROM summary_conviction_defendant scd4
      JOIN defendant d4 ON d4.id = scd4.defendant_id
      WHERE scd4.summary_conviction_id = sc.id AND d4.sex = @sex
    )`);
    params.sex = filters.sex;
  }
  if (filters.defendantCount) {
    clauses.push(`(
      SELECT COUNT(*) FROM summary_conviction_defendant scd5
      WHERE scd5.summary_conviction_id = sc.id
    ) = @defendantCount`);
    params.defendantCount = filters.defendantCount;
  }

  return {
    sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

function buildOrderBy(filters: BrowseFilters): string {
  const { nullsExpr, valueExpr } = SORT_EXPRESSIONS[filters.sortBy ?? "conviction_date"];
  const dir = filters.sortDir === "desc" ? "DESC" : "ASC";
  const terms = nullsExpr ? [`${nullsExpr} ASC`, `${valueExpr} ${dir}`] : [`${valueExpr} ${dir}`];
  // Reference number as a final tiebreaker keeps the order stable when many
  // rows share the same sorted value (e.g. the same conviction_date).
  terms.push("sc.reference_number");
  return terms.join(", ");
}

// The valid set of sortable columns -- for URL query-param validation only;
// each table column's own sort button is the source of truth for what's
// actually rendered and in what order.
const SORT_COLUMN_KEYS: Set<string> = new Set<BrowseSortColumn>([
  "offence_date",
  "conviction_date",
  "reference_number",
  "defendant_names",
  "offence_type_names",
  "location",
]);

function isSortColumn(value: string | null): value is BrowseSortColumn {
  return value !== null && SORT_COLUMN_KEYS.has(value);
}

// Bookmarkable/shareable search state -- read once on mount to hydrate a
// filtered view from a pasted URL, and written back on every filter change.
// Also read by the conviction detail page, to show "Record N of M matching
// search for..." and keep Prev/Next scoped to the same filtered set when
// arriving from a filtered listing rather than browsing cold.
export function filtersFromSearchParams(params: URLSearchParams): BrowseFilters {
  const get = (key: string) => params.get(key) ?? undefined;
  const sortDir = get("dir");
  const sex = get("sex");
  return {
    q: get("q"),
    locationId: get("location") ? Number(get("location")) : undefined,
    offenceCategoryId: get("category") ? Number(get("category")) : undefined,
    offenceTypeId: get("offence") ? Number(get("offence")) : undefined,
    dateFrom: get("from"),
    dateTo: get("to"),
    sentenceDateFrom: get("sentenceFrom"),
    sentenceDateTo: get("sentenceTo"),
    sex: sex === "male" || sex === "female" ? sex : undefined,
    defendantCount: get("defendants") ? Number(get("defendants")) : undefined,
    sortBy: isSortColumn(params.get("sort")) ? (params.get("sort") as BrowseSortColumn) : undefined,
    sortDir: sortDir === "asc" || sortDir === "desc" ? sortDir : undefined,
    page: get("page") ? Number(get("page")) : 1,
    pageSize: PAGE_SIZE,
  };
}

export function searchParamsFromFilters(filters: BrowseFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.locationId) params.set("location", String(filters.locationId));
  if (filters.offenceCategoryId) params.set("category", String(filters.offenceCategoryId));
  if (filters.offenceTypeId) params.set("offence", String(filters.offenceTypeId));
  if (filters.dateFrom) params.set("from", filters.dateFrom);
  if (filters.dateTo) params.set("to", filters.dateTo);
  if (filters.sentenceDateFrom) params.set("sentenceFrom", filters.sentenceDateFrom);
  if (filters.sentenceDateTo) params.set("sentenceTo", filters.sentenceDateTo);
  if (filters.sex) params.set("sex", filters.sex);
  if (filters.defendantCount) params.set("defendants", String(filters.defendantCount));
  if (filters.sortBy) params.set("sort", filters.sortBy);
  if (filters.sortDir) params.set("dir", filters.sortDir);
  if (filters.page > 1) params.set("page", String(filters.page));
  return params.toString();
}

// True when any filter narrows the result set beyond "everything" -- used
// both to decide whether to show "Clear filters" on the listing and whether
// a detail page arrived at via a link should describe itself as scoped to a
// search/filter rather than the whole dataset.
export function isFilteredSearch(filters: BrowseFilters): boolean {
  return Boolean(
    filters.q ||
      filters.locationId ||
      filters.offenceCategoryId ||
      filters.offenceTypeId ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.sentenceDateFrom ||
      filters.sentenceDateTo ||
      filters.sex ||
      filters.defendantCount
  );
}

// Unpaginated ids in the same order listConvictions would page through --
// for the detail page's "Record N of M" position and Prev/Next within a
// filtered set, where the whole ordered set (not just one page of it) is
// needed to find where a given id falls.
export interface ConvictionOrderRow {
  id: number;
  slug: string;
}

export function listConvictionOrder(db: DbLike, filters: BrowseFilters): ConvictionOrderRow[] {
  const { sql: whereSql, params } = buildWhere(db, filters);
  const orderBySql = buildOrderBy(filters);
  const rows = db
    .prepare(
      `SELECT sc.id, sc.reference_number FROM summary_conviction sc ${whereSql} ORDER BY ${orderBySql}`
    )
    .all(params) as { id: number; reference_number: string }[];
  return rows.map((r) => ({ id: r.id, slug: referenceToSlug(r.reference_number) }));
}

export function listConvictions(
  db: DbLike,
  filters: BrowseFilters
): {
  rows: BrowseRow[];
  total: number;
} {
  const { sql: whereSql, params } = buildWhere(db, filters);
  const orderBySql = buildOrderBy(filters);
  const offset = (filters.page - 1) * filters.pageSize;

  const rows = db
    .prepare(
      `
      SELECT
        sc.id,
        sc.reference_number,
        sc.offence_date,
        sc.offence_date_raw,
        sc.conviction_date,
        sc.conviction_date_raw,
        sc.charge_description,
        (
          SELECT GROUP_CONCAT(ot.name, ', ')
          FROM summary_conviction_offence_type scot
          JOIN offence_type ot ON ot.id = scot.offence_type_id
          WHERE scot.summary_conviction_id = sc.id
        ) AS offence_type_names,
        ot_place.name AS offence_town_name,
        court_place.name AS court_town_name,
        (
          SELECT json_group_array(json_object('first_name', d.first_name, 'last_name', d.last_name, 'occupation', d.occupation, 'name_qualifier', d.name_qualifier))
          FROM summary_conviction_defendant scd
          JOIN defendant d ON d.id = scd.defendant_id
          WHERE scd.summary_conviction_id = sc.id
        ) AS defendant_names_json
      FROM summary_conviction sc
      LEFT JOIN place ot_place ON ot_place.id = sc.offence_location_id
      LEFT JOIN place court_place ON court_place.id = sc.court_location_id
      ${whereSql}
      ORDER BY ${orderBySql}
      LIMIT @limit OFFSET @offset
      `
    )
    .all({ ...params, limit: filters.pageSize, offset }) as BrowseRow[];

  const { total } = db
    .prepare(
      `
      SELECT COUNT(*) AS total
      FROM summary_conviction sc
      ${whereSql}
      `
    )
    .get(params) as { total: number };

  return { rows, total };
}
