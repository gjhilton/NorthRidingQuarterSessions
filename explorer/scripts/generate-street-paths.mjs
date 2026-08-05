// One-off (but safely re-runnable) generation script -- NOT part of the
// build (not referenced by package.json's build/dev scripts). Queries
// OpenStreetMap's Overpass API for the real road geometry (a polyline of
// [lat, lon] points, not a single hand-guessed centroid) of every distinct
// (town, street) pair in the dataset, anchored by TOWN_COORDINATES' existing
// hand-compiled township centroid so obscure 19th-century townships that
// don't exist as their own OSM administrative area can still be searched
// via a radius around a known point.
//
// Historical names frequently won't match a modern OSM way at all (road
// renamed/gone, or the DB entry is a generic descriptor like "town street"
// rather than a real road name) -- those are just omitted from the output,
// same "quietly skip, don't break" convention as TOWN_COORDINATES itself.
// Only `highway=*` ways are matched.
//
// Query strategy, tried in order per street (confirmed against the live
// API before running the full batch -- see the "baxtergate" smoke test):
//   1. Exact match on the title-cased name (`name="Baxtergate"`). Cheap for
//      Overpass to evaluate, and the reliable path in practice.
//   2. Only if that finds nothing: a case-insensitive regex exact match
//      (`name~"^...$",i`), to still catch OSM entries cased differently
//      than our title-casing -- slower and more failure-prone under load,
//      so it's the fallback, not the default, for every street.
// Both variants get a few retries with backoff on transient failures (the
// public instance returns occasional 504s under load), same "log it, don't
// silently drop it" spirit as 02_fetch_resources.py::fetch_webpage
// elsewhere in this project.
//
// Usage:
//   node scripts/generate-street-paths.mjs
//   node scripts/generate-street-paths.mjs --only=whitby,baxtergate   # one street, for validation
//
// Writes src/lib/data/streetPaths.json: { "town|street": [[lat,lon], ...] }

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const EXPLORER_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DB_PATH = process.env.NRQS_EXPLORER_DB_PATH
  ? path.resolve(process.cwd(), process.env.NRQS_EXPLORER_DB_PATH)
  : path.resolve(process.cwd(), "..", "data", "db.sqlite");
const OUTPUT_PATH = path.join(EXPLORER_ROOT, "src", "lib", "data", "streetPaths.json");

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const SEARCH_RADIUS_METRES = 4000;
const REQUEST_DELAY_MS = 1500;
const MAX_ATTEMPTS = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeForOverpassString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function runQuery(query) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
    });
    if (response.ok) return response.json();
    const body = await response.text();
    if (attempt === MAX_ATTEMPTS) {
      throw new Error(`Overpass ${response.status} after ${MAX_ATTEMPTS} attempts: ${body.slice(0, 200)}`);
    }
    await sleep(2000 * attempt);
  }
}

function extractGeometry(data) {
  const way = data.elements?.find((el) => el.type === "way" && el.geometry?.length > 1);
  return way ? way.geometry.map((pt) => [pt.lat, pt.lon]) : null;
}

async function fetchWayGeometry(streetName, titleCased, [lat, lon]) {
  const exactQuery = `
    [out:json][timeout:25];
    way["highway"]["name"="${escapeForOverpassString(titleCased)}"](around:${SEARCH_RADIUS_METRES},${lat},${lon});
    out geom;
  `;
  const exactResult = extractGeometry(await runQuery(exactQuery));
  if (exactResult) return exactResult;

  const pattern = `^${escapeForRegex(streetName)}$`;
  const regexQuery = `
    [out:json][timeout:25];
    way["highway"]["name"~"${pattern}",i](around:${SEARCH_RADIUS_METRES},${lat},${lon});
    out geom;
  `;
  return extractGeometry(await runQuery(regexQuery));
}

async function main() {
  const { TOWN_COORDINATES } = await import(
    path.join(EXPLORER_ROOT, "src", "lib", "townCoordinates.ts")
  );
  const { titleCase } = await import(path.join(EXPLORER_ROOT, "src", "lib", "text.ts"));

  const db = new Database(DB_PATH, { readonly: true });
  let pairs = db
    .prepare(
      `SELECT DISTINCT t.name AS town, s.name AS street
       FROM street s JOIN town t ON t.id = s.town_id
       ORDER BY t.name, s.name`
    )
    .all();
  db.close();

  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  if (onlyArg) {
    const [onlyTown, onlyStreet] = onlyArg.slice("--only=".length).split(",");
    pairs = pairs.filter((p) => p.town === onlyTown && p.street === onlyStreet);
  }

  console.log(`${pairs.length} (town, street) pairs to look up.`);

  const results = {};
  let found = 0;
  let noTownCoords = 0;
  let notFound = 0;
  let errored = 0;

  for (const [i, { town, street }] of pairs.entries()) {
    const anchor = TOWN_COORDINATES[town];
    if (!anchor) {
      noTownCoords++;
      continue;
    }
    try {
      const geometry = await fetchWayGeometry(street, titleCase(street), anchor);
      if (geometry) {
        results[`${town}|${street}`] = geometry;
        found++;
      } else {
        notFound++;
      }
    } catch (err) {
      errored++;
      console.error(`  error on "${street}" (${town}): ${err.message}`);
    }
    if ((i + 1) % 25 === 0 || i === pairs.length - 1) {
      console.log(
        `  ${i + 1}/${pairs.length} done -- found ${found}, not found ${notFound}, no town coords ${noTownCoords}, errors ${errored}`
      );
    }
    await sleep(REQUEST_DELAY_MS);
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${Object.keys(results).length} street path(s) to ${OUTPUT_PATH}`);
  console.log(
    `Final: found ${found}, not found ${notFound}, no town coords ${noTownCoords}, errors ${errored}, total ${pairs.length}`
  );
}

main();
