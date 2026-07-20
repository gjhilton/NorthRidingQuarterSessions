import Link from "next/link";
import { css } from "styled-system/css";
import { convictionsByYear, getTotals } from "@/lib/queries/dashboard";
import { Card, PageContainer, PageTitle, StatTile } from "@/components/ui";

const sections = [
  {
    href: "/browse",
    title: "Browse & search",
    description: "Paginated, filterable list of every summary conviction record.",
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Offence-type breakdown, convictions over time, geographic spread.",
  },
  {
    href: "/trends",
    title: "Trends",
    description: "Change over time: offence mix, gender, geography, and how fast justice moved.",
  },
  {
    href: "/people",
    title: "People",
    description: "Look up a defendant or involved person and trace their connections.",
  },
  {
    href: "/data-quality",
    title: "Data quality",
    description: "Repeated names, unreviewed offence categories, extraction failures.",
  },
  {
    href: "/methodology",
    title: "Methodology",
    description: "Where this data comes from, its coverage, and what to treat with caution.",
  },
];

function decadesCovered(years: { year: number }[]): string {
  const decades = [...new Set(years.map((y) => Math.floor(y.year / 10) * 10))].sort(
    (a, b) => a - b
  );
  if (decades.length === 0) return "none yet";
  if (decades.length <= 6) return decades.map((d) => `${d}s`).join(", ");
  return `${decades.length} different decades (${decades[0]}s–${decades[decades.length - 1]}s)`;
}

export default function Home() {
  const totals = getTotals();
  const coveragePct = Math.round((totals.convictions / totals.rawCaseTotal) * 100);

  return (
    <PageContainer>
      <PageTitle subtitle="North Riding Quarter Sessions — Whitby Summary Conviction records">
        NRQS Explorer
      </PageTitle>

      <Card className={css({ borderColor: "fgAccent" })}>
        <p className={css({ fontSize: "sm", color: "fgMuted" })}>
          <strong className={css({ color: "fg" })}>
            {totals.convictions.toLocaleString()} of {totals.rawCaseTotal.toLocaleString()}
          </strong>{" "}
          archive records extracted so far ({coveragePct}%), spanning{" "}
          {decadesCovered(convictionsByYear())}. Extraction is ongoing and sampled to cover
          decades evenly rather than in archive order, but a partial corpus is still a partial
          corpus — treat any pattern here as provisional until coverage is more complete.
        </p>
      </Card>

      <div className={css({ display: "flex", gap: "4", flexWrap: "wrap" })}>
        <StatTile label="Convictions" value={totals.convictions} />
        <StatTile label="Defendant mentions" value={totals.defendants} />
        <StatTile label="Involved persons" value={totals.involvedPersons} />
        <StatTile
          label="Year range"
          value={
            totals.earliestYear && totals.latestYear
              ? `${totals.earliestYear}–${totals.latestYear}`
              : "—"
          }
        />
      </div>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
          gap: "4",
        })}
      >
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card
              className={css({
                height: "100%",
                transition: "border-color 0.15s",
                _hover: { borderColor: "fgAccent" },
              })}
            >
              <h2 className={css({ fontFamily: "serif", fontSize: "lg", fontWeight: "600" })}>
                {s.title}
              </h2>
              <p className={css({ color: "fgMuted", fontSize: "sm", mt: "1" })}>
                {s.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
