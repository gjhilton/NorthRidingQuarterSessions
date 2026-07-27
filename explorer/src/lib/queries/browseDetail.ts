// Server-only (better-sqlite3, build-time) -- the `server-only` import below
// makes this a build error, not a convention to remember, if a 'use client'
// component ever pulls it in. See browseList.ts for the client-safe half of
// what used to be a single browse.ts.
import "server-only";
import { getDb } from "@/lib/db";
import { referenceToSlug } from "@/lib/referenceSlug";
import { getPlaceAncestry } from "@/lib/queries/locationTree";

export interface ConvictionDetail {
  id: number;
  reference_number: string;
  conviction_date: string | null;
  conviction_date_raw: string;
  offence_date: string | null;
  offence_date_raw: string | null;
  offence_day_of_week: string | null;
  offence_time: string | null;
  charge_description: string;
  sentencing: string | null;
  raw_record: string;
  archive_url: string;
  court_town_name: string | null;
  // Self-reported by the LLM at extraction time -- null for records
  // extracted before this was captured, not a sign of anything wrong.
  extraction_confidence: string | null;
  uncertain_fields: string | null; // comma-separated field names, or null
  // Added partway through extraction -- null on records extracted before
  // these fields existed, and null on any record where the source text
  // simply didn't state them (most records, for monetary_value_raw and
  // game_species specifically -- see About).
  petty_sessional_division_name: string | null;
  monetary_value_raw: string | null;
  game_species: string | null;
  // Set only when a field was deliberately extracted *against* a literal
  // reading of raw_record, because the source text itself was judged to
  // contain an error -- see About. Null in the overwhelming majority of
  // records.
  correction_note: string | null;
  // Self-reported by the LLM/human extractor -- flags unusually colourful or
  // notable cases. False for the overwhelming majority of records.
  of_especial_interest: boolean;
}

export interface DetailDefendant {
  id: number;
  name_key: string;
  first_name: string | null;
  last_name: string | null;
  name_qualifier: string | null;
  sex: string | null;
  age: number | null;
  marital_status: string | null;
  relationship_type: string | null;
  related_to_name: string | null;
  occupation: string | null;
  relationships_and_details: string | null;
  prior_convictions: string | null;
  location_name: string | null;
  aliases: string[];
}

export interface DetailInvolvedPerson {
  id: number;
  name_key: string;
  first_name: string | null;
  last_name: string | null;
  name_qualifier: string | null;
  age: number | null;
  marital_status: string | null;
  relationship_type: string | null;
  related_to_name: string | null;
  occupation: string | null;
  relationships_and_details: string | null;
  role: string | null;
  location_name: string | null;
}

export interface RelatedConviction {
  id: number;
  reference_number: string;
  conviction_date: string | null;
  conviction_date_raw: string;
  charge_description: string;
  // Explains why this pair was linked -- see qsrecords.related_convictions.
  // Not a claim of certainty, just what matched (same defendant + date, or
  // same date/street/charge wording with a different defendant).
  note: string | null;
}

// The URL key for a conviction detail page is a slug derived from its
// reference_number, not the internal auto-increment id -- ids are extraction
// order, not a stable public identifier, and could shift on a future
// re-import. Verified unique across the whole table before this was
// introduced (see fix_reference_number_mismatches.py for the two rows whose
// reference_number had to be corrected first). Built once per build process
// and cached, since it's looked up once per static page (6,231 of them).
let slugToIdCache: Map<string, number> | null = null;

