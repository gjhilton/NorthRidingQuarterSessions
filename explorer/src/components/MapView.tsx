"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from "react-leaflet";
import { token } from "styled-system/tokens";

export interface MapPoint {
  name: string;
  count: number;
  lat: number;
  lon: number;
}

const MARKER_COLOR = token("colors.chart1");
const MAP_RADIUS = token("radii.corner");

// sqrt so a town with 4x the cases doesn't get a circle 4x the *area* worse
// than that -- area scales with radius squared, so this keeps differences
// perceptible without letting the busiest town swallow the map.
function radiusFor(count: number): number {
  return 4 + Math.sqrt(count) * 3;
}

export function MapView({
  points,
  center = [54.45, -0.75], // Whitby, roughly centred on the townships this dataset covers.
  zoom = 9,
  // Coordinates are hand-compiled (township or street) centroids, not
  // geocoded addresses (see the caveat card on /map) -- zooming in further
  // would suggest a precision the data doesn't have, and zooming out past
  // the relevant area makes the circles meaningless. minZoom/maxZoom keep
  // the view within the range where the map is actually honest.
  minZoom = 8,
  maxZoom = 13,
  height = "32rem",
  // For a small single-point "here's roughly where this is" map (e.g. the
  // conviction detail page's street highlight) rather than the large
  // explorable regional/town views -- drag/zoom/keyboard all off, so it
  // reads as a fixed illustration, not an interactive map someone might
  // expect to pan around a mostly-empty tile set.
  interactive = true,
  markerColor = MARKER_COLOR,
  // Real OSM road geometry (see lib/streetPaths.ts) -- when known, draws
  // the road's actual shape instead of just a dot at one point on it.
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
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      scrollWheelZoom={false}
      dragging={interactive}
      zoomControl={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
      style={{ height, width: "100%", borderRadius: MAP_RADIUS }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {path ? (
        <Polyline positions={path} pathOptions={{ color: markerColor, weight: 4 }} />
      ) : (
        points.map((p) => (
          <CircleMarker
            key={p.name}
            center={[p.lat, p.lon]}
            radius={radiusFor(p.count)}
            pathOptions={{ color: markerColor, fillColor: markerColor, fillOpacity: 0.6 }}
          >
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.count} case{p.count === 1 ? "" : "s"}
            </Popup>
          </CircleMarker>
        ))
      )}
    </MapContainer>
  );
}
