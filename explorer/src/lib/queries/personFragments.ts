// Shared SQL fragments and identity-key helpers for `person` rows, reused
// across every query file that used to hand-roll its own defendant/person
// join (browseList, browseDetail, filters, gender, locationTree,
// occupations, peopleList, peopleNetwork) or duplicate the old `defendant`
// UNION ALL `person` pattern (peopleList, peopleSearch, peopleNetwork) --
// both eliminated by v3's single `person` table plus
// `summary_conviction_person.role`. Pure strings/functions, no
// getDb/server-only, safe to import from both server-only and client-safe
// query modules.
import { formatPersonName } from "@/lib/text";

// The stored role value for the person(s) actually convicted -- a named
// constant, not a magic string, since every file that used to treat
// "defendant" as a separate table now compares against this instead.
export const DEFENDANT_ROLE = "defendant";

// The canonical set of columns behind every displayed person name. Found
// this set (first/middle/last name, title, name_postfix, alias) being
// hand-picked inconsistently -- a subset here, a different subset there,
// one place rebuilding "First Last" in raw SQL instead of going through
// formatPersonName at all -- across locationTree.ts, peopleSearch.ts,
// peopleList.ts, browseDetail.ts, peopleNetwork.ts, and their consuming
// components. Any query selecting a person's name for display should
// select all six (via personNameColumnsSql) and format via formatNameRow,
// not re-derive a subset or a display string locally.
export interface NameRow {
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  title: string | null;
  name_postfix: string | null;
  alias: string | null;
}

export function formatNameRow(row: NameRow): string {
  return formatPersonName({
    firstName: row.first_name,
    middleName: row.middle_name,
    lastName: row.last_name,
    title: row.title,
    namePostfix: row.name_postfix,
    alias: row.alias,
  });
}

// SQL column list matching NameRow's fields for a given table alias, e.g.
// personNameColumnsSql("p") -> "p.first_name, p.middle_name, p.last_name,
// p.title, p.name_postfix, p.alias".
export function personNameColumnsSql(alias = "p"): string {
  return ["first_name", "middle_name", "last_name", "title", "name_postfix", "alias"]
    .map((c) => `${alias}.${c}`)
    .join(", ");
}

// v3 dropped the old `name_key` stored column (a pure function of
// first_name/last_name, same "don't store what's derivable" reasoning as
// birth_year) -- this recomputes it at query time for "group mentions that
// look like the same person" (People listing, People search, the People
// detail page's identity/routing), given a person-table alias. NOT
// identity resolution -- two different real people who happen to share a
// name still collapse into one group here, the same known limitation v2
// had (see relationship_type 'namesake' for the schema's own way of
// flagging a confirmed exception -- not yet surfaced in this grouping).
export function personKeyExpr(alias = "p"): string {
  return `LOWER(TRIM(COALESCE(${alias}.first_name,'') || ' ' || COALESCE(${alias}.last_name,'')))`;
}

// Broad free-text match target for a person -- first/middle/last name,
// postfix, and alias all concatenated, for search boxes where a user might
// type any of them (a middle name, "the elder", a nickname). Deliberately
// NOT the same as personKeyExpr: that's a narrower first+last-only identity
// key used for grouping mentions into one person page, and folding
// middle_name/name_postfix into it would fragment a single real person's
// mentions across multiple pages depending on which fields happened to be
// recorded on a given row.
export function personSearchExpr(alias = "p"): string {
  return `LOWER(
    COALESCE(${alias}.title,'') || ' ' ||
    COALESCE(${alias}.first_name,'') || ' ' ||
    COALESCE(${alias}.middle_name,'') || ' ' ||
    COALESCE(${alias}.last_name,'') || ' ' ||
    COALESCE(${alias}.name_postfix,'') || ' ' ||
    COALESCE(${alias}.alias,'')
  )`;
}

