import { css } from "styled-system/css";
import { offenceToConvictionLag } from "@/lib/queries/justice";
import { Sparkline } from "@/components/charts/Sparkline";
import { CategoryBar } from "@/components/charts/CategoryBar";
import { Card, ChartTitle, EmptyState, PageContainer, PageTitle } from "@/components/ui";

export default function JusticePage() {
  const lag = offenceToConvictionLag();

  return (
    <PageContainer>
      <PageTitle subtitle="How fast summary justice moved, from offence to conviction">
        Justice
      </PageTitle>

      <Card>
        <ChartTitle>Average days, offence to conviction</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          By year, for records with both dates given.
        </p>
        {lag.byYear.length === 0 ? (
          <EmptyState>No dated pairs yet.</EmptyState>
        ) : (
          <Sparkline data={lag.byYear.map((p) => ({ x: p.year, y: p.count }))} height={100} />
        )}
      </Card>

      <Card>
        <ChartTitle>Time to conviction</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Distribution across the whole run.
        </p>
        <CategoryBar data={lag.histogram} />
      </Card>
    </PageContainer>
  );
}
