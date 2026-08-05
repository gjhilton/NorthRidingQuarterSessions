// Client-safe: no import of @/lib/db (better-sqlite3), so this can be
// bundled into the browser for BrowseExplorer's interactive search/filter
// without dragging a native module into the client bundle.
import type { DbLike } from "@/lib/dbTypes";
import { referenceToSlug } from "@/lib/referenceSlug";
import { buildTreeIndex, descendantIds, type MinimalTreeNode } from "@/lib/tree";
import {
  DEFENDANT_ROLE,
  personSearchExpr,
  personSortExpr,
  personsJsonExpr,
  type NameRow,
} from "@/lib/queries/personFragments";

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
  // (see lib/tree.ts's descendantIds), so selecting a town alone still
  // finds every conviction recorded against one of its streets. Matches via
  // summary_conviction_location (role='location of offence') now that a
  // conviction's offence location isn't a scalar FK column any more.
  locationId?: number;
  offenceCategoryId?: number;
  offenceTypeId?: number;
  dateFrom?: string;
  dateTo?: string;
  sentenceDateFrom?: string;
  sentenceDateTo?: string;
  sex?: "male" | "female";
  minorDefendant?: boolean;
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
//
// Both location roles are resolved via a correlated subquery now (there's
// no more sc.offence_location_id/court_location_id scalar column to LEFT
// JOIN place against) -- LIMIT 1 picks an arbitrary one when a conviction
// has more than one row for a given role, which SummaryConvictionLocation's
// shape allows but is rare in practice; good enough for a sort/display
// expression, not a claim there's only ever one.
const OFFENCE_LOCATION_EXPR = `(
  SELECT loc.name FROM summary_conviction_location scl_o
  JOIN location loc ON loc.id = scl_o.location_id
  WHERE scl_o.summary_conviction_id = sc.id AND scl_o.role = 'location of offence'
  LIMIT 1
)`;
const COURT_LOCATION_EXPR = `(
  SELECT loc.name FROM summary_conviction_location scl_c
  JOIN location loc ON loc.id = scl_c.location_id
  WHERE scl_c.summary_conviction_id = sc.id AND scl_c.role = 'court location'
  LIMIT 1
)`;
const LOCATION_EXPR = `COALESCE(${OFFENCE_LOCATION_EXPR}, ${COURT_LOCATION_EXPR})`;
// A plain sortable string (surname-first, comma-joined) -- personSortExpr()
// from personFragments.ts replaces the old locally-defined
// DEFENDANT_SORT_EXPR now that "defendant" is a role on summary_conviction_person
// rather than its own table. Computed directly in the ORDER BY rather than
// reusing the SELECTed defendant_names_json -- that's a JSON array now (for
// per-defendant name formatting on display), which would sort by its raw
// text, not by name.
const DEFENDANT_SORT_EXPR = personSortExpr();
// valueExpr is the column/expression actually being sorted; nullsExpr (when
// set) always sorts ascending so NULLs land last regardless of sort
// direction, rather than jumping to the top when a descending sort is
// applied to valueExpr.
const SORT_EXPRESSIONS: Record<BrowseSortColumn, { nullsExpr?: string; valueExpr: string }> = {
  // Sort key name kept as "reference_number" even though the underlying
  // column is now sc.record_number -- this is a URL query-param value
  // (?sort=reference_number), not a claim about the column name, and
  // renaming it would break any bookmarked/shared filtered-search URL.
  reference_number: { valueExpr: "sc.record_number" },
  offence_date: { nullsExpr: "sc.offence_date IS NULL", valueExpr: "sc.offence_date" },
  conviction_date: { nullsExpr: "sc.conviction_date IS NULL", valueExpr: "sc.conviction_date" },
  defendant_names: { nullsExpr: `${DEFENDANT_SORT_EXPR} IS NULL`, valueExpr: DEFENDANT_SORT_EXPR },
  offence_type_names: {
    nullsExpr: "offence_type_names IS NULL",
    valueExpr: "offence_type_names",
  },
  location: { nullsExpr: `${LOCATION_EXPR} IS NULL`, valueExpr: LOCATION_EXPR },
};

// Per-defendant fields for a conviction's Offender(s) cell -- matches
// personsJsonExpr()'s own json_object shape (personFragments.ts), which
// deliberately doesn't include occupation (a real multi-valued join now,
// via person_occupation, not a flat column) -- the browse table's defendant
// column no longer shows occupation as a result. See PeopleBrowseList/the
// conviction detail page for occupation display, where a person is looked
// at individually rather than as part of a dense summary row.
export interface BrowseDefendantName extends NameRow {
  id: number;
  sex: string | null;
}

export interface BrowseRow {
  id: number;
  // Aliased from sc.record_number (the column's new name in the DB) back to
  // reference_number -- every consumer (BrowseExplorer, ConvictionNav,
  // referenceToSlug call sites) still expects that name, and renaming it
  // through the whole app isn't this port's job. Matches the same choice
  // made in offences.ts's getOffenceTypeConvictions.
  reference_number: string;
  offence_date: string | null;
  offence_date_raw: string | null;
  conviction_date: string | null;
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

// The location tree is ~350 rows -- loaded fresh per call rather than
// cached, since this runs against whichever db (build-time better-sqlite3,
// or the browser's sql.js copy) the caller passed in.
function loadLocationIndex(db: DbLike): Map<number, MinimalTreeNode> {
  const rows = db.prepare(`SELECT id, name, parent_id FROM location`).all() as MinimalTreeNode[];
  return buildTreeIndex(rows);
}

function buildWhere(db: DbLike, filters: BrowseFilters): WhereClause {
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};

