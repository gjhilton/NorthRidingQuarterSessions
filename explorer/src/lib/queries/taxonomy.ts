import "server-only";
import { getDb } from "@/lib/db";
import { titleCase } from "@/lib/text";

export interface TaxonomyLeaf {
  id: number;
  name: string;
  count: number;
}

export interface TaxonomyCategory {
  id: number;
  name: string;
  total: number;
  leaves: TaxonomyLeaf[];
}

// The full category -> leaf -> conviction-count tree, largest category
// first (not the curated sort_order used for chart legends in trends.ts --
// a reference page reads better biggest-first), for the /taxonomy page.
// See data-loader/qsrecords/offence_types.py's OFFENCE_TAXONOMY for how
// this was built (91 near-duplicate offence_type strings consolidated into
// 55 canonical leaves under 17 categories).
export function offenceTaxonomyTree(): TaxonomyCategory[] {
  const rows = getDb()
    .prepare(
      `
      SELECT
        oc.id AS category_id, oc.name AS category_name, oc.sort_order AS sort_order,
        ot.id AS leaf_id, ot.name AS leaf_name,
        COUNT(DISTINCT sc.id) AS count
      FROM offence_category oc
      JOIN offence_type ot ON ot.category_id = oc.id
      LEFT JOIN summary_conviction_offence_type scot ON scot.offence_type_id = ot.id
      LEFT JOIN summary_conviction sc ON sc.id = scot.summary_conviction_id
      GROUP BY oc.id, ot.id
      ORDER BY oc.sort_order, count DESC
      `
    )
    .all() as {
    category_id: number;
    category_name: string;
    sort_order: number;
    leaf_id: number;
    leaf_name: string;
    count: number;
  }[];

  const byCategory = new Map<number, TaxonomyCategory>();
  for (const row of rows) {
    let category = byCategory.get(row.category_id);
    if (!category) {
      category = { id: row.category_id, name: titleCase(row.category_name), total: 0, leaves: [] };
      byCategory.set(row.category_id, category);
    }
    category.total += row.count;
    category.leaves.push({ id: row.leaf_id, name: row.leaf_name, count: row.count });
  }

  return [...byCategory.values()].sort((a, b) => b.total - a.total);
}
