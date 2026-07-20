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
