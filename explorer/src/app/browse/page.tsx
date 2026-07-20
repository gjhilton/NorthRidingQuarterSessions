import "server-only";
import { getDb } from "@/lib/db";
import { listConvictions, PAGE_SIZE } from "@/lib/queries/browseList";
import { listTowns, listOffenceTypes } from "@/lib/queries/filters";
import { PageContainer, PageTitle } from "@/components/ui";
import { BrowseExplorer } from "@/components/browse/BrowseExplorer";

// The unfiltered first page is prerendered at build time (better-sqlite3,
// same as every other page). Only the interactive search/filter/pagination
// below it -- arbitrary combinations that can't be enumerated in advance --
// falls back to client-side SQLite, and only once the user actually
// interacts with it. See src/lib/clientDb.ts.
export default function BrowsePage() {
  const db = getDb();
  const { rows, total } = listConvictions(db, { page: 1, pageSize: PAGE_SIZE });
  const towns = listTowns();
  const offenceTypes = listOffenceTypes();

  return (
    <PageContainer>
      <PageTitle subtitle={`${total} record${total === 1 ? "" : "s"} in total`}>Browse</PageTitle>
      <BrowseExplorer
        initialRows={rows}
        initialTotal={total}
        towns={towns}
        offenceTypes={offenceTypes}
      />
    </PageContainer>
  );
}
