"use client";

import { useState } from "react";
import Link from "next/link";
import { css, cx } from "styled-system/css";
import { formInputStyle, PageTitle, Td } from "@/components/ui";
import { XIcon } from "@/components/icons/XIcon";
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

// Keeps a node when it (or something in its subtree) is itself an offence
// location, so ancestor rows stay in the grid even if the offence happened
// several levels down -- a node that only ever shows up as a person's
// residence (defendant/person.location_id, never offence_location_id) drops
// out entirely.
function filterToOffenceLocations(node: PlaceNode): PlaceNode | null {
  const children = node.children
    .map(filterToOffenceLocations)
    .filter((c): c is PlaceNode => c !== null);
  if (node.offenceCount === 0 && children.length === 0) return null;
  return { ...node, children };
}

// Replaces each node's offenceCount with itself plus every descendant's --
// the displayed count at a parish should read as "how many offences
// happened somewhere under here", not just the ones filed directly against
// that exact node.
function rollUpOffenceCounts(node: PlaceNode): PlaceNode {
  const children = node.children.map(rollUpOffenceCounts);
  const offenceCount = node.offenceCount + children.reduce((sum, c) => sum + c.offenceCount, 0);
  return { ...node, offenceCount, children };
}

// If a node's own name matches, keep its entire subtree untouched (that's
// the point of the search -- finding "Whitby" should still show every
// street under it). Otherwise keep the node only as scaffolding for
// descendants that do match, dropping any sibling subtree with no match
// anywhere inside it.
function filterBySearch(node: PlaceNode, query: string): PlaceNode | null {
  if (node.name.toLowerCase().includes(query)) return node;
  const children = node.children
    .map((c) => filterBySearch(c, query))
    .filter((c): c is PlaceNode => c !== null);
  if (children.length === 0) return null;
  return { ...node, children };
}

// Wraps the matched substring (case-insensitive) in a <mark> so it's
// visible as you type, not just that the row survived filterBySearch --
// most names showing in the filtered grid are ancestors kept as
// scaffolding for a match further down, so this only lights up on the
// node(s) that actually matched.
function highlightMatch(name: string, query: string): React.ReactNode {
  if (!query) return name;
  const index = name.toLowerCase().indexOf(query);
  if (index === -1) return name;
  return (
    <>
      {name.slice(0, index)}
      <mark className={css({ bg: "#fff2a8", color: "inherit" })}>{name.slice(index, index + query.length)}</mark>
      {name.slice(index + query.length)}
    </>
  );
}

