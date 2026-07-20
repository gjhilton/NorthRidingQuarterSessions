"use client";

// Lazy, browser-only SQLite -- used by the two search islands (BrowseExplorer,
// PeopleSearch) whose queries can't be enumerated at build time (arbitrary
// free-text search/filter combinations). Everything else in the app queries
// data/db.sqlite directly at build time via better-sqlite3 (src/lib/db.ts)
// and never touches this module.
//
// Imports the non-"browser" sql.js build explicitly (sql-wasm.js, not
// sql-wasm-browser.js) so the WASM filename it requests via `locateFile`
// matches the file scripts/copy-db.mjs actually stages into public/ --
// package.json's "browser" export field would otherwise make bundlers pick
// sql-wasm-browser.js, which looks for a differently-named .wasm file.
import type { Database as SqlJsDatabase, Statement as SqlJsStatement } from "sql.js";
import type { DbLike, PreparedStatementLike } from "@/lib/dbTypes";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

let clientDbPromise: Promise<DbLike> | null = null;

// listConvictions/searchPeople write every placeholder as `@name`; sql.js
// (unlike better-sqlite3) requires that prefix literally in the bind object's
// keys, so it's added here rather than at each call site.
function bindNamedParams(stmt: SqlJsStatement, params: Record<string, unknown> | undefined) {
  if (!params) return;
  const named: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    named[`@${key}`] = value;
  }
  stmt.bind(named as Parameters<SqlJsStatement["bind"]>[0]);
}

function wrapDatabase(sqlDb: SqlJsDatabase): DbLike {
  return {
    prepare(sql: string): PreparedStatementLike {
      return {
        all(params?: Record<string, unknown>) {
          const stmt = sqlDb.prepare(sql);
          bindNamedParams(stmt, params);
          const rows: unknown[] = [];
          while (stmt.step()) rows.push(stmt.getAsObject());
          stmt.free();
          return rows;
        },
        get(params?: Record<string, unknown>) {
          const stmt = sqlDb.prepare(sql);
          bindNamedParams(stmt, params);
          const row = stmt.step() ? stmt.getAsObject() : undefined;
          stmt.free();
          return row;
        },
      };
    },
  };
}

export function getClientDb(): Promise<DbLike> {
  if (!clientDbPromise) {
    clientDbPromise = (async () => {
      const [{ default: initSqlJs }, dbResponse] = await Promise.all([
        import("sql.js/dist/sql-wasm.js"),
        fetch(`${BASE_PATH}/db.sqlite`),
      ]);
      const SQL = await initSqlJs({
        locateFile: (file: string) => `${BASE_PATH}/${file}`,
      });
      const buffer = await dbResponse.arrayBuffer();
      return wrapDatabase(new SQL.Database(new Uint8Array(buffer)));
    })();
  }
  return clientDbPromise;
}
