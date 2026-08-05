// Build-time only: stages the two static assets the client-side search
// islands (BrowseExplorer, PeopleSearch) lazy-load in the browser via sql.js
// -- the DB file itself and the sql.js WASM runtime. Everything else in the
// app queries data/db.sqlite directly at build time via better-sqlite3 and
// never touches these copies.
//
// DB_PATH resolution deliberately mirrors src/lib/db.ts's (process.cwd()-
// relative, same NRQS_EXPLORER_DB_PATH override) rather than resolving from
// this script's own file location, so the two can't silently pick different
// files. npm always runs package scripts with cwd = explorer/, matching what
// db.ts assumes.
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const EXPLORER_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const DB_PATH = process.env.NRQS_EXPLORER_DB_PATH
  ? path.resolve(process.cwd(), process.env.NRQS_EXPLORER_DB_PATH)
  : path.resolve(process.cwd(), "..", "data", "db.sqlite");
const WASM_SRC = path.join(EXPLORER_ROOT, "node_modules", "sql.js", "dist", "sql-wasm.wasm");

const publicDir = path.join(EXPLORER_ROOT, "public");
fs.mkdirSync(publicDir, { recursive: true });

const publicDbPath = path.join(publicDir, "db.sqlite");
fs.copyFileSync(DB_PATH, publicDbPath);
fs.copyFileSync(WASM_SRC, path.join(publicDir, "sql-wasm.wasm"));

// location.notes_private is an internal working-notes scratchpad (unverified
// coordinates, merge provenance) never meant for display -- must never reach
// the client-facing sql.js copy the browser fetches directly. Stripped here,
// on the copy only, so the build-time better-sqlite3 queries against the
// original data/db.sqlite are unaffected.
const publicDb = new Database(publicDbPath);
try {
  publicDb.prepare("UPDATE location SET notes_private = NULL WHERE notes_private IS NOT NULL").run();
} finally {
  publicDb.close();
}

console.log(`Copied ${DB_PATH} and sql-wasm.wasm into ${publicDir} (location.notes_private stripped)`);
