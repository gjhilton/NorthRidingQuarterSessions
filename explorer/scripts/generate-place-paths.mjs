// Successor to generate-street-paths.mjs (which targeted the old flat
// town/street schema, keyed its JSON output by "town|street", and only
// ever got one validation street done) -- this targets the new
// self-referencing place tree instead, writing straight into
// place.path_geometry (a JSON-encoded [[lat,lon], ...] string) rather than
// a separate file. Anchor point for each path-type place is its own
// lat/lon if it has one, otherwise the nearest ancestor's -- most streets
// don't have their own point yet, but by now every parish/town/district
// hub does (see the "geolocate all point locations" pass), so almost every
// street resolves to a real nearby anchor.
//
// Same Overpass query strategy as the old script (exact name match, then a
// case-insensitive regex fallback), same retry/backoff, same "quietly skip
// what isn't found" convention -- see that file's header comment for the
// full rationale, unchanged here.
//
// Usage:
//   node scripts/generate-place-paths.mjs
//   node scripts/generate-place-paths.mjs --only=Baxtergate   # one place, for validation
//   node scripts/generate-place-paths.mjs --limit=20          # first N only

import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const EXPLORER_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DB_PATH = process.env.NRQS_EXPLORER_DB_PATH
  ? path.resolve(process.cwd(), process.env.NRQS_EXPLORER_DB_PATH)
  : path.resolve(process.cwd(), "..", "data", "db.sqlite");

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const SEARCH_RADIUS_METRES = 3000;
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

// place.name carries disambiguator suffixes for display ("Church Street
// (Staithes)", distinguishing it from Whitby's own Church Street) -- OSM
// has no such suffix in its own `name` tag, so searching for the literal
// string never matches. Strip it for the Overpass query only; the DB row
// keyed by place.id (not by name) still gets the geometry either way.
function queryName(name) {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

async function runQuery(query) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        // The public instance 406s requests without a real User-Agent
        // (an anti-abuse measure, not present when this script was first
        // written) -- identifies this as the project's own tooling, not a
        // browser, per Overpass's usage policy.
        "User-Agent": "NorthRidingQuarterSessions-place-paths/1.0 (github.com/gjhilton/NorthRidingQuarterSessions)",
        Accept: "application/json",
      },
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

async function fetchWayGeometry(name, [lat, lon], radius = SEARCH_RADIUS_METRES) {
  const exactQuery = `
    [out:json][timeout:25];
    way["highway"]["name"="${escapeForOverpassString(name)}"](around:${radius},${lat},${lon});
    out geom;
  `;
  const exactResult = extractGeometry(await runQuery(exactQuery));
  if (exactResult) return exactResult;

  const pattern = `^${escapeForRegex(name)}$`;
  const regexQuery = `
    [out:json][timeout:25];
    way["highway"]["name"~"${pattern}",i](around:${radius},${lat},${lon});
    out geom;
  `;
  return extractGeometry(await runQuery(regexQuery));
}

// Walks parent_id upward until it finds a place with its own lat/lon.
function findAnchor(place, byId) {
  let current = place;
  while (current) {
    if (current.latitude != null && current.longitude != null) {
      return [current.latitude, current.longitude];
    }
    current = current.parent_id != null ? byId.get(current.parent_id) : null;
  }
  return null;
}

async function main() {
  const db = new Database(DB_PATH);
  const all = db.prepare(`SELECT id, name, type, parent_id, latitude, longitude FROM place`).all();
  const byId = new Map(all.map((p) => [p.id, p]));
  let places = all.filter((p) => p.type === "path");

  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  if (onlyArg) {
    const onlyName = onlyArg.slice("--only=".length);
    places = places.filter((p) => p.name === onlyName);
  }
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  if (limitArg) {
    places = places.slice(0, Number(limitArg.slice("--limit=".length)));
  }
  const radiusArg = process.argv.find((a) => a.startsWith("--radius="));
  const radius = radiusArg ? Number(radiusArg.slice("--radius=".length)) : SEARCH_RADIUS_METRES;

  console.log(`${places.length} path-type place(s) to look up.`);

  const updateStmt = db.prepare(`UPDATE place SET path_geometry = ? WHERE id = ?`);

  let found = 0;
  let noAnchor = 0;
  let notFound = 0;
  let errored = 0;

  for (const [i, place] of places.entries()) {
    const anchor = findAnchor(place, byId);
    if (!anchor) {
      noAnchor++;
      continue;
    }
    try {
      const geometry = await fetchWayGeometry(queryName(place.name), anchor, radius);
      if (geometry) {
        updateStmt.run(JSON.stringify(geometry), place.id);
        found++;
      } else {
        notFound++;
      }
    } catch (err) {
      errored++;
      console.error(`  error on "${place.name}" (id ${place.id}): ${err.message}`);
    }
    if ((i + 1) % 10 === 0 || i === places.length - 1) {
      console.log(
        `  ${i + 1}/${places.length} done -- found ${found}, not found ${notFound}, no anchor ${noAnchor}, errors ${errored}`
      );
    }
    await sleep(REQUEST_DELAY_MS);
  }

  db.close();
  console.log(
    `\nFinal: found ${found}, not found ${notFound}, no anchor ${noAnchor}, errors ${errored}, total ${places.length}`
  );
}

main();
