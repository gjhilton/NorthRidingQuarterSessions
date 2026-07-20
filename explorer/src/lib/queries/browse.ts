import { getDb } from "@/lib/db";

export interface BrowseFilters {
  q?: string;
  townId?: number;
  offenceTypeId?: number;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
}

export interface BrowseRow {
  id: number;
  reference_number: string;
  conviction_date: string | null;
  conviction_date_raw: string;
  charge_description: string;
  offence_type_name: string | null;
  offence_town_name: string | null;
  court_town_name: string | null;
  defendant_names: string | null;
}

interface WhereClause {
  sql: string;
  params: Record<string, unknown>;
}

function buildWhere(filters: BrowseFilters): WhereClause {
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};

  if (filters.q) {
    clauses.push(`(
      sc.charge_description LIKE @q
      OR sc.reference_number LIKE @q
      OR EXISTS (
        SELECT 1 FROM summary_conviction_defendant scd2
        JOIN defendant d2 ON d2.id = scd2.defendant_id
        WHERE scd2.summary_conviction_id = sc.id AND d2.name_key LIKE @q
      )
      OR EXISTS (
        SELECT 1 FROM involved_persons ip2
        JOIN person p2 ON p2.id = ip2.person_id
        WHERE ip2.summary_conviction_id = sc.id AND p2.name_key LIKE @q
      )
    )`);
    params.q = `%${filters.q.toLowerCase()}%`;
  }
  if (filters.townId) {
    clauses.push(`(sc.offence_location_town_id = @townId OR sc.court_location_town_id = @townId)`);
    params.townId = filters.townId;
  }
  if (filters.offenceTypeId) {
    clauses.push(`sc.offence_type_id = @offenceTypeId`);
    params.offenceTypeId = filters.offenceTypeId;
  }
  if (filters.dateFrom) {
    clauses.push(`sc.conviction_date >= @dateFrom`);
    params.dateFrom = filters.dateFrom;
  }
  if (filters.dateTo) {
    clauses.push(`sc.conviction_date <= @dateTo`);
    params.dateTo = filters.dateTo;
  }

  return {
    sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

export function listConvictions(filters: BrowseFilters): {
  rows: BrowseRow[];
  total: number;
} {
  const db = getDb();
  const { sql: whereSql, params } = buildWhere(filters);
  const offset = (filters.page - 1) * filters.pageSize;

  const rows = db
    .prepare(
      `
      SELECT
        sc.id,
        sc.reference_number,
        sc.conviction_date,
        sc.conviction_date_raw,
        sc.charge_description,
        ot.name AS offence_type_name,
        ot_town.name AS offence_town_name,
        court_town.name AS court_town_name,
        (
          SELECT GROUP_CONCAT(TRIM(d.first_name || ' ' || d.last_name), ', ')
          FROM summary_conviction_defendant scd
          JOIN defendant d ON d.id = scd.defendant_id
          WHERE scd.summary_conviction_id = sc.id
        ) AS defendant_names
      FROM summary_conviction sc
      LEFT JOIN offence_type ot ON ot.id = sc.offence_type_id
      LEFT JOIN town ot_town ON ot_town.id = sc.offence_location_town_id
      LEFT JOIN town court_town ON court_town.id = sc.court_location_town_id
      ${whereSql}
      ORDER BY sc.conviction_date IS NULL, sc.conviction_date DESC, sc.reference_number
      LIMIT @limit OFFSET @offset
      `
    )
    .all({ ...params, limit: filters.pageSize, offset }) as BrowseRow[];

  const { total } = db
    .prepare(
      `
      SELECT COUNT(*) AS total
      FROM summary_conviction sc
      ${whereSql}
      `
    )
    .get(params) as { total: number };

  return { rows, total };
}

export interface ConvictionDetail {
  id: number;
  reference_number: string;
  conviction_date: string | null;
  conviction_date_raw: string;
  offence_date: string | null;
  offence_date_raw: string | null;
  offence_day_of_week: string | null;
  offence_time: string | null;
  offence_type_name: string | null;
  charge_description: string;
  sentencing: string | null;
  raw_record: string;
  archive_url: string;
  offence_town_name: string | null;
  offence_street_name: string | null;
  court_town_name: string | null;
}

export interface DetailDefendant {
  id: number;
  first_name: string | null;
  last_name: string | null;
  sex: string | null;
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
  occupation: string | null;
  relationships_and_details: string | null;
  role: string | null;
  town_name: string | null;
}

export function getConvictionDetail(id: number): ConvictionDetail | undefined {
  return getDb()
    .prepare(
      `
      SELECT
        sc.id, sc.reference_number, sc.conviction_date, sc.conviction_date_raw,
        sc.offence_date, sc.offence_date_raw, sc.offence_day_of_week, sc.offence_time,
        ot.name AS offence_type_name,
        sc.charge_description, sc.sentencing, sc.raw_record, sc.archive_url,
        ot_town.name AS offence_town_name,
        st.name AS offence_street_name,
        court_town.name AS court_town_name
      FROM summary_conviction sc
      LEFT JOIN offence_type ot ON ot.id = sc.offence_type_id
      LEFT JOIN town ot_town ON ot_town.id = sc.offence_location_town_id
      LEFT JOIN street st ON st.id = sc.offence_location_street_id
      LEFT JOIN town court_town ON court_town.id = sc.court_location_town_id
      WHERE sc.id = ?
      `
    )
    .get(id) as ConvictionDetail | undefined;
}

export function getConvictionDefendants(convictionId: number): DetailDefendant[] {
  const db = getDb();
  const defendants = db
    .prepare(
      `
      SELECT
        d.id, d.first_name, d.last_name, d.sex, d.occupation,
        d.relationships_and_details, d.prior_convictions,
        t.name AS town_name, st.name AS street_name
      FROM summary_conviction_defendant scd
      JOIN defendant d ON d.id = scd.defendant_id
      LEFT JOIN town t ON t.id = d.town_id
      LEFT JOIN street st ON st.id = d.street_id
      WHERE scd.summary_conviction_id = ?
      `
    )
    .all(convictionId) as Omit<DetailDefendant, "aliases">[];

  const aliasStmt = db.prepare(`SELECT alias_name FROM alias WHERE defendant_id = ?`);

  return defendants.map((d) => ({
    ...d,
    aliases: (aliasStmt.all(d.id) as { alias_name: string }[]).map((a) => a.alias_name),
  }));
}

export function getConvictionInvolvedPersons(convictionId: number): DetailInvolvedPerson[] {
  return getDb()
    .prepare(
      `
      SELECT
        p.id, p.first_name, p.last_name, p.occupation,
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
