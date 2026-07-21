import "server-only";
import { getTotals } from "@/lib/queries/stats";

// The dataset's year range grows as extraction continues, so the site name
// is derived from the data rather than hard-coded -- see About for
// why a partial corpus is still labelled with its full eventual claim.
export function siteTitle(): string {
  const { earliestYear, latestYear } = getTotals();
  const range = earliestYear && latestYear ? `${earliestYear}–${latestYear}` : "";
  return `North Riding Quarter Sessions: Whitby${range ? ` ${range}` : ""}`;
}
