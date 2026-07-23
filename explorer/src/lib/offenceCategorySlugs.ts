// Maps offence_category.name (stored lowercase, see qsrecords/offence_types.py's
// OFFENCE_TAXONOMY) to the URL slug its future /offences/[slug] page will use.
// The routes don't exist yet -- see TODO.md's "Offence pages + 'Offences'
// section" entry -- but the homepage already links to four of these ahead of
// the pages existing, so this just extends that same forward-looking
// convention to the rest of the taxonomy's 17 categories rather than
// inventing a new scheme. Not a mechanical kebab-case of the name (a couple
// are deliberately shortened, matching the homepage's existing picks), so
// it's a lookup table, not a slugify function.
const OFFENCE_CATEGORY_SLUGS: Record<string, string> = {
  "drink & public order": "drink-public-order",
  "assault & resisting authority": "assault-resisting-authority",
  "highway, traffic & railways": "highway-traffic-railways",
  "property offences": "property-offences",
  "poaching & fishing": "poaching-fishing",
  "licensing & gaming": "licensing-gaming",
  "vagrancy, begging & rogue-and-vagabond offences": "vagrancy-begging",
  "poor law & workhouse": "poor-law-workhouse",
  education: "education",
  "master & servant / desertion of service": "master-servant",
  "weights, measures, food & trade": "weights-measures-trade",
  "public health": "public-health",
  animals: "animals",
  "maritime & customs": "maritime-customs",
  "miscellaneous regulatory": "miscellaneous-regulatory",
  "administrative / public office": "administrative-public-office",
  unclassified: "unclassified",
};

export function offenceCategorySlug(categoryName: string): string | undefined {
  return OFFENCE_CATEGORY_SLUGS[categoryName.toLowerCase()];
}