function slugToIdMap(): Map<string, number> {
  if (!slugToIdCache) {
    const rows = getDb().prepare(`SELECT id, reference_number FROM summary_conviction`).all() as {
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
      `SELECT reference_number FROM summary_conviction WHERE id = (SELECT MAX(id) FROM summary_conviction WHERE id < ?)`
    )
    .get(id) as { reference_number: string } | undefined;
  const nextRow = getDb()
    .prepare(
      `SELECT reference_number FROM summary_conviction WHERE id = (SELECT MIN(id) FROM summary_conviction WHERE id > ?)`
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
  const row = getDb()
    .prepare(
      `
      SELECT
        sc.id, sc.reference_number, sc.conviction_date, sc.conviction_date_raw,
        sc.offence_date, sc.offence_date_raw, sc.offence_day_of_week, sc.offence_time,
        sc.charge_description, sc.sentencing, sc.raw_record, sc.archive_url,
        court_place.name AS court_town_name,
        sc.extraction_confidence, sc.uncertain_fields,
        psd.name AS petty_sessional_division_name,
        sc.monetary_value_raw, sc.game_species, sc.correction_note,
        sc.of_especial_interest
      FROM summary_conviction sc
      LEFT JOIN place court_place ON court_place.id = sc.court_location_id
      LEFT JOIN petty_sessional_division psd ON psd.id = sc.petty_sessional_division_id
      WHERE sc.id = ?
      `
    )
    .get(id) as (Omit<ConvictionDetail, "of_especial_interest"> & {
    of_especial_interest: number;
  }) | undefined;

  if (!row) return undefined;
  const { of_especial_interest, ...rest } = row;
  return {
    ...rest,
    of_especial_interest: Boolean(of_especial_interest),
  };
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
  const row = getDb()
    .prepare(`SELECT offence_location_id AS id FROM summary_conviction WHERE id = ?`)
    .get(convictionId) as { id: number | null } | undefined;
  if (!row?.id) return undefined;

  const ancestry = getPlaceAncestry(row.id);
  if (ancestry.length === 0) return undefined;

  const { count } = getDb()
    .prepare(`SELECT COUNT(*) AS count FROM summary_conviction WHERE offence_location_id = ?`)
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
        ot.id, ot.name AS type_name, oc.name AS category_name,
        (
          SELECT COUNT(DISTINCT scot2.summary_conviction_id)
          FROM summary_conviction_offence_type scot2
          WHERE scot2.offence_type_id = ot.id
        ) AS type_count,
        (
          SELECT COUNT(DISTINCT scot3.summary_conviction_id)
          FROM summary_conviction_offence_type scot3
          JOIN offence_type ot3 ON ot3.id = scot3.offence_type_id
          WHERE ot3.category_id = oc.id
        ) AS category_count
      FROM summary_conviction_offence_type scot
      JOIN offence_type ot ON ot.id = scot.offence_type_id
      JOIN offence_category oc ON oc.id = ot.category_id
      WHERE scot.summary_conviction_id = ?
      ORDER BY ot.name
      `
    )
    .all(convictionId) as ConvictionOffence[];
}

// How many *other* convictions each of the given name_keys is mentioned in
// (as either a defendant or an involved person), archive-wide -- name_key
// is a coarse "every mention of this name" index, not a per-individual
// dedup key (two different real people can share one), so this counts
// mentions of the name, same as the People pages' own mention counts.
// Batched into one query per page render rather than one per person.
export function getOtherConvictionCounts(
  nameKeys: string[],
  excludeConvictionId: number
): Map<string, number> {
  if (nameKeys.length === 0) return new Map();
  const placeholders = nameKeys.map(() => "?").join(",");
  const rows = getDb()
    .prepare(
      `
      SELECT name_key, COUNT(DISTINCT summary_conviction_id) AS count
      FROM (
        SELECT d.name_key AS name_key, scd.summary_conviction_id AS summary_conviction_id
        FROM defendant d
        JOIN summary_conviction_defendant scd ON scd.defendant_id = d.id
        WHERE d.name_key IN (${placeholders})
        UNION ALL
        SELECT p.name_key AS name_key, ip.summary_conviction_id AS summary_conviction_id
        FROM person p
        JOIN involved_persons ip ON ip.person_id = p.id
        WHERE p.name_key IN (${placeholders})
      )
      WHERE summary_conviction_id != ?
      GROUP BY name_key
      `
    )
    .all(...nameKeys, ...nameKeys, excludeConvictionId) as { name_key: string; count: number }[];
  return new Map(rows.map((r) => [r.name_key, r.count]));
}

export function getConvictionDefendants(convictionId: number): DetailDefendant[] {
  const defendants = getDb()
    .prepare(
      `
      SELECT
        d.id, d.name_key, d.first_name, d.last_name, d.name_qualifier, d.sex,
        d.age, d.marital_status, d.relationship_type, d.related_to_name,
        d.occupation,
        d.relationships_and_details, d.prior_convictions,
        pl.name AS location_name,
        (
          SELECT GROUP_CONCAT(a.alias_name, char(31))
          FROM alias a
          WHERE a.defendant_id = d.id
        ) AS aliases_concat
      FROM summary_conviction_defendant scd
      JOIN defendant d ON d.id = scd.defendant_id
      LEFT JOIN place pl ON pl.id = d.location_id
      WHERE scd.summary_conviction_id = ?
      `
    )
    .all(convictionId) as (Omit<DetailDefendant, "aliases"> & { aliases_concat: string | null })[];

  return defendants.map(({ aliases_concat, ...d }) => ({
    ...d,
    aliases: aliases_concat ? aliases_concat.split("\x1f") : [],
  }));
}

export function getConvictionInvolvedPersons(convictionId: number): DetailInvolvedPerson[] {
  return getDb()
    .prepare(
      `
      SELECT
        p.id, p.name_key, p.first_name, p.last_name, p.name_qualifier,
        p.age, p.marital_status, p.relationship_type, p.related_to_name,
        p.occupation,
        p.relationships_and_details, ip.role,
        pl.name AS location_name
      FROM involved_persons ip
      JOIN person p ON p.id = ip.person_id
      LEFT JOIN place pl ON pl.id = p.location_id
      WHERE ip.summary_conviction_id = ?
      `
    )
    .all(convictionId) as DetailInvolvedPerson[];
}

export function getRelatedConvictions(convictionId: number): RelatedConviction[] {
  return getDb()
    .prepare(
      `
      SELECT
        sc.id, sc.reference_number, sc.conviction_date, sc.conviction_date_raw,
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
