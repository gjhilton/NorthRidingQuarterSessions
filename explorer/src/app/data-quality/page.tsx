import Link from "next/link";
import { css } from "styled-system/css";
import {
  recentExtractionFailures,
  repeatedDefendantNames,
  repeatedPersonNames,
  rawCaseStatusBreakdown,
  unreviewedOffenceTypes,
} from "@/lib/queries/quality";
import { Card, EmptyState, PageContainer, PageTitle, Pill, Table, Th, Td } from "@/components/ui";
import { toSlug } from "@/lib/slug";

export default function DataQualityPage() {
  const repeatedDefendants = repeatedDefendantNames();
  const repeatedPersons = repeatedPersonNames();
  const unreviewedOffences = unreviewedOffenceTypes();
  const statusBreakdown = rawCaseStatusBreakdown();
  const failures = recentExtractionFailures();

  return (
    <PageContainer>
      <PageTitle subtitle="Mirrors data-loader/report.py -- review queues, not automated fixes">
        Data quality
      </PageTitle>

      <Section title="Raw case pipeline status">
        <div className={css({ display: "flex", gap: "3", flexWrap: "wrap" })}>
          {statusBreakdown.map((s) => (
            <Card key={s.status} className={css({ minWidth: "8rem" })}>
              <div className={css({ fontSize: "xl", fontWeight: "600", fontFamily: "serif" })}>
                {s.count}
              </div>
              <div className={css({ fontSize: "sm", color: "fgMuted" })}>{s.status}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title={`Repeated defendant names (${repeatedDefendants.length})`}
        note="Same name_key across multiple mentions -- candidates for manual cross-case identity resolution, not automatically merged."
      >
        <NameList
          rows={repeatedDefendants.map((r) => ({ ...r, href: `/people/${toSlug(r.name_key)}` }))}
        />
      </Section>

      <Section
        title={`Repeated involved-person names (${repeatedPersons.length})`}
        note="Witnesses, victims, prosecutors etc. whose name recurs across cases."
      >
        <NameList
          rows={repeatedPersons.map((r) => ({ ...r, href: `/people/${toSlug(r.name_key)}` }))}
        />
      </Section>

      <Section
        title={`Unreviewed offence types (${unreviewedOffences.length})`}
        note="LLM-proposed categories beyond the seed list -- review for near-duplicates and merge by hand."
      >
        {unreviewedOffences.length === 0 ? (
          <EmptyState>None pending review.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Offence type</Th>
                <Th>Case count</Th>
              </tr>
            </thead>
            <tbody>
              {unreviewedOffences.map((o) => (
                <tr key={o.name}>
                  <Td>{o.name}</Td>
                  <Td>{o.count}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>

      <Section title={`Recent extraction failures (${failures.length})`}>
        {failures.length === 0 ? (
          <EmptyState>No extraction failures recorded.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Reference</Th>
                <Th>Attempted</Th>
                <Th>Provider / model</Th>
                <Th>Error</Th>
              </tr>
            </thead>
            <tbody>
              {failures.map((f) => (
                <tr key={f.id}>
                  <Td>{f.reference_number}</Td>
                  <Td>{f.attempted_at}</Td>
                  <Td>
                    {f.provider} / {f.model}
                  </Td>
                  <Td className={css({ maxWidth: "24rem" })}>{f.error_message ?? "—"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>
    </PageContainer>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <div>
        <h2 className={css({ fontFamily: "serif", fontSize: "xl", fontWeight: "600" })}>{title}</h2>
        {note && <p className={css({ fontSize: "sm", color: "fgMuted", mt: "1" })}>{note}</p>}
      </div>
      {children}
    </section>
  );
}

function NameList({ rows }: { rows: { name_key: string; count: number; href: string }[] }) {
  if (rows.length === 0) return <EmptyState>None found.</EmptyState>;
  return (
    <div className={css({ display: "flex", flexWrap: "wrap", gap: "2" })}>
      {rows.map((r) => (
        <Link key={r.name_key} href={r.href}>
          <Pill>
            {r.name_key} ({r.count}×)
          </Pill>
        </Link>
      ))}
    </div>
  );
}
