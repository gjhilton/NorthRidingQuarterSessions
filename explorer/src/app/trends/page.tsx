import Link from "next/link";
import { css } from "styled-system/css";
import {
  dayOfWeekBreakdown,
  femalePercentByYear,
  offenceCategoryByYear,
  offenceCategoryByYearBySex,
  offenceCategoryGenderTotals,
  offenceCategoryGenderTrends,
  offenceGenderTrendsByType,
  offenceToConvictionLag,
  offenceTypeByYear,
  offenceTypeByYearBySex,
  offenceTypeGenderTotals,
  topOccupations,
  townByYear,
} from "@/lib/queries/trends";
import { convictionsByYear, getTotals } from "@/lib/queries/stats";
import { HorizontalBarStat } from "@/components/charts/BarStat";
import { YearTrend } from "@/components/charts/YearTrend";
import { CategoryBar } from "@/components/charts/CategoryBar";
import { StackedYearArea } from "@/components/charts/StackedYearArea";
import { OffenceGenderExplorer } from "@/components/charts/OffenceGenderExplorer";
import { Card, ChartTitle, EmptyState, PageContainer, PageTitle, Table, Td, Th } from "@/components/ui";

export default function TrendsPage() {
  const totals = getTotals();
  const convictionsPerYear = convictionsByYear();
  const offenceCategories = offenceCategoryByYear();
  const offenceTypes = offenceTypeByYear();
  const towns = townByYear();
  const genderTrend = femalePercentByYear();
  const dayOfWeek = dayOfWeekBreakdown();
  const occupations = topOccupations();
  const lag = offenceToConvictionLag();
  const categoryByGender = offenceCategoryByYearBySex();
  const offenceByGender = offenceTypeByYearBySex();
  const categoryGenderTrends = offenceCategoryGenderTrends();
  const offenceGenderTrends = offenceGenderTrendsByType();
  const categoryGenderTotals = offenceCategoryGenderTotals();
  const offenceGenderTotals = offenceTypeGenderTotals();

  const yearSpan =
    totals.earliestYear && totals.latestYear && totals.earliestYear !== totals.latestYear;

  return (
    <PageContainer>
      <PageTitle subtitle="How prosecuted behaviour, its subjects, and the justice system itself changed across the run of the archive">
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
          The raw count behind every chart below — how many convictions are dated to each year.
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

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", lg: "1fr 1fr" },
          gap: "6",
        })}
      >
        <Card>
          <ChartTitle>Defendants: % female by year</ChartTitle>
          <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
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
          <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
            Weekly rhythms — pay day, market day, the Sabbath.
          </p>
          <CategoryBar data={dayOfWeek} />
        </Card>
      </div>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", lg: "1fr 1fr" },
          gap: "6",
        })}
      >
        <Card>
          <ChartTitle>Male defendants: offence composition over time</ChartTitle>
          <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
            By category — same top categories as the chart to the right, so the two are directly
            comparable.
          </p>
          {categoryByGender.male.years.length === 0 ? (
            <EmptyState>No dated convictions yet.</EmptyState>
          ) : (
            <StackedYearArea data={categoryByGender.male.data} seriesKeys={categoryByGender.seriesKeys} />
          )}
        </Card>

        <Card>
          <ChartTitle>Female defendants: offence composition over time</ChartTitle>
          <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
            What the court&rsquo;s attention fell on when the defendant was a woman.
          </p>
          {categoryByGender.female.years.length === 0 ? (
            <EmptyState>No dated convictions yet.</EmptyState>
          ) : (
            <StackedYearArea data={categoryByGender.female.data} seriesKeys={categoryByGender.seriesKeys} />
          )}
        </Card>
      </div>

      <details>
        <summary className={css({ cursor: "pointer", fontSize: "body", color: "fgMuted", mb: "3" })}>
          Same comparison at the finer offence-type grain
        </summary>
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: { base: "1fr", lg: "1fr 1fr" },
            gap: "6",
          })}
        >
          <Card>
            <ChartTitle>Male defendants: offence composition over time</ChartTitle>
            {offenceByGender.male.years.length === 0 ? (
              <EmptyState>No dated convictions yet.</EmptyState>
            ) : (
              <StackedYearArea data={offenceByGender.male.data} seriesKeys={offenceByGender.seriesKeys} />
            )}
          </Card>
          <Card>
            <ChartTitle>Female defendants: offence composition over time</ChartTitle>
            {offenceByGender.female.years.length === 0 ? (
              <EmptyState>No dated convictions yet.</EmptyState>
            ) : (
              <StackedYearArea data={offenceByGender.female.data} seriesKeys={offenceByGender.seriesKeys} />
            )}
          </Card>
        </div>
      </details>

      <Card>
        <ChartTitle>One category or offence type, male vs female, over time</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Pick a category (or drill into an individual offence type) and see how often it was
          brought against men versus women, year by year.
        </p>
        {categoryGenderTrends.length === 0 ? (
          <EmptyState>No dated, gendered convictions yet.</EmptyState>
        ) : (
          <OffenceGenderExplorer categoryTrends={categoryGenderTrends} leafTrends={offenceGenderTrends} />
        )}
      </Card>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", lg: "1fr 1fr" },
          gap: "6",
          alignItems: "start",
        })}
      >
        <Card>
          <ChartTitle>Offence categories by gender (whole archive)</ChartTitle>
          <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
            Totals across the full run, not just the dated subset used in the charts above.
          </p>
          {categoryGenderTotals.length === 0 ? (
            <EmptyState>No gendered convictions yet.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Category</Th>
                  <Th>Male</Th>
                  <Th>Female</Th>
                  <Th>% female</Th>
                </tr>
              </thead>
              <tbody>
                {categoryGenderTotals.map((row) => (
                  <tr key={row.label}>
                    <Td>{row.label}</Td>
                    <Td>{row.male}</Td>
                    <Td>{row.female}</Td>
                    <Td>{row.percentFemale}%</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card>
          <ChartTitle>Top offence types by gender (whole archive)</ChartTitle>
          <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
            The finer-grained detail behind the category table to the left.
          </p>
          {offenceGenderTotals.length === 0 ? (
            <EmptyState>No gendered convictions yet.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Offence type</Th>
                  <Th>Male</Th>
                  <Th>Female</Th>
                  <Th>% female</Th>
                </tr>
              </thead>
              <tbody>
                {offenceGenderTotals.map((row) => (
                  <tr key={row.label}>
                    <Td>{row.label}</Td>
                    <Td>{row.male}</Td>
                    <Td>{row.female}</Td>
                    <Td>{row.percentFemale}%</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>

      <Card>
        <ChartTitle>Convictions by town over time</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
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
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
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
          <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
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
          <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
            Distribution across the whole run.
          </p>
          <CategoryBar data={lag.histogram} />
        </Card>
      </div>
    </PageContainer>
  );
}
