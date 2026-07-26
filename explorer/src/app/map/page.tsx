import Link from "next/link";
import { css } from "styled-system/css";
import { allTownCaseCounts, townByYear, unmappedTownCaseCount } from "@/lib/queries/map";
import { MapViewLoader } from "@/components/MapViewLoader";
import { StackedYearArea } from "@/components/charts/StackedYearArea";
import { Card, ChartTitle, EmptyState, PageContainer, PageTitle } from "@/components/ui";

export default function MapPage() {
  const points = allTownCaseCounts();
  const townsByYear = townByYear();
  const unmapped = unmappedTownCaseCount();

  return (
    <PageContainer>
      <PageTitle subtitle="Offence locations by township — circle size is case count, not precision">
        Map
      </PageTitle>

      <Card className={css({ borderColor: "fgAccent" })}>
        <p className={css({ fontSize: "body", color: "fgMuted" })}>
          Points are the town/parish&rsquo;s own geocoded centre, not the exact offence address —
          see <Link href="/locations" className={css({ color: "fgAccent" })}>Locations</Link> for
          street-level detail on a specific place. See{" "}
          <a href="/about" className={css({ color: "fgAccent" })}>
            About
          </a>
          .
          {unmapped > 0 &&
            ` ${unmapped} case(s) aren't plotted — recorded only against a stretch of road between two places, not a fixed point.`}
        </p>
      </Card>

      <MapViewLoader points={points} />

      <Card>
        <ChartTitle>Convictions by town over time</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Whitby against the surrounding townships, year by year.
        </p>
        {townsByYear.years.length === 0 ? (
          <EmptyState>No located, dated convictions yet.</EmptyState>
        ) : (
          <StackedYearArea data={townsByYear.data} seriesKeys={townsByYear.seriesKeys} />
        )}
      </Card>

      <p className={css({ fontSize: "body" })}>
        <Link href="/map/whitby" className={css({ color: "fgAccent" })}>
          View street-level detail within Whitby →
        </Link>
      </p>
    </PageContainer>
  );
}
