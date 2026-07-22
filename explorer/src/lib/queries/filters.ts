import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";

export interface Option {
  id: number;
  name: string;
}

// Bounds the From/To date pickers to dates that actually occur in the
// data (1808-12-14..1889-09-30) -- native date inputs don't otherwise stop
// someone picking, say, 1750 or 2030 and getting a silently-empty result.
export function getOffenceDateRange(): { min: string | null; max: string | null } {
  return getDb()
    .prepare(`SELECT MIN(offence_date) AS min, MAX(offence_date) AS max FROM summary_conviction`)
    .get() as { min: string | null; max: string | null };
}

// Same idea as getOffenceDateRange(), for the separate Sentence date
// fieldset (1809-01-08..1889-10-01) -- offence and conviction dates aren't
// the same range (a case can be tried into the following year).
export function getConvictionDateRange(): { min: string | null; max: string | null } {
  return getDb()
    .prepare(`SELECT MIN(conviction_date) AS min, MAX(conviction_date) AS max FROM summary_conviction`)
    .get() as { min: string | null; max: string | null };
}

// Every distinct number of defendants a conviction actually has (1..6 in
// practice -- the overwhelming majority are 1) -- drives the Defendants
// count filter's options.
export function listDefendantCounts(): number[] {
  return getDb()
    .prepare(
      `
      SELECT DISTINCT n FROM (
        SELECT COUNT(scd.defendant_id) AS n
        FROM summary_conviction sc
        LEFT JOIN summary_conviction_defendant scd ON scd.summary_conviction_id = sc.id
        GROUP BY sc.id
      )
      WHERE n > 0
      ORDER BY n
      `
    )
    .all()
    .map((r) => (r as { n: number }).n);
}

// The town table also holds ~90 street/yard-level addresses that were
// miscategorised as towns during extraction (e.g. "argument's yard, whitby")
// -- none of those are ever an offence location on any conviction, so
// scoping to towns actually used as one filters them out for free, rather
// than needing a separate cleanup pass before the dropdown is usable.
// Offence location specifically, not court location -- see browseList.ts's
// townId filter, which this list needs to stay in sync with.
export function listTowns(): Option[] {
  return getDb()
    .prepare(
      `
      SELECT DISTINCT t.id, t.name
      FROM town t
      WHERE t.id IN (
        SELECT offence_location_town_id FROM summary_conviction WHERE offence_location_town_id IS NOT NULL
      )
      ORDER BY t.name
      `
    )
    .all() as Option[];
}

export interface StreetOption extends Option {
  townId: number;
}

// Every street actually used as an offence location, tagged with its town
// so the UI can filter this one list client-side per selected town rather
// than round-tripping for each town change. Scoped to actual usage for the
// same reason as listTowns() above.
export function listOffenceStreets(): StreetOption[] {
  return getDb()
    .prepare(
      `
      SELECT DISTINCT s.id, s.name, s.town_id AS townId
      FROM street s
      WHERE s.id IN (
        SELECT offence_location_street_id FROM summary_conviction WHERE offence_location_street_id IS NOT NULL
      )
      ORDER BY s.name
      `
    )
    .all() as StreetOption[];
}

// Curated sort_order (e.g. "Drink & Public Order" first), not alphabetical
// -- see data-loader/qsrecords/offence_types.py's OFFENCE_TAXONOMY. All 17
// categories have at least one real conviction (checked directly), so
// unlike listTowns()/listOffenceStreets() there's no unused-junk case to
// filter out here.
export function listOffenceCategories(): Option[] {
  return getDb()
    .prepare(`SELECT id, name FROM offence_category ORDER BY sort_order`)
    .all()
    .map((r) => {
      const row = r as Option;
      return { id: row.id, name: titleCase(row.name) };
    });
}

export interface OffenceTypeOption extends Option {
  categoryId: number | null;
}

// Flat, tagged with categoryId, so the UI can filter this one list
// client-side per selected category the same way listOffenceStreets() does
// for streets-per-town -- see data-loader/qsrecords/offence_types.py's
// OFFENCE_TAXONOMY for how the 55 leaves here were consolidated from an
// earlier 91-near-duplicate-string vocabulary.
export function listOffenceTypes(): OffenceTypeOption[] {
  return getDb()
    .prepare(
      `
      SELECT ot.id AS id, ot.name AS name, ot.category_id AS categoryId
      FROM offence_type ot
      LEFT JOIN offence_category oc ON oc.id = ot.category_id
      ORDER BY COALESCE(oc.sort_order, 999999), ot.name
      `
    )
    .all() as OffenceTypeOption[];
}
