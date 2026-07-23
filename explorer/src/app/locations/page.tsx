import { PageContainer, PageTitle } from "@/components/ui";
import { LocationTree } from "@/components/LocationTree";
import { listPlaceTree } from "@/lib/queries/locationTree";

// Placeholder page: renders the new place tree as nested, collapsible lists,
// so it can be eyeballed as the manual parish-by-parish migration
// progresses. Only Whitby's subtree is populated so far -- everything else
// still lives in the old flat town/street tables. Not linked from nav yet.
export default function LocationsPage() {
  const roots = listPlaceTree();

  return (
    <PageContainer>
      <PageTitle subtitle="Work-in-progress view of the new place tree -- replacing the old flat town/street pair, one parish at a time">
        Locations
      </PageTitle>
      <LocationTree roots={roots} />
    </PageContainer>
  );
}
