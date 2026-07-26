import "server-only";
import { Suspense } from "react";
import { getDb } from "@/lib/db";
import { listPeople, listLetterCounts, PAGE_SIZE } from "@/lib/queries/peopleList";
import {
  listPersonNameLetters,
  listPersonRoles,
  listResidenceTowns,
  listOccupations,
  getConvictionDateRange,
} from "@/lib/queries/filters";
import { PageContainer, PageTitle } from "@/components/ui";
import { PeopleBrowseList } from "@/components/people/PeopleBrowseList";

// The unfiltered first page is prerendered at build time (better-sqlite3,
// same as every other page). Only the interactive search/filter/pagination
// below it falls back to client-side SQLite, and only once the user
// actually interacts with it -- see src/lib/clientDb.ts. PeopleSearch (a
// separate free-text-to-a-specific-person lookup, not part of this
// listing's own filters) lives inside PeopleBrowseList's filter box now.
export default function PeoplePage() {
  const db = getDb();
  const { rows, total } = listPeople(db, { page: 1, pageSize: PAGE_SIZE });

  return (
    <PageContainer>
      <PageTitle>People</PageTitle>
      <Suspense fallback={null}>
        <PeopleBrowseList
          initialRows={rows}
          initialTotal={total}
          initialLetterCounts={listLetterCounts(db, { page: 1, pageSize: PAGE_SIZE })}
          letters={listPersonNameLetters()}
          roles={listPersonRoles()}
          towns={listResidenceTowns()}
          occupations={listOccupations()}
          convictionDateRange={getConvictionDateRange()}
        />
      </Suspense>
    </PageContainer>
  );
}
