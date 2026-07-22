import "server-only";
import { getTotals } from "@/lib/queries/stats";

// Plain-text form, for contexts that can't render markup (the <title>
// metadata tag, aria-labels). Visual contexts (nav brand, homepage h1)
// should use the <SiteTitle /> component instead, which superscripts the
// "th" -- see src/components/SiteTitle.tsx.
export const SITE_TITLE = "Petty crime in C19th Whitby";

// The dataset's year range grows as extraction continues, so the subtitle
// is derived from the data rather than hard-coded -- see About for why a
// partial corpus is still labelled with its full eventual claim.
export function siteSubtitle(): string {
  const { earliestYear, latestYear } = getTotals();
  const range = earliestYear && latestYear ? ` ${earliestYear}–${latestYear}` : "";
  return `North Riding Quarter Sessions summary convictions${range}`;
}

export function siteTitleFull(): string {
  const subtitle = siteSubtitle();
  return subtitle ? `${SITE_TITLE}: ${subtitle}` : SITE_TITLE;
}
