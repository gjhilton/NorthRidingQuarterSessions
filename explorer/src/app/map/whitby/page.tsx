import Link from "next/link";
import { css } from "styled-system/css";
import { whitbyStreetCaseCounts } from "@/lib/queries/map";
import { whitbyStreetCoordinatesFor } from "@/lib/streetCoordinates";
import { titleCase } from "@/lib/text";
import { MapViewLoader } from "@/components/MapViewLoader";
import { Card, PageContainer, PageTitle } from "@/components/ui";

// Whitby town centre, roughly where the streets below cluster.
const WHITBY_CENTER: [number, number] = [54.4862, -0.6155];

export default function WhitbyStreetMapPage() {
  const streetCounts = whitbyStreetCaseCounts();

  const points = streetCounts
    .map((s) => {
      const coords = whitbyStreetCoordinatesFor(s.name);
      return coords ? { name: titleCase(s.name), count: s.count, lat: coords[0], lon: coords[1] } : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const unmapped = streetCounts.length - points.length;

  return (
    <PageContainer>
      <div>
        <Link href="/map" className={css({ fontSize: "body", color: "fgMuted" })}>
          ← Back to area map
        </Link>
        <PageTitle subtitle="Offence locations by street, within Whitby itself — circle size is case count, not precision">
          Whitby streets
        </PageTitle>
      </div>

      <Card className={css({ borderColor: "fgAccent" })}>
        <p className={css({ fontSize: "body", color: "fgMuted" })}>
          Coordinates here are hand-compiled from general knowledge of Whitby&rsquo;s layout, not
          geocoded addresses — each is one rough spot along the street, not the exact offence
          location. See{" "}
          <a href="/about" className={css({ color: "fgAccent" })}>
            About
          </a>
          .
          {unmapped > 0 &&
            ` ${unmapped} street(s) with cases aren't plotted yet (no known coordinates).`}
        </p>
      </Card>

      <MapViewLoader points={points} center={WHITBY_CENTER} zoom={15} minZoom={14} maxZoom={18} />
    </PageContainer>
  );
}
