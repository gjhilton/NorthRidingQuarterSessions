"use client";

import TreeView, { flattenTree, type INodeRendererProps } from "react-accessible-treeview";
import { css } from "styled-system/css";
import { Pill } from "@/components/ui";
import type { PlaceNode } from "@/lib/queries/locationTree";

// A fixed modular scale (ratio 1.2), largest at the root, floor of 1rem for
// anything six or more levels deep -- each level down is visibly, distinctly
// smaller than its parent, so the type scale itself carries the hierarchy
// rather than just the indent/stem.
const DEPTH_FONT_REMS = [2.011, 1.749, 1.521, 1.323, 1.15, 1];

function fontSizeForDepth(depth: number): string {
  return `${DEPTH_FONT_REMS[Math.min(depth, DEPTH_FONT_REMS.length - 1)]}rem`;
}

// react-accessible-treeview needs one single root with parent:null (it's
// never rendered) -- our place data has several real roots (Whitby,
// Aislaby, ...), so they all become children of a throwaway wrapper node.
function toFlatTree(roots: PlaceNode[]) {
  return flattenTree({
    name: "",
    children: roots.map(toITreeNode),
  });
}

function toITreeNode(node: PlaceNode) {
  return {
    id: node.id,
    name: node.name,
    metadata: { placeType: node.type },
    children: node.children.map(toITreeNode),
  };
}

export function LocationTree({ roots }: { roots: PlaceNode[] }) {
  const data = toFlatTree(roots);

  return (
    <TreeView
      data={data}
      aria-label="Places"
      className={css({ display: "flex", flexDirection: "column", gap: "2" })}
      nodeRenderer={NodeRenderer}
    />
  );
}

function NodeRenderer({ element, isBranch, isExpanded, getNodeProps, level, handleExpand }: INodeRendererProps) {
  const depth = level - 1; // library levels start at 1; our root parish is depth 0
  const placeType = (element.metadata?.placeType as string) ?? "";

  return (
    <div
      {...getNodeProps({ onClick: handleExpand })}
      style={{ marginLeft: `${depth * 1.5}rem` }}
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "2",
        flexWrap: "wrap",
        cursor: isBranch ? "pointer" : "default",
        py: "1",
        outline: "none",
        _focusVisible: { outlineWidth: "lineweight_normal", outlineStyle: "solid", outlineColor: "fgAccent" },
      })}
    >
      {depth > 0 && (
        <span aria-hidden className={css({ color: "fgMuted", fontFamily: "sans" })}>
          └─
        </span>
      )}
      {isBranch && (
        <span
          aria-hidden
          className={css({ color: "fgMuted", fontFamily: "sans", fontSize: "body", lineHeight: "1" })}
        >
          {isExpanded ? "▼" : "▶"}
        </span>
      )}
      <span
        style={{ fontSize: fontSizeForDepth(depth) }}
        className={css({ fontWeight: depth === 0 ? "600" : "400" })}
      >
        {element.name}
      </span>
      <Pill>{placeType}</Pill>
      {isBranch && !isExpanded && (
        <span className={css({ fontSize: "small", color: "fgMuted" })}>
          {element.children.length} {element.children.length === 1 ? "child" : "children"}
        </span>
      )}
    </div>
  );
}
