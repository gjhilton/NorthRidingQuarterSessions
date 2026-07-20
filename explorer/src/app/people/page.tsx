import Link from "next/link";
import { css } from "styled-system/css";
import { Card, PageContainer, PageTitle, Pill } from "@/components/ui";
import { PeopleSearch } from "@/components/people/PeopleSearch";
import { PeopleBrowseList } from "@/components/people/PeopleBrowseList";
import { listAllPeople } from "@/lib/queries/peopleList";
import { toSlug } from "@/lib/slug";

const LEADERBOARD_SIZE = 10;

// Arbitrary free-text name search can't be enumerated at build time, so
// PeopleSearch's results come from client-side SQLite (src/lib/clientDb.ts)
// once the user starts typing. Everything else on this page -- the
// leaderboard and the full A-Z index -- is a fixed, enumerable list, so it's
// prerendered at build time like the destination /people/[nameKey] pages.
export default function PeoplePage() {
  const people = listAllPeople();
  const leaderboard = [...people]
    .sort((a, b) => b.total_mentions - a.total_mentions)
    .slice(0, LEADERBOARD_SIZE);

  return (
    <PageContainer>
      <PageTitle subtitle="Search for a defendant or involved person, then trace their connections">
        People
      </PageTitle>
      <PeopleSearch />

      <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
        <h2 className={css({ fontFamily: "serif", fontSize: "xl", fontWeight: "600" })}>
          Most mentioned
        </h2>
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: { base: "1fr", sm: "repeat(2, 1fr)" },
            gap: "2",
          })}
        >
          {leaderboard.map((p) => (
            <Link key={p.name_key} href={`/people/${toSlug(p.name_key)}`}>
              <Card
                className={css({
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "3",
                  _hover: { borderColor: "fgAccent" },
                })}
              >
                <span className={css({ fontWeight: "600" })}>{p.display_name}</span>
                <Pill>
                  {p.total_mentions} mention{p.total_mentions === 1 ? "" : "s"}
                </Pill>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
        <h2 className={css({ fontFamily: "serif", fontSize: "xl", fontWeight: "600" })}>
          Browse all names
        </h2>
        <PeopleBrowseList people={people} />
      </section>
    </PageContainer>
  );
}
