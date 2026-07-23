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
