// Server-only (better-sqlite3, build-time) -- the `server-only` import below
// makes this a build error, not a convention to remember, if a 'use client'
// component ever pulls it in. See peopleSearch.ts for the client-safe half
// of what used to be a single people.ts.
import "server-only";
import { getDb, selectColumn } from "@/lib/db";
import { formatPersonName, sentenceCase } from "@/lib/text";
import { Roles, classifyInvolvedPersonRole } from "@/lib/roles";
import {
  personKeyExpr,
  personOccupationsExpr,
  personNameColumnsSql,
  formatNameRow,
  type NameRow,
} from "@/lib/queries/personFragments";

// Spousal relationship_type names (see the `relationship_type` seed data --
// data-loader/qsrecords/models/reference.py's RelationshipType docstring
// lists the full vocabulary) -- the only two that matter for the "Spouse:"
// line on a person page.
const SPOUSE_RELATIONSHIP_NAMES = ["wife", "husband"];

export interface CaseMention {
  summary_conviction_id: number;
  reference_number: string;
  conviction_date: string | null;
  charge_description: string;
  role: string;
  // These are per-mention, not per-person -- person rows aren't deduplicated
  // across cases (see About), so the same real person can carry different
  // values here in different cases, and that's expected rather than a
  // data-quality bug. Comma-joined -- a person can hold more than one
  // occupation at once now (person_occupation is a real join table).
  occupation: string | null;
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
  middle_name: string | null;
  last_name: string | null;
  title: string | null;
  name_postfix: string | null;
  alias: string | null;
}

export interface CaseParticipants {
  offenders: CaseParticipant[];
  police: CaseParticipant[];
  other: CaseParticipant[];
}

// The other identity split off this one by backfill_split_police_names.py
// (or vice versa) -- a police officer and an offender sharing a common
// name are essentially certain to be different real people, so they're
// given separate name_keys (see that script) rather than shown merged on
// one page. This is the cross-reference back the other way, so each split
// identity can still be found from the other.
export interface SameNameAlternate {
  name_key: string;
  display_name: string;
}

// A spouse linked via person_relationship's 'wife'/'husband' relationship
// types -- either this name_key's own row states it (forward: this
// person IS wife/husband of the target), or the other way around (reverse:
// this name_key IS the target some other row's 'wife'/'husband' relationship
// points at). Both directions are surfaced the same way, since from the
// reader's point of view "who is this person's spouse" is one question
// regardless of which of the pair the relationship happened to be recorded
// against. relationship_type_reciprocal (reference.py) isn't needed here --
// it resolves the correctly-gendered *label* for the reverse direction
// (e.g. "wife" reciprocates to "husband"), but SpouseLink never displays a
// gendered label, just a name under a fixed "Spouse:" heading, so knowing
// *that* a spousal row links the two people is enough.
export interface SpouseLink {
  name_key: string;
  display_name: string;
}

// A non-spousal family/employment link (person_relationship, minus the
// wife/husband rows already covered by SpouseLink). Covers BOTH directions:
// this name_key's own row states it directly ("Joseph is stepson of
// Laidler" -> label "Stepson"), or the reverse, where some other row names
// this name_key as its related_person_id target -- in that case `label` is
// the correctly-gendered reverse word resolved via
// relationship_type_reciprocal (reference.py) against this person's own
// sex, e.g. "stepson" reciprocates to "Stepfather"/"Stepmother" depending
// on which this name_key is. Some relationship types (e.g. 'master') have
// no reciprocal mapping at all -- deliberately ambiguous, see reference.py
// -- those fall back to a generic label rather than guessing.
export interface RelationshipLink {
  name_key: string;
  display_name: string;
  label: string;
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
  sameNameAlternate: SameNameAlternate | undefined;
  spouses: SpouseLink[];
  // Everyone else linked via person_relationship -- family (stepson,
  // cousin, ...), employment (employer, apprentice, ...), etc. Matters most
  // for people with NO case appearances of their own (see `cases` above,
  // which can legitimately be empty): a relationship-only "stub" person
  // (created purely to hold a real related_person_id -- e.g. a stepfather
  // named only in his stepson's record, never himself a case party) is
  // still a real, important entry in the dataset and needs a working page,
  // not a 404 -- their relationships are the ONLY thing that page has to
  // show, so this list carries real weight for them.
  relationships: RelationshipLink[];
  // True if ANY person row under this name_key holds an occupation flagged
  // occupation.is_police (see backfill_is_police.py's original intent,
  // carried over to the new person_occupation/occupation join). A name_key
  // can span many rows across many cases; one police-occupation mention is
  // enough to call the person police here, same as elsewhere on the site.
  isPolice: boolean;
}

