// Server-only (better-sqlite3, build-time) -- the full name index is
// enumerable at build time, unlike PeopleSearch's arbitrary free-text query.
import "server-only";
import { getDb } from "@/lib/db";

export interface PersonListRow {
  name_key: string;
  display_name: string;
  defendant_mentions: number;
  person_mentions: number;
  total_mentions: number;
  occupation: string | null;
  town_name: string | null;
  sex: string | null;
}

export function listAllPeople(): PersonListRow[] {
  return getDb()
    .prepare(
      `
      SELECT
        name_key,
        MAX(display_name) AS display_name,
        SUM(CASE WHEN kind = 'defendant' THEN 1 ELSE 0 END) AS defendant_mentions,
        SUM(CASE WHEN kind = 'person' THEN 1 ELSE 0 END) AS person_mentions,
        COUNT(*) AS total_mentions,
        MAX(occupation) AS occupation,
        MAX(town_name) AS town_name,
        MAX(sex) AS sex
      FROM (
        SELECT
          d.name_key,
          TRIM(COALESCE(d.first_name,'') || ' ' || COALESCE(d.last_name,'')) AS display_name,
          'defendant' AS kind,
          d.occupation,
          t.name AS town_name,
          d.sex
        FROM defendant d
        LEFT JOIN town t ON t.id = d.town_id
        UNION ALL
        SELECT
          p.name_key,
          TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) AS display_name,
          'person' AS kind,
          p.occupation,
          t.name AS town_name,
          NULL AS sex
        FROM person p
        LEFT JOIN town t ON t.id = p.town_id
      )
      WHERE name_key IS NOT NULL AND TRIM(name_key) != ''
      GROUP BY name_key
      ORDER BY name_key
      `
    )
    .all() as PersonListRow[];
}
