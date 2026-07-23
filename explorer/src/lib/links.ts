// Every internal link to a dynamic-route page goes through one of these,
// rather than each call site inlining its own `/people/${...}` or
// `/streets/${...}` template literal -- see lib/referenceSlug.ts's
// convictionHref for why (a repo-wide grep-and-fix every time the URL
// scheme needs to change is a sign the scheme wasn't centralized).
import { toSlug } from "@/lib/slug";
import { offenceCategorySlug } from "@/lib/offenceCategorySlugs";

export function personHref(nameKey: string): string {
  return `/people/${toSlug(nameKey)}`;
}

export function streetHref(id: number): string {
  return `/streets/${id}`;
}

// The /offences/[slug] pages themselves don't exist yet (see TODO.md) --
// returns undefined for a category with no slug mapping yet, so callers can
// render plain text instead of a link to nowhere.
export function offenceHref(categoryName: string): string | undefined {
  const slug = offenceCategorySlug(categoryName);
  return slug ? `/offences/${slug}` : undefined;
}
