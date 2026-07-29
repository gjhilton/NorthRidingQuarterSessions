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

// Offence type names are stored lowercase too (e.g. "drunk and
// disorderly") -- capitalizes just the first letter, unlike titleCase's
// every-word capitalization, since these are ordinary phrases rather than
// proper nouns.
export function sentenceCase(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

// Site-wide canonical name display rule: "SURNAME, Title Forename Middlename
// [postfix] "Alias" (occupation)", or "...(occupation: Town)" wherever
// `town` is passed -- that extended form is opt-in per call site
// (list-of-people contexts with room for it), not a change to the base
// rule, so most callers keep the plain form just by not passing town. Does
// NOT apply to literal quotes of the records themselves (raw_record,
// charge_description, sentencing, etc.) -- only to names shown as their own
// distinct UI element (a person's name in a list, a link label, a search
// result). Being rolled out page by page, not applied everywhere yet.
// namePostfix is a generational epithet ("the elder", "junior", ...) kept
// separate from lastName at the data layer specifically so it can be shown
// this way instead of getting read as part of the surname; title ("Sir",
// "Rev.", ...) and middleName are likewise kept as their own fields rather
// than folded into firstName -- see data-loader/qsrecords/models/core.py's
// Person model. alias (a nickname the record itself uses, e.g. "Big Ollie"
// for Oliver Wells) is quoted rather than parenthesized like namePostfix,
// since it's a name someone was actually called, not a disambiguating label.
// namePostfix is shown exactly as stored, lowercase ("the elder", "junior"),
// not title-cased.
export function formatPersonName({
  firstName,
  middleName,
  lastName,
  title,
  namePostfix,
  alias,
  occupation,
  town,
}: {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  // "Sir" / "Rev." / "Lady" / "Dr." etc -- see
  // data-loader/qsrecords/models/core.py::Person.title.
  title?: string | null;
  // "the elder" / "the younger" / "junior" -- see Person.name_postfix.
  namePostfix?: string | null;
  // Comma-joined if more than one (Person.alias) -- each rendered in its
  // own quotes.
  alias?: string | null;
  occupation?: string | null;
  town?: string | null;
}): string {
  const surname = lastName ? lastName.toUpperCase() : "";
  const titlePrefix = title?.trim() ? `${title.trim()} ` : "";
  const first = firstName?.trim() || "";
  const middle = middleName?.trim() ? ` ${middleName.trim()}` : "";
  const firstFull = `${titlePrefix}${first}${middle}`.trim();
  let name = surname && firstFull ? `${surname}, ${firstFull}` : surname || firstFull;
  if (namePostfix?.trim()) name += ` (${namePostfix.trim()})`;
  if (alias?.trim()) {
    const aliases = alias
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    if (aliases.length > 0) name += ` ${aliases.map((a) => `"${a}"`).join(", ")}`;
  }
  const occ = occupation?.trim() || "";
  const twn = town?.trim() ? titleCase(town.trim()) : "";
  const detail = occ && twn ? `${occ}: ${twn}` : occ || twn;
  return detail ? `${name} (${detail})` : name;
}

// Broad-category display casing for the Offences tree (see the conviction
// detail page) -- just the name; the archive-wide conviction count next to
// it is rendered separately (matching the People lists' "mentioned in N
// other records" pattern: plain muted text beside the link, not baked into
// the link's own label).
export function formatOffenceCategory(categoryName: string): string {
  return categoryName.toUpperCase();
}
