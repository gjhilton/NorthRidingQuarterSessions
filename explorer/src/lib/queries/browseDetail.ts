// Server-only (better-sqlite3, build-time) -- the `server-only` import below
// makes this a build error, not a convention to remember, if a 'use client'
// component ever pulls it in. See browseList.ts for the client-safe half of
// what used to be a single browse.ts.
import "server-only";
import { getDb } from "@/lib/db";
import { referenceToSlug } from "@/lib/referenceSlug";
import { getPlaceAncestry } from "@/lib/queries/locationTree";
import {
  DEFENDANT_ROLE,
  personKeyExpr,
  personOccupationsExpr,
  personNameColumnsSql,
} from "@/lib/queries/personFragments";

export interface ConvictionDetail {
  id: number;
  // Aliased from sc.record_number -- see browseList.ts's BrowseRow for why
  // the exposed field name stays reference_number.
  reference_number: string;
  conviction_date: string | null;
  // conviction_date_raw dropped entirely in v3 (not just renamed) -- a
  // conviction is always a single precise court-sitting day, and
  // raw_record already preserves the full original text. No text fallback
  // for conviction_date display any more; see formatDate's callers below.
  offence_date: string | null;
  offence_date_raw: string | null;
  offence_time: string | null;
  charge_description: string;
  raw_record: string;
  court_town_name: string | null;
  petty_sessional_division_name: string | null;
  // sentencing, archive_url, extraction_confidence, uncertain_fields,
  // monetary_value_raw, game_species, correction_note, of_especial_interest,
  // offence_day_of_week: all dropped in v3 -- see
  // data-loader/qsrecords/models/core.py's SummaryConviction docstring.
}

// Shared shape for both defendant and involved-person rows now that they
// come from the same `person` table -- DetailDefendant/DetailInvolvedPerson
// below are thin extensions of this, matching the old two-interface shape
// callers (the conviction detail page) already expect.
export interface DetailPerson {
  id: number;
  name_key: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  name_postfix: string | null;
  title: string | null;
  // Comma-joined if more than one (max 2 per person) -- see
  // personFragments.ts's NameRow/formatNameRow, which this matches.
  alias: string | null;
  sex: string | null;
  // Comma-joined -- a person can hold more than one occupation at once now
  // (person_occupation is a real join table, not a flat column). See
  // personFragments.ts's personOccupationsExpr.
  occupation: string | null;
  location_name: string | null;
}

export type DetailDefendant = DetailPerson;

export interface DetailInvolvedPerson extends DetailPerson {
  role: string;
  is_police: boolean;
}

export interface RelatedConviction {
  id: number;
  reference_number: string;
  conviction_date: string | null;
  charge_description: string;
  // Explains why this pair was linked -- see qsrecords.related_convictions.
  // Not a claim of certainty, just what matched (same defendant + date, or
  // same date/street/charge wording with a different defendant).
  note: string | null;
}

// The URL key for a conviction detail page is a slug derived from its
// record_number, not the internal auto-increment id -- ids are extraction
// order, not a stable public identifier, and could shift on a future
// re-import. Built once per build process and cached, since it's looked up
// once per static page (thousands of them).
let slugToIdCache: Map<string, number> | null = null;

function slugToIdMap(): Map<string, number> {
  if (!slugToIdCache) {
    const rows = getDb()
      .prepare(`SELECT id, record_number AS reference_number FROM summary_conviction`)
      .all() as {
      id: number;
      reference_number: string;
    }[];
    slugToIdCache = new Map(rows.map((r) => [referenceToSlug(r.reference_number), r.id]));
  }
  return slugToIdCache;
}

export function listConvictionSlugs(): string[] {
  return [...slugToIdMap().keys()];
}

export function getConvictionIdBySlug(slug: string): number | undefined {
  return slugToIdMap().get(slug);
}

export interface AdjacentConvictionSlugs {
  prevSlug: string | null;
  nextSlug: string | null;
}

