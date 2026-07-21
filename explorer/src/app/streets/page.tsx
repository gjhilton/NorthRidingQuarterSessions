import Link from "next/link";
import { css } from "styled-system/css";
import { listStreets } from "@/lib/queries/streets";
import { Card, EmptyState, PageContainer, PageTitle, Pill } from "@/components/ui";
import { titleCase } from "@/lib/text";

export default function StreetsPage() {
  const streets = listStreets();

  return (
    <PageContainer>
      <PageTitle subtitle="Every street with at least one extracted case, most-mentioned first">
        Streets
      </PageTitle>

      {streets.length === 0 ? (
        <EmptyState>No street-level data extracted yet.</EmptyState>
      ) : (
        <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
          {streets.map((s) => (
            <Link key={s.id} href={`/streets/${s.id}`}>
              <Card
                className={css({
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  _hover: { borderColor: "fgAccent" },
                })}
              >
                <span>
                  <span className={css({ fontWeight: "600" })}>{titleCase(s.name)}</span>
                  {s.town_name && (
                    <span className={css({ color: "fgMuted", fontSize: "body" })}>
                      {" "}
                      · {titleCase(s.town_name)}
                    </span>
                  )}
                </span>
                <Pill>
                  {s.case_count} case{s.case_count === 1 ? "" : "s"}
                </Pill>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
