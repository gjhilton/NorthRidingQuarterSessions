# E2E test coverage notes

Working notes accumulated while reviewing/redesigning each page, for the
future E2E test plan (Playwright) once the page-by-page pass is done. Not
a spec -- just "what actually needs covering" observations, page by page,
so nothing has to be re-derived from scratch when that planning happens.

## Nav (Nav.tsx / NavDropdown.tsx)

- Active-section indicator: bullet before each top-nav item is invisible
  by default, red only when that section (or, for the Insights dropdown
  trigger, any of its child links) is the current route.
- Insights dropdown: opens on click, closes on outside click and Escape,
  closes after clicking a link inside it.

## Global layout

- Mobile-portrait warning banner (`MobileWarningBanner.tsx`): visible only
  at narrow width + portrait orientation (CSS media query, no JS) -- worth
  a viewport-size test rather than a DOM-presence test, since it's always
  in the DOM and toggled by CSS alone.

## Convictions listing (`/convictions`, `BrowseExplorer.tsx`)

- Free-text search (`q`) via the search field's Enter/submit.
- Advanced filters (each applies immediately on change, no submit needed):
  town → street (street list scoped to selected town), offence category →
  type (type list scoped to selected category), offence date range,
  conviction date range, sex, defendant count.
- "Clear filters" resets every field, including the uncontrolled ones
  (remounts the form via a key bump) -- worth checking date/select fields
  actually revert visually, not just filters state.
- Column sort: click a column header toggles asc/desc; default is
  conviction_date ascending.
- Pagination: Prev/Next buttons, page count text, disabled states at the
  first/last page.
- "Showing X-Y of Z" / "Showing all N" / "Showing 1" text variants
  depending on total vs PAGE_SIZE.
- CSV export button: downloads all matching rows (not just current page),
  respecting current filters.
- Row click navigates to `/convictions/[id]`, carrying the current filter
  state as query params on the link (this is what ConvictionNav below
  depends on).
- Filter state round-trips through the URL (shareable/bookmarkable link
  hydrates the same filtered view on load).

## Conviction detail (`/convictions/[id]`)

- `ConvictionNav.tsx` -- two distinct behaviours depending on how the page
  was reached, both worth their own test:
  - **Cold / no search context**: server-rendered, works without JS.
    "← Back to convictions", "Record N of M" (whole-dataset, id order),
    Prev/Next step by adjacent id, disabled/greyed at dataset ends.
  - **Arrived from a filtered/searched listing** (query params present):
    client-side (sql.js) swap to "← Back to search results" (returns to
    the *same* filtered listing), "Record N of M matching search for
    "..."" (or "matching filtered results" when filtered but no free-text
    q), Prev/Next scoped to just the filtered set, and this context
    keeps propagating through repeated Prev/Next clicks (each link carries
    the same query string forward). Falls back to the whole-dataset
    default if the current record no longer matches the filters (e.g. a
    hand-edited URL).
- Header block: reference number title, "Conviction date: ..." subtitle,
  "Court: ..." line (both same size/colour by design) -- `Court:` line
  only renders when `court_town_name` is present.
- Raw record box (no heading, `bgSurface` bg, no border): the record text
  wrapped in curly quotes, plus a bottom-right "View original record at
  NYCRO →" link to `archive_url`.
- "Citing this record" section (deliberately unboxed, plain text; placed
  directly under the raw record box, before the pills/charge-description
  card): "Please cite NYCRO, not this website" note first (parenthetical,
  no em dash), then one Chicago Notes-Bibliography (bibliography form)
  citation -- normal body text except the archive URL itself, which is a
  real `<a>` link in a small monospace font. `CopyCitationButton` is
  icon-only now (clipboard glyph -> checkmark for 2s after click, via
  `aria-label`/`title` rather than visible text) -- worth testing
  clipboard content matches the full plain-text citation (URL included),
  not just the icon swap.
- (Rest of the page -- info card pills/charge/sentencing, Defendants/
  Involved persons, Related cases -- not yet reviewed this pass; add
  notes here as each is covered.)
- Raw record box: no heading, `bgSurface` bg, no border, record text in
  curly quotes, bottom-right "View original record at NYCRO →" link.
- People section: one `<h2>People</h2>` (bigger -- `display` size, not
  `heading`) containing three conditionally-rendered `<h3>` subsections in
  a fixed order -- Offenders, Police, Other -- driven by `lib/roles.ts`'s
  `Roles` enum/`ROLE_LABELS`/`classifyInvolvedPersonRole`. Police is
  *only* the literal "police"/"police officer" `involved_persons.role`
  values (2 of 3,000+ rows) -- "informant" (the largest role by far)
  deliberately stays in Other. Worth a fixture with one person in each
  category (e.g. conviction id 7 / QSB 1889 1/10/10/7 in the current
  data) to check all three render, plus a record with zero involved
  persons (Police/Other both absent, only Offenders) and zero of
  everything (whole People section absent).
- Citing this record: placed directly under the raw record box (not at
  page bottom). Italic "Please cite... NYCRO... (why?)" note (links to
  /about), then one regular-weight Chicago bibliography-form citation
  with the archive URL as a real link, then an icon-only copy button
  (clipboard -> checkmark, `aria-label`/`title` carries the accessible
  name) with a toast (`components/Toast.tsx`) on success/failure --
  worth testing both the clipboard content and the failure path (mock
  `navigator.clipboard.writeText` rejecting).

## Conviction URLs are reference-number-based, not numeric ids

Significant routing change: `/convictions/[id]` (numeric, e.g.
`/convictions/2698`) became `/convictions/[reference]` (a slug of the
conviction's `reference_number`, e.g. `/convictions/QSB_1866_4-10-15-19`)
-- ids reflect extraction order and could shift on a future re-import;
reference_number is the stable public identifier. Old numeric URLs now
404 (worth a regression test that they don't silently 200/redirect).

- `referenceToSlug`/`convictionHref`/`convictionHrefFromSlug`
  (`lib/referenceSlug.ts`) are the only place a conviction URL is built --
  every link site (BrowseExplorer row click, ConvictionNav prev/next/back,
  About's low-confidence/repeated-name/name-variant tables, People's case
  lists, Streets' case list, EspecialInterest, OnThisDay, the conviction
  detail page's own Related cases) goes through one of these rather than
  inlining `/convictions/${...}`. Same pattern for people
  (`lib/links.ts`'s `personHref`) and streets (`streetHref`) -- worth an
  E2E check that clicking through from *every* one of those entry points
  lands on the correct record, not just the two or three most obvious
  ones.
- `referenceToSlug` was verified unique across all 6,231 live
  reference_number values before this was built (see
  `fix_reference_number_mismatches.py` in data-loader -- two rows'
  reference_number disagreed with their own archive_url and were
  corrected first, since one of them collided with an unrelated record).
  A future re-scrape could in principle reintroduce a collision; there's
  no runtime guard against it today (build would just silently produce
  two static pages at the same path, last one wins) -- worth deciding
  whether an E2E/build-time uniqueness check belongs here.
- Conviction detail pages fetched a `name_key` for defendants/involved
  persons (added to `DetailDefendant`/`DetailInvolvedPerson`) so their
  "View person" links use the real stored name_key via `personHref`
  instead of a hand-rolled `${first} ${last}`.toLowerCase()` slug that
  could in principle drift from the actual `/people/[nameKey]` static
  pages -- worth a test that a defendant's link on a conviction page
  actually resolves (not just that it's shaped like a URL).
