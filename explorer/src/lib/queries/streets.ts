import "server-only";
import { getDb, selectColumn } from "@/lib/db";

export interface StreetSummary {
  id: number;
  name: string;
  town_name: string | null;
  case_count: number;
}

export function listStreets(): StreetSummary[] {
  return getDb()
    .prepare(
      `
      SELECT s.id, s.name, t.name AS town_name, COUNT(*) AS case_count
      FROM street s
      JOIN summary_conviction sc ON sc.offence_location_street_id = s.id
      LEFT JOIN town t ON t.id = s.town_id
      GROUP BY s.id
      ORDER BY case_count DESC, s.name
      `
    )
    .all() as StreetSummary[];
}

export function listStreetIds(): number[] {
  return selectColumn<number>(
    `
    SELECT DISTINCT s.id
    FROM street s
    JOIN summary_conviction sc ON sc.offence_location_street_id = s.id
    `,
    "id"
  );
}

export interface StreetDetail {
  id: number;
  name: string;
  town_name: string | null;
}

export function getStreetDetail(id: number): StreetDetail | undefined {
  return getDb()
    .prepare(
      `
      SELECT s.id, s.name, t.name AS town_name
      FROM street s
      LEFT JOIN town t ON t.id = s.town_id
      WHERE s.id = ?
      `
    )
    .get(id) as StreetDetail | undefined;
}

export interface StreetCaseRow {
  id: number;
  reference_number: string;
  conviction_date: string | null;
  conviction_date_raw: string;
  charge_description: string;
  offence_type_name: string | null;
  defendant_names: string | null;
}

export function getStreetCases(streetId: number): StreetCaseRow[] {
  return getDb()
    .prepare(
      `
      SELECT
        sc.id, sc.reference_number, sc.conviction_date, sc.conviction_date_raw,
        sc.charge_description,
        ot.name AS offence_type_name,
        (
          SELECT GROUP_CONCAT(TRIM(COALESCE(d.first_name,'') || ' ' || COALESCE(d.last_name,'')), ', ')
          FROM summary_conviction_defendant scd
          JOIN defendant d ON d.id = scd.defendant_id
          WHERE scd.summary_conviction_id = sc.id
        ) AS defendant_names
      FROM summary_conviction sc
      LEFT JOIN offence_type ot ON ot.id = sc.offence_type_id
      WHERE sc.offence_location_street_id = ?
      ORDER BY sc.conviction_date IS NULL, sc.conviction_date DESC
      `
    )
    .all(streetId) as StreetCaseRow[];
}
