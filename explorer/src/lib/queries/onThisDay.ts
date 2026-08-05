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
  raw_record: string;
}

// "MM-DD", e.g. "01-12" -- matches SQLite's strftime('%m-%d', ...) output
// for a date stored as 'YYYY-MM-DD'.
function todayMonthDay(date: Date = new Date()): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

// A single record for a given calendar day, preferring a match on the date
// of the offence (the crime itself) over the date of conviction (sentencing)
// -- offence_date alone already covers all 366 possible days across the
// corpus, so this only falls back to conviction_date on the rare day that
// has offence-date gaps but a conviction-date match.
function onThisDayOne(db: DbLike, monthDay: string): OnThisDayRow | null {
  const byOffence = db
    .prepare(
      `
      SELECT id, record_number AS reference_number, offence_date, conviction_date, raw_record
      FROM summary_conviction
      WHERE strftime('%m-%d', offence_date) = @monthDay
      ORDER BY offence_date
      LIMIT 1
      `
    )
    .get({ monthDay }) as OnThisDayRow | undefined;
  if (byOffence) return byOffence;

  const byConviction = db
    .prepare(
      `
      SELECT id, record_number AS reference_number, offence_date, conviction_date, raw_record
      FROM summary_conviction
      WHERE strftime('%m-%d', conviction_date) = @monthDay
      ORDER BY conviction_date
      LIMIT 1
      `
    )
    .get({ monthDay }) as OnThisDayRow | undefined;
  return byConviction ?? null;
}

export interface OnThisDayResult {
  // Days from "today" the matched row actually falls on -- 0 means an exact
  // match, otherwise the nearest day (in either direction) that has one.
  offsetDays: number;
  row: OnThisDayRow;
}

const MAX_OFFSET_DAYS = 30;

// A match on today's exact date is close to guaranteed (offence_date alone
// covers all 366 possible days), but widen outward a day at a time (checking
// both directions before going further) as a safety net, capped so a
// genuinely sparse patch of the year doesn't search forever.
export function onThisDayNearest(db: DbLike, today: Date): OnThisDayResult | null {
  for (let offset = 0; offset <= MAX_OFFSET_DAYS; offset++) {
    for (const signedOffset of offset === 0 ? [0] : [offset, -offset]) {
      const d = new Date(today);
      d.setDate(d.getDate() + signedOffset);
      const row = onThisDayOne(db, todayMonthDay(d));
      if (row) {
        return { offsetDays: signedOffset, row };
      }
    }
  }
  return null;
}
