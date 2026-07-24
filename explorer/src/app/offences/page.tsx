import Link from "next/link";
import { css } from "styled-system/css";
import { listOffenceTypesByCategory } from "@/lib/queries/offences";
import { Card, EmptyState, PageContainer, PageTitle } from "@/components/ui";
import { formatOffenceCategory, sentenceCase } from "@/lib/text";

const categoryHeadingStyle = css({ fontFamily: "serif", fontSize: "XL", fontWeight: "600" });

// Same master-list convention as /streets (one Card per row, plain-text
// count), grouped under each category (taxonomy's own sort_order) rather
// than one flat alphabetical list -- types alphabetical within each group.
export default function OffencesPage() {
  const categories = listOffenceTypesByCategory();

  return (
    <PageContainer>
      <PageTitle>Offences</PageTitle>

      {categories.length === 0 ? (
        <EmptyState>No offence types found.</EmptyState>
      ) : (
        categories.map((group) => (
          <section key={group.category} className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
            <h2 className={categoryHeadingStyle}>{formatOffenceCategory(group.category)}</h2>
            <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
              {group.types.map((o) => (
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
                    <span className={css({ color: "fgMuted", fontSize: "M" })}>
                      <strong>{o.count}</strong> conviction{o.count === 1 ? "" : "s"}
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </PageContainer>
  );
}
