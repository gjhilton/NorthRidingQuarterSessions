// Server-only (better-sqlite3, build-time) -- the `server-only` import below
// makes this a build error, not a convention to remember, if a 'use client'
// component ever pulls it in. See browseList.ts for the client-safe half of
// what used to be a single browse.ts.
import "server-only";
import { getDb, selectColumn } from "@/lib/db";

export interface ConvictionDetail {
  id: number;
  reference_number: string;
  conviction_date: string | null;
  conviction_date_raw: string;
  offence_date: string | null;
  offence_date_raw: string | null;
  offence_day_of_week: string | null;
  offence_time: string | null;
  offence_type_names: string[];
  charge_description: string;
  sentencing: string | null;
  raw_record: string;
  archive_url: string;
  offence_town_name: string | null;
  offence_street_name: string | null;
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
  first_name: string | null;
  last_name: string | null;
  sex: string | null;
  age: number | null;
  marital_status: string | null;
  relationship_type: string | null;
  related_to_name: string | null;
  occupation: string | null;
  relationships_and_details: string | null;
  prior_convictions: string | null;
  town_name: string | null;
  street_name: string | null;
  aliases: string[];
}

export interface DetailInvolvedPerson {
  id: number;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  marital_status: string | null;
  relationship_type: string | null;
  related_to_name: string | null;
  occupation: string | null;
  relationships_and_details: string | null;
  role: string | null;
  town_name: string | null;
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

export function listConvictionIds(): number[] {
  return selectColumn<number>(`SELECT id FROM summary_conviction`, "id");
}

export interface AdjacentConvictionIds {
  prevId: number | null;
  nextId: number | null;
}

// Stepping by id, not by any date/reference ordering -- ids reflect
// extraction order, not a claim about chronological or archival sequence,
// but they're the one ordering every record always has.
export function getAdjacentConvictionIds(id: number): AdjacentConvictionIds {
  const { prevId } = getDb()
    .prepare(`SELECT MAX(id) AS prevId FROM summary_conviction WHERE id < ?`)
    .get(id) as { prevId: number | null };
  const { nextId } = getDb()
    .prepare(`SELECT MIN(id) AS nextId FROM summary_conviction WHERE id > ?`)
    .get(id) as { nextId: number | null };
  return { prevId, nextId };
}

export function getConvictionDetail(id: number): ConvictionDetail | undefined {
  const row = getDb()
    .prepare(
      `
      SELECT
        sc.id, sc.reference_number, sc.conviction_date, sc.conviction_date_raw,
        sc.offence_date, sc.offence_date_raw, sc.offence_day_of_week, sc.offence_time,
        (
          SELECT GROUP_CONCAT(ot.name, char(31))
          FROM summary_conviction_offence_type scot
          JOIN offence_type ot ON ot.id = scot.offence_type_id
          WHERE scot.summary_conviction_id = sc.id
        ) AS offence_type_names_concat,
        sc.charge_description, sc.sentencing, sc.raw_record, sc.archive_url,
        ot_town.name AS offence_town_name,
        st.name AS offence_street_name,
        court_town.name AS court_town_name,
        sc.extraction_confidence, sc.uncertain_fields,
        psd.name AS petty_sessional_division_name,
        sc.monetary_value_raw, sc.game_species, sc.correction_note,
        sc.of_especial_interest
      FROM summary_conviction sc
      LEFT JOIN town ot_town ON ot_town.id = sc.offence_location_town_id
      LEFT JOIN street st ON st.id = sc.offence_location_street_id
      LEFT JOIN town court_town ON court_town.id = sc.court_location_town_id
      LEFT JOIN petty_sessional_division psd ON psd.id = sc.petty_sessional_division_id
      WHERE sc.id = ?
      `
    )
    .get(id) as (Omit<ConvictionDetail, "offence_type_names" | "of_especial_interest"> & {
    offence_type_names_concat: string | null;
    of_especial_interest: number;
  }) | undefined;

  if (!row) return undefined;
  const { offence_type_names_concat, of_especial_interest, ...rest } = row;
  return {
    ...rest,
    offence_type_names: offence_type_names_concat ? offence_type_names_concat.split("\x1f") : [],
    of_especial_interest: Boolean(of_especial_interest),
  };
}

export function getConvictionDefendants(convictionId: number): DetailDefendant[] {
  const defendants = getDb()
    .prepare(
      `
      SELECT
        d.id, d.first_name, d.last_name, d.sex,
        d.age, d.marital_status, d.relationship_type, d.related_to_name,
        d.occupation,
        d.relationships_and_details, d.prior_convictions,
        t.name AS town_name, st.name AS street_name,
        (
          SELECT GROUP_CONCAT(a.alias_name, char(31))
          FROM alias a
          WHERE a.defendant_id = d.id
        ) AS aliases_concat
      FROM summary_conviction_defendant scd
      JOIN defendant d ON d.id = scd.defendant_id
      LEFT JOIN town t ON t.id = d.town_id
      LEFT JOIN street st ON st.id = d.street_id
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
        p.id, p.first_name, p.last_name,
        p.age, p.marital_status, p.relationship_type, p.related_to_name,
        p.occupation,
        p.relationships_and_details, ip.role,
        t.name AS town_name
      FROM involved_persons ip
      JOIN person p ON p.id = ip.person_id
      LEFT JOIN town t ON t.id = p.town_id
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