export function listNameKeys(): string[] {
  return selectColumn<string>(`SELECT DISTINCT ${personKeyExpr("person")} AS name_key FROM person`, "name_key").filter(
    (k) => k != null && k.trim() !== ""
  );
}

function spouseRows(db: ReturnType<typeof getDb>, nameKey: string): SpouseLink[] {
  const placeholders = SPOUSE_RELATIONSHIP_NAMES.map(() => "?").join(",");
  // Forward: this name_key's own person row(s) hold a 'wife'/'husband'
  // relationship -- the related_person_id side is the spouse.
  const forward = db
    .prepare(
      `
      SELECT rp.first_name, rp.middle_name, rp.last_name, rp.title, rp.name_postfix, rp.alias,
        ${personKeyExpr("rp")} AS name_key
      FROM person p
      JOIN person_relationship pr ON pr.person_id = p.id
      JOIN relationship_type rt ON rt.id = pr.relationship_type_id
      JOIN person rp ON rp.id = pr.related_person_id
      WHERE ${personKeyExpr("p")} = ? AND rt.name IN (${placeholders})
      `
    )
    .all(nameKey, ...SPOUSE_RELATIONSHIP_NAMES) as (NameRow & { name_key: string })[];
  // Reverse: some other person row's 'wife'/'husband' relationship names
  // THIS name_key as its related_person_id target -- the person_id side
  // (the one who stated the relationship) is the spouse.
  const reverse = db
    .prepare(
      `
      SELECT p.first_name, p.middle_name, p.last_name, p.title, p.name_postfix, p.alias,
        ${personKeyExpr("p")} AS name_key
      FROM person_relationship pr
      JOIN relationship_type rt ON rt.id = pr.relationship_type_id
      JOIN person target ON target.id = pr.related_person_id
      JOIN person p ON p.id = pr.person_id
      WHERE ${personKeyExpr("target")} = ? AND rt.name IN (${placeholders})
      `
    )
    .all(nameKey, ...SPOUSE_RELATIONSHIP_NAMES) as (NameRow & { name_key: string })[];

  const byNameKey = new Map<string, SpouseLink>();
  for (const row of [...forward, ...reverse]) {
    if (row.name_key === nameKey) continue; // never link to self
    byNameKey.set(row.name_key, {
      name_key: row.name_key,
      display_name: formatNameRow(row),
    });
  }
  return [...byNameKey.values()];
}

interface RelationshipRow extends NameRow {
  name_key: string;
  label: string | null;
}

