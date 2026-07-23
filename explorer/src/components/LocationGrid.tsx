"use client";

import { useState } from "react";
import Link from "next/link";
import { css, cx } from "styled-system/css";
import { Td } from "@/components/ui";
import type { PlaceNode } from "@/lib/queries/locationTree";

// A different alternative again: one flat grid, not nested tables. Every
// depth gets its own column; a node's cell uses rowSpan to cover exactly
// the rows its descendants occupy, and a leaf's cell uses colSpan to fill
// out any unused columns to the right (so shallower branches, e.g. a
// street with no yards, still reach the grid's right edge). Static/fully
// expanded -- no collapse, unlike LocationTree/LocationTables.
interface Cell {
  node: PlaceNode;
  depth: number;
  rowSpan: number;
  colSpan: number;
  // Every node in this cell's own subtree (itself + all descendants) --
  // lets hovering a cell also highlight everything nested under it, even
  // though those descendants are separate <td> elements to the right/below.
  subtreeIds: number[];
}
type Row = Cell[];

// Fixed modular scale (ratio 1.15, same shape as LocationTree's but
// gentler -- the type size itself carries the hierarchy, not just column
// position), floor of 1rem for anything six or more levels deep.
const DEPTH_FONT_REMS = [2.011, 1.749, 1.521, 1.323, 1.15, 1];

function fontSizeForDepth(depth: number): string {
  return `${DEPTH_FONT_REMS[Math.min(depth, DEPTH_FONT_REMS.length - 1)]}rem`;
}

function maxDepth(node: PlaceNode, depth = 0): number {
  if (node.children.length === 0) return depth;
  return Math.max(...node.children.map((c) => maxDepth(c, depth + 1)));
}

function collectSubtreeIds(node: PlaceNode): number[] {
  return [node.id, ...node.children.flatMap(collectSubtreeIds)];
}

function buildRows(node: PlaceNode, depth: number, treeMaxDepth: number): Row[] {
  const subtreeIds = collectSubtreeIds(node);
  if (node.children.length === 0) {
    return [[{ node, depth, rowSpan: 1, colSpan: treeMaxDepth - depth + 1, subtreeIds }]];
  }
  const childRows = node.children.flatMap((child) => buildRows(child, depth + 1, treeMaxDepth));
  const [firstRow, ...restRows] = childRows;
  return [[{ node, depth, rowSpan: childRows.length, colSpan: 1, subtreeIds }, ...firstRow], ...restRows];
}

export function LocationGrid({ roots }: { roots: PlaceNode[] }) {
  const treeMaxDepth = Math.max(...roots.map((r) => maxDepth(r)));
  const columnCount = treeMaxDepth + 1;
  const rows = roots.flatMap((root) => buildRows(root, 0, treeMaxDepth));
  const [hoveredIds, setHoveredIds] = useState<ReadonlySet<number>>(new Set());

  return (
    <div
      className={css({
        overflowX: "auto",
        borderWidth: "lineweight_normal",
        borderStyle: "solid",
        borderColor: "fg",
        borderRadius: "corner",
      })}
    >
      <table
        className={css({ width: "100%", tableLayout: "fixed", borderCollapse: "collapse", fontSize: "body" })}
      >
        {/* table-layout:fixed only respects the FIRST row's cell widths by
            default, and that row's cells are full of rowSpan/colSpan --
            an explicit colgroup is the only reliable way to force every
            column to the same width regardless of what any row spans. */}
        <colgroup>
          {Array.from({ length: columnCount }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key -- columns are positional, no other identity
            <col key={i} style={{ width: `${100 / columnCount}%` }} />
          ))}
        </colgroup>
        <tbody>
          {rows.map((row, i) => (
            // eslint-disable-next-line react/no-array-index-key -- rows have no stable id of their own, only the cells within them do
            <tr key={i}>
              {row.map((cell) => (
                <Td
                  key={cell.node.id}
                  rowSpan={cell.rowSpan}
                  colSpan={cell.colSpan}
                  onMouseEnter={() => setHoveredIds(new Set(cell.subtreeIds))}
                  onMouseLeave={() => setHoveredIds(new Set())}
                  className={cx(
                    css({
                      borderRightWidth: "lineweight_normal",
                      borderRightStyle: "solid",
                      borderRightColor: "fg",
                      cursor: "pointer",
                    }),
                    hoveredIds.has(cell.node.id) && css({ bg: "#fffde7" })
                  )}
                >
                  <Link
                    href={`/locations/${cell.node.id}`}
                    style={{ fontSize: fontSizeForDepth(cell.depth) }}
                    className={css({
                      display: "block",
                      fontWeight: cell.depth === 0 ? "600" : "400",
                      color: "fg",
                      _hover: { color: "fgAccent" },
                    })}
                  >
                    {cell.node.name}
                  </Link>
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
