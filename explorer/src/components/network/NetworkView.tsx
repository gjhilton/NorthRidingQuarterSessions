"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";
import type { Connection, NetworkGraph } from "@/lib/queries/peopleNetwork";
import { Card, EmptyState, Pill } from "@/components/ui";
import { toSlug } from "@/lib/slug";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

const NODE_COLOR = {
  center: token("colors.chart1"),
  defendant: token("colors.chart2"),
  person: token("colors.chart3"),
};
const LINK_COLOR = token("colors.border");

export function NetworkView({
  connections,
  graph,
}: {
  connections: Connection[];
  graph: NetworkGraph;
}) {
  const [mode, setMode] = useState<"list" | "graph">("list");

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <div className={css({ display: "flex", gap: "2" })}>
        <ToggleButton active={mode === "list"} onClick={() => setMode("list")}>
          List
        </ToggleButton>
        <ToggleButton active={mode === "graph"} onClick={() => setMode("graph")}>
          Graph
        </ToggleButton>
      </div>

      {connections.length === 0 ? (
        <EmptyState>No connections found in the extracted data yet.</EmptyState>
      ) : mode === "list" ? (
        <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
          {connections.map((c) => (
            <Link key={c.name_key} href={`/people/${toSlug(c.name_key)}`}>
              <Card
                className={css({
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  _hover: { borderColor: "fgAccent" },
                })}
              >
                <div>
                  <span className={css({ fontWeight: "600" })}>{c.display_name}</span>
                  {c.role && (
                    <span className={css({ ml: "2" })}>
                      <Pill>{c.role}</Pill>
                    </span>
                  )}
                </div>
                <span className={css({ fontSize: "small", color: "fgMuted" })}>
                  {c.shared_cases.length} shared case{c.shared_cases.length === 1 ? "" : "s"}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div
          className={css({
            borderWidth: "lineweight_normal", borderStyle: "solid",
            borderColor: "borderMuted",
            borderRadius: "corner",
            overflow: "hidden",
            height: "28rem",
            bg: "bgSurface",
          })}
        >
          <ForceGraph2D
            graphData={{
              nodes: graph.nodes.map((n) => ({ ...n })),
              links: graph.links.map((l) => ({ ...l })),
            }}
            nodeId="id"
            nodeLabel="label"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nodeColor={(n: any) => NODE_COLOR[n.kind as keyof typeof NODE_COLOR]}
            nodeRelSize={5}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            linkWidth={(l: any) => Math.min(4, 1 + l.cases)}
            linkColor={() => LINK_COLOR}
            linkLabel={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (l: any) => `${l.cases} shared case${l.cases === 1 ? "" : "s"}`
            }
          />
        </div>
      )}
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={css({
        px: "3",
        py: "1.5",
        borderRadius: "corner",
        fontSize: "body",
        fontWeight: "600",
        cursor: "pointer",
        borderWidth: "lineweight_normal", borderStyle: "solid",
        borderColor: active ? "fgAccent" : "borderMuted",
        bg: active ? "fgAccent" : "bgSurface",
        color: active ? "bgSurface" : "fg",
      })}
    >
      {children}
    </button>
  );
}
