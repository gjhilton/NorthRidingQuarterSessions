import Link from "next/link";
import { css } from "styled-system/css";
import { Card, PageContainer } from "@/components/ui";
import { CasesSearch } from "@/components/browse/CasesSearch";
import { OnThisDay } from "@/components/OnThisDay";
import { PeopleSearch } from "@/components/people/PeopleSearch";
import { SiteTitle } from "@/components/SiteTitle";
import { siteSubtitle } from "@/lib/siteName";

const findBoxes = [
  {
    href: "/convictions",
    title: "Find convictions",
    description: "Search and browse every extracted Summary Conviction record.",
    linkText: "Browse convictions",
    search: <CasesSearch />,
  },
  {
    href: "/people",
    title: "Find people",
    description: "Look up a defendant or involved person and trace their connections.",
    linkText: "Browse people",
    search: <PeopleSearch autoFocus={false} />,
  },
];

export default function Home() {
  return (
    <PageContainer>
      <div>
        <h1 className={css({ fontFamily: "serif", fontSize: "hero", fontWeight: "600", color: "fg" })}>
          <SiteTitle />
        </h1>
        <p className={css({ fontSize: "display", color: "fgMuted", mt: "2" })}>{siteSubtitle()}</p>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/homepage-placeholder.png"
        alt="Tin Ghaut, Whitby, circa 1890s"
        className={css({ width: "100%", height: "auto", borderRadius: "corner" })}
      />
      <p className={css({ fontSize: "body" })}>
        The Justices of the Peace at Whitby&rsquo;s Quarter Sessions convicted people of
        everyday offences —{" "}
        <Link href="/offences/poaching-fishing">poaching</Link>,{" "}
        <Link href="/offences/drink-public-order">drunkenness</Link>,{" "}
        <Link href="/offences/vagrancy-begging">vagrancy</Link>,{" "}
        <Link href="/offences/assault-resisting-authority">assault</Link>, and dozens more —
        each case recorded as a short summary in the archive&rsquo;s own catalogue. This site
        makes those Summary Conviction records searchable, browsable, and explorable, drawn
        from{" "}
        <a href="https://archivesunlocked.northyorks.gov.uk" target="_blank" rel="noopener noreferrer">
          North Yorkshire County Record Office&rsquo;s Archives Unlocked catalogue
        </a>
        . Read more about the North Riding Quarter Sessions on the NYCRO blog{" "}
        <a
          href="https://nycroblog.com/2024/11/29/records-of-the-north-riding-quarter-sessions/"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>{" "}
        and{" "}
        <a
          href="https://nycroblog.com/2025/05/28/quarter-sessions-bundles/"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>

      <OnThisDay />

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
          gap: "4",
        })}
      >
        {findBoxes.map((b) => (
          <Card key={b.href} className={css({ height: "100%" })}>
            <h2 className={css({ fontFamily: "serif", fontSize: "heading", fontWeight: "600" })}>
              {b.title}
            </h2>
            <p className={css({ color: "fgMuted", fontSize: "body", mt: "1" })}>{b.description}</p>
            <div className={css({ mt: "3" })}>{b.search}</div>
            <Link
              href={b.href}
              className={css({
                display: "inline-block",
                color: "fgAccent",
                fontSize: "body",
                fontWeight: "600",
                mt: "3",
              })}
            >
              {b.linkText} →
            </Link>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}

/* Previous homepage, kept for reference while the redesign is in progress:

import Link from "next/link";
import { css } from "styled-system/css";
import { convictionsByYear, getTotals } from "@/lib/queries/stats";
import { Card, PageContainer, PageTitle, StatTile } from "@/components/ui";
import { OnThisDay } from "@/components/OnThisDay";
import { EspecialInterest } from "@/components/EspecialInterest";
import { siteTitle } from "@/lib/siteName";

const sections = [
  {
    href: "/convictions",
    title: "Browse & search",
    description: "Paginated, filterable list of every summary conviction record.",
  },
  {
    href: "/trends",
    title: "Trends",
    description: "How many convictions and what offence mix, year by year — see the Insights menu for gender, occupations, seasonal patterns, and how fast justice moved.",
  },
  {
    href: "/people",
    title: "People",
    description: "Look up a defendant or involved person and trace their connections.",
  },
  {
    href: "/streets",
    title: "Streets",
    description: "Browse by street — every extracted case tied to a named street.",
  },
  {
    href: "/map",
    title: "Map",
    description: "Offence locations by township, sized by how many cases.",
  },
  {
    href: "/about",
    title: "About",
    description:
      "Where this data comes from, its coverage, and its rough edges: repeated names, unreviewed offence categories, extraction failures.",
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
      <PageTitle subtitle="Summary Conviction records from the Quarter Sessions Bundles archive">
        {siteTitle()}
      </PageTitle>

      <Card>
        <p className={css({ fontSize: "body" })}>
          The North Riding Quarter Sessions was the court through which
          Justices of the Peace administered both justice and local
          government across this part of Yorkshire — records survive from
          1538, continuously minuted from 1605, right up to 1889, when the
          newly-created North Riding County Council took over the
          Justices&rsquo; administrative role.{" "}
          <strong>That&rsquo;s the same year this dataset ends</strong> — not
          a coincidence of scraping, but the actual close of the era these
          records belonged to. The court sat four times a year (Epiphany,
          Easter, Midsummer, Michaelmas) and combined indictable criminal
          business with sweeping administrative responsibility: roads and
          bridges, weights and measures, licensing, the poor law, militia,
          and policing.
        </p>
        <p className={css({ fontSize: "body", mt: "3" })}>
          The records here are Summary Convictions — minor offences
          disposed of without a jury, a category substantially broadened by
          the Summary Jurisdiction Act 1848, which falls in the middle of
          this dataset&rsquo;s 1802–1889 span. They come from the Quarter
          Sessions Bundles (QSB): the loose working papers tied together at
          the end of each Session, now held by North Yorkshire County
          Record Office. Most were heard within Whitby Strand, one of the
          North Riding&rsquo;s petty sessional divisions — local groupings
          of Justices who dealt with minor cases without needing the full
          Quarter Sessions.
        </p>
        <p className={css({ fontSize: "small", color: "fgMuted", mt: "3" })}>
          Sources:{" "}
          <a
            href="https://nycroblog.com/2024/11/29/records-of-the-north-riding-quarter-sessions/"
            target="_blank"
            rel="noopener noreferrer"
            className={css({ color: "fgAccent" })}
          >
            &ldquo;Records of the North Riding Quarter Sessions,&rdquo; North
            Yorkshire Archives Blog (29 Nov 2024)
          </a>
          ; Falkingham, Gail.{" "}
          <a
            href="https://nycroblog.com/2025/05/28/quarter-sessions-bundles/"
            target="_blank"
            rel="noopener noreferrer"
            className={css({ color: "fgAccent" })}
          >
            &ldquo;The working papers of the North Riding Quarter
            Sessions,&rdquo; North Yorkshire Archives Blog (28 May 2025)
          </a>
          ;{" "}
          <a
            href="https://www.britannica.com/topic/quarter-sessions"
            target="_blank"
            rel="noopener noreferrer"
            className={css({ color: "fgAccent" })}
          >
            &ldquo;Quarter sessions,&rdquo; Encyclopædia Britannica
          </a>
          ;{" "}
          <a
            href="https://www.digitalpanopticon.org/Criminal_Justice,_1780-1925"
            target="_blank"
            rel="noopener noreferrer"
            className={css({ color: "fgAccent" })}
          >
            &ldquo;Criminal Justice, 1780&ndash;1925,&rdquo; The Digital
            Panopticon
          </a>{" "}
          (Universities of Liverpool, Sheffield &amp; Oxford).
        </p>
      </Card>

      <OnThisDay />

      <EspecialInterest />

      <Card className={css({ borderColor: "fgAccent" })}>
        <p className={css({ fontSize: "body", color: "fgMuted" })}>
          {coveragePct >= 100 ? (
            <>
              <strong className={css({ color: "fg" })}>
                All {totals.convictions.toLocaleString()}
              </strong>{" "}
              Summary Conviction records identified in the archive scrape have been extracted,
              spanning {decadesCovered(convictionsByYear())}. That&rsquo;s the full set of
              Summary Convictions this project scraped — not every document type in the
              Quarter Sessions Bundles, and not a claim that the archive itself is complete.
              See{" "}
              <Link href="/about" className={css({ color: "fgAccent" })}>
                About
              </Link>{" "}
              for coverage on individual fields, which varies a lot more than this headline
              number suggests.
            </>
          ) : (
            <>
              <strong className={css({ color: "fg" })}>
                {totals.convictions.toLocaleString()} of {totals.rawCaseTotal.toLocaleString()}
              </strong>{" "}
              archive records extracted so far ({coveragePct}%), spanning{" "}
              {decadesCovered(convictionsByYear())}. Extraction is ongoing and sampled to cover
              decades evenly rather than in archive order, but a partial corpus is still a
              partial corpus — treat any pattern here as provisional until coverage is more
              complete.
            </>
          )}
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
              <h2 className={css({ fontFamily: "serif", fontSize: "heading", fontWeight: "600" })}>
                {s.title}
              </h2>
              <p className={css({ color: "fgMuted", fontSize: "body", mt: "1" })}>
                {s.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}

*/
