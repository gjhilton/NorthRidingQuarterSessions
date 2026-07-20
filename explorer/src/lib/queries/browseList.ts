// Client-safe: no import of @/lib/db (better-sqlite3), so this can be
// bundled into the browser for BrowseExplorer's interactive search/filter
// without dragging a native module into the client bundle.
import type { DbLike } from "@/lib/dbTypes";

export const PAGE_SIZE = 25;

export type BrowseSortColumn =
  | "reference_number"
  | "conviction_date"
  | "defendant_names"
  | "offence_type_name"
  | "location";

export interface BrowseFilters {
  q?: string;
  townId?: number;
  offenceTypeId?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: BrowseSortColumn;
  sortDir?: "asc" | "desc";
  page: number;
  pageSize: number;
}

// Looked up rather than interpolating filters.sortBy directly, since it
// ultimately comes from client-controlled state (and, once URL-synced,
// straight from the query string) -- this keeps the ORDER BY clause to a
// fixed set of known-safe expressions.
const LOCATION_EXPR = "COALESCE(ot_town.name, court_town.name)";
// valueExpr is the column/expression actually being sorted; nullsExpr (when
// set) always sorts ascending so NULLs land last regardless of sort
// direction, rather than jumping to the top when a descending sort is
// applied to valueExpr.
const SORT_EXPRESSIONS: Record<BrowseSortColumn, { nullsExpr?: string; valueExpr: string }> = {
  reference_number: { valueExpr: "sc.reference_number" },
  conviction_date: { nullsExpr: "sc.conviction_date IS NULL", valueExpr: "sc.conviction_date" },
  defendant_names: { nullsExpr: "defendant_names IS NULL", valueExpr: "defendant_names" },
  offence_type_name: {
    nullsExpr: "offence_type_name IS NULL",
    valueExpr: "offence_type_name",
  },
  location: { nullsExpr: `${LOCATION_EXPR} IS NULL`, valueExpr: LOCATION_EXPR },
};

export interface BrowseRow {
  id: number;
  reference_number: string;
  conviction_date: string | null;
  conviction_date_raw: string;
  charge_description: string;
  offence_type_name: string | null;
  offence_town_name: string | null;
  court_town_name: string | null;
  defendant_names: string | null;
}

interface WhereClause {
  sql: string;
  params: Record<string, unknown>;
}

function buildWhere(filters: BrowseFilters): WhereClause {
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};

  if (filters.q) {
    clauses.push(`(
      sc.charge_description LIKE @q
      OR sc.reference_number LIKE @q
      OR sc.sentencing LIKE @q
      OR EXISTS (
        SELECT 1 FROM offence_type ot2
        WHERE ot2.id = sc.offence_type_id AND ot2.name LIKE @q
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
  if (filters.townId) {
    clauses.push(`(sc.offence_location_town_id = @townId OR sc.court_location_town_id = @townId)`);
    params.townId = filters.townId;
  }
  if (filters.offenceTypeId) {
    clauses.push(`sc.offence_type_id = @offenceTypeId`);
    params.offenceTypeId = filters.offenceTypeId;
  }
  if (filters.dateFrom) {
    clauses.push(`sc.conviction_date >= @dateFrom`);
    params.dateFrom = filters.dateFrom;
  }
  if (filters.dateTo) {
    clauses.push(`sc.conviction_date <= @dateTo`);
    params.dateTo = filters.dateTo;
  }

  return {
    sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

function buildOrderBy(filters: BrowseFilters): string {
  const { nullsExpr, valueExpr } = SORT_EXPRESSIONS[filters.sortBy ?? "conviction_date"];
  const dir = filters.sortDir === "asc" ? "ASC" : "DESC";
  const terms = nullsExpr ? [`${nullsExpr} ASC`, `${valueExpr} ${dir}`] : [`${valueExpr} ${dir}`];
  // Reference number as a final tiebreaker keeps the order stable when many
  // rows share the same sorted value (e.g. the same conviction_date).
  terms.push("sc.reference_number");
  return terms.join(", ");
}

export function listConvictions(
  db: DbLike,
  filters: BrowseFilters
): {
  rows: BrowseRow[];
  total: number;
} {
  const { sql: whereSql, params } = buildWhere(filters);
  const orderBySql = buildOrderBy(filters);
  const offset = (filters.page - 1) * filters.pageSize;

  const rows = db
    .prepare(
      `
      SELECT
        sc.id,
        sc.reference_number,
        sc.conviction_date,
        sc.conviction_date_raw,
        sc.charge_description,
        ot.name AS offence_type_name,
        ot_town.name AS offence_town_name,
        court_town.name AS court_town_name,
        (
          SELECT GROUP_CONCAT(TRIM(d.first_name || ' ' || d.last_name), ', ')
          FROM summary_conviction_defendant scd
          JOIN defendant d ON d.id = scd.defendant_id
          WHERE scd.summary_conviction_id = sc.id
        ) AS defendant_names
      FROM summary_conviction sc
      LEFT JOIN offence_type ot ON ot.id = sc.offence_type_id
      LEFT JOIN town ot_town ON ot_town.id = sc.offence_location_town_id
      LEFT JOIN town court_town ON court_town.id = sc.court_location_town_id
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
