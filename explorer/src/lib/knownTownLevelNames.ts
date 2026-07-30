// The old flat `town` table (used only to recognize which place-tree nodes
// were "town-level," for tree.ts's resolveAncestorByName) is gone from the
// v3 schema -- `location` is one tree with no separate marker for which
// nodes are towns. Checked directly against the pre-migration `town` table
// before deciding not to resurrect it as this list's source: 20 of its 106
// names no longer have an exact match in `location.name` (e.g. old
// "carlton" vs the migrated tree's "Carlton in Cleveland"). This list is
// read off the *actual* migrated tree structure instead: every direct
// child of the three top-level region nodes (North Riding of Yorkshire /
// County Durham / Rest of British Isles) plus York itself, which is
// exactly the town/parish level real convictions are tagged at. Verified
// against data/db.sqlite directly before hardcoding.
//
// Single shared export -- was independently duplicated once (a live query
// against the stale `town` table in filters.ts, this verified list in
// map.ts) before being reconciled here; keep it that way rather than
// letting either file's copy drift from the other again.
export const KNOWN_TOWN_LEVEL_NAMES = new Set(
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
