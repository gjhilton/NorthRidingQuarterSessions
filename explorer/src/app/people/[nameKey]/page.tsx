import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "styled-system/css";
import { getPersonNetwork } from "@/lib/queries/people";
import { NetworkView } from "@/components/network/NetworkView";
import { Card, PageContainer, PageTitle, Pill, Table, Th, Td } from "@/components/ui";

export default async function PersonPage(props: PageProps<"/people/[nameKey]">) {
  const { nameKey } = await props.params;
  const network = getPersonNetwork(decodeURIComponent(nameKey));
  if (!network) notFound();

  return (
    <PageContainer>
      <div>
        <Link href="/people" className={css({ fontSize: "sm", color: "fgMuted" })}>
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
            </tr>
          </thead>
          <tbody>
            {network.cases.map((c) => (
              <tr key={`${c.summary_conviction_id}-${c.role}`}>
                <Td>
                  <Link
                    href={`/browse/${c.summary_conviction_id}`}
                    className={css({ color: "fgAccent", fontWeight: "600" })}
                  >
                    {c.reference_number}
                  </Link>
                </Td>
                <Td>{c.conviction_date ?? "—"}</Td>
                <Td>
                  <Pill>{c.role}</Pill>
                </Td>
                <Td>{c.charge_description}</Td>
              </tr>
            ))}
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
      <h2 className={css({ fontFamily: "serif", fontSize: "xl", fontWeight: "600" })}>{title}</h2>
      {children}
    </section>
  );
}
