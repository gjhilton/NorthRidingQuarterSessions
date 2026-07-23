import { css } from "styled-system/css";
import { Pill, Td } from "@/components/ui";
import type { PlaceNode } from "@/lib/queries/locationTree";

// A different alternative again: one flat grid, not nested tables. Every
// depth gets its own column; a node's cell uses rowSpan to cover exactly
// the rows its descendants occupy, and a leaf's cell uses colSpan to fill
// out any unused columns to the right (so shallower branches, e.g. a
// street with no yards, still reach the grid's right edge). Static/fully
// expanded -- no collapse, unlike LocationTree/LocationTables.
interface Cell {
  node: PlaceNode;
  rowSpan: number;
  colSpan: number;
}
type Row = Cell[];

function maxDepth(node: PlaceNode, depth = 0): number {
  if (node.children.length === 0) return depth;
  return Math.max(...node.children.map((c) => maxDepth(c, depth + 1)));
}

function buildRows(node: PlaceNode, depth: number, treeMaxDepth: number): Row[] {
  if (node.children.length === 0) {
    return [[{ node, rowSpan: 1, colSpan: treeMaxDepth - depth + 1 }]];
  }
  const childRows = node.children.flatMap((child) => buildRows(child, depth + 1, treeMaxDepth));
  const [firstRow, ...restRows] = childRows;
  return [[{ node, rowSpan: childRows.length, colSpan: 1 }, ...firstRow], ...restRows];
}

export function LocationGrid({ roots }: { roots: PlaceNode[] }) {
  const treeMaxDepth = Math.max(...roots.map((r) => maxDepth(r)));
  const columnCount = treeMaxDepth + 1;
  const rows = roots.flatMap((root) => buildRows(root, 0, treeMaxDepth));

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
                  className={css({ borderRightWidth: "lineweight_normal", borderRightStyle: "solid", borderRightColor: "fg" })}
                >
                  <span className={css({ display: "flex", alignItems: "center", gap: "2", flexWrap: "wrap" })}>
                    {cell.node.name}
                    <Pill>{cell.node.type}</Pill>
                  </span>
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
