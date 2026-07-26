// Client-safe: no import of @/lib/db (better-sqlite3), so this can be
// bundled into the browser for PeopleBrowseList's interactive
// search/filter/pagination without dragging a native module into the client
// bundle. Mirrors browseList.ts's shape closely -- same PAGE_SIZE, same
// filters-in-URL/buildWhere-buildOrderBy/listX(db, filters) pattern -- this
// page is meant to behave like a close clone of the Convictions listing,
// just over people instead of convictions.
import type { DbLike } from "@/lib/dbTypes";

export const PAGE_SIZE = 25;

export type PeopleSortColumn = "name" | "total_mentions";

export interface PeopleFilters {
  letter?: string;
  role?: string;
  sex?: "male" | "female";
  town?: string;
  occupation?: string;
  convictedFrom?: string;
  convictedTo?: string;
  sortBy?: PeopleSortColumn;
  sortDir?: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface PersonListRow {
  name_key: string;
  first_name: string | null;
  last_name: string | null;
  name_qualifier: string | null;
  // Comma-joined distinct roles this name_key has appeared under across
  // every case it's in (e.g. "offender,victim,witness") -- a real person can
  // hold different roles in different cases, so this is a set, not a single
  // value. "offender" is a synthetic role (defendant rows don't carry a role
  // column of their own); every other value is the real, unedited
  // involved_persons.role text.
  roles: string;
  total_mentions: number;
  occupation: string | null;
  town_name: string | null;
  sex: string | null;
  min_conviction_date: string | null;
  max_conviction_date: string | null;
}

// The per-name_key aggregation every query below builds on -- one row per
// distinct person across every defendant/involved-person appearance they
// have. Every filter here operates on these aggregated columns (via HAVING,
// since they don't exist until after the GROUP BY), not on the raw
// defendant/person/involved_persons rows underneath.
const BASE_QUERY = `
  SELECT
    name_key,
    MAX(first_name) AS first_name,
    MAX(last_name) AS last_name,
    MAX(name_qualifier) AS name_qualifier,
    GROUP_CONCAT(DISTINCT role) AS roles,
    COUNT(*) AS total_mentions,
    MAX(occupation) AS occupation,
    MAX(town_name) AS town_name,
    MAX(sex) AS sex,
    MIN(conviction_date) AS min_conviction_date,
    MAX(conviction_date) AS max_conviction_date
  FROM (
    SELECT
      d.name_key,
      d.first_name,
      d.last_name,
      d.name_qualifier,
      'offender' AS role,
      d.occupation,
      t.name AS town_name,
      d.sex,
      sc.conviction_date
    FROM defendant d
    LEFT JOIN town t ON t.id = d.town_id
    LEFT JOIN summary_conviction_defendant scd ON scd.defendant_id = d.id
    LEFT JOIN summary_conviction sc ON sc.id = scd.summary_conviction_id
    UNION ALL
    SELECT
      p.name_key,
      p.first_name,
      p.last_name,
      p.name_qualifier,
      NULLIF(TRIM(ip.role), '') AS role,
      p.occupation,
      t.name AS town_name,
      NULL AS sex,
      sc.conviction_date
    FROM person p
    LEFT JOIN town t ON t.id = p.town_id
    LEFT JOIN involved_persons ip ON ip.person_id = p.id
    LEFT JOIN summary_conviction sc ON sc.id = ip.summary_conviction_id
  )
  WHERE name_key IS NOT NULL AND TRIM(name_key) != ''
  GROUP BY name_key
`;

interface HavingClause {
  sql: string;
  params: Record<string, unknown>;
}

function buildHaving(filters: PeopleFilters): HavingClause {
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};

  if (filters.letter) {
    clauses.push(`UPPER(SUBSTR(COALESCE(last_name, first_name, name_key), 1, 1)) = @letter`);
    params.letter = filters.letter.toUpperCase();
  }
  if (filters.role) {
    // roles is a comma-joined set (e.g. "offender,victim") -- padding both
    // sides with commas turns a plain substring search into an exact
    // element match, so "victim" doesn't also match "victim/witness".
    clauses.push(`(',' || roles || ',') LIKE '%,' || @role || ',%'`);
    params.role = filters.role;
  }
  if (filters.sex) {
    clauses.push(`sex = @sex`);
    params.sex = filters.sex;
  }
  if (filters.town) {
    clauses.push(`town_name = @town`);
    params.town = filters.town;
  }
  if (filters.occupation) {
    clauses.push(`occupation = @occupation`);
    params.occupation = filters.occupation;
  }
  // A person's own min/max conviction date span every case they're in --
  // "matches" the selected range if that span overlaps it at all, since
  // there's no single per-person conviction date to check against, only the
  // aggregate span across every case for this name.
  if (filters.convictedFrom) {
    clauses.push(`max_conviction_date >= @convictedFrom`);
    params.convictedFrom = filters.convictedFrom;
  }
  if (filters.convictedTo) {
    clauses.push(`min_conviction_date <= @convictedTo`);
    params.convictedTo = filters.convictedTo;
  }

