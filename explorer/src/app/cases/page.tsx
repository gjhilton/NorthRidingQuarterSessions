import "server-only";
import { Suspense } from "react";
import { getDb } from "@/lib/db";
import { listConvictions, PAGE_SIZE } from "@/lib/queries/browseList";
import {
  listTowns,
  listOffenceStreets,
  listOffenceCategories,
  listOffenceTypes,
  getOffenceDateRange,
  getConvictionDateRange,
  listDefendantCounts,
} from "@/lib/queries/filters";
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
  const streets = listOffenceStreets();
  const offenceCategories = listOffenceCategories();
  const offenceTypes = listOffenceTypes();
  const dateRange = getOffenceDateRange();
  const sentenceDateRange = getConvictionDateRange();
  const defendantCounts = listDefendantCounts();

  return (
    <PageContainer>
      <PageTitle>Cases</PageTitle>
      <Suspense fallback={null}>
        <BrowseExplorer
          initialRows={rows}
          initialTotal={total}
          towns={towns}
          streets={streets}
          offenceCategories={offenceCategories}
          offenceTypes={offenceTypes}
          dateRange={dateRange}
          sentenceDateRange={sentenceDateRange}
          defendantCounts={defendantCounts}
        />
      </Suspense>
    </PageContainer>
  );
}
