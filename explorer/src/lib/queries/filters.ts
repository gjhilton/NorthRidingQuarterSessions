import { getDb } from "@/lib/db";

export interface Option {
  id: number;
  name: string;
}

export function listTowns(): Option[] {
  return getDb()
    .prepare(`SELECT id, name FROM town ORDER BY name`)
    .all() as Option[];
}

export function listOffenceTypes(): Option[] {
  return getDb()
    .prepare(`SELECT id, name FROM offence_type ORDER BY name`)
    .all() as Option[];
}
