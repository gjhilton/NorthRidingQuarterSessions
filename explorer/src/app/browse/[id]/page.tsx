import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "styled-system/css";
import {
  getConvictionDefendants,
  getConvictionDetail,
  getConvictionInvolvedPersons,
} from "@/lib/queries/browse";
import { Card, PageContainer, PageTitle, Pill } from "@/components/ui";

export default async function ConvictionDetailPage(props: PageProps<"/browse/[id]">) {
  const { id } = await props.params;
  const convictionId = Number(id);
  if (!Number.isFinite(convictionId)) notFound();

  const conviction = getConvictionDetail(convictionId);
  if (!conviction) notFound();

  const defendants = getConvictionDefendants(convictionId);
  const involvedPersons = getConvictionInvolvedPersons(convictionId);

  return (
    <PageContainer>
      <div>
        <Link href="/browse" className={css({ fontSize: "sm", color: "fgMuted" })}>
          ← Back to browse
        </Link>
        <PageTitle subtitle={conviction.conviction_date ?? conviction.conviction_date_raw}>
          {conviction.reference_number}
        </PageTitle>
      </div>

      <Card className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
        <div className={css({ display: "flex", gap: "2", flexWrap: "wrap" })}>
          {conviction.offence_type_name && <Pill>{conviction.offence_type_name}</Pill>}
          {conviction.offence_town_name && <Pill>Offence: {conviction.offence_town_name}</Pill>}
          {conviction.court_town_name && <Pill>Court: {conviction.court_town_name}</Pill>}
          {conviction.offence_date && <Pill>Offence date: {conviction.offence_date}</Pill>}
        </div>
        <p>{conviction.charge_description}</p>
        {conviction.sentencing && (
          <p className={css({ color: "fgMuted", fontSize: "sm" })}>
            <strong>Sentencing:</strong> {conviction.sentencing}
          </p>
        )}
        <a
          href={conviction.archive_url}
          target="_blank"
          rel="noopener noreferrer"
          className={css({ fontSize: "sm", color: "fgAccent" })}
        >
          View original archive record →
        </a>
      </Card>

      {defendants.length > 0 && (
        <Section title="Defendants">
          <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
            {defendants.map((d) => (
              <Card key={d.id}>
                <Link
                  href={`/people/${encodeURIComponent(
                    `${d.first_name ?? ""} ${d.last_name ?? ""}`.trim().toLowerCase()
                  )}`}
                  className={css({ fontWeight: "600", color: "fgAccent" })}
                >
                  {d.first_name} {d.last_name}
                </Link>
                {d.aliases.length > 0 && (
                  <p className={css({ fontSize: "sm", color: "fgMuted" })}>
                    aka {d.aliases.join(", ")}
                  </p>
                )}
                <dl className={detailListStyle}>
                  {d.sex && <Detail label="Sex" value={d.sex} />}
                  {d.occupation && <Detail label="Occupation" value={d.occupation} />}
                  {d.town_name && <Detail label="Town" value={d.town_name} />}
                  {d.street_name && <Detail label="Street" value={d.street_name} />}
                  {d.prior_convictions && (
                    <Detail label="Prior convictions" value={d.prior_convictions} />
                  )}
                  {d.relationships_and_details && (
                    <Detail label="Details" value={d.relationships_and_details} />
                  )}
                </dl>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {involvedPersons.length > 0 && (
        <Section title="Involved persons">
          <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
            {involvedPersons.map((p) => (
              <Card key={p.id}>
                <Link
                  href={`/people/${encodeURIComponent(
                    `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim().toLowerCase()
                  )}`}
                  className={css({ fontWeight: "600", color: "fgAccent" })}
                >
                  {p.first_name} {p.last_name}
                </Link>
                {p.role && <span className={css({ ml: "2" })}><Pill>{p.role}</Pill></span>}
                <dl className={detailListStyle}>
                  {p.occupation && <Detail label="Occupation" value={p.occupation} />}
                  {p.town_name && <Detail label="Town" value={p.town_name} />}
                  {p.relationships_and_details && (
                    <Detail label="Details" value={p.relationships_and_details} />
                  )}
                </dl>
              </Card>
            ))}
          </div>
        </Section>
      )}

      <Section title="Raw record">
        <Card>
          <p className={css({ fontSize: "sm", color: "fgMuted", whiteSpace: "pre-wrap" })}>
            {conviction.raw_record}
          </p>
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={css({ fontSize: "xs", color: "fgMuted" })}>{label}</dt>
      <dd className={css({ fontSize: "sm" })}>{value}</dd>
    </div>
  );
}

const detailListStyle = css({
  display: "grid",
  gridTemplateColumns: { base: "1fr", sm: "repeat(auto-fill, minmax(9rem, 1fr))" },
  gap: "2",
  mt: "2",
});
