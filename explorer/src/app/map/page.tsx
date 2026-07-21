import Link from "next/link";
import { css } from "styled-system/css";
import { allTownCaseCounts } from "@/lib/queries/map";
import { coordinatesFor } from "@/lib/townCoordinates";
import { titleCase } from "@/lib/text";
import { MapViewLoader } from "@/components/MapViewLoader";
import { Card, PageContainer, PageTitle } from "@/components/ui";

export default function MapPage() {
  const townCounts = allTownCaseCounts();

  const points = townCounts
    .map((t) => {
      const coords = coordinatesFor(t.name);
      return coords ? { name: titleCase(t.name), count: t.count, lat: coords[0], lon: coords[1] } : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const unmapped = townCounts.length - points.length;

  return (
    <PageContainer>
      <PageTitle subtitle="Offence locations by township — circle size is case count, not precision">
        Map
      </PageTitle>

      <Card className={css({ borderColor: "fgAccent" })}>
        <p className={css({ fontSize: "body", color: "fgMuted" })}>
          Coordinates are hand-compiled township centres, not geocoded addresses — there&rsquo;s
          no street-level positioning here, only which town each offence was recorded in. See{" "}
          <a href="/about" className={css({ color: "fgAccent" })}>
            About
          </a>
          .{unmapped > 0 && ` ${unmapped} town(s) with cases aren't plotted yet (no known coordinates).`}
        </p>
      </Card>

      <MapViewLoader points={points} />

      <p className={css({ fontSize: "body" })}>
        <Link href="/map/whitby" className={css({ color: "fgAccent" })}>
          View street-level detail within Whitby →
        </Link>
      </p>
    </PageContainer>
  );
}
