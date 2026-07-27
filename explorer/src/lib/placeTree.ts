// Pure, client-safe tree-walking helpers over the place table (see
// data-loader/qsrecords/models/reference.py::Place) -- no getDb/server-only,
// so both server-only query files (map.ts, filters.ts) and client-safe ones
// (browseList.ts, run in the browser via sql.js) can share one
// implementation instead of each hand-rolling the same parent_id walk.

export interface PlaceNode {
  id: number;
  name: string;
  parent_id: number | null;
}

export function buildPlaceIndex<T extends PlaceNode>(places: T[]): Map<number, T> {
  return new Map(places.map((p) => [p.id, p]));
}

// Walks upward from startId (inclusive) until it reaches an ancestor whose
// name is in targetNames, or falls back to the starting place itself if no
// ancestor matches -- e.g. resolving a specific offence location up to its
// containing town/parish, using the old `town` table's own names as the
// recognized set of "town-level" names.
export function resolveAncestorByName<T extends PlaceNode>(
  startId: number,
  byId: Map<number, T>,
  targetNames: Set<string>
): T {
  const start = byId.get(startId);
  if (!start) throw new Error(`Unknown place id ${startId}`);
  let current: T | undefined = start;
  while (current) {
    if (targetNames.has(current.name.toLowerCase())) return current;
    current = current.parent_id != null ? byId.get(current.parent_id) : undefined;
  }
  return start;
}

// True if id is rootId itself or a descendant of it (walks upward from id,
// same direction as resolveAncestorByName, just checking for a specific
// ancestor rather than a name match).
export function isWithin<T extends PlaceNode>(id: number, rootId: number, byId: Map<number, T>): boolean {
  let current = byId.get(id);
  while (current) {
    if (current.id === rootId) return true;
    current = current.parent_id != null ? byId.get(current.parent_id) : undefined;
  }
  return false;
}

// Every id in rootId's subtree, including rootId itself -- for "filter to
// this place or anything under it" queries. The place tree is small enough
// (~350 rows) that building a full children-index and walking it in memory
// is simpler and fast enough, rather than a recursive SQL CTE per call.
export function descendantIds<T extends PlaceNode>(rootId: number, byId: Map<number, T>): number[] {
  const children = new Map<number, number[]>();
  for (const p of byId.values()) {
    if (p.parent_id == null) continue;
    const siblings = children.get(p.parent_id);
    if (siblings) siblings.push(p.id);
    else children.set(p.parent_id, [p.id]);
  }
  const result: number[] = [];
  const stack = [rootId];
  while (stack.length > 0) {
    const id = stack.pop()!;
    result.push(id);
    const kids = children.get(id);
    if (kids) stack.push(...kids);
  }
  return result;
}
