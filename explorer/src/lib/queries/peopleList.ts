// Client-safe: no import of @/lib/db (better-sqlite3), so this can be
// bundled into the browser for PeopleBrowseList's interactive
// search/filter/pagination without dragging a native module into the client
// bundle. Mirrors browseList.ts's shape closely -- same PAGE_SIZE, same
// filters-in-URL/buildWhere-buildOrderBy/listX(db, filters) pattern -- this
// page is meant to behave like a close clone of the Convictions listing,
// just over people instead of convictions.
import type { DbLike } from "@/lib/dbTypes";
import { combineClauses } from "@/lib/queries/queryBuilder";
import {
  personKeyExpr,
  personOccupationsExpr,
  personNameColumnsSql,
  type NameRow,
} from "@/lib/queries/personFragments";

export const PAGE_SIZE = 25;

export type PeopleSortColumn = "name" | "total_mentions";

export interface PeopleFilters {
  letter?: string;
  role?: string;
  sex?: "male" | "female";
  minor?: boolean;
  town?: string;
  occupation?: string;
  convictedFrom?: string;
  convictedTo?: string;
  sortBy?: PeopleSortColumn;
  sortDir?: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface PersonListRow extends NameRow {
  name_key: string;
  // Comma-joined distinct roles this name_key has appeared under across
  // every case it's in (e.g. "defendant,victim,witness") -- a real person
  // can hold different roles in different cases, so this is a set, not a
  // single value. 'defendant' is now the real stored
  // summary_conviction_person.role value (see personFragments.ts's
  // DEFENDANT_ROLE), not a synthetic label -- displayed as "Offender" in
  // the UI (see roles.ts).
  roles: string;
  total_mentions: number;
  // Comma-joined -- a person can hold more than one occupation at once now
  // (person_occupation is a real join table). One representative mention's
  // occupation set, same MAX() convention as the rest of this aggregation.
  occupation: string | null;
  location_name: string | null;
  sex: string | null;
  is_minor: number;
  min_conviction_date: string | null;
  max_conviction_date: string | null;
}

// The per-name_key aggregation every query below builds on -- one row per
// distinct person across every case appearance they have. Every filter here
// operates on these aggregated columns (via HAVING, since they don't exist
// until after the GROUP BY), not on the raw person/summary_conviction_person
// rows underneath. Collapses the old defendant/person UNION ALL entirely --
// v3 merged those into one `person` table with role living on
// summary_conviction_person, so this is a single join, not a union of two
// near-identical queries.
const BASE_QUERY = `
  SELECT
    name_key,
    MAX(first_name) AS first_name,
    MAX(middle_name) AS middle_name,
    MAX(last_name) AS last_name,
    MAX(title) AS title,
    MAX(name_postfix) AS name_postfix,
    MAX(alias) AS alias,
    COALESCE(GROUP_CONCAT(DISTINCT role), '') AS roles,
    COUNT(*) AS total_mentions,
    MAX(occupation) AS occupation,
    MAX(location_name) AS location_name,
    MAX(sex) AS sex,
    MAX(is_minor) AS is_minor,
    MIN(conviction_date) AS min_conviction_date,
    MAX(conviction_date) AS max_conviction_date
  FROM (
    SELECT
      ${personKeyExpr("p")} AS name_key,
      ${personNameColumnsSql("p")},
      scp.role AS role,
      ${personOccupationsExpr("p")} AS occupation,
      loc.name AS location_name,
      p.sex,
      -- v3 dropped age/is_child entirely (see Person.birth_year's comment in
      -- data-loader/qsrecords/models/core.py) -- "minor" is computed here as
      -- offence_year - birth_year < 16 for this specific mention's own
      -- conviction, same formula that comment gives as the canonical way to
      -- derive age. Unknown either way (no birth_year, or no offence_date on
      -- this case) reads as not-a-minor rather than guessed.
      CASE
        WHEN p.birth_year IS NOT NULL AND sc.offence_date IS NOT NULL
          AND (CAST(strftime('%Y', sc.offence_date) AS INTEGER) - p.birth_year) < 16
        THEN 1 ELSE 0
      END AS is_minor,
      sc.conviction_date
    FROM person p
    JOIN summary_conviction_person scp ON scp.person_id = p.id
    JOIN summary_conviction sc ON sc.id = scp.summary_conviction_id
    LEFT JOIN location loc ON loc.id = p.home_location_id
  )
  WHERE name_key IS NOT NULL AND TRIM(name_key) != ''
  GROUP BY name_key
`;

function buildHaving(filters: PeopleFilters): { sql: string; params: Record<string, unknown> } {
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};

  if (filters.letter) {
    clauses.push(`UPPER(SUBSTR(COALESCE(last_name, first_name, name_key), 1, 1)) = @letter`);
    params.letter = filters.letter.toUpperCase();
  }
  if (filters.role) {
    // roles is a comma-joined set (e.g. "defendant,victim") -- padding both
    // sides with commas turns a plain substring search into an exact
    // element match, so "victim" doesn't also match "victim/witness".
    clauses.push(`(',' || roles || ',') LIKE '%,' || @role || ',%'`);
    params.role = filters.role;
  }
  if (filters.sex) {
    clauses.push(`sex = @sex`);
    params.sex = filters.sex;
  }
  if (filters.minor) {
    clauses.push(`is_minor = 1`);
  }
  if (filters.town) {
    clauses.push(`location_name = @town`);
    params.town = filters.town;
  }
  if (filters.occupation) {
    // occupation is a ", "-joined set (personOccupationsExpr) -- same
    // exact-element-match padding trick as roles above, just with the
    // ", " separator that expression actually uses.
    clauses.push(`(', ' || occupation || ', ') LIKE '%, ' || @occupation || ', %'`);
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

  return combineClauses(clauses, params, "HAVING");
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
    minor: get("minor") === "1" ? true : undefined,
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
  if (filters.minor) params.set("minor", "1");
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
      filters.minor ||
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

// Not routed through queryBuilder.ts's paginate() -- that helper assumes a
// flat `${selectSql} ${whereSql}` shape it can also reuse for the count
// query, but this listing's COUNT needs to wrap the whole aggregated
// GROUP BY/HAVING subquery (BASE_QUERY itself), not just append a clause
// after a plain SELECT -- see below.
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
