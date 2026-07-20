"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

export interface MapPoint {
  name: string;
  count: number;
  lat: number;
  lon: number;
}

const MARKER_COLOR = "#8a5240";

// sqrt so a town with 4x the cases doesn't get a circle 4x the *area* worse
// than that -- area scales with radius squared, so this keeps differences
// perceptible without letting the busiest town swallow the map.
function radiusFor(count: number): number {
  return 4 + Math.sqrt(count) * 3;
}

export function MapView({ points }: { points: MapPoint[] }) {
  // Whitby, roughly centred on the townships this dataset covers.
  const center: [number, number] = [54.45, -0.75];

  return (
    <MapContainer
      center={center}
      zoom={9}
      scrollWheelZoom={false}
      style={{ height: "32rem", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((p) => (
        <CircleMarker
          key={p.name}
          center={[p.lat, p.lon]}
          radius={radiusFor(p.count)}
          pathOptions={{ color: MARKER_COLOR, fillColor: MARKER_COLOR, fillOpacity: 0.6 }}
        >
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.count} case{p.count === 1 ? "" : "s"}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
