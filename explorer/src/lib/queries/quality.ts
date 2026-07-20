import { getDb } from "@/lib/db";

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
      SELECT ot.name AS name, COUNT(sc.id) AS count
      FROM offence_type ot
      LEFT JOIN summary_conviction sc ON sc.offence_type_id = ot.id
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
