import "server-only";
import { getDb } from "@/lib/db";
import { levenshtein } from "@/lib/levenshtein";

// Mirrors data-loader/qsrecords/reports.py -- same queries, TS side, read-only.

export interface RepeatedName {
  name_key: string;
  count: number;
}

export interface CaseRef {
  reference_number: string;
  conviction_date: string | null;
}

export function repeatedDefendantNames(minOccurrences = 2): RepeatedName[] {
  return getDb()
    .prepare(
      `
      SELECT name_key, COUNT(*) AS count
      FROM defendant
      GROUP BY name_key
      HAVING COUNT(*) >= ?
      ORDER BY count DESC
      `
    )
    .all(minOccurrences) as RepeatedName[];
}

export function repeatedPersonNames(minOccurrences = 2): RepeatedName[] {
  return getDb()
    .prepare(
      `
      SELECT name_key, COUNT(*) AS count
      FROM person
      GROUP BY name_key
      HAVING COUNT(*) >= ?
      ORDER BY count DESC
      `
    )
    .all(minOccurrences) as RepeatedName[];
}

export function defendantCaseReferences(nameKey: string): CaseRef[] {
  return getDb()
    .prepare(
      `
      SELECT sc.reference_number, sc.conviction_date
      FROM summary_conviction sc
      JOIN summary_conviction_defendant scd ON scd.summary_conviction_id = sc.id
      JOIN defendant d ON d.id = scd.defendant_id
      WHERE d.name_key = ?
      ORDER BY sc.conviction_date
      `
    )
    .all(nameKey) as CaseRef[];
}

export function personCaseReferences(nameKey: string): CaseRef[] {
  return getDb()
    .prepare(
      `
      SELECT sc.reference_number, sc.conviction_date
      FROM summary_conviction sc
      JOIN involved_persons ip ON ip.summary_conviction_id = sc.id
      JOIN person p ON p.id = ip.person_id
      WHERE p.name_key = ?
      ORDER BY sc.conviction_date
      `
    )
    .all(nameKey) as CaseRef[];
}

export interface UnreviewedOffenceType {
  name: string;
  count: number;
}

export function unreviewedOffenceTypes(): UnreviewedOffenceType[] {
  return getDb()
    .prepare(
      `
      SELECT ot.name AS name, COUNT(DISTINCT sc.id) AS count
      FROM offence_type ot
      LEFT JOIN summary_conviction_offence_type scot ON scot.offence_type_id = ot.id
      LEFT JOIN summary_conviction sc ON sc.id = scot.summary_conviction_id
      WHERE ot.is_seeded = 0
      GROUP BY ot.name
      ORDER BY count DESC
      `
    )
    .all() as UnreviewedOffenceType[];
}

export interface StatusCount {
  status: string;
  count: number;
}

export function rawCaseStatusBreakdown(): StatusCount[] {
  return getDb()
    .prepare(`SELECT status, COUNT(*) AS count FROM raw_case GROUP BY status ORDER BY count DESC`)
    .all() as StatusCount[];
}

export interface ExtractionFailure {
  id: number;
  reference_number: string;
  title: string;
  provider: string;
  model: string;
  attempted_at: string;
  error_message: string | null;
}

export function recentExtractionFailures(limit = 25): ExtractionFailure[] {
  return getDb()
    .prepare(
      `
      SELECT ea.id, rc.reference_number, rc.title, ea.provider, ea.model, ea.attempted_at, ea.error_message
      FROM extraction_attempt ea
      JOIN raw_case rc ON rc.id = ea.raw_case_id
      WHERE ea.success = 0
      ORDER BY ea.attempted_at DESC
      LIMIT ?
      `
    )
    .all(limit) as ExtractionFailure[];
}

export interface LowConfidenceRecord {
  id: number;
  reference_number: string;
  extraction_confidence: string;
  uncertain_fields: string | null;
}

// Records extracted before self-reported confidence was captured have
// extraction_confidence = NULL -- excluded here deliberately (that's a
// coverage gap, not a flagged-as-uncertain record), see About.
export function lowConfidenceRecords(): LowConfidenceRecord[] {
  return getDb()
    .prepare(
      `
      SELECT id, reference_number, extraction_confidence, uncertain_fields
      FROM summary_conviction
      WHERE extraction_confidence IN ('low', 'medium')
      ORDER BY extraction_confidence = 'low' DESC, reference_number
      `
    )
    .all() as LowConfidenceRecord[];
}

export interface NameVariantCandidate {
  a: { name_key: string; display_name: string; count: number };
  b: { name_key: string; display_name: string; count: number };
  distance: number;
}

// repeatedDefendantNames/repeatedPersonNames above only catch the *same*
// name_key recurring -- they can't catch a spelling slip that produced a
// different name_key for what's likely the same real person (the "Jno.
// Smith" vs "John Smith" example from the deduplication note). This looks
// for near-miss pairs instead: same normalised last name, small edit
// distance between the full names, excluding exact matches (distance 0,
// already covered by the exact-match lists). Bucketing by last name first
// keeps the pairwise comparison cheap even as the name list grows -- it's
// O(n^2) only within each same-surname group, not across the whole list.
export function possibleNameVariants(maxDistance = 2): NameVariantCandidate[] {
  const rows = getDb()
    .prepare(
      `
      SELECT
        name_key,
        MAX(display_name) AS display_name,
        MAX(last_name) AS last_name,
        COUNT(*) AS count
      FROM (
        SELECT name_key, TRIM(COALESCE(first_name,'') || ' ' || COALESCE(last_name,'')) AS display_name,
               LOWER(TRIM(last_name)) AS last_name
        FROM defendant
        WHERE name_key IS NOT NULL AND TRIM(name_key) != ''
        UNION ALL
        SELECT name_key, TRIM(COALESCE(first_name,'') || ' ' || COALESCE(last_name,'')) AS display_name,
               LOWER(TRIM(last_name)) AS last_name
        FROM person
        WHERE name_key IS NOT NULL AND TRIM(name_key) != ''
      )
      WHERE last_name IS NOT NULL AND last_name != ''
      GROUP BY name_key
      `
    )
    .all() as { name_key: string; display_name: string; last_name: string; count: number }[];

  const bySurname = new Map<string, typeof rows>();
  for (const row of rows) {
    const bucket = bySurname.get(row.last_name);
    if (bucket) bucket.push(row);
    else bySurname.set(row.last_name, [row]);
  }

  const candidates: NameVariantCandidate[] = [];
  for (const bucket of bySurname.values()) {
    if (bucket.length < 2) continue;
    for (let i = 0; i < bucket.length; i++) {
      for (let j = i + 1; j < bucket.length; j++) {
        const distance = levenshtein(bucket[i].name_key, bucket[j].name_key);
        if (distance > 0 && distance <= maxDistance) {
          candidates.push({ a: bucket[i], b: bucket[j], distance });
        }
      }
    }
  }

  return candidates.sort((x, y) => x.distance - y.distance);
}
