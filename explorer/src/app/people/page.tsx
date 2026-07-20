import { PageContainer, PageTitle } from "@/components/ui";
import { PeopleSearch } from "@/components/people/PeopleSearch";

// Arbitrary free-text name search can't be enumerated at build time, so this
// page's results come from client-side SQLite (src/lib/clientDb.ts) once the
// user starts typing. The destination pages (/people/[nameKey]) are, by
// contrast, fully prerendered -- see that route's generateStaticParams.
export default function PeoplePage() {
  return (
    <PageContainer>
      <PageTitle subtitle="Search for a defendant or involved person, then trace their connections">
        People
      </PageTitle>
      <PeopleSearch />
    </PageContainer>
  );
}
