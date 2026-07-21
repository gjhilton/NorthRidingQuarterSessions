import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "styled-system/css";
import {
  getAdjacentConvictionIds,
  getConvictionDefendants,
  getConvictionDetail,
  getConvictionInvolvedPersons,
  getRelatedConvictions,
  listConvictionIds,
} from "@/lib/queries/browseDetail";
import { Card, PageContainer, PageTitle, Pill } from "@/components/ui";
import { toSlug } from "@/lib/slug";
import { titleCase } from "@/lib/text";
import { CopyCitationButton } from "@/components/CopyCitationButton";
import { formatDate } from "@/lib/date";

// The dataset is static, so every conviction detail page can be prerendered
// at build time -- only free-text search/filtering (in BrowseExplorer) needs
// client-side SQLite.
export async function generateStaticParams() {
  return listConvictionIds().map((id) => ({ id: String(id) }));
}

export default async function ConvictionDetailPage(props: PageProps<"/browse/[id]">) {
  const { id } = await props.params;
  const convictionId = Number(id);
  if (!Number.isFinite(convictionId)) notFound();

  const conviction = getConvictionDetail(convictionId);
  if (!conviction) notFound();

  const defendants = getConvictionDefendants(convictionId);
  const involvedPersons = getConvictionInvolvedPersons(convictionId);
  const relatedConvictions = getRelatedConvictions(convictionId);
  const { prevId, nextId } = getAdjacentConvictionIds(convictionId);
  const citationText = `North Riding Quarter Sessions Bundles, ${conviction.reference_number}, North Yorkshire County Record Office, Archives Unlocked, ${conviction.archive_url}`;

  return (
    <PageContainer>
      <div>
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <Link href="/browse" className={css({ fontSize: "body", color: "fgMuted" })}>
            ← Back to browse
          </Link>
          <div className={css({ display: "flex", gap: "3", fontSize: "body" })}>
            {prevId !== null ? (
              <Link href={`/browse/${prevId}`} className={css({ color: "fgAccent" })}>
                ← Previous
              </Link>
            ) : (
              <span className={css({ color: "fgMuted", opacity: 0.5 })}>← Previous</span>
            )}
            {nextId !== null ? (
              <Link href={`/browse/${nextId}`} className={css({ color: "fgAccent" })}>
                Next →
              </Link>
            ) : (
              <span className={css({ color: "fgMuted", opacity: 0.5 })}>Next →</span>
            )}
          </div>
        </div>
        <PageTitle subtitle={formatDate(conviction.conviction_date) ?? conviction.conviction_date_raw}>
          {conviction.reference_number}
        </PageTitle>
      </div>

      <Card className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
        <div className={css({ display: "flex", gap: "2", flexWrap: "wrap" })}>
          {conviction.offence_type_names.map((name) => (
            <Pill key={name}>{name}</Pill>
          ))}
          {conviction.offence_town_name && (
            <Pill>Offence: {titleCase(conviction.offence_town_name)}</Pill>
          )}
          {conviction.court_town_name && <Pill>Court: {titleCase(conviction.court_town_name)}</Pill>}
          {conviction.offence_date && <Pill>Offence date: {formatDate(conviction.offence_date)}</Pill>}
          {conviction.petty_sessional_division_name && (
            <Pill>Division: {conviction.petty_sessional_division_name}</Pill>
          )}
          {conviction.monetary_value_raw && <Pill>Value: {conviction.monetary_value_raw}</Pill>}
          {conviction.game_species && <Pill>Species: {conviction.game_species}</Pill>}
        </div>
        <p>{conviction.charge_description}</p>
        {conviction.sentencing && (
          <p className={css({ color: "fgMuted", fontSize: "body" })}>
            <strong>Sentencing:</strong> {conviction.sentencing}
          </p>
        )}
        {conviction.correction_note && (
          <p
            className={css({
              fontSize: "body",
              color: "fg",
              bg: "bgSurface",
              borderWidth: "hairline", borderStyle: "solid",
              borderColor: "fgAccent",
              borderRadius: "corner",
              px: "3",
              py: "2",
            })}
          >
            <strong>Editorial correction:</strong> {conviction.correction_note}
          </p>
        )}
        {(conviction.extraction_confidence === "medium" ||
          conviction.extraction_confidence === "low") && (
          <p
            className={css({
              fontSize: "body",
              color: "fgAccent",
              bg: "bg",
              borderWidth: "hairline", borderStyle: "solid",
              borderColor: "borderMuted",
              borderRadius: "corner",
              px: "3",
              py: "2",
            })}
          >
            <strong>
              {conviction.extraction_confidence === "low" ? "Low" : "Medium"} extraction
              confidence
            </strong>
            {conviction.uncertain_fields
              ? ` — the model flagged: ${conviction.uncertain_fields}. Worth checking against the original record.`
              : " — worth checking against the original record."}
          </p>
        )}
        <a
          href={conviction.archive_url}
          target="_blank"
          rel="noopener noreferrer"
          className={css({ fontSize: "body", color: "fgAccent" })}
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
                  href={`/people/${toSlug(
                    `${d.first_name ?? ""} ${d.last_name ?? ""}`.trim().toLowerCase()
                  )}`}
                  className={css({ fontWeight: "600", color: "fgAccent" })}
                >
                  {d.first_name} {d.last_name}
                </Link>
                {d.aliases.length > 0 && (
                  <p className={css({ fontSize: "body", color: "fgMuted" })}>
                    aka {d.aliases.join(", ")}
                  </p>
                )}
                <dl className={detailListStyle}>
                  {d.sex && <Detail label="Sex" value={d.sex} />}
                  {d.age !== null && <Detail label="Age" value={`${d.age}`} />}
                  {d.marital_status && <Detail label="Marital status" value={d.marital_status} />}
                  {d.relationship_type && d.related_to_name && (
                    <Detail
                      label="Relationship"
                      value={`${d.relationship_type} of ${d.related_to_name}`}
                    />
                  )}
                  {d.occupation && <Detail label="Occupation" value={d.occupation} />}
                  {d.town_name && <Detail label="Town" value={titleCase(d.town_name)} />}
                  {d.street_name && <Detail label="Street" value={titleCase(d.street_name)} />}
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
                  href={`/people/${toSlug(
                    `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim().toLowerCase()
                  )}`}
                  className={css({ fontWeight: "600", color: "fgAccent" })}
                >
                  {p.first_name} {p.last_name}
                </Link>
                {p.role && <span className={css({ ml: "2" })}><Pill>{p.role}</Pill></span>}
                <dl className={detailListStyle}>
                  {p.age !== null && <Detail label="Age" value={`${p.age}`} />}
                  {p.marital_status && <Detail label="Marital status" value={p.marital_status} />}
                  {p.relationship_type && p.related_to_name && (
                    <Detail
                      label="Relationship"
                      value={`${p.relationship_type} of ${p.related_to_name}`}
                    />
                  )}
                  {p.occupation && <Detail label="Occupation" value={p.occupation} />}
                  {p.town_name && <Detail label="Town" value={titleCase(p.town_name)} />}
                  {p.relationships_and_details && (
                    <Detail label="Details" value={p.relationships_and_details} />
                  )}
                </dl>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {relatedConvictions.length > 0 && (
        <Section title="Related cases">
          <p className={css({ fontSize: "small", color: "fgMuted", mt: "-2" })}>
            Detected automatically (same defendant on the same date, or several
            defendants charged with the same wording on the same date and street) —
            a suggestion worth checking, not a certainty.
          </p>
          <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
            {relatedConvictions.map((rc) => (
              <Card key={rc.id}>
                <Link
                  href={`/browse/${rc.id}`}
                  className={css({ fontWeight: "600", color: "fgAccent" })}
                >
                  {rc.reference_number}
                </Link>
                <p className={css({ fontSize: "small", color: "fgMuted", mt: "1" })}>
                  {formatDate(rc.conviction_date) ?? rc.conviction_date_raw}
                </p>
                <p className={css({ fontSize: "body", mt: "1" })}>{rc.charge_description}</p>
                {rc.note && (
                  <p className={css({ fontSize: "small", color: "fgMuted", mt: "2" })}>{rc.note}</p>
                )}
              </Card>
            ))}
          </div>
        </Section>
      )}

      <Section title="Raw record">
        <Card>
          <p className={css({ fontSize: "body", color: "fgMuted", whiteSpace: "pre-wrap" })}>
            {conviction.raw_record}
          </p>
        </Card>
      </Section>

      <Section title="Citing this record">
        <Card>
          <p className={css({ fontSize: "body" })}>
            North Riding Quarter Sessions Bundles, {conviction.reference_number}, North Yorkshire
            County Record Office, Archives Unlocked,{" "}
            <a
              href={conviction.archive_url}
              target="_blank"
              rel="noopener noreferrer"
              className={css({ color: "fgAccent" })}
            >
              {conviction.archive_url}
            </a>
          </p>
          <p className={css({ fontSize: "small", color: "fgMuted", mt: "2" })}>
            Cite the original archive record, not this site — see{" "}
            <Link href="/about" className={css({ color: "fgAccent" })}>
              About
            </Link>{" "}
            for why.
          </p>
          <CopyCitationButton text={citationText} />
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={css({ fontSize: "small", color: "fgMuted" })}>{label}</dt>
      <dd className={css({ fontSize: "body" })}>{value}</dd>
    </div>
  );
}

const detailListStyle = css({
  display: "grid",
  gridTemplateColumns: { base: "1fr", sm: "repeat(auto-fill, minmax(9rem, 1fr))" },
  gap: "2",
  mt: "2",
});
