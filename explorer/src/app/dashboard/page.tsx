import { css } from "styled-system/css";
import {
  convictionsByTown,
  convictionsByYear,
  offenceTypeBreakdown,
} from "@/lib/queries/dashboard";
import { HorizontalBarStat } from "@/components/charts/BarStat";
import { YearTrend } from "@/components/charts/YearTrend";
import { Card, ChartTitle, EmptyState, PageContainer, PageTitle } from "@/components/ui";

export default function DashboardPage() {
  const offences = offenceTypeBreakdown();
  const years = convictionsByYear();
  const towns = convictionsByTown();

  return (
    <PageContainer>
      <PageTitle subtitle="Aggregate views over the extracted dataset">Dashboard</PageTitle>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", lg: "1fr 1fr" },
          gap: "6",
        })}
      >
        <Card>
          <ChartTitle>Offence type breakdown</ChartTitle>
          {offences.length === 0 ? (
            <EmptyState>No convictions yet.</EmptyState>
          ) : (
            <HorizontalBarStat data={offences} />
          )}
        </Card>

        <Card>
          <ChartTitle>Convictions by offence town</ChartTitle>
          {towns.length === 0 ? (
            <EmptyState>No located convictions yet.</EmptyState>
          ) : (
            <HorizontalBarStat data={towns} />
          )}
        </Card>
      </div>

      <Card>
        <ChartTitle>Convictions over time</ChartTitle>
        {years.length === 0 ? (
          <EmptyState>No dated convictions yet.</EmptyState>
        ) : (
          <YearTrend data={years} />
        )}
      </Card>
    </PageContainer>
  );
}
