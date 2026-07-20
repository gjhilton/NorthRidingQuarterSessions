import { getDb } from "@/lib/db";

export interface PersonSearchResult {
  name_key: string;
  display_name: string;
  defendant_mentions: number;
  person_mentions: number;
}

export function searchPeople(q: string, limit = 25): PersonSearchResult[] {
  const like = `%${q.toLowerCase()}%`;
  return getDb()
    .prepare(
      `
      SELECT
        name_key,
        MAX(display_name) AS display_name,
        SUM(CASE WHEN kind = 'defendant' THEN 1 ELSE 0 END) AS defendant_mentions,
        SUM(CASE WHEN kind = 'person' THEN 1 ELSE 0 END) AS person_mentions
      FROM (
        SELECT name_key, TRIM(first_name || ' ' || last_name) AS display_name, 'defendant' AS kind
        FROM defendant
        UNION ALL
        SELECT name_key, TRIM(first_name || ' ' || last_name) AS display_name, 'person' AS kind
        FROM person
      )
      WHERE name_key LIKE @like
      GROUP BY name_key
      ORDER BY (defendant_mentions + person_mentions) DESC, display_name
      LIMIT @limit
      `
    )
    .all({ like, limit }) as PersonSearchResult[];
}

export interface CaseMention {
  summary_conviction_id: number;
  reference_number: string;
  conviction_date: string | null;
  charge_description: string;
  role: string;
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

export function getPersonNetwork(nameKey: string): PersonNetwork | undefined {
  const db = getDb();

  const asDefendant = db
    .prepare(
      `
      SELECT sc.id AS summary_conviction_id, sc.reference_number, sc.conviction_date, sc.charge_description
      FROM defendant d
      JOIN summary_conviction_defendant scd ON scd.defendant_id = d.id
      JOIN summary_conviction sc ON sc.id = scd.summary_conviction_id
      WHERE d.name_key = ?
      `
    )
    .all(nameKey) as Omit<CaseMention, "role">[];

  const asInvolved = db
    .prepare(
      `
      SELECT sc.id AS summary_conviction_id, sc.reference_number, sc.conviction_date, sc.charge_description, ip.role
      FROM person p
      JOIN involved_persons ip ON ip.person_id = p.id
      JOIN summary_conviction sc ON sc.id = ip.summary_conviction_id
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
      `SELECT TRIM(first_name || ' ' || last_name) AS name FROM defendant WHERE name_key = ?
       UNION ALL
       SELECT TRIM(first_name || ' ' || last_name) AS name FROM person WHERE name_key = ?
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
        SELECT d.name_key, TRIM(d.first_name || ' ' || d.last_name) AS display_name, scd.summary_conviction_id, sc.reference_number
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
        SELECT p.name_key, TRIM(p.first_name || ' ' || p.last_name) AS display_name, ip.role, ip.summary_conviction_id, sc.reference_number
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
