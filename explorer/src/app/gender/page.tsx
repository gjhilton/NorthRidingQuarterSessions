import Link from "next/link";
import { css } from "styled-system/css";
import {
  femalePercentByYear,
  occupationsBySex,
  offenceCategoryGenderTotals,
  offenceCategoryGenderTrends,
  offenceGenderTrendsByType,
  offenceTypeGenderTotals,
} from "@/lib/queries/gender";
import { Sparkline } from "@/components/charts/Sparkline";
import { MiniBarRow } from "@/components/charts/MiniBarRow";
import { OffenceGenderExplorer } from "@/components/charts/OffenceGenderExplorer";
import { Card, ChartTitle, EmptyState, PageContainer, PageTitle, Table, Td, Th } from "@/components/ui";

export default function GenderPage() {
  const femaleTrend = femalePercentByYear();
  const categoryGenderTrends = offenceCategoryGenderTrends();
  const offenceGenderTrends = offenceGenderTrendsByType();
  const categoryGenderTotals = offenceCategoryGenderTotals();
  const offenceGenderTotals = offenceTypeGenderTotals();
  const femaleOccupations = occupationsBySex("female");
  const maleOccupations = occupationsBySex("male");
  const maxOccupation = Math.max(
    ...femaleOccupations.map((o) => o.count),
    ...maleOccupations.map((o) => o.count),
    1
  );
  const poorLaw = categoryGenderTotals.find((c) => c.label === "Poor Law & Workhouse");

  return (
    <PageContainer>
      <PageTitle subtitle="Who the court's attention fell on, and how that changed">
        Gender
      </PageTitle>

      <Card>
        <ChartTitle>Offenders: % female by year</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Who the law&rsquo;s attention fell on, not just how much — see{" "}
          <Link href="/trends" className={css({ color: "fgAccent" })}>
            Trends
          </Link>{" "}
          for the raw volume behind this ratio.
        </p>
        {femaleTrend.length === 0 ? (
          <EmptyState>No offender sex data yet.</EmptyState>
        ) : (
          <Sparkline data={femaleTrend.map((p) => ({ x: p.year, y: p.count }))} height={80} />
        )}
      </Card>

      <Card>
        <ChartTitle>Gender balance by offence category, over time</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Percent female, year by year, for each of the top categories — side by side so a
          category that&rsquo;s become more or less female-skewed over time stands out at a
          glance.
        </p>
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
            gap: "4",
          })}
        >
          {categoryGenderTrends.map((trend) => {
            const points = trend.points
              .filter((p) => p.male + p.female > 0)
              .map((p) => ({ x: p.year, y: Math.round((p.female / (p.male + p.female)) * 1000) / 10 }));
            return (
              <div key={trend.offenceType}>
                <div className={css({ display: "flex", justifyContent: "space-between", fontSize: "small", mb: "1" })}>
                  <span>{trend.offenceType}</span>
                  <span className={css({ color: "fgMuted" })}>{trend.total.toLocaleString()}</span>
                </div>
                <Sparkline data={points} />
              </div>
            );
          })}
        </div>
      </Card>

      {poorLaw && (
        <Card>
          <p className={css({ fontSize: "body" })}>
            <strong>Poor Law &amp; Workhouse offences are almost entirely male</strong>{" "}
            ({poorLaw.male} male vs. {poorLaw.female}{" "}
            female, whole archive) — the opposite of
            what an assumption that poor-relief enforcement mainly targets women might predict.
            These convictions are largely about a male head-of-household&rsquo;s legal
            obligations (maintaining a family, refusing workhouse labour) rather than women&rsquo;s
            own poverty being criminalised directly.
          </p>
        </Card>
      )}

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
        <ChartTitle>Occupation, by gender</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Top male occupations are industrial and maritime (labourer, jet worker, fisherman,
          miner). Top female occupations look structurally different — informal and street
          trading, and status/moral labels (&ldquo;singlewoman&rdquo;, &ldquo;common
          prostitute&rdquo;) rather than a trade — a pattern the combined, ungendered occupation
          chart on{" "}
          <Link href="/occupations" className={css({ color: "fgAccent" })}>
            Occupations
          </Link>{" "}
          hides entirely, and which also shows how occupation crosses with offence category.
        </p>
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
            gap: "6",
          })}
        >
          <div>
            <h3 className={css({ fontSize: "small", color: "fgMuted", mb: "2" })}>
              Female offenders
            </h3>
            {femaleOccupations.length === 0 ? (
              <EmptyState>No occupation data yet.</EmptyState>
            ) : (
              femaleOccupations.map((o) => (
                <MiniBarRow key={o.occupation} label={o.occupation} value={o.count} max={maxOccupation} />
              ))
            )}
          </div>
          <div>
            <h3 className={css({ fontSize: "small", color: "fgMuted", mb: "2" })}>
              Male offenders
            </h3>
            {maleOccupations.length === 0 ? (
              <EmptyState>No occupation data yet.</EmptyState>
            ) : (
              maleOccupations.map((o) => (
                <MiniBarRow key={o.occupation} label={o.occupation} value={o.count} max={maxOccupation} />
              ))
            )}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
