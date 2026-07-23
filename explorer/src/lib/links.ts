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
