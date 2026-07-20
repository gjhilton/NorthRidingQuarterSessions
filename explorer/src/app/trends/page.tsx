import { css } from "styled-system/css";
import {
  dayOfWeekBreakdown,
  femalePercentByYear,
  offenceToConvictionLag,
  offenceTypeByYear,
  topOccupations,
  townByYear,
} from "@/lib/queries/trends";
import { convictionsByYear, getTotals } from "@/lib/queries/stats";
import { HorizontalBarStat } from "@/components/charts/BarStat";
import { YearTrend } from "@/components/charts/YearTrend";
import { CategoryBar } from "@/components/charts/CategoryBar";
import { StackedYearArea } from "@/components/charts/StackedYearArea";
import { Card, ChartTitle, EmptyState, PageContainer, PageTitle } from "@/components/ui";

export default function TrendsPage() {
  const totals = getTotals();
  const convictionsPerYear = convictionsByYear();
  const offenceTypes = offenceTypeByYear();
  const towns = townByYear();
  const genderTrend = femalePercentByYear();
  const dayOfWeek = dayOfWeekBreakdown();
  const occupations = topOccupations();
  const lag = offenceToConvictionLag();

  const yearSpan =
    totals.earliestYear && totals.latestYear && totals.earliestYear !== totals.latestYear;

  return (
    <PageContainer>
      <PageTitle subtitle="How prosecuted behaviour, its subjects, and the justice system itself changed across the run of the archive">
        Trends
      </PageTitle>

      {!yearSpan && (
        <Card className={css({ borderColor: "fgAccent" })}>
          <p className={css({ fontSize: "sm", color: "fgMuted" })}>
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
        <p className={css({ fontSize: "sm", color: "fgMuted", mb: "3" })}>
          The raw count behind every chart below — how many convictions are dated to each year.
        </p>
        {convictionsPerYear.length === 0 ? (
          <EmptyState>No dated convictions yet.</EmptyState>
        ) : (
          <YearTrend data={convictionsPerYear} />
        )}
      </Card>

      <Card>
        <ChartTitle>Offence type composition over time</ChartTitle>
        <p className={css({ fontSize: "sm", color: "fgMuted", mb: "3" })}>
          What kinds of behaviour the court&rsquo;s attention fell on, year by year.
        </p>
        {offenceTypes.years.length === 0 ? (
          <EmptyState>No dated convictions yet.</EmptyState>
        ) : (
          <StackedYearArea data={offenceTypes.data} seriesKeys={offenceTypes.seriesKeys} />
        )}
      </Card>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", lg: "1fr 1fr" },
          gap: "6",
        })}
      >
        <Card>
          <ChartTitle>Defendants: % female by year</ChartTitle>
          <p className={css({ fontSize: "sm", color: "fgMuted", mb: "3" })}>
            Who the law&rsquo;s attention fell on, not just how much.
          </p>
          {genderTrend.length === 0 ? (
            <EmptyState>No defendant sex data yet.</EmptyState>
          ) : (
            <YearTrend data={genderTrend} />
          )}
        </Card>

        <Card>
          <ChartTitle>Day of the offence</ChartTitle>
          <p className={css({ fontSize: "sm", color: "fgMuted", mb: "3" })}>
            Weekly rhythms — pay day, market day, the Sabbath.
          </p>
          <CategoryBar data={dayOfWeek} />
        </Card>
      </div>

      <Card>
        <ChartTitle>Convictions by town over time</ChartTitle>
        <p className={css({ fontSize: "sm", color: "fgMuted", mb: "3" })}>
          Whitby against the surrounding townships, year by year.
        </p>
        {towns.years.length === 0 ? (
          <EmptyState>No located, dated convictions yet.</EmptyState>
        ) : (
          <StackedYearArea data={towns.data} seriesKeys={towns.seriesKeys} />
        )}
      </Card>

      <Card>
        <ChartTitle>Defendant occupations</ChartTitle>
        <p className={css({ fontSize: "sm", color: "fgMuted", mb: "3" })}>
          The working lives behind the charge sheet.
        </p>
        {occupations.length === 0 ? (
          <EmptyState>No occupation data yet.</EmptyState>
        ) : (
          <HorizontalBarStat data={occupations.map((o) => ({ name: o.label, count: o.count }))} />
        )}
      </Card>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", lg: "1fr 1fr" },
          gap: "6",
        })}
      >
        <Card>
          <ChartTitle>Average days, offence to conviction</ChartTitle>
          <p className={css({ fontSize: "sm", color: "fgMuted", mb: "3" })}>
            How fast summary justice moved, by year.
          </p>
          {lag.byYear.length === 0 ? (
            <EmptyState>No dated pairs yet.</EmptyState>
          ) : (
            <YearTrend data={lag.byYear} />
          )}
        </Card>

        <Card>
          <ChartTitle>Time to conviction</ChartTitle>
          <p className={css({ fontSize: "sm", color: "fgMuted", mb: "3" })}>
            Distribution across the whole run.
          </p>
          <CategoryBar data={lag.histogram} />
        </Card>
      </div>
    </PageContainer>
  );
}
