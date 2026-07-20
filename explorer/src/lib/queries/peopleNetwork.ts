// Server-only (better-sqlite3, build-time) -- the `server-only` import below
// makes this a build error, not a convention to remember, if a 'use client'
// component ever pulls it in. See peopleSearch.ts for the client-safe half
// of what used to be a single people.ts.
import "server-only";
import { getDb, selectColumn } from "@/lib/db";

export interface CaseMention {
  summary_conviction_id: number;
  reference_number: string;
  conviction_date: string | null;
  charge_description: string;
  role: string;
  // These are per-mention, not per-person -- defendant/person rows aren't
  // deduplicated across cases (see Methodology), so the same real person
  // can carry different values here in different cases, and that's
  // expected rather than a data-quality bug.
  occupation: string | null;
  age: number | null;
  marital_status: string | null;
  relationship_type: string | null;
  related_to_name: string | null;
  town_id: number | null;
  town_name: string | null;
}

export interface Connection {
  name_key: string;
  display_name: string;
  kind: "defendant" | "person";
  role: string | null;
  shared_cases: string[];
}

export interface NetworkGraph {
  nodes: { id: string; label: string; kind: "center" | "defendant" | "person" }[];
  links: { source: string; target: string; cases: number }[];
}

export interface PersonNetwork {
  name_key: string;
  display_name: string;
  aliases: string[];
  cases: CaseMention[];
  connections: Connection[];
  graph: NetworkGraph;
}

export function listNameKeys(): string[] {
  return selectColumn<string>(
    `
    SELECT name_key FROM defendant
    UNION
    SELECT name_key FROM person
    `,
    "name_key"
  ).filter((k) => k != null && k.trim() !== "");
}

export function getPersonNetwork(nameKey: string): PersonNetwork | undefined {
  const db = getDb();

  const asDefendant = db
    .prepare(
      `
      SELECT
        sc.id AS summary_conviction_id, sc.reference_number, sc.conviction_date, sc.charge_description,
        d.occupation, d.age, d.marital_status, d.relationship_type, d.related_to_name,
        d.town_id, t.name AS town_name
      FROM defendant d
      JOIN summary_conviction_defendant scd ON scd.defendant_id = d.id
      JOIN summary_conviction sc ON sc.id = scd.summary_conviction_id
      LEFT JOIN town t ON t.id = d.town_id
      WHERE d.name_key = ?
      `
    )
    .all(nameKey) as Omit<CaseMention, "role">[];

  const asInvolved = db
    .prepare(
      `
      SELECT
        sc.id AS summary_conviction_id, sc.reference_number, sc.conviction_date, sc.charge_description, ip.role,
        p.occupation, p.age, p.marital_status, p.relationship_type, p.related_to_name,
        p.town_id, t.name AS town_name
      FROM person p
      JOIN involved_persons ip ON ip.person_id = p.id
      JOIN summary_conviction sc ON sc.id = ip.summary_conviction_id
      LEFT JOIN town t ON t.id = p.town_id
      WHERE p.name_key = ?
      `
    )
    .all(nameKey) as CaseMention[];

  if (asDefendant.length === 0 && asInvolved.length === 0) return undefined;

  const cases: CaseMention[] = [
    ...asDefendant.map((c) => ({ ...c, role: "defendant" })),
    ...asInvolved,
  ].sort((a, b) => (a.conviction_date ?? "").localeCompare(b.conviction_date ?? ""));

  const caseIds = [...new Set(cases.map((c) => c.summary_conviction_id))];

  const displayNameRow = db
    .prepare(
      `SELECT TRIM(COALESCE(first_name,'') || ' ' || COALESCE(last_name,'')) AS name FROM defendant WHERE name_key = ?
       UNION ALL
       SELECT TRIM(COALESCE(first_name,'') || ' ' || COALESCE(last_name,'')) AS name FROM person WHERE name_key = ?
       LIMIT 1`
    )
    .get(nameKey, nameKey) as { name: string } | undefined;

  const aliases = caseIds.length
    ? (db
        .prepare(
          `
          SELECT DISTINCT a.alias_name
          FROM alias a
          JOIN defendant d ON d.id = a.defendant_id
          WHERE d.name_key = ?
          `
        )
        .all(nameKey) as { alias_name: string }[])
    : [];

  const connectionsMap = new Map<string, Connection>();
  if (caseIds.length > 0) {
    const placeholders = caseIds.map(() => "?").join(",");

    const coDefendants = db
      .prepare(
        `
        SELECT d.name_key, TRIM(COALESCE(d.first_name,'') || ' ' || COALESCE(d.last_name,'')) AS display_name, scd.summary_conviction_id, sc.reference_number
        FROM summary_conviction_defendant scd
        JOIN defendant d ON d.id = scd.defendant_id
        JOIN summary_conviction sc ON sc.id = scd.summary_conviction_id
        WHERE scd.summary_conviction_id IN (${placeholders}) AND d.name_key != ?
        `
      )
      .all(...caseIds, nameKey) as {
      name_key: string;
      display_name: string;
      summary_conviction_id: number;
      reference_number: string;
    }[];

    const coInvolved = db
      .prepare(
        `
        SELECT p.name_key, TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) AS display_name, ip.role, ip.summary_conviction_id, sc.reference_number
        FROM involved_persons ip
        JOIN person p ON p.id = ip.person_id
        JOIN summary_conviction sc ON sc.id = ip.summary_conviction_id
        WHERE ip.summary_conviction_id IN (${placeholders}) AND p.name_key != ?
        `
      )
      .all(...caseIds, nameKey) as {
      name_key: string;
      display_name: string;
      role: string | null;
      summary_conviction_id: number;
      reference_number: string;
    }[];

    for (const row of coDefendants) {
      const existing = connectionsMap.get(row.name_key);
      if (existing) {
        existing.shared_cases.push(row.reference_number);
      } else {
        connectionsMap.set(row.name_key, {
          name_key: row.name_key,
          display_name: row.display_name,
          kind: "defendant",
          role: "co-defendant",
          shared_cases: [row.reference_number],
        });
      }
    }
    for (const row of coInvolved) {
      const existing = connectionsMap.get(row.name_key);
      if (existing) {
        existing.shared_cases.push(row.reference_number);
      } else {
        connectionsMap.set(row.name_key, {
          name_key: row.name_key,
          display_name: row.display_name,
          kind: "person",
          role: row.role,
          shared_cases: [row.reference_number],
        });
      }
    }
  }

  const connections = [...connectionsMap.values()].sort(
    (a, b) => b.shared_cases.length - a.shared_cases.length
  );

  const displayName = displayNameRow?.name ?? nameKey;

  const graph: NetworkGraph = {
    nodes: [
      { id: nameKey, label: displayName, kind: "center" },
      ...connections.map((c) => ({ id: c.name_key, label: c.display_name, kind: c.kind })),
    ],
    links: connections.map((c) => ({
      source: nameKey,
      target: c.name_key,
      cases: c.shared_cases.length,
    })),
  };

  return {
    name_key: nameKey,
    display_name: displayName,
    aliases: aliases.map((a) => a.alias_name),
    cases,
    connections,
    graph,
  };
}
