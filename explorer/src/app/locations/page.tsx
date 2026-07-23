import { PageContainer, PageTitle } from "@/components/ui";
import { LocationGrid } from "@/components/LocationGrid";
import { listPlaceTree } from "@/lib/queries/locationTree";

// Placeholder page: renders the new place tree as one flat grid (rowSpan
// per node, colSpan filling out shallower branches), so it can be
// eyeballed as the manual parish-by-parish migration progresses. Only
// Whitby's subtree is populated so far -- everything else still lives in
// the old flat town/street tables. Not linked from nav yet.
// (Two other renderings -- LocationTree.tsx, a collapsible nested list, and
// LocationTables.tsx, drill-down nested tables -- are still in the tree,
// just unused by this page for now.)
export default function LocationsPage() {
  const roots = listPlaceTree();

  return (
    <PageContainer>
      <PageTitle subtitle="Work-in-progress view of the new place tree -- replacing the old flat town/street pair, one parish at a time">
        Locations
      </PageTitle>
      <LocationGrid roots={roots} />
    </PageContainer>
  );
}
