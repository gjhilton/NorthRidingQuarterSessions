// Every internal link to a dynamic-route page goes through one of these,
// rather than each call site inlining its own `/people/${...}` or
// `/streets/${...}` template literal -- see lib/referenceSlug.ts's
// convictionHref for why (a repo-wide grep-and-fix every time the URL
// scheme needs to change is a sign the scheme wasn't centralized).
import { toSlug } from "@/lib/slug";

export function personHref(nameKey: string): string {
  return `/people/${toSlug(nameKey)}`;
}

export function streetHref(id: number): string {
  return `/streets/${id}`;
}

// The /places/[id] page (a town/place overview -- distinct from
// /streets/[id]) doesn't exist yet, same TBC status as offenceHref's
// category pages. Numeric id, not a name-derived slug, since town already
// has a stable id (same reasoning as streetHref) -- no lookup table needed.
export function placeHref(id: number): string {
  return `/places/${id}`;
}

// One page per offence *type* (the 55 taxonomy leaves), not per category --
// resolves TODO.md's open "type or category?" question the way the actual
// /offences section was built: a page per specific offence, categories are
// just the grouping Taxonomy/conviction-detail pages already show. Numeric
// id (offence_type.id), same reasoning as streetHref/placeHref.
export function offenceHref(offenceTypeId: number): string {
  return `/offences/${offenceTypeId}`;
}
