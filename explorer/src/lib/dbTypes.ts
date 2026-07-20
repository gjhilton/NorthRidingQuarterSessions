// Structural shape shared by better-sqlite3's Database (used at build time
// by Server Components) and the sql.js adapter (used in the browser by the
// two search islands) -- lets browseList.ts/peopleSearch.ts's query
// functions run against either without caring which one they got.
//
// Narrowed to a single named-params object because that's the only calling
// convention listConvictions/searchPeople actually use: every placeholder in
// their SQL is `@name`-prefixed, and both call sites pass exactly one bind
// object. If a future client-safe query needs positional `?` params too,
// widen this (and clientDb.ts's bindNamedParams) back out then.
export interface PreparedStatementLike {
  all(params?: Record<string, unknown>): unknown[];
  get(params?: Record<string, unknown>): unknown;
}

export interface DbLike {
  prepare(sql: string): PreparedStatementLike;
}
