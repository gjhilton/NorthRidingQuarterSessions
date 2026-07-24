import Link from "next/link";
import { css } from "styled-system/css";
import { listOffenceTypesAlphabetical } from "@/lib/queries/offences";
import { Card, EmptyState, PageContainer, PageTitle, Pill } from "@/components/ui";
import { sentenceCase } from "@/lib/text";

// Same master-list convention as /streets: one Card per row, a Pill with
// the count, sorted alphabetically (not by count -- this is an index for
// looking a specific offence up, not a "what's most common" ranking).
export default function OffencesPage() {
  const offenceTypes = listOffenceTypesAlphabetical();

  return (
    <PageContainer>
      <PageTitle subtitle="Every offence type in the taxonomy, alphabetical">Offences</PageTitle>

      {offenceTypes.length === 0 ? (
        <EmptyState>No offence types found.</EmptyState>
      ) : (
        <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
          {offenceTypes.map((o) => (
            <Link key={o.id} href={`/offences/${o.id}`}>
              <Card
                className={css({
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  _hover: { borderColor: "fgAccent" },
                })}
              >
                <span className={css({ fontWeight: "600" })}>{sentenceCase(o.name)}</span>
                <Pill>
                  {o.count} conviction{o.count === 1 ? "" : "s"}
                </Pill>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
