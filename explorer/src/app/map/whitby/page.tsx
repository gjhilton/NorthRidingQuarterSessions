import Link from "next/link";
import { css } from "styled-system/css";
import { whitbyStreetCaseCounts } from "@/lib/queries/map";
import { MapViewLoader } from "@/components/MapViewLoader";
import { Card, PageContainer, PageTitle } from "@/components/ui";

// Whitby town centre, roughly where the streets below cluster.
const WHITBY_CENTER: [number, number] = [54.4862, -0.6155];

export default function WhitbyStreetMapPage() {
  const points = whitbyStreetCaseCounts();

  return (
    <PageContainer>
      <div>
        <Link href="/map" className={css({ fontSize: "M", color: "fgMuted" })}>
          ← Back to area map
        </Link>
        <PageTitle subtitle="Offence locations by street, within Whitby itself — circle size is case count, not precision">
          Whitby streets
        </PageTitle>
      </div>

      <Card className={css({ borderColor: "fgAccent" })}>
        <p className={css({ fontSize: "body", color: "fgMuted" })}>
          Each point is that street or yard&rsquo;s own geocoded position — for many, this is real
          OpenStreetMap road geometry, not a hand-placed guess. See{" "}
          <a href="/about" className={css({ color: "fgAccent" })}>
            About
          </a>
          .
        </p>
      </Card>

      <MapViewLoader points={points} center={WHITBY_CENTER} zoom={15} minZoom={14} maxZoom={18} />
    </PageContainer>
  );
}
