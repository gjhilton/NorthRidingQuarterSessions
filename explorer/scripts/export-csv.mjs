// Build-time only: writes the full extracted dataset to public/nrqs-dataset.csv
// for the "download the whole dataset" link on the Methodology page. Distinct
// from BrowseExplorer's client-side CSV export, which exports only the
// current filtered result set and is generated in the browser instead.
//
// Ported to the v3 schema (location/crime_type self-referencing trees,
// person/summary_conviction_person, summary_conviction_location) -- this was
// already broken against the *pre-v3* schema too (it referenced defendant,
// town, street, offence_type directly via flat town_id/street_id columns,
// bypassing the old place tree entirely), so this rewrite doesn't try to
// preserve the old SQL shape, just the CSV's columns/purpose. Four columns
// are dropped outright, not renamed -- sentencing, extraction_confidence,
// of_especial_interest, and archive_url have no v3 equivalent (see
// data-loader/qsrecords/models/core.py's SummaryConviction docstring: all
// four were dropped from the schema, not moved).
//
// Plain Node (no TS transpilation -- see package.json's "export-csv"
// script), so this can't import src/lib/tree.ts or queries/map.ts's
// KNOWN_TOWN_LEVEL_NAMES -- resolveTown() below is a small, deliberately
// duplicated equivalent. If a third place ends up needing this same
// town-resolution logic, that's worth promoting into one shared JSON/data
// file both the TS app code and this plain-JS script can read.
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

// Same list as queries/map.ts's KNOWN_TOWN_LEVEL_NAMES -- every direct
// child of the three top-level region nodes (North Riding of Yorkshire /
// County Durham / Rest of British Isles) plus York, read off the actual
// migrated location tree (see that file's own comment for how/why this
// was derived instead of reusing the stale pre-migration `town` table).
const KNOWN_TOWN_LEVEL_NAMES = new Set(
  [
    "Aislaby", "Ampleforth", "Barrow-in-Furness", "Boosbeck", "Brompton", "Brotton",
    "Carlin How", "Carlton in Cleveland", "Claxton", "Cross-Parish Highways", "Cumberland",
    "Danby", "Darlington", "Doncaster", "Durham", "Easington", "Easingwold", "Egton",
    "Eskdaleside-cum-Ugglebarnby", "Filey", "Fylingdales", "Glaisdale", "Glasgow", "Goathland",
    "Great Ayton", "Guisborough", "Hartlepool", "Harwood Dale", "Hawsker-cum-Stainsacre",
    "Helmsley", "Hereford", "Hexham", "Hinderwell", "Ingleby Greenhow", "Ireland",
    "Kingston upon Hull", "Kirkbymoorside", "Levisham", "Liverton", "Lofthouse (Loftus)",
    "Loftus", "London", "Lythe", "Middlesbrough", "Middleton", "Moorsholm", "New London",
    "Newholm-cum-Dunsley", "North Shields", "Northallerton", "Penzance", "Pickering", "Picton",
    "Rosedale", "Ruswarp", "Ryedale", "Saltburn by the Sea", "Saltersgate", "Sand Hutton",
    "Scaling", "Scarborough", "Sheffield", "Skinningrove", "Slapewath", "Sneaton",
    "South Stockton", "Stockton on Tees", "Stokesley", "Whitby", "Whitby Strand", "Wolviston",
    "Yarmouth", "York",
  ].map((n) => n.toLowerCase())
);

// Walks upward from startId until it hits a node in KNOWN_TOWN_LEVEL_NAMES,
// falling back to the start node itself if nothing matches -- same
// algorithm as src/lib/tree.ts's resolveAncestorByName, reimplemented here
// since this plain-JS script can't import that TS module.
function resolveTown(startId, byId) {
  let current = byId.get(startId);
  const start = current;
  while (current) {
    if (KNOWN_TOWN_LEVEL_NAMES.has(current.name.toLowerCase())) return current;
    current = current.parent_id != null ? byId.get(current.parent_id) : undefined;
  }
  return start;
}

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

const locations = db.prepare(`SELECT id, name, parent_id FROM location`).all();
const locationsById = new Map(locations.map((l) => [l.id, l]));

const convictionRows = db
  .prepare(
    `
    SELECT
      sc.id,
      sc.record_number AS reference_number,
      sc.conviction_date,
      sc.offence_date,
      -- SQLite's strftime('%w', ...) is 0=Sunday..6=Saturday -- see
      -- queries/patterns.ts's dayOfWeekBreakdown() for the same derivation.
      (CASE CAST(strftime('%w', sc.offence_date) AS INTEGER)
        WHEN 0 THEN 'Sunday' WHEN 1 THEN 'Monday' WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday' WHEN 4 THEN 'Thursday' WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday' END) AS offence_day_of_week,
      COALESCE(
        (
          SELECT GROUP_CONCAT(ct.name, '; ')
          FROM summary_conviction_crime_type scct
          JOIN crime_type ct ON ct.id = scct.crime_type_id
          WHERE scct.summary_conviction_id = sc.id
        ),
        'unclassified'
      ) AS offence_type,
      sc.charge_description,
      (
        SELECT GROUP_CONCAT(TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')), '; ')
        FROM summary_conviction_person scp
        JOIN person p ON p.id = scp.person_id
        WHERE scp.summary_conviction_id = sc.id AND scp.role = 'defendant'
      ) AS defendants
    FROM summary_conviction sc
    ORDER BY sc.conviction_date, sc.record_number
    `
  )
  .all();

// One row per conviction id -> offence/court location, so offence_town/
// offence_street/court_town can be resolved in JS against the in-memory
// location tree above rather than re-expressing resolveTown() as SQL.
const offenceLocations = new Map(
  db
    .prepare(
      `SELECT summary_conviction_id, location_id FROM summary_conviction_location WHERE role = 'location of offence'`
    )
    .all()
    .map((r) => [r.summary_conviction_id, r.location_id])
);
const courtLocations = new Map(
  db
    .prepare(
      `SELECT summary_conviction_id, location_id FROM summary_conviction_location WHERE role = 'court location'`
    )
    .all()
    .map((r) => [r.summary_conviction_id, r.location_id])
);

const rows = convictionRows.map((sc) => {
  const offenceLocationId = offenceLocations.get(sc.id);
  const courtLocationId = courtLocations.get(sc.id);
  const offenceTown = offenceLocationId != null ? resolveTown(offenceLocationId, locationsById) : undefined;
  const courtTown = courtLocationId != null ? resolveTown(courtLocationId, locationsById) : undefined;
  // A leaf more specific than its own resolved town counts as a "street"
  // (matches src/lib/queries/filters.ts's listOffenceStreets() convention:
  // town.id === id means the location was tagged exactly at town level, no
  // street to show).
  const offenceStreet =
    offenceLocationId != null && offenceTown && offenceTown.id !== offenceLocationId
      ? locationsById.get(offenceLocationId)?.name
      : null;

  const { id, ...rest } = sc;
  return {
    ...rest,
    offence_town: offenceTown?.name ?? null,
    offence_street: offenceStreet,
    court_town: courtTown?.name ?? null,
  };
});

db.close();

const publicDir = path.join(EXPLORER_ROOT, "public");
fs.mkdirSync(publicDir, { recursive: true });
const outPath = path.join(publicDir, "nrqs-dataset.csv");
fs.writeFileSync(outPath, toCsv(rows));

console.log(`Wrote ${outPath} (${rows.length} rows)`);
