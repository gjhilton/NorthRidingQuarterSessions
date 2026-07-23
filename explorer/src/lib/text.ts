// Town/street names are stored lowercase (get-or-create dedup keys off the
// lowercased name) -- this is display-only formatting, never used for
// lookups or comparisons. Capitalizes letters at the start of the string,
// after whitespace, or after a hyphen (so compound names like
// "eskdaleside-cum-ugglebarnby" come out "Eskdaleside-Cum-Ugglebarnby"),
// except "cum" itself -- the conventional way to write these compound
// place names (e.g. "Eskdaleside-cum-Ugglebarnby") keeps that joining word
// lowercase, same idea as "of"/"the" staying lowercase in a title. A plain
// \b\w regex would also treat an apostrophe as a word boundary, so
// possessives like "st ann's staith" come out "St Ann's Staith" rather
// than "St Ann'S Staith".
export function titleCase(s: string): string {
  return s.replace(/(^|[\s-])\w/g, (c) => c.toUpperCase()).replace(/-Cum-/g, "-cum-");
}

// Site-wide name display rule: "SURNAME, Firstname [qualifier] (occupation)",
// or "SURNAME, Firstname [qualifier] (occupation: Town)" wherever `town` is
// passed -- that extended form is opt-in per call site (list-of-people
// contexts with room for it), not a change to the base rule, so most
// callers keep the plain form just by not passing town. Does NOT apply to
// literal quotes of the records themselves (raw_record, charge_description,
// sentencing, etc.) -- only to names shown as their own distinct UI element
// (a person's name in a list, a link label, a search result). Being rolled
// out page by page, not applied everywhere yet. nameQualifier is a
// generational epithet ("the elder", "junior", ...) kept separate from
// lastName at the data layer specifically so it can be shown this way
// instead of getting read as part of the surname -- see
// data-loader/qsrecords/models/core.py's Defendant.name_qualifier.
export function formatPersonName({
  firstName,
  lastName,
  occupation,
  nameQualifier,
  town,
}: {
  firstName?: string | null;
  lastName?: string | null;
  occupation?: string | null;
  nameQualifier?: string | null;
  town?: string | null;
}): string {
  const surname = lastName ? lastName.toUpperCase() : "";
  const first = firstName?.trim() || "";
  let name = surname && first ? `${surname}, ${first}` : surname || first;
  if (nameQualifier?.trim()) name += ` [${nameQualifier.trim()}]`;
  const occ = occupation?.trim() || "";
  const twn = town?.trim() ? titleCase(town.trim()) : "";
  const detail = occ && twn ? `${occ}: ${twn}` : occ || twn;
  return detail ? `${name} (${detail})` : name;
}
