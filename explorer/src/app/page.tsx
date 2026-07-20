import Link from "next/link";
import { css } from "styled-system/css";
import { getTotals } from "@/lib/queries/dashboard";
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
    href: "/people",
    title: "People",
    description: "Look up a defendant or involved person and trace their connections.",
  },
  {
    href: "/data-quality",
    title: "Data quality",
    description: "Repeated names, unreviewed offence categories, extraction failures.",
  },
];

export default function Home() {
  const totals = getTotals();

  return (
    <PageContainer>
      <PageTitle subtitle="North Riding Quarter Sessions — Whitby Summary Conviction records">
        NRQS Explorer
      </PageTitle>

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