  return {
    sql: clauses.length ? `HAVING ${clauses.join(" AND ")}` : "",
    params,
  };
}

const SORT_EXPRESSIONS: Record<PeopleSortColumn, string> = {
  name: "COALESCE(last_name, first_name, name_key)",
  total_mentions: "total_mentions",
};

function buildOrderBy(filters: PeopleFilters): string {
  const valueExpr = SORT_EXPRESSIONS[filters.sortBy ?? "name"];
  const dir = filters.sortDir === "desc" ? "DESC" : "ASC";
  // name_key as a final tiebreaker keeps the order stable when many rows
  // share the same sorted value (e.g. the same total_mentions).
  return `${valueExpr} ${dir}, name_key`;
}

export function filtersFromSearchParams(params: URLSearchParams): PeopleFilters {
  const get = (key: string) => params.get(key) ?? undefined;
  const sortDir = get("dir");
  const sex = get("sex");
  const sort = get("sort");
  return {
    letter: get("letter"),
    role: get("role"),
    sex: sex === "male" || sex === "female" ? sex : undefined,
    town: get("town"),
    occupation: get("occupation"),
    convictedFrom: get("from"),
    convictedTo: get("to"),
    sortBy: sort === "name" || sort === "total_mentions" ? sort : undefined,
    sortDir: sortDir === "asc" || sortDir === "desc" ? sortDir : undefined,
    page: get("page") ? Number(get("page")) : 1,
    pageSize: PAGE_SIZE,
  };
}

export function searchParamsFromFilters(filters: PeopleFilters): string {
  const params = new URLSearchParams();
  if (filters.letter) params.set("letter", filters.letter);
  if (filters.role) params.set("role", filters.role);
  if (filters.sex) params.set("sex", filters.sex);
  if (filters.town) params.set("town", filters.town);
  if (filters.occupation) params.set("occupation", filters.occupation);
  if (filters.convictedFrom) params.set("from", filters.convictedFrom);
  if (filters.convictedTo) params.set("to", filters.convictedTo);
  if (filters.sortBy) params.set("sort", filters.sortBy);
  if (filters.sortDir) params.set("dir", filters.sortDir);
  if (filters.page > 1) params.set("page", String(filters.page));
  return params.toString();
}

export function isFilteredSearch(filters: PeopleFilters): boolean {
  return Boolean(
    filters.letter ||
      filters.role ||
      filters.sex ||
      filters.town ||
      filters.occupation ||
      filters.convictedFrom ||
      filters.convictedTo
  );
}

// Per-letter counts under every filter except letter itself -- drives the
// A-Z nav's own "this letter has nothing under the current filters" state,
// recomputed on every filter change so it stays accurate as role/sex/town/
// occupation/date narrow the result set.
export function listLetterCounts(db: DbLike, filters: PeopleFilters): Record<string, number> {
  const { sql: havingSql, params } = buildHaving({ ...filters, letter: undefined });
  const rows = db
    .prepare(
      `
      SELECT UPPER(SUBSTR(COALESCE(last_name, first_name, name_key), 1, 1)) AS letter, COUNT(*) AS n
      FROM (${BASE_QUERY} ${havingSql})
      GROUP BY letter
      `
    )
    .all(params) as { letter: string; n: number }[];
  return Object.fromEntries(rows.map((r) => [r.letter, r.n]));
}

export function listPeople(db: DbLike, filters: PeopleFilters): { rows: PersonListRow[]; total: number } {
  const { sql: havingSql, params } = buildHaving(filters);
  const orderBySql = buildOrderBy(filters);
  const offset = (filters.page - 1) * filters.pageSize;

  const rows = db
    .prepare(`${BASE_QUERY} ${havingSql} ORDER BY ${orderBySql} LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit: filters.pageSize, offset }) as PersonListRow[];

  const { total } = db
    .prepare(`SELECT COUNT(*) AS total FROM (${BASE_QUERY} ${havingSql})`)
    .get(params) as { total: number };

  return { rows, total };
}
