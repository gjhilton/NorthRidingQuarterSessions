// Display-only: reformats a stored ISO "YYYY-MM-DD" date into dd/mm/yyyy
// (e.g. "18/06/1864") -- the site-wide date display format. Everything that
// sorts/filters/compares dates keeps using the raw ISO string (SQLite
// ORDER BY, <input type="date">, julianday() math, OnThisDay's strftime
// matching) -- only call this at the point of display.
export function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}
