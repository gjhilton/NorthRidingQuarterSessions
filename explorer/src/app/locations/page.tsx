import { PageContainer } from "@/components/ui";
import { LocationGrid } from "@/components/LocationGrid";
import { listPlaceTree } from "@/lib/queries/locationTree";

// Renders the place tree as one flat grid (rowSpan per node, colSpan
// filling out shallower branches). The page title itself is dynamic
// (Locations of Offences / All Locations) based on LocationGrid's own
// include-all toggle, so it's rendered inside that client component rather
// than here. (Two other renderings -- LocationTree.tsx, a collapsible
// nested list, and LocationTables.tsx, drill-down nested tables -- are
// still in the tree, just unused by this page for now.)
export default function LocationsPage() {
  const roots = listPlaceTree();

  return (
    <PageContainer>
      <LocationGrid roots={roots} />
    </PageContainer>
  );
}