// JS-side equivalent of personKeyExpr, for building a route key from a
// person row already in hand (e.g. a search result) rather than re-querying.
export function personKey({
  firstName,
  lastName,
}: {
  firstName?: string | null;
  lastName?: string | null;
}): string {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim().toLowerCase().replace(/\s+/g, " ");
}

export function personHref(key: string): string {
  return `/people/${encodeURIComponent(key)}`;
}

function roleInList(roles: string[]): string {
  return roles.map((r) => `'${r}'`).join(",");
}

// Comma-joined "First Last" names for a conviction, aliased `sc` in the
// enclosing query, restricted to a role (or role set) via
// summary_conviction_person -- replaces the old defendant-only
// DEFENDANT_NAMES_EXPR now that every role, including 'defendant', lives in
// one junction table.
export function personNamesExpr(roles: string[] = [DEFENDANT_ROLE]): string {
  return `(
    SELECT GROUP_CONCAT(TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')), ', ')
    FROM summary_conviction_person scp
    JOIN person p ON p.id = scp.person_id
    WHERE scp.summary_conviction_id = sc.id AND scp.role IN (${roleInList(roles)})
  )`;
}

// Same, but surname-first -- for a sortable ORDER BY expression, not
// display (mirrors the old browseList.ts DEFENDANT_SORT_EXPR).
export function personSortExpr(roles: string[] = [DEFENDANT_ROLE]): string {
  return `(
    SELECT GROUP_CONCAT(TRIM(COALESCE(p.last_name,'') || ' ' || COALESCE(p.first_name,'')), ', ')
    FROM summary_conviction_person scp
    JOIN person p ON p.id = scp.person_id
    WHERE scp.summary_conviction_id = sc.id AND scp.role IN (${roleInList(roles)})
  )`;
}

// json_group_array of per-person fields for people on a conviction
// restricted to a role set -- the structured equivalent of personNamesExpr,
// for list rows that need per-person fields (name_postfix, title, alias,
// sex) rather than just a flattened display string. Matches
// formatPersonName's own field set (see lib/text.ts) so a row from this
// array can be passed straight through.
export function personsJsonExpr(roles: string[] = [DEFENDANT_ROLE]): string {
  return `(
    SELECT json_group_array(json_object(
      'id', p.id,
      'first_name', p.first_name,
      'middle_name', p.middle_name,
      'last_name', p.last_name,
      'name_postfix', p.name_postfix,
      'title', p.title,
      'alias', p.alias,
      'sex', p.sex
    ))
    FROM summary_conviction_person scp
    JOIN person p ON p.id = scp.person_id
    WHERE scp.summary_conviction_id = sc.id AND scp.role IN (${roleInList(roles)})
  )`;
}

// Comma-joined occupation names for a person, aliased however the caller's
// person row is aliased -- replaces the old flat defendant.occupation/
// person.occupation text column now that a person can hold more than one
// occupation at once (person_occupation is a real join table, not capped
// at one).
export function personOccupationsExpr(personAlias = "p"): string {
  return `(
    SELECT GROUP_CONCAT(o.name, ', ')
    FROM person_occupation po
    JOIN occupation o ON o.id = po.occupation_id
    WHERE po.person_id = ${personAlias}.id
  )`;
}

// Comma-joined "relationship_type of Related Name" for a person's
// relationships (person_relationship) -- not conviction-scoped, since a
// relationship exists between two people independent of which
// conviction(s) either appears on.
export function personRelationshipsExpr(personAlias = "p"): string {
  return `(
    SELECT GROUP_CONCAT(
      rt.name || ' of ' || TRIM(COALESCE(rp.first_name,'') || ' ' || COALESCE(rp.last_name,'')),
      '; '
    )
    FROM person_relationship pr
    JOIN relationship_type rt ON rt.id = pr.relationship_type_id
    JOIN person rp ON rp.id = pr.related_person_id
    WHERE pr.person_id = ${personAlias}.id
  )`;
}
