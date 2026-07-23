import { css } from "styled-system/css";
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
}
type Row = Cell[];

// Same fixed modular scale (ratio 1.2) as LocationTree/LocationTables --
// the type size itself carries the hierarchy, not just column position.
const DEPTH_FONT_REMS = [2.488, 2.07, 1.72, 1.44, 1.2, 1];

function fontSizeForDepth(depth: number): string {
  return `${DEPTH_FONT_REMS[Math.min(depth, DEPTH_FONT_REMS.length - 1)]}rem`;
}

function maxDepth(node: PlaceNode, depth = 0): number {
  if (node.children.length === 0) return depth;
  return Math.max(...node.children.map((c) => maxDepth(c, depth + 1)));
}

function buildRows(node: PlaceNode, depth: number, treeMaxDepth: number): Row[] {
  if (node.children.length === 0) {
    return [[{ node, depth, rowSpan: 1, colSpan: treeMaxDepth - depth + 1 }]];
  }
  const childRows = node.children.flatMap((child) => buildRows(child, depth + 1, treeMaxDepth));
  const [firstRow, ...restRows] = childRows;
  return [[{ node, depth, rowSpan: childRows.length, colSpan: 1 }, ...firstRow], ...restRows];
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
                  <span
                    style={{ fontSize: fontSizeForDepth(cell.depth) }}
                    className={css({ fontWeight: cell.depth === 0 ? "600" : "400" })}
                  >
                    {cell.node.name}
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
