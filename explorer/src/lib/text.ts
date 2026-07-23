// Town/street names are stored lowercase (get-or-create dedup keys off the
// lowercased name) -- this is display-only formatting, never used for
// lookups or comparisons. Only capitalizes letters at the start of the
// string or after whitespace, so possessives like "st ann's staith" come
// out as "St Ann's Staith" rather than "St Ann'S Staith" (a plain \b\w
// regex treats the apostrophe as a word boundary too).
export function titleCase(s: string): string {
  return s.replace(/(^|\s)\w/g, (c) => c.toUpperCase());
}

// Site-wide name display rule: "SURNAME, Firstname [qualifier] (occupation)".
// Does NOT apply to literal quotes of the records themselves (raw_record,
// charge_description, sentencing, etc.) -- only to names shown as their own
// distinct UI element (a person's name in a list, a link label, a search
// result). Being rolled out page by page, not applied everywhere yet.
// nameQualifier is a generational epithet ("the elder", "junior", ...) kept
// separate from lastName at the data layer specifically so it can be shown
// this way instead of getting read as part of the surname -- see
// data-loader/qsrecords/models/core.py's Defendant.name_qualifier.
export function formatPersonName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  occupation?: string | null,
  nameQualifier?: string | null
): string {
  const surname = lastName ? lastName.toUpperCase() : "";
  const first = firstName?.trim() || "";
  let name = surname && first ? `${surname}, ${first}` : surname || first;
  if (nameQualifier?.trim()) name += ` [${nameQualifier.trim()}]`;
  return occupation?.trim() ? `${name} (${occupation})` : name;
}
