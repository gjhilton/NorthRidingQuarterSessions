import "server-only";
import { getDb } from "@/lib/db";
import { personKeyExpr, personNamesExpr, personNameColumnsSql, type NameRow } from "@/lib/queries/personFragments";

// Query for the self-referencing location tree (see
// data-loader/qsrecords/models/reference.py::Location), which replaced the
// old flat Town/Street pair AND the old `place` tree it's renamed from --
// both folded into one self-referential (id, name, parent_id) tree. `type`
// dropped entirely -- the old `place.type` column isn't in the new schema
// and nothing here or in LocationGrid.tsx actually read it.
export interface PlaceNode {
  id: number;
  name: string;
  parent_id: number | null;
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
  notes_public: string | null;
  latitude: number | null;
  longitude: number | null;
}

// The stored role value for a summary_conviction_location row that marks
// where the offence itself happened (as opposed to 'court location' or
// 'petty sessional division') -- see core.py's SummaryConvictionLocation.
const OFFENCE_LOCATION_ROLE = "location of offence";

export function listPlaceIds(): number[] {
  return (getDb().prepare(`SELECT id FROM location`).all() as { id: number }[]).map((r) => r.id);
}

// notes_private deliberately never selected -- see reference.py's Location
// docstring: it must never reach the client-facing build.
export function getPlaceDetail(id: number): PlaceDetail | undefined {
  return getDb()
    .prepare(`SELECT id, name, notes_public, latitude, longitude FROM location WHERE id = ?`)
    .get(id) as PlaceDetail | undefined;
}

// Direct children only (one level down) -- the detail page shows these as a
// short flowing sentence, not the full recursive grid the /locations page
// already covers.
export function getPlaceChildren(id: number): { id: number; name: string }[] {
  return getDb()
    .prepare(`SELECT id, name FROM location WHERE parent_id = ? ORDER BY name`)
    .all(id) as { id: number; name: string }[];
}

export interface PlacePersonRow extends NameRow {
  name_key: string;
  role: string;
  reference_number: string;
  offence_date: string | null;
  offence_date_raw: string | null;
}

// Every person (any role -- defendant, victim, witness, etc.) whose own
// home_location_id is this exact node -- i.e. people who lived here, not
// people merely convicted of an offence that happened here (that's
// getPlaceConvictions' job). One row per (person, conviction) appearance --
// same "don't collapse to one row per identity" shape as
// getPlaceConvictions, so the table behaves the same way (sortable by
// offence date, links to the specific record).
//
// v3 merges defendant/person into one table and summary_conviction_defendant/
// involved_persons into one summary_conviction_person junction with a real
// `role` column always populated (including 'defendant') -- so this no
// longer needs the old UNION ALL of two differently-shaped queries, nor the
// COALESCE(NULLIF(...), 'other') fallback (that only existed because
// involved_persons.role could be blank; summary_conviction_person.role never is).
// Returns raw name fields (personNameColumnsSql) rather than a pre-built
// display string -- format via formatNameRow (personFragments.ts) at the
// call site, the same convention as every other person-name query, instead
// of re-deriving a "First Last" string in SQL (which used to skip
// middle_name/title/name_postfix/alias entirely).
export function getPlacePeople(id: number): PlacePersonRow[] {
  return getDb()
    .prepare(
      `
      SELECT ${personKeyExpr("p")} AS name_key,
        ${personNameColumnsSql("p")},
        scp.role AS role,
        sc.record_number AS reference_number, sc.offence_date, sc.offence_date_raw
      FROM person p
      JOIN summary_conviction_person scp ON scp.person_id = p.id
      JOIN summary_conviction sc ON sc.id = scp.summary_conviction_id
      WHERE p.home_location_id = ? AND name_key IS NOT NULL AND TRIM(name_key) != ''
      ORDER BY offence_date IS NULL, offence_date ASC
      `
    )
    .all(id) as PlacePersonRow[];
}

// The chain from the root region down to this place, for a breadcrumb --
// walks parent_id upward (the whole point of the tree: one id recovers
// the full ancestry).
export function getPlaceAncestry(id: number): { id: number; name: string }[] {
  const rows = getDb()
    .prepare(
      `
      WITH RECURSIVE ancestry(id, name, parent_id, depth) AS (
        SELECT id, name, parent_id, 0 FROM location WHERE id = ?
        UNION ALL
        SELECT l.id, l.name, l.parent_id, a.depth + 1
        FROM location l JOIN ancestry a ON l.id = a.parent_id
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

// Convictions directly tied to this exact node (any summary_conviction_location
// role -- offence or court location, matching the old offence_location_id OR
// court_location_id check) -- not rolled up from descendants, since a node's
// own rowSpan/breadcrumb already shows where it sits relative to its
// children. One row per (conviction, offence type) pair -- a conviction
// tagged with more than one offence type appears once per type, so the
// detail page can group into sections by offence_type. Every conviction has
// at least one type tagged, so the join can't silently drop any.
//
// `record_number` aliased back to `reference_number` and
// `conviction_date_raw` dropped -- see offences.ts's getOffenceTypeConvictions
// for the same two calls, made for the same reason (ConvictionsTable, which
// both this page and /offences/[id] share, expects `reference_number` and
// never reads conviction_date_raw).
export function getPlaceConvictions(id: number): PlaceConvictionRow[] {
  return getDb()
    .prepare(
      `
      SELECT DISTINCT sc.record_number AS reference_number, sc.conviction_date,
        sc.offence_date, sc.offence_date_raw, sc.charge_description,
        ct.name AS offence_type,
        ${personNamesExpr()} AS defendant_names
      FROM summary_conviction sc
      JOIN summary_conviction_crime_type scct ON scct.summary_conviction_id = sc.id
      JOIN crime_type ct ON ct.id = scct.crime_type_id
      WHERE EXISTS (
        SELECT 1 FROM summary_conviction_location scl
        WHERE scl.summary_conviction_id = sc.id AND scl.location_id = ?
      )
      ORDER BY ct.name, sc.offence_date IS NULL, sc.offence_date ASC
      `
    )
    .all(id) as PlaceConvictionRow[];
}

export function listPlaceTree(): PlaceNode[] {
  const rows = getDb()
    .prepare(`SELECT id, name, parent_id FROM location ORDER BY name`)
    .all() as Omit<PlaceNode, "children" | "offenceCount">[];

  const offenceCounts = new Map(
    (
      getDb()
        .prepare(
          `SELECT location_id AS id, COUNT(*) AS count FROM summary_conviction_location
           WHERE role = '${OFFENCE_LOCATION_ROLE}' GROUP BY location_id`
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