// Stepping by id, not by any date/reference ordering -- ids reflect
// extraction order, not a claim about chronological or archival sequence,
// but they're the one ordering every record always has. Returns slugs
// (not ids) since that's what a Prev/Next link actually needs.
export function getAdjacentConvictionSlugs(id: number): AdjacentConvictionSlugs {
  const prevRow = getDb()
    .prepare(
      `SELECT record_number AS reference_number FROM summary_conviction WHERE id = (SELECT MAX(id) FROM summary_conviction WHERE id < ?)`
    )
    .get(id) as { reference_number: string } | undefined;
  const nextRow = getDb()
    .prepare(
      `SELECT record_number AS reference_number FROM summary_conviction WHERE id = (SELECT MIN(id) FROM summary_conviction WHERE id > ?)`
    )
    .get(id) as { reference_number: string } | undefined;
  return {
    prevSlug: prevRow ? referenceToSlug(prevRow.reference_number) : null,
    nextSlug: nextRow ? referenceToSlug(nextRow.reference_number) : null,
  };
}

export interface ConvictionPosition {
  position: number;
  total: number;
}

// The whole-dataset "Record N of M" shown when a detail page is opened
// without arriving from a filtered/search listing -- prerendered at build
// time, same id ordering as getAdjacentConvictionSlugs. Superseded
// client-side by ConvictionNav whenever the URL carries filter/search state.
export function getConvictionPosition(id: number): ConvictionPosition {
  const { position } = getDb()
    .prepare(`SELECT COUNT(*) AS position FROM summary_conviction WHERE id <= ?`)
    .get(id) as { position: number };
  const { total } = getDb().prepare(`SELECT COUNT(*) AS total FROM summary_conviction`).get() as {
    total: number;
  };
  return { position, total };
}

export function getConvictionDetail(id: number): ConvictionDetail | undefined {
  return getDb()
    .prepare(
      `
      SELECT
        sc.id, sc.record_number AS reference_number, sc.conviction_date,
        sc.offence_date, sc.offence_date_raw, sc.offence_time,
        sc.charge_description, sc.raw_record,
        (
          SELECT loc.name FROM summary_conviction_location scl
          JOIN location loc ON loc.id = scl.location_id
          WHERE scl.summary_conviction_id = sc.id AND scl.role = 'court location'
          LIMIT 1
        ) AS court_town_name,
        (
          SELECT loc.name FROM summary_conviction_location scl
          JOIN location loc ON loc.id = scl.location_id
          WHERE scl.summary_conviction_id = sc.id AND scl.role = 'petty sessional division'
          LIMIT 1
        ) AS petty_sessional_division_name
      FROM summary_conviction sc
      WHERE sc.id = ?
      `
    )
    .get(id) as ConvictionDetail | undefined;
}

export interface ConvictionLocation {
  // Root-to-leaf chain (see locationTree.ts's getPlaceAncestry) -- the
  // conviction's own offence location is the last entry; everything before
  // it is that place's ancestry, for a breadcrumb matching the one
  // /locations/[id] itself renders.
  ancestry: { id: number; name: string }[];
  // Archive-wide total convictions at this exact leaf place.
  count: number;
}

export function getConvictionLocation(convictionId: number): ConvictionLocation | undefined {
  // A conviction may in theory have more than one 'location of offence' row
  // now (SummaryConvictionLocation isn't capped at one) -- picks the first
  // for this single breadcrumb display, same simplification browseList.ts
  // makes for its own offence-location sort/display expression.
  const row = getDb()
    .prepare(
      `SELECT location_id AS id FROM summary_conviction_location WHERE summary_conviction_id = ? AND role = 'location of offence' LIMIT 1`
    )
    .get(convictionId) as { id: number } | undefined;
  if (!row) return undefined;

  const ancestry = getPlaceAncestry(row.id);
  if (ancestry.length === 0) return undefined;

  const { count } = getDb()
    .prepare(
      `SELECT COUNT(DISTINCT summary_conviction_id) AS count FROM summary_conviction_location WHERE location_id = ? AND role = 'location of offence'`
    )
    .get(row.id) as { count: number };

  return { ancestry, count };
}

export interface ConvictionOffence {
  id: number;
  type_name: string;
  // Archive-wide total convictions tagged with this specific offence type.
  type_count: number;
  category_name: string;
  // Archive-wide total convictions tagged with any type in this category.
  category_count: number;
}