function relationshipRows(db: ReturnType<typeof getDb>, nameKey: string): RelationshipLink[] {
  const spousePlaceholders = SPOUSE_RELATIONSHIP_NAMES.map(() => "?").join(",");
  // Forward: this name_key's own row states the relationship directly --
  // label is the relationship_type name exactly as recorded (e.g. "Joseph
  // is stepson of Laidler" -> label "Stepson", read as "Stepson of Laidler").
  const forward = db
    .prepare(
      `
      SELECT rp.first_name, rp.middle_name, rp.last_name, rp.title, rp.name_postfix, rp.alias,
        ${personKeyExpr("rp")} AS name_key, rt.name AS label
      FROM person p
      JOIN person_relationship pr ON pr.person_id = p.id
      JOIN relationship_type rt ON rt.id = pr.relationship_type_id
      JOIN person rp ON rp.id = pr.related_person_id
      WHERE ${personKeyExpr("p")} = ? AND rt.name NOT IN (${spousePlaceholders})
      `
    )
    .all(nameKey, ...SPOUSE_RELATIONSHIP_NAMES) as RelationshipRow[];
  // Reverse: some other row names THIS name_key as its related_person_id
  // target -- label is the correctly-gendered reverse word, resolved via
  // relationship_type_reciprocal against this person's own sex (e.g.
  // "stepson" reciprocates to "stepfather"/"stepmother"). Per the seed data,
  // a relationship_type has either one sex-independent reciprocal row
  // (related_sex IS NULL) or up to two sex-specific ones, never both, so
  // this single OR condition is enough to pick the right one without
  // over-matching. NULL label (no reciprocal seeded, e.g. 'master' -- see
  // reference.py) is handled by the caller, not guessed here.
  const reverse = db
    .prepare(
      `
      SELECT p.first_name, p.middle_name, p.last_name, p.title, p.name_postfix, p.alias,
        ${personKeyExpr("p")} AS name_key, recip_rt.name AS label
      FROM person_relationship pr
      JOIN relationship_type rt ON rt.id = pr.relationship_type_id
      JOIN person target ON target.id = pr.related_person_id
      JOIN person p ON p.id = pr.person_id
      LEFT JOIN relationship_type_reciprocal rtr
        ON rtr.relationship_type_id = pr.relationship_type_id
        AND (rtr.related_sex = target.sex OR rtr.related_sex IS NULL)
      LEFT JOIN relationship_type recip_rt ON recip_rt.id = rtr.reciprocal_relationship_type_id
      WHERE ${personKeyExpr("target")} = ? AND rt.name NOT IN (${spousePlaceholders})
      `
    )
    .all(nameKey, ...SPOUSE_RELATIONSHIP_NAMES) as RelationshipRow[];

  const byNameKeyAndLabel = new Map<string, RelationshipLink>();
  for (const row of [...forward, ...reverse]) {
    if (row.name_key === nameKey) continue; // never link to self
    const label = row.label ? sentenceCase(row.label) : "Connected to";
    byNameKeyAndLabel.set(`${row.name_key} ${label}`, {
      name_key: row.name_key,
      display_name: formatNameRow(row),
      label,
    });
  }
  return [...byNameKeyAndLabel.values()];
}

