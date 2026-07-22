// Client-safe: no import of @/lib/db (better-sqlite3), so this can be
// bundled into the browser for PeopleSearch's interactive name search
// without dragging a native module into the client bundle.
import type { DbLike } from "@/lib/dbTypes";

export interface PersonSearchResult {
  name_key: string;
  first_name: string | null;
  last_name: string | null;
  // A name_key can span multiple mentions with different recorded
  // occupations (rows aren't deduplicated -- see About) -- MAX() picks one
  // representative value, same convention as peopleList.ts.
  occupation: string | null;
  defendant_mentions: number;
  person_mentions: number;
}

export function searchPeople(db: DbLike, q: string, limit = 25): PersonSearchResult[] {
  const like = `%${q.toLowerCase()}%`;
  return db
    .prepare(
      `
      SELECT
        name_key,
        MAX(first_name) AS first_name,
        MAX(last_name) AS last_name,
        MAX(occupation) AS occupation,
        SUM(CASE WHEN kind = 'defendant' THEN 1 ELSE 0 END) AS defendant_mentions,
        SUM(CASE WHEN kind = 'person' THEN 1 ELSE 0 END) AS person_mentions
      FROM (
        SELECT name_key, first_name, last_name, occupation, 'defendant' AS kind FROM defendant
        UNION ALL
        SELECT name_key, first_name, last_name, occupation, 'person' AS kind FROM person
      )
      WHERE name_key LIKE @like AND TRIM(name_key) != ''
      GROUP BY name_key
      ORDER BY (defendant_mentions + person_mentions) DESC, name_key
      LIMIT @limit
      `
    )
    .all({ like, limit }) as PersonSearchResult[];
}
