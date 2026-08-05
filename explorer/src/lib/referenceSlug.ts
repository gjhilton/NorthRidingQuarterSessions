// Client-safe (pure string function, no db import) -- used both server-side
// (building conviction links across the site) and client-side (BrowseExplorer
// row links, ConvictionNav's filtered-search Prev/Next). Mirrors the historical
// data-loader convention (see git history's 03_postprocess_resources.py::
// sanitize_filename) for turning a reference number like "QSB 1872 4/10/10/119"
// into a single URL path segment: "QSB_1872_4-10-10-119". Verified unique
// across all 6,231 current reference_number values -- see the conviction
// routing change that introduced this for how that was confirmed.
export function referenceToSlug(reference: string): string {
  return reference.replaceAll(" ", "_").replaceAll("/", "-");
}

// The one place that knows a conviction detail page's URL shape -- every
// link to one should go through this rather than inlining
// `/convictions/${referenceToSlug(...)}` at each call site, so a future
// change to the URL scheme (an id suffix, a different prefix, whatever)
// is a one-function edit instead of a repo-wide grep-and-fix.
export function convictionHref(referenceNumber: string): string {
  return `/convictions/${referenceToSlug(referenceNumber)}`;
}

// Same, for callers that already have the slug (e.g. Prev/Next, computed
// server- or client-side from a reference_number elsewhere) rather than a
// raw reference number -- avoids a redundant referenceToSlug round-trip.
export function convictionHrefFromSlug(slug: string): string {
  return `/convictions/${slug}`;
}
