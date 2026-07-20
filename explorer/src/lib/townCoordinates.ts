// Approximate lat/lon for townships appearing in the extracted dataset.
// Hand-compiled (not geocoded via an API -- this project has no network
// access at build time), so treat these as "roughly where this place is",
// good enough to show geographic distribution, not precise enough for
// anything requiring real accuracy. Most are within a few hundred metres of
// the historic village/town centre; none are offence-exact -- there's no
// street-level geocoding here at all, only township-level.
//
// Deliberately a lookup keyed by town.name (lowercase, matching the DB)
// rather than a required field on every town: as extraction continues, new
// townships will appear that aren't in this table yet, and the map should
// just quietly skip those rather than break. See MapPage's "N towns not
// yet mapped" note.
export const TOWN_COORDINATES: Record<string, [number, number]> = {
  whitby: [54.4858, -0.6206],
  roxby: [54.545, -0.785],
  "liverton mines": [54.5397, -0.8494],
  "hawsker cum stainsacre": [54.4693, -0.5701],
  lythe: [54.5093, -0.6598],
  mickleby: [54.5157, -0.7057],
  fylingdales: [54.4183, -0.5333],
  hinderwell: [54.5389, -0.7757],
  barnby: [54.4922, -0.6478],
  ellerby: [54.4967, -0.7256],
  ruswarp: [54.4728, -0.6142],
  "eskdaleside cum ugglebarnby": [54.4611, -0.6511],
  eskdaleside: [54.4611, -0.6511],
  "newholm cum dunsley": [54.4931, -0.6389],
  danby: [54.4636, -0.8918],
  easington: [54.5461, -0.7684],
  aislaby: [54.4667, -0.6467],
  glaisdale: [54.4231, -0.7917],
  "new malton": [54.1339, -0.7972],
  "old malton": [54.1444, -0.7929],
  "kirby moorside": [54.2708, -0.9308],
  thornton: [54.2364, -0.7331],
  egton: [54.4444, -0.7639],
  pickering: [54.2367, -0.7719],
  claxton: [54.0389, -0.9686],
  "sand hutton": [54.0264, -0.9494],
  winteringham: [53.7011, -0.6067],
  sneaton: [54.4553, -0.5931],
  guisborough: [54.5347, -1.0554],
  loftus: [54.5578, -0.8847],
  "whitby strand": [54.4858, -0.6206], // historic wapentake, not a point -- falls back to Whitby
  yedingham: [54.1889, -0.6664],
  glasgow: [55.8642, -4.2518],
};

export function coordinatesFor(townName: string): [number, number] | undefined {
  return TOWN_COORDINATES[townName.toLowerCase().trim()];
}
