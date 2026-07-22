import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";

export interface Option {
  id: number;
  name: string;
}

export interface OptionGroup {
  category: string;
  types: Option[];
}

export function listTowns(): Option[] {
  return getDb()
    .prepare(`SELECT id, name FROM town ORDER BY name`)
    .all() as Option[];
}

// Grouped by offence_category (curated sort_order, e.g. "Drink & Public
// Order" first), not a flat alphabetical list -- see
// data-loader/qsrecords/offence_types.py's OFFENCE_TAXONOMY for how the 55
// leaves below were consolidated from an earlier 91-near-duplicate-string
// vocabulary. Uncategorised rows (category_id IS NULL -- a brand new
// proposal awaiting review, see /about) fall into an "Other" group at the
// end rather than being silently dropped from the filter.
export function listOffenceTypes(): OptionGroup[] {
  const rows = getDb()
    .prepare(
      `
      SELECT ot.id AS id, ot.name AS name,
             COALESCE(oc.name, 'other') AS category,
             COALESCE(oc.sort_order, 999999) AS sort_order
      FROM offence_type ot
      LEFT JOIN offence_category oc ON oc.id = ot.category_id
      ORDER BY sort_order, ot.name
      `
    )
    .all() as { id: number; name: string; category: string; sort_order: number }[];

  const groups: OptionGroup[] = [];
  const byCategory = new Map<string, Option[]>();
  for (const row of rows) {
    let types = byCategory.get(row.category);
    if (!types) {
      types = [];
      byCategory.set(row.category, types);
      groups.push({ category: titleCase(row.category), types });
    }
    types.push({ id: row.id, name: row.name });
  }
  return groups;
}
