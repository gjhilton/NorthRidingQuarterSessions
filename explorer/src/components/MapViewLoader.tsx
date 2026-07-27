"use client";

// Leaflet touches `window` at module load time, so it can't be part of the
// server/build-time render pass at all -- ssr:false skips loading this
// module until after hydration, in the browser.
import dynamic from "next/dynamic";
import type { MapPoint } from "@/components/MapView";
import { css } from "styled-system/css";

function loadingPlaceholder(height: string) {
  return (
    <div
      className={css({
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "fgMuted",
        fontSize: "body",
      })}
    >
      Loading map…
    </div>
  );
}

const MapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => loadingPlaceholder("32rem"),
});

const SmallMapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => loadingPlaceholder("12rem"),
});

export function MapViewLoader({
  points,
  center,
  zoom,
  minZoom,
  maxZoom,
  height,
  interactive,
  markerColor,
  path,
}: {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  height?: string;
  interactive?: boolean;
  markerColor?: string;
  path?: [number, number][];
}) {
  // Two separate dynamic() calls (not one component reused with different
  // loading heights) so the loading placeholder's height matches the
  // eventual map's height instead of always reserving 32rem -- a small
  // street-highlight map with a 32rem loading placeholder would jump/shrink
  // once Leaflet finishes loading.
  const Component = height && height !== "32rem" ? SmallMapView : MapView;
  return (
    <Component
      points={points}
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      height={height}
      interactive={interactive}
      markerColor={markerColor}
      path={path}
    />
  );
}
