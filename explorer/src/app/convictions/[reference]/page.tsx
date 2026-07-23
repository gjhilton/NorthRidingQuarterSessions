import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { css } from "styled-system/css";
import {
  getAdjacentConvictionSlugs,
  getConvictionDefendants,
  getConvictionDetail,
  getConvictionIdBySlug,
  getConvictionInvolvedPersons,
  type DetailInvolvedPerson,
  getConvictionPosition,
  getRelatedConvictions,
  listConvictionSlugs,
} from "@/lib/queries/browseDetail";
import { Card, PageContainer, PageTitle, Pill } from "@/components/ui";
import { ConvictionNav } from "@/components/ConvictionNav";
import { personHref } from "@/lib/links";
import { convictionHref } from "@/lib/referenceSlug";
import { titleCase } from "@/lib/text";
import { Roles, ROLE_LABELS, classifyInvolvedPersonRole } from "@/lib/roles";
import { CopyCitationButton } from "@/components/CopyCitationButton";
import { formatDate } from "@/lib/date";

// The dataset is static, so every conviction detail page can be prerendered
// at build time -- only free-text search/filtering (in BrowseExplorer) needs
// client-side SQLite.
export async function generateStaticParams() {
  return listConvictionSlugs().map((slug) => ({ reference: slug }));
}

export default async function ConvictionDetailPage(props: PageProps<"/convictions/[reference]">) {
  const { reference } = await props.params;
  const convictionId = getConvictionIdBySlug(reference);
  if (convictionId === undefined) notFound();

  const conviction = getConvictionDetail(convictionId);
  if (!conviction) notFound();

  const defendants = getConvictionDefendants(convictionId);
  const involvedPersons = getConvictionInvolvedPersons(convictionId);
  const police = involvedPersons.filter((p) => classifyInvolvedPersonRole(p.role) === Roles.police);
  const otherPersons = involvedPersons.filter((p) => classifyInvolvedPersonRole(p.role) === Roles.other);
  const relatedConvictions = getRelatedConvictions(convictionId);
  const { prevSlug, nextSlug } = getAdjacentConvictionSlugs(convictionId);
  const { position, total } = getConvictionPosition(convictionId);
  // Chicago Notes-Bibliography style (bibliography form, repository-first),
  // per CMOS guidance for archival/manuscript collections. Split so the URL
  // can be rendered as its own monospaced link while the clipboard copy
  // still gets the whole citation as one plain-text string.
  const citationPrefix = `North Yorkshire County Record Office. North Riding Quarter Sessions Bundles. ${conviction.reference_number}. Archives Unlocked North Yorkshire.`;
  const citation = `${citationPrefix} ${conviction.archive_url}.`;

  return (
    <PageContainer>
      <div>
        <Suspense fallback={null}>
          <ConvictionNav
            convictionSlug={reference}
            serverPrevSlug={prevSlug}
            serverNextSlug={nextSlug}
            serverPosition={position}
            serverTotal={total}
          />
        </Suspense>
        <PageTitle
          subtitle={`Conviction date: ${formatDate(conviction.conviction_date) ?? conviction.conviction_date_raw}`}
        >
          {conviction.reference_number}
        </PageTitle>
        {conviction.court_town_name && (
          <p className={css({ fontSize: "heading", color: "fg" })}>
            Court: {titleCase(conviction.court_town_name)}
          </p>
        )}
      </div>

      <Card bg="bgSurface" borderWidth="0">
        <p className={css({ fontSize: "heading", fontWeight: "600", color: "fg", whiteSpace: "pre-wrap" })}>
          &ldquo;{conviction.raw_record}&rdquo;
        </p>
        <div className={css({ display: "flex", justifyContent: "flex-end", mt: "3" })}>
          <a
            href={conviction.archive_url}
            target="_blank"
            rel="noopener noreferrer"
            className={css({ fontSize: "body", color: "fgAccent" })}
          >
            View original record at NYCRO →
          </a>
        </div>
      </Card>

      <Section title="Citing this record">
        <p className={css({ fontSize: "body", fontStyle: "italic" })}>
          Please cite the original record held by NYCRO, not this website (
          <Link href="/about" className={css({ color: "fgAccent" })}>
            why?
          </Link>
          )
        </p>
        <div className={css({ display: "flex", alignItems: "flex-start", gap: "3" })}>
          <p className={css({ fontSize: "body", overflowWrap: "break-word" })}>
            {citationPrefix}{" "}
            <a
              href={conviction.archive_url}
              target="_blank"
              rel="noopener noreferrer"
              className={css({ color: "fgAccent" })}
            >
              {conviction.archive_url}
            </a>
            .
          </p>
          <CopyCitationButton text={citation} label="Copy citation" />
        </div>
      </Section>

      {(defendants.length > 0 || involvedPersons.length > 0) && (
        <Section title="People" titleSize="display">
        {defendants.length > 0 && (
          <SubSection title={ROLE_LABELS[Roles.offender]}>
          <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
            {defendants.map((d) => (
              <Card key={d.id}>
                <Link
                  href={personHref(d.name_key)}
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
          </SubSection>
        )}

        {police.length > 0 && (
          <SubSection title={ROLE_LABELS[Roles.police]}>
          <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
            {police.map((p) => (
              <InvolvedPersonCard key={p.id} person={p} />
            ))}
          </div>
          </SubSection>
        )}

        {otherPersons.length > 0 && (
          <SubSection title={ROLE_LABELS[Roles.other]}>
          <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
            {otherPersons.map((p) => (
              <InvolvedPersonCard key={p.id} person={p} />
            ))}
          </div>
          </SubSection>
        )}
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
                  href={convictionHref(rc.reference_number)}
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

    </PageContainer>
  );
}

function Section({
  title,
  titleSize = "heading",
  children,
}: {
  title: string;
  titleSize?: "heading" | "display";
  children: React.ReactNode;
}) {
  return (
    <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <h2 className={css({ fontFamily: "serif", fontSize: titleSize, fontWeight: "600" })}>{title}</h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <h3 className={css({ fontFamily: "serif", fontSize: "body", fontWeight: "600" })}>{title}</h3>
      {children}
    </div>
  );
}

function InvolvedPersonCard({ person: p }: { person: DetailInvolvedPerson }) {
  return (
    <Card>
      <Link
        href={personHref(p.name_key)}
        className={css({ fontWeight: "600", color: "fgAccent" })}
      >
        {p.first_name} {p.last_name}
      </Link>
      {p.role && (
        <span className={css({ ml: "2" })}>
          <Pill>{p.role}</Pill>
        </span>
      )}
      <dl className={detailListStyle}>
        {p.age !== null && <Detail label="Age" value={`${p.age}`} />}
        {p.marital_status && <Detail label="Marital status" value={p.marital_status} />}
        {p.relationship_type && p.related_to_name && (
          <Detail label="Relationship" value={`${p.relationship_type} of ${p.related_to_name}`} />
        )}
        {p.occupation && <Detail label="Occupation" value={p.occupation} />}
        {p.town_name && <Detail label="Town" value={titleCase(p.town_name)} />}
        {p.relationships_and_details && (
          <Detail label="Details" value={p.relationships_and_details} />
        )}
      </dl>
    </Card>
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
