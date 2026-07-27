import { notFound } from "next/navigation";

// Deprecated -- kept for reference, not maintained. Do not fix bugs here.
export default function TrendsPage() {
  notFound();
}

/*
import Link from "next/link";
import { css } from "styled-system/css";
import { offenceCategoryByYear, offenceTypeByYear } from "@/lib/queries/trends";
import { convictionsByYear, getTotals } from "@/lib/queries/stats";
import { YearTrend } from "@/components/charts/YearTrend";
import { StackedYearArea } from "@/components/charts/StackedYearArea";
import { Card, ChartTitle, EmptyState, PageContainer, PageTitle } from "@/components/ui";

export default function TrendsPage() {
  const totals = getTotals();
  const convictionsPerYear = convictionsByYear();
  const offenceCategories = offenceCategoryByYear();
  const offenceTypes = offenceTypeByYear();

  const yearSpan =
    totals.earliestYear && totals.latestYear && totals.earliestYear !== totals.latestYear;

  return (
    <PageContainer>
      <PageTitle subtitle="How much the court's attention grew, and what it fell on, year by year">
        Trends
      </PageTitle>

      {!yearSpan && (
        <Card className={css({ borderColor: "fgAccent" })}>
          <p className={css({ fontSize: "body", color: "fgMuted" })}>
            The loaded dataset currently spans only{" "}
            {totals.earliestYear ?? "—"}
            {totals.latestYear && totals.latestYear !== totals.earliestYear
              ? `–${totals.latestYear}`
              : ""}
            , so these charts will look flat. They&rsquo;re built to read correctly across the
            full 1803–1889 run once more of the archive is extracted — see{" "}
            <code>data-loader/04_extract_structured_data.py</code>.
          </p>
        </Card>
      )}

      <Card>
        <ChartTitle>Convictions over time</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          The raw count behind every chart on this and every other Insights page — how many
          convictions are dated to each year.
        </p>
        {convictionsPerYear.length === 0 ? (
          <EmptyState>No dated convictions yet.</EmptyState>
        ) : (
          <YearTrend data={convictionsPerYear} />
        )}
      </Card>

      <Card>
        <ChartTitle>Offence category composition over time</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          What kinds of behaviour the court&rsquo;s attention fell on, year by year, grouped by
          the 17-category taxonomy (see{" "}
          <Link href="/taxonomy" className={css({ color: "fgAccent" })}>
            Taxonomy
          </Link>{" "}
          for the full breakdown).
        </p>
        {offenceCategories.years.length === 0 ? (
          <EmptyState>No dated convictions yet.</EmptyState>
        ) : (
          <StackedYearArea data={offenceCategories.data} seriesKeys={offenceCategories.seriesKeys} />
        )}
      </Card>

      <Card>
        <ChartTitle>Offence type composition over time (detail)</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          The same data at the finer, 55-leaf-type grain, for comparison with the category view
          above.
        </p>
        {offenceTypes.years.length === 0 ? (
          <EmptyState>No dated convictions yet.</EmptyState>
        ) : (
          <StackedYearArea data={offenceTypes.data} seriesKeys={offenceTypes.seriesKeys} />
        )}
      </Card>
    </PageContainer>
  );
}
*/
