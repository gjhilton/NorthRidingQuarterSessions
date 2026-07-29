// Client-safe: no import of @/lib/db (better-sqlite3), so this can be
// bundled into the browser for PeopleSearch's interactive name search
// without dragging a native module into the client bundle.
import type { DbLike } from "@/lib/dbTypes";
import {
  DEFENDANT_ROLE,
  personKeyExpr,
  personSearchExpr,
  personOccupationsExpr,
  type NameRow,
} from "@/lib/queries/personFragments";

export interface PersonSearchResult extends NameRow {
  name_key: string;
  // A name_key can span multiple mentions with different recorded
  // occupations (rows aren't deduplicated -- see About) -- MAX() picks one
  // representative value, same convention as peopleList.ts. Also true of
  // middle_name/title/name_postfix/alias: none of them are part of the
  // name_key identity itself (see personKeyExpr), so a group can mix
  // mentions with and without any of them.
  occupation: string | null;
  defendant_mentions: number;
  person_mentions: number;
}

export function searchPeople(db: DbLike, q: string, limit = 25): PersonSearchResult[] {
  const like = `%${q.toLowerCase()}%`;
  const key = personKeyExpr("p");
  return db
    .prepare(
      `
      SELECT
        ${key} AS name_key,
        MAX(p.first_name) AS first_name,
        MAX(p.middle_name) AS middle_name,
        MAX(p.last_name) AS last_name,
        MAX(p.title) AS title,
        MAX(p.name_postfix) AS name_postfix,
        MAX(p.alias) AS alias,
        MAX(${personOccupationsExpr("p")}) AS occupation,
        SUM(CASE WHEN scp.role = @defendantRole THEN 1 ELSE 0 END) AS defendant_mentions,
        SUM(CASE WHEN scp.role != @defendantRole THEN 1 ELSE 0 END) AS person_mentions
      FROM person p
      JOIN summary_conviction_person scp ON scp.person_id = p.id
      WHERE ${personSearchExpr("p")} LIKE @like AND TRIM(${key}) != ''
      GROUP BY name_key
      ORDER BY (defendant_mentions + person_mentions) DESC, name_key
      LIMIT @limit
      `
    )
    .all({ like, limit, defendantRole: DEFENDANT_ROLE }) as PersonSearchResult[];
}
