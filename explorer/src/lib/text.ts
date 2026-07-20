// Town/street names are stored lowercase (get-or-create dedup keys off the
// lowercased name) -- this is display-only formatting, never used for
// lookups or comparisons. Only capitalizes letters at the start of the
// string or after whitespace, so possessives like "st ann's staith" come
// out as "St Ann's Staith" rather than "St Ann'S Staith" (a plain \b\w
// regex treats the apostrophe as a word boundary too).
export function titleCase(s: string): string {
  return s.replace(/(^|\s)\w/g, (c) => c.toUpperCase());
}