export function getPersonNetwork(nameKey: string): PersonNetwork | undefined {
  const db = getDb();
  const key = personKeyExpr("p");

  // Every case appearance for this name_key, any role -- collapses the old
  // defendant/involved_persons UNION ALL now that both live in one
  // summary_conviction_person junction table with a real, always-populated
  // `role` column (including the literal 'defendant').
  const cases = db
    .prepare(
      `
      SELECT
        sc.id AS summary_conviction_id, sc.record_number AS reference_number, sc.conviction_date, sc.charge_description,
        scp.role,
        ${personOccupationsExpr("p")} AS occupation,
        p.home_location_id AS location_id, loc.name AS location_name
      FROM summary_conviction_person scp
      JOIN person p ON p.id = scp.person_id
      JOIN summary_conviction sc ON sc.id = scp.summary_conviction_id
      LEFT JOIN location loc ON loc.id = p.home_location_id
      WHERE ${key} = ?
      ORDER BY sc.conviction_date
      `
    )
    .all(nameKey) as CaseMention[];

  const caseIds = [...new Set(cases.map((c) => c.summary_conviction_id))];

  const displayNameRow = db
    .prepare(
      `SELECT first_name, middle_name, last_name, title, name_postfix, alias FROM person p WHERE ${key} = ? LIMIT 1`
    )
    .get(nameKey) as NameRow | undefined;

  // A real name_key has at least one person row -- if none exists at all,
  // this genuinely isn't a known person (a true 404). cases.length === 0 is
  // NOT that check: a relationship-only "stub" person (created purely to
  // hold a real related_person_id, e.g. a stepfather named only in his
  // stepson's record and never himself a case party -- see
  // migrate_to_unified_schema.py's _resolve_or_stub_person) has zero cases
  // but a real person row, and is just as important a database entry as
  // anyone with a full case history -- their page should render with
  // whatever's known about them (name, relationships), not 404.
  if (!displayNameRow) return undefined;

  const aliasRows = db
    .prepare(
      `SELECT DISTINCT alias FROM person p WHERE ${key} = ? AND alias IS NOT NULL AND TRIM(alias) != ''`
    )
    .all(nameKey) as { alias: string }[];
  // person.alias is itself comma-joined (max 2 aliases per person) -- flatten
  // and dedupe across every person row sharing this name_key.
  const aliases = [
    ...new Set(aliasRows.flatMap((r) => r.alias.split(",").map((a) => a.trim()).filter(Boolean))),
  ];

  // Every person on every one of this person's own cases, not just the ones
  // excluding them -- unlike the old connections/network view (which only
  // cared about *other* people), each case's own columns need the full
  // cast, this person included. One query (not a defendant/involved-persons
  // split) since classifyInvolvedPersonRole (roles.ts) now handles
  // 'defendant' -> Roles.offender itself, the same translation used
  // everywhere else on the site.
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

    const participantRows = db
      .prepare(
        `
        SELECT
          scp.summary_conviction_id AS conviction_id,
          ${personKeyExpr("p")} AS name_key,
          p.first_name, p.middle_name, p.last_name, p.title, p.name_postfix, p.alias, scp.role,
          EXISTS (
            SELECT 1 FROM person_occupation po
            JOIN occupation o ON o.id = po.occupation_id
            WHERE po.person_id = p.id AND o.is_police = 1
          ) AS is_police
        FROM summary_conviction_person scp
        JOIN person p ON p.id = scp.person_id
        WHERE scp.summary_conviction_id IN (${placeholders})
        `
      )
      .all(...caseIds) as (NameRow & {
      conviction_id: number;
      name_key: string;
      role: string;
      is_police: number;
    })[];

    for (const row of participantRows) {
      const bucket = classifyInvolvedPersonRole(row.role, Boolean(row.is_police));
      const target =
        bucket === Roles.offender ? "offenders" : bucket === Roles.police ? "police" : "other";
      ensure(row.conviction_id)[target].push({
        name_key: row.name_key,
        first_name: row.first_name,
        middle_name: row.middle_name,
        last_name: row.last_name,
        title: row.title,
        name_postfix: row.name_postfix,
        alias: row.alias,
      });
    }
  }

  // Canonical display name includes every alias known under this name_key
  // (aggregated across every person row sharing it, not just displayNameRow's
  // own single row -- see `aliases` above), not just displayNameRow's own.
  const displayName = displayNameRow
    ? formatPersonName({
        firstName: displayNameRow.first_name,
        middleName: displayNameRow.middle_name,
        lastName: displayNameRow.last_name,
        title: displayNameRow.title,
        namePostfix: displayNameRow.name_postfix,
        alias: aliases.join(", "),
      })
    : nameKey;

  const alternateNameKey = nameKey.endsWith(" police")
    ? nameKey.slice(0, -" police".length)
    : `${nameKey} police`;
  const alternateNameRow = db
    .prepare(
      `SELECT first_name, middle_name, last_name, title, name_postfix, alias FROM person p WHERE ${key} = ? LIMIT 1`
    )
    .get(alternateNameKey) as NameRow | undefined;
  const sameNameAlternate: SameNameAlternate | undefined = alternateNameRow
    ? {
        name_key: alternateNameKey,
        display_name: formatNameRow(alternateNameRow),
      }
    : undefined;

  const isPolice = Boolean(
    db
      .prepare(
        `
        SELECT 1 FROM person p
        JOIN person_occupation po ON po.person_id = p.id
        JOIN occupation o ON o.id = po.occupation_id
        WHERE ${key} = ? AND o.is_police = 1
        LIMIT 1
        `
      )
      .get(nameKey)
  );

  return {
    name_key: nameKey,
    display_name: displayName,
    aliases,
    cases: [...cases].sort((a, b) => (a.conviction_date ?? "").localeCompare(b.conviction_date ?? "")),
    participantsByCase,
    sameNameAlternate,
    spouses: spouseRows(db, nameKey),
    relationships: relationshipRows(db, nameKey),
    isPolice,
  };
}
