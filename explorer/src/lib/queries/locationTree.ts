import "server-only";
import { getDb } from "@/lib/db";

// Query for the self-referencing place tree (see
// data-loader/qsrecords/models/reference.py::Place), which replaced the old
// flat Town/Street pair.
export interface PlaceNode {
  id: number;
  name: string;
  parent_id: number | null;
  type: string;
  // How many convictions have this exact node (not its descendants) as
  // their offence location -- lets the Locations page toggle between "all
  // locations" (including ones only ever referenced as a person's
  // residence) and "only locations where an offence was committed", and
  // show the count for the latter.
  offenceCount: number;
  children: PlaceNode[];
}

export interface PlaceDetail {
  id: number;
  name: string;
  type: string;
  notes_public: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function listPlaceIds(): number[] {
  return (getDb().prepare(`SELECT id FROM place`).all() as { id: number }[]).map((r) => r.id);
}

export function getPlaceDetail(id: number): PlaceDetail | undefined {
  return getDb()
    .prepare(`SELECT id, name, type, notes_public, latitude, longitude FROM place WHERE id = ?`)
    .get(id) as PlaceDetail | undefined;
}

// Direct children only (one level down) -- the detail page shows these as a
// short flowing sentence, not the full recursive grid the /locations page
// already covers.
export function getPlaceChildren(id: number): { id: number; name: string }[] {
  return getDb()
    .prepare(`SELECT id, name FROM place WHERE parent_id = ? ORDER BY name`)
    .all(id) as { id: number; name: string }[];
}

export interface PlacePersonRow {
  name_key: string;
  display_name: string;
  role: string;
  reference_number: string;
  offence_date: string | null;
  offence_date_raw: string | null;
}

// Defendants and other involved persons whose own location_id is this exact
// node -- i.e. people who lived here, not people merely convicted of an
// offence that happened here (that's getPlaceConvictions' job). One row per
// (person, conviction) appearance -- same "don't collapse to one row per
// identity" shape as getPlaceConvictions, so the table behaves the same way
// (sortable by offence date, links to the specific record).
export function getPlacePeople(id: number): PlacePersonRow[] {
  return getDb()
    .prepare(
      `
      SELECT name_key, display_name, role, reference_number, offence_date, offence_date_raw
      FROM (
        SELECT d.name_key,
          TRIM(COALESCE(d.first_name,'') || ' ' || COALESCE(d.last_name,'')) AS display_name,
          'defendant' AS role, sc.reference_number, sc.offence_date, sc.offence_date_raw
        FROM defendant d
        JOIN summary_conviction_defendant scd ON scd.defendant_id = d.id
        JOIN summary_conviction sc ON sc.id = scd.summary_conviction_id
        WHERE d.location_id = ?
        UNION ALL
        SELECT p.name_key,
          TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) AS display_name,
          COALESCE(NULLIF(TRIM(ip.role), ''), 'other') AS role,
          sc.reference_number, sc.offence_date, sc.offence_date_raw
        FROM person p
        JOIN involved_persons ip ON ip.person_id = p.id
        JOIN summary_conviction sc ON sc.id = ip.summary_conviction_id
        WHERE p.location_id = ?
      )
      WHERE name_key IS NOT NULL AND TRIM(name_key) != ''
      ORDER BY offence_date IS NULL, offence_date ASC
      `
    )
    .all(id, id) as PlacePersonRow[];
}

// The chain from the root parish down to this place, for a breadcrumb --
// walks parent_id upward (the whole point of the tree: one id recovers
// the full ancestry).
export function getPlaceAncestry(id: number): { id: number; name: string }[] {
  const rows = getDb()
    .prepare(
      `
      WITH RECURSIVE ancestry(id, name, parent_id, depth) AS (
        SELECT id, name, parent_id, 0 FROM place WHERE id = ?
        UNION ALL
        SELECT p.id, p.name, p.parent_id, a.depth + 1
        FROM place p JOIN ancestry a ON p.id = a.parent_id
      )
      SELECT id, name FROM ancestry ORDER BY depth DESC
      `
    )
    .all(id) as { id: number; name: string }[];
  return rows;
}

export interface PlaceConvictionRow {
  reference_number: string;
  conviction_date: string | null;
  conviction_date_raw: string;
  offence_date: string | null;
  offence_date_raw: string | null;
  charge_description: string;
  offence_type: string;
  // Comma-joined "First Last" -- same shape/expression as browseList.ts's
  // DEFENDANT_SORT_EXPR, so the Convictions page and this one show
  // defendants the same way (that page's richer per-defendant JSON with
  // occupation/qualifier is overkill here, this page never sorts by it).
  defendant_names: string | null;
}

// Convictions directly tied to this exact node (as offence or court
// location) -- not rolled up from descendants, since a node's own
// rowSpan/breadcrumb already shows where it sits relative to its children.
// One row per (conviction, offence type) pair -- a conviction tagged with
// more than one offence type appears once per type, so the detail page can
// group into sections by offence_type. Every conviction has at least one
// type tagged, so the join can't silently drop any.
export function getPlaceConvictions(id: number): PlaceConvictionRow[] {
  return getDb()
    .prepare(
      `
      SELECT DISTINCT sc.reference_number, sc.conviction_date, sc.conviction_date_raw,
        sc.offence_date, sc.offence_date_raw, sc.charge_description,
        ot.name AS offence_type,
        (
          SELECT GROUP_CONCAT(TRIM(COALESCE(d.first_name,'') || ' ' || COALESCE(d.last_name,'')), ', ')
          FROM summary_conviction_defendant scd
          JOIN defendant d ON d.id = scd.defendant_id
          WHERE scd.summary_conviction_id = sc.id
        ) AS defendant_names
      FROM summary_conviction sc
      JOIN summary_conviction_offence_type scot ON scot.summary_conviction_id = sc.id
      JOIN offence_type ot ON ot.id = scot.offence_type_id
      WHERE sc.offence_location_id = ? OR sc.court_location_id = ?
      ORDER BY ot.name, sc.offence_date IS NULL, sc.offence_date ASC
      `
    )
    .all(id, id) as PlaceConvictionRow[];
}

export function listPlaceTree(): PlaceNode[] {
  const rows = getDb()
    .prepare(`SELECT id, name, parent_id, type FROM place ORDER BY name`)
    .all() as Omit<PlaceNode, "children" | "offenceCount">[];

  const offenceCounts = new Map(
    (
      getDb()
        .prepare(
          `SELECT offence_location_id AS id, COUNT(*) AS count FROM summary_conviction
           WHERE offence_location_id IS NOT NULL GROUP BY offence_location_id`
        )
        .all() as { id: number; count: number }[]
    ).map((r) => [r.id, r.count])
  );

  const byId = new Map<number, PlaceNode>(
    rows.map((r) => [r.id, { ...r, offenceCount: offenceCounts.get(r.id) ?? 0, children: [] }])
  );
  const roots: PlaceNode[] = [];
  for (const node of byId.values()) {
    if (node.parent_id !== null && byId.has(node.parent_id)) {
      byId.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
