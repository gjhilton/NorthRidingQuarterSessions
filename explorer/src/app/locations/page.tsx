import { PageContainer, PageTitle } from "@/components/ui";
import { LocationTables } from "@/components/LocationTables";
import { listPlaceTree } from "@/lib/queries/locationTree";

// Placeholder page: renders the new place tree as drill-down nested tables,
// so it can be eyeballed as the manual parish-by-parish migration
// progresses. Only Whitby's subtree is populated so far -- everything else
// still lives in the old flat town/street tables. Not linked from nav yet.
// (An alternative nested-list rendering, LocationTree.tsx, is still in the
// tree -- see git history for the version this page used before.)
export default function LocationsPage() {
  const roots = listPlaceTree();

  return (
    <PageContainer>
      <PageTitle subtitle="Work-in-progress view of the new place tree -- replacing the old flat town/street pair, one parish at a time">
        Locations
      </PageTitle>
      <LocationTables roots={roots} />
    </PageContainer>
  );
}
