// Shared SQL subquery fragments used verbatim by more than one query file --
// pure strings, no getDb/server-only, safe to import from server-only and
// client-safe query modules alike. Extracted after finding the exact same
// text duplicated between locationTree.ts and offences.ts.

// Comma-joined "First Last" defendant names for a conviction, aliased `sc`
// in the enclosing query. Display order (first name first) -- for a
// sortable surname-first version, see browseList.ts's own
// DEFENDANT_SORT_EXPR, which is deliberately different, not a duplicate.
export const DEFENDANT_NAMES_EXPR = `(
  SELECT GROUP_CONCAT(TRIM(COALESCE(d.first_name,'') || ' ' || COALESCE(d.last_name,'')), ', ')
  FROM summary_conviction_defendant scd
  JOIN defendant d ON d.id = scd.defendant_id
  WHERE scd.summary_conviction_id = sc.id
)`;
