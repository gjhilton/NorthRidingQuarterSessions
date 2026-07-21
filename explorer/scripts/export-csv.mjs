// Build-time only: writes the full extracted dataset to public/nrqs-dataset.csv
// for the "download the whole dataset" link on the Methodology page. Distinct
// from BrowseExplorer's client-side CSV export, which exports only the
// current filtered result set and is generated in the browser instead.
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const EXPLORER_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Mirrors src/lib/db.ts's resolution (process.cwd()-relative, same env var
// override) so this script and the app can't silently read different files.
const DB_PATH = process.env.NRQS_EXPLORER_DB_PATH
  ? path.resolve(process.cwd(), process.env.NRQS_EXPLORER_DB_PATH)
  : path.resolve(process.cwd(), "..", "data", "db.sqlite");

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows) {
  if (rows.length === 0) return "";
  const columns = Object.keys(rows[0]);
  const lines = [columns.join(",")];
  for (const row of rows) {
    lines.push(columns.map((c) => csvEscape(row[c])).join(","));
  }
  return lines.join("\n");
}

const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });

const rows = db
  .prepare(
    `
    SELECT
      sc.reference_number,
      sc.conviction_date,
      sc.offence_date,
      sc.offence_day_of_week,
      COALESCE(
        (
          SELECT GROUP_CONCAT(ot.name, '; ')
          FROM summary_conviction_offence_type scot
          JOIN offence_type ot ON ot.id = scot.offence_type_id
          WHERE scot.summary_conviction_id = sc.id
        ),
        'unclassified'
      ) AS offence_type,
      sc.charge_description,
      sc.sentencing,
      ot_town.name AS offence_town,
      st.name AS offence_street,
      court_town.name AS court_town,
      (
        SELECT GROUP_CONCAT(TRIM(d.first_name || ' ' || d.last_name), '; ')
        FROM summary_conviction_defendant scd
        JOIN defendant d ON d.id = scd.defendant_id
        WHERE scd.summary_conviction_id = sc.id
      ) AS defendants,
      sc.extraction_confidence,
      sc.archive_url
    FROM summary_conviction sc
    LEFT JOIN town ot_town ON ot_town.id = sc.offence_location_town_id
    LEFT JOIN street st ON st.id = sc.offence_location_street_id
    LEFT JOIN town court_town ON court_town.id = sc.court_location_town_id
    ORDER BY sc.conviction_date, sc.reference_number
    `
  )
  .all();

db.close();

const publicDir = path.join(EXPLORER_ROOT, "public");
fs.mkdirSync(publicDir, { recursive: true });
const outPath = path.join(publicDir, "nrqs-dataset.csv");
fs.writeFileSync(outPath, toCsv(rows));

console.log(`Wrote ${outPath} (${rows.length} rows)`);
