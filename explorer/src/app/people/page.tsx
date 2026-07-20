import Link from "next/link";
import { css } from "styled-system/css";
import { searchPeople } from "@/lib/queries/people";
import { Card, EmptyState, PageContainer, PageTitle, Pill } from "@/components/ui";

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const results = q.trim() ? searchPeople(q) : [];

  return (
    <PageContainer>
      <PageTitle subtitle="Search for a defendant or involved person, then trace their connections">
        People
      </PageTitle>

      <form
        method="GET"
        className={css({ display: "flex", gap: "3" })}
      >
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name…"
          autoFocus
          className={css({
            flex: "1",
            border: "1px solid",
            borderColor: "borderMuted",
            borderRadius: "md",
            px: "3",
            py: "2",
            fontSize: "sm",
            bg: "bgSurface",
            color: "fg",
          })}
        />
        <button
          type="submit"
          className={css({
            bg: "fgAccent",
            color: "bgSurface",
            px: "4",
            py: "2",
            borderRadius: "md",
            fontSize: "sm",
            fontWeight: "600",
            cursor: "pointer",
            border: "none",
          })}
        >
          Search
        </button>
      </form>

      {q.trim() && results.length === 0 && <EmptyState>No matches for “{q}”.</EmptyState>}

      {results.length > 0 && (
        <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
          {results.map((r) => (
            <Link key={r.name_key} href={`/people/${encodeURIComponent(r.name_key)}`}>
              <Card
                className={css({
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  _hover: { borderColor: "fgAccent" },
                })}
              >
                <span className={css({ fontWeight: "600" })}>{r.display_name}</span>
                <span className={css({ display: "flex", gap: "2" })}>
                  {r.defendant_mentions > 0 && (
                    <Pill>
                      {r.defendant_mentions} defendant mention{r.defendant_mentions === 1 ? "" : "s"}
                    </Pill>
                  )}
                  {r.person_mentions > 0 && (
                    <Pill>
                      {r.person_mentions} other mention{r.person_mentions === 1 ? "" : "s"}
                    </Pill>
                  )}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
