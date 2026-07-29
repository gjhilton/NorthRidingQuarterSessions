// Pure, client-safe tree-walking helpers over any self-referential
// (id, name, parent_id) table -- no getDb/server-only, so both server-only
// query files and client-safe ones (run in the browser via sql.js) can
// share one implementation instead of each hand-rolling the same parent_id
// walk. Originally written for `place` (now `location`), and reused as-is
// for `crime_type` -- both are (id, name, parent_id) self-referential
// trees, so one generic implementation covers both rather than a second,
// near-identical file.

export interface MinimalTreeNode {
  id: number;
  name: string;
  parent_id: number | null;
}

export function buildTreeIndex<T extends MinimalTreeNode>(nodes: T[]): Map<number, T> {
  return new Map(nodes.map((n) => [n.id, n]));
}

// Walks upward from startId (inclusive) until it reaches an ancestor whose
// name is in targetNames, or falls back to the starting node itself if no
// ancestor matches -- e.g. resolving a specific offence location up to its
// containing town/parish, using a known set of "town-level" names.
export function resolveAncestorByName<T extends MinimalTreeNode>(
  startId: number,
  byId: Map<number, T>,
  targetNames: Set<string>
): T {
  const start = byId.get(startId);
  if (!start) throw new Error(`Unknown node id ${startId}`);
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
export function isWithin<T extends MinimalTreeNode>(id: number, rootId: number, byId: Map<number, T>): boolean {
  let current = byId.get(id);
  while (current) {
    if (current.id === rootId) return true;
    current = current.parent_id != null ? byId.get(current.parent_id) : undefined;
  }
  return false;
}

// Every id in rootId's subtree, including rootId itself -- for "filter to
// this node or anything under it" queries. Both trees this is used for are
// small enough (~350 locations, ~90 crime types) that building a full
// children-index and walking it in memory is simpler and fast enough,
// rather than a recursive SQL CTE per call.
export function descendantIds<T extends MinimalTreeNode>(rootId: number, byId: Map<number, T>): number[] {
  const children = new Map<number, number[]>();
  for (const n of byId.values()) {
    if (n.parent_id == null) continue;
    const siblings = children.get(n.parent_id);
    if (siblings) siblings.push(n.id);
    else children.set(n.parent_id, [n.id]);
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
