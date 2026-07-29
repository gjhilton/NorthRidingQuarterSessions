import "server-only";
import { getDb } from "@/lib/db";

// Plain-text form, for contexts that can't render markup (the <title>
// metadata tag, aria-labels). Visual contexts (nav brand, homepage h1)
// should use the <SiteTitle /> component instead, which superscripts the
// "th" -- see src/components/SiteTitle.tsx.
export const SITE_TITLE = "Petty crime in C19th Whitby";

// The dataset's year range grows as extraction continues, so the subtitle
// is derived from the data rather than hard-coded -- see About for why a
// partial corpus is still labelled with its full eventual claim.
//
// Used to go through queries/stats.ts's getTotals(), which the v3 port
// deleted as dead code (only reachable from the old, now-commented-out
// homepage per the port brief) -- but siteSubtitle() is called from the
// *live* homepage (see app/page.tsx's <h1>), so that year range is a real,
// live dependency the port brief's grep missed. Rather than resurrect all
// of getTotals() (convictions/defendants/involvedPersons/rawCaseTotal --
// fields no live caller other than this needs, some referencing tables
// that are dropped or renamed), this inlines just the one MIN/MAX(year)
// query siteSubtitle() actually uses, derived from offence_date the same
// way every other ported query file now derives a year.
export function siteSubtitle(): string {
  const { earliestYear, latestYear } = getDb()
    .prepare(
      `SELECT MIN(CAST(strftime('%Y', offence_date) AS INTEGER)) AS earliestYear,
              MAX(CAST(strftime('%Y', offence_date) AS INTEGER)) AS latestYear
       FROM summary_conviction WHERE offence_date IS NOT NULL`
    )
    .get() as { earliestYear: number | null; latestYear: number | null };
  const range = earliestYear && latestYear ? ` ${earliestYear}–${latestYear}` : "";
  return `North Riding Quarter Sessions summary convictions${range}`;
}

export function siteTitleFull(): string {
  const subtitle = siteSubtitle();
  return subtitle ? `${SITE_TITLE}: ${subtitle}` : SITE_TITLE;
}
