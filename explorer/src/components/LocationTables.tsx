"use client";

import { useState } from "react";
import { css } from "styled-system/css";
import { Pill, Table, Th, Td } from "@/components/ui";
import type { PlaceNode } from "@/lib/queries/locationTree";

// Alternative to LocationTree.tsx's nested-list rendering: each level of
// the place tree is its own two-column <table> -- name in the first cell,
// and (once expanded) a nested table of its children in the second cell of
// the same row, rather than an indented list item or a full-width drill-down
// row.
export function LocationTables({ roots }: { roots: PlaceNode[] }) {
  return <PlaceTable nodes={roots} />;
}

function PlaceTable({ nodes }: { nodes: PlaceNode[] }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Children</Th>
        </tr>
      </thead>
      <tbody>
        {nodes.map((node) => (
          <PlaceRow key={node.id} node={node} />
        ))}
      </tbody>
    </Table>
  );
}

function PlaceRow({ node }: { node: PlaceNode }) {
  const hasChildren = node.children.length > 0;
  const [open, setOpen] = useState(false);

  return (
    <tr>
      <Td className={css({ whiteSpace: "nowrap" })}>
        <span
          onClick={hasChildren ? () => setOpen((o) => !o) : undefined}
          className={css({
            display: "flex",
            alignItems: "center",
            gap: "2",
            cursor: hasChildren ? "pointer" : "default",
          })}
        >
          {hasChildren ? (
            <span aria-hidden className={css({ color: "fgMuted", fontFamily: "sans" })}>
              {open ? "▼" : "▶"}
            </span>
          ) : (
            <span aria-hidden className={css({ color: "fgMuted", width: "1em", display: "inline-block" })} />
          )}
          {node.name}
          <Pill>{node.type}</Pill>
        </span>
      </Td>
      <Td>
        {hasChildren ? (
          open ? (
            <PlaceTable nodes={node.children} />
          ) : (
            <span className={css({ color: "fgMuted" })}>
              {node.children.length} {node.children.length === 1 ? "child" : "children"}
            </span>
          )
        ) : (
          <span className={css({ color: "fgMuted" })}>—</span>
        )}
      </Td>
    </tr>
  );
}