  if (filters.q) {
    clauses.push(`(
      sc.charge_description LIKE @q
      OR sc.record_number LIKE @q
      OR EXISTS (
        SELECT 1 FROM summary_conviction_crime_type scct2
        JOIN crime_type ct2 ON ct2.id = scct2.crime_type_id
        WHERE scct2.summary_conviction_id = sc.id AND ct2.name LIKE @q
      )
      OR EXISTS (
        SELECT 1 FROM summary_conviction_person scp2
        JOIN person p2 ON p2.id = scp2.person_id
        WHERE scp2.summary_conviction_id = sc.id AND ${personSearchExpr("p2")} LIKE @q
      )
    )`);
    params.q = `%${filters.q.toLowerCase()}%`;
  }
  if (filters.locationId) {
    // Matches the selected location or anything in its subtree -- a town
    // filter should still find convictions recorded against one of its
    // streets, not just ones tagged at the town exactly.
    const ids = descendantIds(filters.locationId, loadLocationIndex(db));
    const placeholders = ids.map((_, i) => `@loc${i}`).join(",");
    clauses.push(`EXISTS (
      SELECT 1 FROM summary_conviction_location scl2
      WHERE scl2.summary_conviction_id = sc.id
        AND scl2.role = 'location of offence'
        AND scl2.location_id IN (${placeholders})
    )`);
    ids.forEach((id, i) => {
      params[`loc${i}`] = id;
    });
  }
  if (filters.offenceTypeId) {
    clauses.push(`EXISTS (
      SELECT 1 FROM summary_conviction_crime_type sct3
      WHERE sct3.summary_conviction_id = sc.id AND sct3.crime_type_id = @offenceTypeId
    )`);
    params.offenceTypeId = filters.offenceTypeId;
  } else if (filters.offenceCategoryId) {
    // Only applied when no specific leaf type is chosen -- offenceTypeId
    // alone already implies its category, so this is the "all leaves within
    // this category" case, not an additional narrowing. Also matches the
    // category id itself directly (ct3b.id = @offenceCategoryId), in case a
    // conviction was ever tagged at the category node rather than a leaf.
    clauses.push(`EXISTS (
      SELECT 1 FROM summary_conviction_crime_type sct3b
      JOIN crime_type ct3b ON ct3b.id = sct3b.crime_type_id
      WHERE sct3b.summary_conviction_id = sc.id
        AND (ct3b.parent_id = @offenceCategoryId OR ct3b.id = @offenceCategoryId)
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
      SELECT 1 FROM summary_conviction_person scp4
      JOIN person p4 ON p4.id = scp4.person_id
      WHERE scp4.summary_conviction_id = sc.id AND scp4.role = @defendantRole AND p4.sex = @sex
    )`);
    params.sex = filters.sex;
    params.defendantRole = DEFENDANT_ROLE;
  }
  if (filters.minorDefendant) {
    // is_child was a stored boolean before; v3 dropped age entirely (see
    // Person.birth_year's comment in data-loader/qsrecords/models/core.py)
    // -- "minor" is now computed as offence_year - birth_year < 16, the
    // same formula that comment gives as the canonical way to derive age.
    // Only catches defendants with both a known birth_year AND a known
    // offence_date on this conviction; unknown either way is excluded
    // rather than assumed, same "don't guess" spirit as the rest of v3.
    clauses.push(`EXISTS (
      SELECT 1 FROM summary_conviction_person scp6
      JOIN person p6 ON p6.id = scp6.person_id
      WHERE scp6.summary_conviction_id = sc.id AND scp6.role = @defendantRole
        AND p6.birth_year IS NOT NULL AND sc.offence_date IS NOT NULL
        AND (CAST(strftime('%Y', sc.offence_date) AS INTEGER) - p6.birth_year) < 16
    )`);
    params.defendantRole = DEFENDANT_ROLE;
  }
  if (filters.defendantCount) {
    clauses.push(`(
      SELECT COUNT(*) FROM summary_conviction_person scp5
      WHERE scp5.summary_conviction_id = sc.id AND scp5.role = @defendantRole
    ) = @defendantCount`);
    params.defendantCount = filters.defendantCount;
    params.defendantRole = DEFENDANT_ROLE;
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
  // Record number as a final tiebreaker keeps the order stable when many
  // rows share the same sorted value (e.g. the same conviction_date).
  terms.push("sc.record_number");
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
    minorDefendant: get("minor") === "1" ? true : undefined,
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
  if (filters.minorDefendant) params.set("minor", "1");
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
      filters.minorDefendant ||
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
      `SELECT sc.id, sc.record_number AS reference_number FROM summary_conviction sc ${whereSql} ORDER BY ${orderBySql}`
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
        sc.record_number AS reference_number,
        sc.offence_date,
        sc.offence_date_raw,
        sc.conviction_date,
        sc.charge_description,
        (
          SELECT GROUP_CONCAT(ct.name, ', ')
          FROM summary_conviction_crime_type scct
          JOIN crime_type ct ON ct.id = scct.crime_type_id
          WHERE scct.summary_conviction_id = sc.id
        ) AS offence_type_names,
        ${OFFENCE_LOCATION_EXPR} AS offence_town_name,
        ${COURT_LOCATION_EXPR} AS court_town_name,
        ${personsJsonExpr()} AS defendant_names_json
      FROM summary_conviction sc
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
