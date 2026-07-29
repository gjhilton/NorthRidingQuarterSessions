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
//
// crime_type is a single self-referencing tree now (parent_id IS NULL =
// category, else a leaf under that category) rather than the old
// offence_category/offence_type pair -- this page only ever needs the
// two-level category/leaf shape, so a plain self-join on parent_id covers
// it without needing tree.ts's general arbitrary-depth walker.
export function offenceTaxonomyTree(): TaxonomyCategory[] {
  const rows = getDb()
    .prepare(
      `
      SELECT
        cat.id AS category_id, cat.name AS category_name, cat.sort_order AS sort_order,
        leaf.id AS leaf_id, leaf.name AS leaf_name,
        COUNT(DISTINCT sc.id) AS count
      FROM crime_type cat
      JOIN crime_type leaf ON leaf.parent_id = cat.id
      LEFT JOIN summary_conviction_crime_type scct ON scct.crime_type_id = leaf.id
      LEFT JOIN summary_conviction sc ON sc.id = scct.summary_conviction_id
      WHERE cat.parent_id IS NULL
      GROUP BY cat.id, leaf.id
      ORDER BY cat.sort_order, count DESC
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
