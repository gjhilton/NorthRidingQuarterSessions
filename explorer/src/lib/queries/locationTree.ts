import "server-only";
import { getDb } from "@/lib/db";

// Placeholder query for the new self-referencing place tree (see
// data-loader/qsrecords/models/reference.py::Place), which is replacing the
// old flat Town/Street pair. Only Whitby's subtree is populated so far --
// the migration is still in progress, one parish at a time.
export interface PlaceNode {
  id: number;
  name: string;
  parent_id: number | null;
  type: string;
  children: PlaceNode[];
}

export interface PlaceDetail {
  id: number;
  name: string;
  type: string;
  notes_public: string | null;
}

export function listPlaceIds(): number[] {
  return (getDb().prepare(`SELECT id FROM place`).all() as { id: number }[]).map((r) => r.id);
}

export function getPlaceDetail(id: number): PlaceDetail | undefined {
  return getDb()
    .prepare(`SELECT id, name, type, notes_public FROM place WHERE id = ?`)
    .get(id) as PlaceDetail | undefined;
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
  charge_description: string;
}

// Convictions directly tied to this exact node (as offence or court
// location) -- not rolled up from descendants, since a node's own
// rowSpan/breadcrumb already shows where it sits relative to its children.
export function getPlaceConvictions(id: number): PlaceConvictionRow[] {
  return getDb()
    .prepare(
      `
      SELECT DISTINCT reference_number, conviction_date, conviction_date_raw, charge_description
      FROM summary_conviction
      WHERE offence_location_id = ? OR court_location_id = ?
      ORDER BY conviction_date IS NULL, conviction_date DESC
      `
    )
    .all(id, id) as PlaceConvictionRow[];
}

export function listPlaceTree(): PlaceNode[] {
  const rows = getDb()
    .prepare(`SELECT id, name, parent_id, type FROM place ORDER BY name`)
    .all() as Omit<PlaceNode, "children">[];

  const byId = new Map<number, PlaceNode>(rows.map((r) => [r.id, { ...r, children: [] }]));
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
