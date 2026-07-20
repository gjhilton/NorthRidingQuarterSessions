// Turns a name_key into a URL path segment and back, without relying on
// percent-encoding.
//
// Why: a name_key like "alfred ford" needs to appear in /people/[nameKey]
// URLs. encodeURIComponent (-> "alfred%20ford") looked like the obvious
// choice, but it doesn't work for this app: `next dev` under
// `output: "export"` validates each request's raw (still-encoded) path
// against generateStaticParams()'s returned values, so it needs the encoded
// form -- but the real static-hosted build needs the *decoded* form,
// because static file servers decode the URL before doing the filesystem
// lookup, and `next export` writes files named after whatever
// generateStaticParams() returned. Encoding satisfies dev, decoding
// satisfies production; nothing satisfies both.
//
// Sidestepping it: spaces (the only character name_keys actually contain
// today) become underscores, which -- unlike hyphens, which real surnames
// use (e.g. "Smith-Jones") -- are in the URL "unreserved" set and are never
// percent-encoded by browsers or by encodeURIComponent. So the raw request
// path, generateStaticParams()'s output, and the emitted filename are all
// identical strings in every context, and there's nothing to en/decode.
export function toSlug(nameKey: string): string {
  return nameKey.replace(/ /g, "_");
}

export function fromSlug(slug: string): string {
  return decodeURIComponent(slug).replace(/_/g, " ");
}
