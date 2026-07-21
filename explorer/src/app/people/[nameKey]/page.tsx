import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "styled-system/css";
import { getPersonNetwork, listNameKeys, type CaseMention } from "@/lib/queries/peopleNetwork";
import { NetworkView } from "@/components/network/NetworkView";
import { Card, PageContainer, PageTitle, Pill, Table, Th, Td } from "@/components/ui";
import { fromSlug, toSlug } from "@/lib/slug";
import { titleCase } from "@/lib/text";
import { formatDate } from "@/lib/date";

function caseDetails(c: CaseMention): string {
  return [
    c.occupation,
    c.age !== null ? `age ${c.age}` : null,
    c.marital_status,
    c.relationship_type && c.related_to_name ? `${c.relationship_type} of ${c.related_to_name}` : null,
  ]
    .filter(Boolean)
    .join(", ");
}

// The set of known name_keys is static (fixed dataset), so every person page
// can be prerendered -- only the free-text search on /people needs
// client-side SQLite.
export async function generateStaticParams() {
  return listNameKeys().map((nameKey) => ({ nameKey: toSlug(nameKey) }));
}

export default async function PersonPage(props: PageProps<"/people/[nameKey]">) {
  const { nameKey } = await props.params;
  const network = getPersonNetwork(fromSlug(nameKey));
  if (!network) notFound();

  return (
    <PageContainer>
      <div>
        <Link href="/people" className={css({ fontSize: "body", color: "fgMuted" })}>
          ← Back to search
        </Link>
        <PageTitle
          subtitle={
            network.aliases.length > 0 ? `also known as ${network.aliases.join(", ")}` : undefined
          }
        >
          {network.display_name}
        </PageTitle>
      </div>

      <Section title={`Cases (${network.cases.length})`}>
        <Table>
          <thead>
            <tr>
              <Th>Reference</Th>
              <Th>Date</Th>
              <Th>Role</Th>
              <Th>Charge</Th>
              <Th>Details</Th>
            </tr>
          </thead>
          <tbody>
            {network.cases.map((c) => {
              const details = caseDetails(c);
              return (
                <tr key={`${c.summary_conviction_id}-${c.role}`}>
                  <Td>
                    <Link
                      href={`/browse/${c.summary_conviction_id}`}
                      className={css({ color: "fgAccent", fontWeight: "600" })}
                    >
                      {c.reference_number}
                    </Link>
                  </Td>
                  <Td>{formatDate(c.conviction_date) ?? "—"}</Td>
                  <Td>
                    <Pill>{c.role}</Pill>
                  </Td>
                  <Td>{c.charge_description}</Td>
                  <Td>
                    {details && <span>{details}</span>}
                    {c.town_name && (
                      <>
                        {details && " · "}
                        <Link href="/map" className={css({ color: "fgAccent" })}>
                          {titleCase(c.town_name)}
                        </Link>
                      </>
                    )}
                    {!details && !c.town_name && "—"}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Section>

      <Section title={`Connections (${network.connections.length})`}>
        <Card>
          <NetworkView connections={network.connections} graph={network.graph} />
        </Card>
      </Section>
    </PageContainer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <h2 className={css({ fontFamily: "serif", fontSize: "heading", fontWeight: "600" })}>{title}</h2>
      {children}
    </section>
  );
}
