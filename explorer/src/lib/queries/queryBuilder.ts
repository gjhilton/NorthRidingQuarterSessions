// Shared list-query plumbing: WHERE/HAVING-clause accumulation and
// paginated count+page query pairing. Extracted after finding the same
// shape (accumulate filter clauses + params, join with AND, run a COUNT
// alongside a LIMIT/OFFSET page) hand-rolled slightly differently in
// browseList.ts, peopleList.ts, and offences.ts. Callers still decide what
// to push and when -- every filter's own presence check and SQL shape
// stays local to its query file, this only removes the boilerplate at the
// bottom of each buildWhere/buildHaving and the copy-pasted count+page pair.
import type { DbLike } from "@/lib/dbTypes";

export interface WhereClause {
  sql: string;
  params: Record<string, unknown>;
}

export function combineClauses(
  clauses: string[],
  params: Record<string, unknown>,
  keyword: "WHERE" | "HAVING" = "WHERE"
): WhereClause {
  return {
    sql: clauses.length ? `${keyword} ${clauses.join(" AND ")}` : "",
    params,
  };
}

export function paginate<Row>(
  db: DbLike,
  {
    selectSql,
    countSql,
    whereSql,
    params,
    orderBySql,
    page,
    pageSize,
  }: {
    selectSql: string;
    countSql: string;
    whereSql: string;
    params: Record<string, unknown>;
    orderBySql: string;
    page: number;
    pageSize: number;
  }
): { rows: Row[]; total: number } {
  const offset = (page - 1) * pageSize;
  const rows = db
    .prepare(`${selectSql} ${whereSql} ORDER BY ${orderBySql} LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit: pageSize, offset }) as Row[];
  const { total } = db.prepare(`${countSql} ${whereSql}`).get(params) as { total: number };
  return { rows, total };
}
