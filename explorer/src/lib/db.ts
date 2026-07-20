import "server-only";
import path from "node:path";
import Database from "better-sqlite3";

// Read-only mirror of the schema data-loader/qsrecords/models owns.
// explorer/ never writes to this database.
const DB_PATH = process.env.NRQS_EXPLORER_DB_PATH
  ? path.resolve(process.cwd(), process.env.NRQS_EXPLORER_DB_PATH)
  : path.resolve(process.cwd(), "..", "data", "db.sqlite");

let db: Database.Database | undefined;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
    db.pragma("query_only = ON");
  }
  return db;
}

// Shared by generateStaticParams() implementations that just need every
// value of one column (e.g. all conviction ids, all name_keys) to enumerate
// static routes at build time.
export function selectColumn<T>(sql: string, column: string): T[] {
  return (getDb().prepare(sql).all() as Record<string, T>[]).map((row) => row[column]);
}
