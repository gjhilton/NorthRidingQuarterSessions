"use client";

// Leaflet touches `window` at module load time, so it can't be part of the
// server/build-time render pass at all (same reason NetworkView dynamically
// imports react-force-graph-2d rather than importing it statically) --
// ssr:false skips loading this module until after hydration, in the browser.
import dynamic from "next/dynamic";
import type { MapPoint } from "@/components/MapView";
import { css } from "styled-system/css";

const MapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div
      className={css({
        height: "32rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "fgMuted",
        fontSize: "body",
      })}
    >
      Loading map…
    </div>
  ),
});

export function MapViewLoader({
  points,
  center,
  zoom,
  minZoom,
  maxZoom,
}: {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
}) {
  return <MapView points={points} center={center} zoom={zoom} minZoom={minZoom} maxZoom={maxZoom} />;
}