// A column that's the same value in every single row (a lone root with no
// siblings, e.g. "North Riding of Yorkshire" once County Durham/Elsewhere/
// York all drop out of the offences-only filter) conveys nothing -- skip
// straight to its children instead of wasting a column on it. Repeats in
// case that still leaves a lone child (unlikely, but keeps the grid honest
// either way).
function unwrapSingleRoot(roots: PlaceNode[]): PlaceNode[] {
  while (roots.length === 1 && roots[0].children.length > 0) {
    roots = roots[0].children;
  }
  return roots;
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
  // Defaults to offences-only; selecting "Locations of people" includes every
  // place, even ones only ever a person's residence, never where an
  // offence happened.
  const [includeAll, setIncludeAll] = useState(false);
  const [search, setSearch] = useState("");
  const modeFilteredRoots = includeAll
    ? roots
    : roots
        .map(filterToOffenceLocations)
        .filter((r): r is PlaceNode => r !== null)
        .map(rollUpOffenceCounts);
  const searchQuery = search.trim().toLowerCase();
  const searchedRoots =
    searchQuery === ""
      ? modeFilteredRoots
      : modeFilteredRoots
          .map((r) => filterBySearch(r, searchQuery))
          .filter((r): r is PlaceNode => r !== null);
  const filteredRoots = unwrapSingleRoot(searchedRoots);
  const treeMaxDepth = filteredRoots.length === 0 ? 0 : Math.max(...filteredRoots.map((r) => maxDepth(r)));
  const columnCount = treeMaxDepth + 1;
  const rows = filteredRoots.flatMap((root) => buildRows(root, 0, treeMaxDepth));
  // Background cascades to the whole hovered subtree; text colour is
  // narrower -- only the exact cell the mouse is over, not its
  // descendants, per explicit request.
  const [hoveredIds, setHoveredIds] = useState<ReadonlySet<number>>(new Set());
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

  const radioLabelStyle = css({ display: "flex", alignItems: "center", gap: "3", cursor: "pointer" });
  // Native radio inputs don't resize reliably across browsers via
  // width/height or transform:scale (both are inconsistent, especially on
  // Safari) -- the real <input> stays for semantics/keyboard/screen readers
  // but is visually hidden, and this is the actual visible circle, sized in
  // plain rem with no browser-specific guessing involved.
  const RADIO_SIZE = "1.75rem";
  function RadioDot({ checked }: { checked: boolean }) {
    return (
      <span
        aria-hidden
        className={css({
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: RADIO_SIZE,
          height: RADIO_SIZE,
          borderRadius: "9999px",
          borderWidth: "lineweight_normal",
          borderStyle: "solid",
          borderColor: "fg",
          bg: "bg",
          flexShrink: 0,
        })}
      >
        {checked && (
          <span
            className={css({
              width: "60%",
              height: "60%",
              borderRadius: "9999px",
              bg: "fgAccent",
            })}
          />
        )}
      </span>
    );
  }
  const srOnlyStyle = css({
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: "0",
  });

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
      <PageTitle>Locations</PageTitle>
      <div
        role="radiogroup"
        aria-label="Which locations to show"
        className={css({ display: "flex", alignItems: "center", gap: "8", fontSize: "M" })}
      >
        <label className={radioLabelStyle}>
          <input
            type="radio"
            name="location-filter"
            checked={!includeAll}
            onChange={() => setIncludeAll(false)}
            className={srOnlyStyle}
          />
          <RadioDot checked={!includeAll} />
          <span className={css({ fontWeight: "600" })}>Locations of offences</span>
        </label>
        <label className={radioLabelStyle}>
          <input
            type="radio"
            name="location-filter"
            checked={includeAll}
            onChange={() => setIncludeAll(true)}
            className={srOnlyStyle}
          />
          <RadioDot checked={includeAll} />
          <span className={css({ fontWeight: "600" })}>Locations of people</span>
        </label>
      </div>
      <label
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "1",
          fontSize: "M",
          color: "fgMuted",
          maxWidth: "24rem",
        })}
      >
        Filter by name
        <div className={css({ position: "relative" })}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Whitby, Church Street…"
            className={css(formInputStyle, { width: "100%", pr: search ? "8" : "3" })}
          />
          {search && (
            <button
              type="button"
              aria-label="Clear filter"
              onClick={() => setSearch("")}
              className={css({
                position: "absolute",
                right: "2",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bg: "transparent",
                border: "none",
                p: "1",
                color: "fgMuted",
                cursor: "pointer",
                _hover: { color: "fgAccent" },
              })}
            >
              <XIcon size={14} />
            </button>
          )}
        </div>
      </label>
      {filteredRoots.length === 0 ? (
        <p className={css({ fontSize: "M", color: "fgMuted" })}>No locations match.</p>
      ) : (
    <div
      className={cx(
        "location-grid",
        css({
          overflowX: "auto",
          borderWidth: "lineweight_heavy",
          borderStyle: "solid",
          borderColor: "fg",
          borderRadius: "corner",
        })
      )}
    >
      <table
        className={css({ width: "100%", tableLayout: "fixed", borderCollapse: "collapse", fontSize: "M" })}
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
                  onMouseEnter={() => {
                    setHoveredIds(new Set(cell.subtreeIds));
                    setHoveredNodeId(cell.node.id);
                  }}
                  onMouseLeave={() => {
                    setHoveredIds(new Set());
                    setHoveredNodeId(null);
                  }}
                  className={cx(
                    css({
                      p: "0", // the Link below takes the padding instead, so it can fill the whole cell
                      borderRightWidth: "lineweight_normal",
                      borderRightStyle: "solid",
                      borderRightColor: "fg",
                      cursor: "pointer",
                    }),
                    hoveredIds.has(cell.node.id) && css({ bg: "#fffef5" })
                  )}
                >
                  <Link
                    href={`/locations/${cell.node.id}`}
                    style={{
                      fontSize: fontSizeForDepth(cell.depth),
                      // Inline style so it wins over globals.css's unlayered
                      // `.location-grid a` rule regardless of cascade layers.
                      // Only the exact hovered cell, not its descendants --
                      // the background is what cascades, not the text colour.
                      color: hoveredNodeId === cell.node.id ? "var(--colors-fg-accent)" : undefined,
                    }}
                    className={css({
                      display: "block",
                      width: "100%",
                      height: "100%",
                      py: "2",
                      px: "3",
                      boxSizing: "border-box",
                      fontWeight: cell.depth === 0 ? "600" : "400",
                    })}
                  >
                    {searchQuery ? highlightMatch(cell.node.name, searchQuery) : cell.node.name}
                    {!includeAll && cell.node.offenceCount > 0 && ` (${cell.node.offenceCount})`}
                  </Link>
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      )}
    </div>
  );
}
