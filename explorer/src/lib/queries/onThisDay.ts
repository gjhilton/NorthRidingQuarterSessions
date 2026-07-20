// Client-safe: no import of @/lib/db (better-sqlite3). Deliberately client-
// side, unlike almost everything else in this app -- "on this day" depends
// on the visitor's current date, which a static site built once and
// published can't know at build time. Computed against the visitor's local
// date (not the server's/build's) so it's actually correct for them.
import type { DbLike } from "@/lib/dbTypes";

export interface OnThisDayRow {
  id: number;
  reference_number: string;
  offence_date: string | null;
  conviction_date: string | null;
  charge_description: string;
}

// "MM-DD", e.g. "01-12" -- matches SQLite's strftime('%m-%d', ...) output
// for a date stored as 'YYYY-MM-DD'.
export function todayMonthDay(date: Date = new Date()): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

export function onThisDay(db: DbLike, monthDay: string): OnThisDayRow[] {
  return db
    .prepare(
      `
      SELECT id, reference_number, offence_date, conviction_date, charge_description
      FROM summary_conviction
      WHERE strftime('%m-%d', offence_date) = @monthDay
         OR strftime('%m-%d', conviction_date) = @monthDay
      ORDER BY COALESCE(offence_date, conviction_date)
      `
    )
    .all({ monthDay }) as OnThisDayRow[];
}
