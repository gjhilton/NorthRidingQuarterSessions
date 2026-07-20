// Client-safe: no import of @/lib/db (better-sqlite3), so this can be
// bundled into the browser for PeopleSearch's interactive name search
// without dragging a native module into the client bundle.
import type { DbLike } from "@/lib/dbTypes";

export interface PersonSearchResult {
  name_key: string;
  display_name: string;
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