export function getConvictionOffences(convictionId: number): ConvictionOffence[] {
  return getDb()
    .prepare(
      `
      SELECT
        ct.id, ct.name AS type_name, parent.name AS category_name,
        (
          SELECT COUNT(DISTINCT sct2.summary_conviction_id)
          FROM summary_conviction_crime_type sct2
          WHERE sct2.crime_type_id = ct.id
        ) AS type_count,
        (
          SELECT COUNT(DISTINCT sct3.summary_conviction_id)
          FROM summary_conviction_crime_type sct3
          JOIN crime_type ct3 ON ct3.id = sct3.crime_type_id
          WHERE ct3.parent_id = parent.id
        ) AS category_count
      FROM summary_conviction_crime_type sct
      JOIN crime_type ct ON ct.id = sct.crime_type_id
      JOIN crime_type parent ON parent.id = ct.parent_id
      WHERE sct.summary_conviction_id = ?
      ORDER BY ct.name
      `
    )
    .all(convictionId) as ConvictionOffence[];
}

// How many *other* convictions each of the given name_keys is mentioned in
// (in any role -- defendant, victim, informant, ...), archive-wide --
// name_key is a coarse "every mention of this name" index, not a
// per-individual dedup key (two different real people can share one), so
// this counts mentions of the name, same as the People pages' own mention
// counts. Batched into one query per page render rather than one per
// person. Collapses the old defendant/involved_persons UNION ALL now that
// both live in one summary_conviction_person junction table.
export function getOtherConvictionCounts(
  nameKeys: string[],
  excludeConvictionId: number
): Map<string, number> {
  if (nameKeys.length === 0) return new Map();
  const placeholders = nameKeys.map(() => "?").join(",");
  const rows = getDb()
    .prepare(
      `
      SELECT ${personKeyExpr("p")} AS name_key, COUNT(DISTINCT scp.summary_conviction_id) AS count
      FROM summary_conviction_person scp
      JOIN person p ON p.id = scp.person_id
      WHERE ${personKeyExpr("p")} IN (${placeholders}) AND scp.summary_conviction_id != ?
      GROUP BY name_key
      `
    )
    .all(...nameKeys, excludeConvictionId) as { name_key: string; count: number }[];
  return new Map(rows.map((r) => [r.name_key, r.count]));
}

export function getConvictionDefendants(convictionId: number): DetailDefendant[] {
  return getDb()
    .prepare(
      `
      SELECT
        p.id, ${personKeyExpr("p")} AS name_key,
        ${personNameColumnsSql("p")}, p.sex,
        ${personOccupationsExpr("p")} AS occupation,
        loc.name AS location_name
      FROM summary_conviction_person scp
      JOIN person p ON p.id = scp.person_id
      LEFT JOIN location loc ON loc.id = p.home_location_id
      WHERE scp.summary_conviction_id = ? AND scp.role = ?
      `
    )
    .all(convictionId, DEFENDANT_ROLE) as DetailDefendant[];
}

export function getConvictionInvolvedPersons(convictionId: number): DetailInvolvedPerson[] {
  const rows = getDb()
    .prepare(
      `
      SELECT
        p.id, ${personKeyExpr("p")} AS name_key,
        ${personNameColumnsSql("p")}, p.sex,
        ${personOccupationsExpr("p")} AS occupation,
        loc.name AS location_name,
        scp.role,
        EXISTS (
          SELECT 1 FROM person_occupation po
          JOIN occupation o ON o.id = po.occupation_id
          WHERE po.person_id = p.id AND o.is_police = 1
        ) AS is_police
      FROM summary_conviction_person scp
      JOIN person p ON p.id = scp.person_id
      LEFT JOIN location loc ON loc.id = p.home_location_id
      WHERE scp.summary_conviction_id = ? AND scp.role != ?
      `
    )
    .all(convictionId, DEFENDANT_ROLE) as (Omit<DetailInvolvedPerson, "is_police"> & { is_police: number })[];

  return rows.map((row) => ({ ...row, is_police: Boolean(row.is_police) }));
}

export function getRelatedConvictions(convictionId: number): RelatedConviction[] {
  return getDb()
    .prepare(
      `
      SELECT
        sc.id, sc.record_number AS reference_number, sc.conviction_date,
        sc.charge_description, rc.note
      FROM related_conviction rc
      JOIN summary_conviction sc
        ON sc.id = CASE WHEN rc.summary_conviction_id_a = @id
                         THEN rc.summary_conviction_id_b
                         ELSE rc.summary_conviction_id_a END
      WHERE rc.summary_conviction_id_a = @id OR rc.summary_conviction_id_b = @id
      ORDER BY sc.conviction_date IS NULL, sc.conviction_date
      `
    )
    .all({ id: convictionId }) as RelatedConviction[];
}
