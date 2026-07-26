import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "styled-system/css";
import { getPersonNetwork, listNameKeys, type CaseMention } from "@/lib/queries/peopleNetwork";
import { NetworkView } from "@/components/network/NetworkView";
import { Card, PageContainer, PageTitle, Pill, Table, Th, Td } from "@/components/ui";
import { ClickableTr, referenceCellStyle, StopPropagation } from "@/components/ClickableRow";
import { fromSlug, toSlug } from "@/lib/slug";
import { convictionHref } from "@/lib/referenceSlug";
import { locationHref } from "@/lib/links";
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
        <Link href="/people" className={css({ fontSize: "M", color: "fgMuted" })}>
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
        <Table fontSize="M">
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
                <ClickableTr key={`${c.summary_conviction_id}-${c.role}`} href={convictionHref(c.reference_number)}>
                  <Td verticalAlign="middle" className={referenceCellStyle}>{c.reference_number}</Td>
                  <Td verticalAlign="middle">{formatDate(c.conviction_date) ?? "—"}</Td>
                  <Td verticalAlign="middle">
                    <Pill>{titleCase(c.role)}</Pill>
                  </Td>
                  <Td verticalAlign="middle">{c.charge_description}</Td>
                  <Td verticalAlign="middle">
                    {details && <span>{details}</span>}
                    {c.location_name && c.location_id && (
                      <>
                        {details && " · "}
                        <StopPropagation>
                          <Link href={locationHref(c.location_id)} className={css({ color: "fgAccent" })}>
                            {titleCase(c.location_name)}
                          </Link>
                        </StopPropagation>
                      </>
                    )}
                    {!details && !(c.location_name && c.location_id) && "—"}
                  </Td>
                </ClickableTr>
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
      <h2 className={css({ fontFamily: "serif", fontSize: "XL", fontWeight: "600" })}>{title}</h2>
      {children}
    </section>
  );
}
