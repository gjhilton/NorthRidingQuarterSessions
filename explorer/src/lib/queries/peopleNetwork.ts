// Server-only (better-sqlite3, build-time) -- the `server-only` import below
// makes this a build error, not a convention to remember, if a 'use client'
// component ever pulls it in. See peopleSearch.ts for the client-safe half
// of what used to be a single people.ts.
import "server-only";
import { getDb, selectColumn } from "@/lib/db";
import { formatPersonName } from "@/lib/text";
import { Roles, classifyInvolvedPersonRole } from "@/lib/roles";

export interface CaseMention {
  summary_conviction_id: number;
  reference_number: string;
  conviction_date: string | null;
  charge_description: string;
  role: string;
  // These are per-mention, not per-person -- defendant/person rows aren't
  // deduplicated across cases (see About), so the same real person
  // can carry different values here in different cases, and that's
  // expected rather than a data-quality bug.
  occupation: string | null;
  age: number | null;
  marital_status: string | null;
  relationship_type: string | null;
  related_to_name: string | null;
  location_id: number | null;
  location_name: string | null;
}

// One name in a case's Offender(s)/Involved person(s)/Police column --
// pre-split into name parts (not a pre-formatted display string) so the
// page can decide per-name whether to render it as a link, based on
// whether it's the person whose own page this is.
export interface CaseParticipant {
  name_key: string;
  first_name: string | null;
  last_name: string | null;
  name_qualifier: string | null;
}

export interface CaseParticipants {
  offenders: CaseParticipant[];
  police: CaseParticipant[];
  other: CaseParticipant[];
}

export interface PersonNetwork {
  name_key: string;
  display_name: string;
  aliases: string[];
  cases: CaseMention[];
  // Every case's full cast, keyed by summary_conviction_id -- includes this
  // person's own row too (the page renders it as plain text instead of a
  // link, rather than this map omitting it).
  participantsByCase: Map<number, CaseParticipants>;
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
        d.location_id, pl.name AS location_name
      FROM defendant d
      JOIN summary_conviction_defendant scd ON scd.defendant_id = d.id
      JOIN summary_conviction sc ON sc.id = scd.summary_conviction_id
      LEFT JOIN place pl ON pl.id = d.location_id
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
        p.location_id, pl.name AS location_name
      FROM person p
      JOIN involved_persons ip ON ip.person_id = p.id
      JOIN summary_conviction sc ON sc.id = ip.summary_conviction_id
      LEFT JOIN place pl ON pl.id = p.location_id
      WHERE p.name_key = ?
      `
    )
    .all(nameKey) as CaseMention[];

  if (asDefendant.length === 0 && asInvolved.length === 0) return undefined;

  const cases: CaseMention[] = [
    // "offender" -- the same synthetic role used across the People listing
    // (see peopleList.ts), not the raw table name this row came from.
    ...asDefendant.map((c) => ({ ...c, role: "offender" })),
    ...asInvolved,
  ].sort((a, b) => (a.conviction_date ?? "").localeCompare(b.conviction_date ?? ""));

  const caseIds = [...new Set(cases.map((c) => c.summary_conviction_id))];

  const displayNameRow = db
    .prepare(
      `SELECT first_name, last_name, name_qualifier FROM defendant WHERE name_key = ?
       UNION ALL
       SELECT first_name, last_name, name_qualifier FROM person WHERE name_key = ?
       LIMIT 1`
    )
    .get(nameKey, nameKey) as
    | { first_name: string | null; last_name: string | null; name_qualifier: string | null }
    | undefined;

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

  // Every defendant/involved-person across every one of this person's own
  // cases, not just the ones excluding them -- unlike the old
  // connections/network view (which only cared about *other* people), each
  // case's own columns need the full cast, this person included.
  const participantsByCase = new Map<number, CaseParticipants>();
  if (caseIds.length > 0) {
    const placeholders = caseIds.map(() => "?").join(",");

    function ensure(id: number): CaseParticipants {
      let entry = participantsByCase.get(id);
      if (!entry) {
        entry = { offenders: [], police: [], other: [] };
        participantsByCase.set(id, entry);
      }
      return entry;
    }

    const defendantRows = db
      .prepare(
        `
        SELECT scd.summary_conviction_id AS conviction_id, d.name_key, d.first_name, d.last_name, d.name_qualifier
        FROM summary_conviction_defendant scd
        JOIN defendant d ON d.id = scd.defendant_id
        WHERE scd.summary_conviction_id IN (${placeholders})
        `
      )
      .all(...caseIds) as {
      conviction_id: number;
      name_key: string;
      first_name: string | null;
      last_name: string | null;
      name_qualifier: string | null;
    }[];

    const involvedRows = db
      .prepare(
        `
        SELECT ip.summary_conviction_id AS conviction_id, p.name_key, p.first_name, p.last_name, p.name_qualifier, ip.role
        FROM involved_persons ip
        JOIN person p ON p.id = ip.person_id
        WHERE ip.summary_conviction_id IN (${placeholders})
        `
      )
      .all(...caseIds) as {
      conviction_id: number;
      name_key: string;
      first_name: string | null;
      last_name: string | null;
      name_qualifier: string | null;
      role: string | null;
    }[];

    for (const row of defendantRows) {
      ensure(row.conviction_id).offenders.push({
        name_key: row.name_key,
        first_name: row.first_name,
        last_name: row.last_name,
        name_qualifier: row.name_qualifier,
      });
    }
    for (const row of involvedRows) {
      const bucket = classifyInvolvedPersonRole(row.role) === Roles.police ? "police" : "other";
      ensure(row.conviction_id)[bucket].push({
        name_key: row.name_key,
        first_name: row.first_name,
        last_name: row.last_name,
        name_qualifier: row.name_qualifier,
      });
    }
  }

  const displayName = displayNameRow
    ? formatPersonName({
        firstName: displayNameRow.first_name,
        lastName: displayNameRow.last_name,
        nameQualifier: displayNameRow.name_qualifier,
      })
    : nameKey;

  return {
    name_key: nameKey,
    display_name: displayName,
    aliases: aliases.map((a) => a.alias_name),
    cases,
    participantsByCase,
  };
}
