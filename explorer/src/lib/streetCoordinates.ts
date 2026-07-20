// Approximate lat/lon for streets within Whitby appearing in the extracted
// dataset. Hand-compiled at build time (not geocoded via an API -- this
// project has no network access at build time), from general knowledge of
// Whitby's layout -- treat these as "roughly where this street is", good
// enough to show which part of town an offence was recorded in, not
// precise enough for anything requiring real accuracy. See
// src/lib/townCoordinates.ts for the equivalent township-level table and
// its caveats, which apply here even more strongly: a street is a line, not
// a point, so each entry below is one rough spot along it, not "the"
// location.
//
// Keyed by street.name (lowercase, matching the DB), scoped to streets
// whose town is Whitby specifically -- see /map/whitby.
export const WHITBY_STREET_COORDINATES: Record<string, [number, number]> = {
  baxtergate: [54.4855, -0.6157],
  "bridge street": [54.4863, -0.6144],
  "church street": [54.4875, -0.6134],
  "east cliff near the abbey farm": [54.4886, -0.6058],
  "grape lane": [54.487, -0.6138],
  "hospital yard": [54.4857, -0.6172],
  sandgate: [54.4862, -0.6152],
  "st ann's staith": [54.4863, -0.6161],
  "wellington road": [54.482, -0.6202],
};

export function whitbyStreetCoordinatesFor(streetName: string): [number, number] | undefined {
  return WHITBY_STREET_COORDINATES[streetName.toLowerCase().trim()];
}
