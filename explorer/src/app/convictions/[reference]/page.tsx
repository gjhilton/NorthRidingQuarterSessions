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
  getConvictionOffences,
  type ConvictionOffence,
  getConvictionPosition,
  getOtherConvictionCounts,
  getRelatedConvictions,
  listConvictionSlugs,
} from "@/lib/queries/browseDetail";
import { Card, PageContainer, PageTitle, Pill } from "@/components/ui";
import { ConvictionNav } from "@/components/ConvictionNav";
import { personHref, offenceHref } from "@/lib/links";
import { convictionHref } from "@/lib/referenceSlug";
import { formatOffenceCategory, formatPersonName, titleCase } from "@/lib/text";
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

  const defendants = [...getConvictionDefendants(convictionId)].sort(bySurname);
  const involvedPersons = [...getConvictionInvolvedPersons(convictionId)].sort(bySurname);
  const police = involvedPersons.filter((p) => classifyInvolvedPersonRole(p.role) === Roles.police);
  const otherPersons = involvedPersons.filter((p) => classifyInvolvedPersonRole(p.role) === Roles.other);
  const otherConvictionCounts = getOtherConvictionCounts(
    [...defendants, ...involvedPersons].map((p) => p.name_key),
    convictionId
  );
  const offences = getConvictionOffences(convictionId);
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
          <ul className={personListStyle}>
            {defendants.map((d) => (
              <li key={d.id}>
                <Link href={personHref(d.name_key)} className={css({ color: "fgAccent" })}>
                  {formatPersonName({
                    firstName: d.first_name,
                    lastName: d.last_name,
                    occupation: d.occupation,
                    nameQualifier: d.name_qualifier,
                    town: d.town_name,
                  })}
                </Link>
                <MentionCount count={otherConvictionCounts.get(d.name_key)} />
              </li>
            ))}
          </ul>
          </SubSection>
        )}

        {police.length > 0 && (
          <SubSection title={ROLE_LABELS[Roles.police]}>
          <PersonList people={police} showRole={false} otherConvictionCounts={otherConvictionCounts} />
          </SubSection>
        )}

        {otherPersons.length > 0 && (
          <SubSection title={ROLE_LABELS[Roles.other]}>
          <PersonList people={otherPersons} otherConvictionCounts={otherConvictionCounts} />
          </SubSection>
        )}
        </Section>
      )}

      {offences.length > 0 && (
        <Section title="Offences" titleSize="display">
          <OffenceTree offences={offences} />
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

// Nulls (unnamed people, rare) sort last rather than first -- localeCompare
// so accented surnames sort where a reader would expect them, not by raw
// char code.
function bySurname(a: { last_name: string | null }, b: { last_name: string | null }): number {
  if (!a.last_name) return b.last_name ? 1 : 0;
  if (!b.last_name) return -1;
  return a.last_name.localeCompare(b.last_name);
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

function PersonList({
  people,
  showRole = true,
  otherConvictionCounts,
}: {
  people: DetailInvolvedPerson[];
  showRole?: boolean;
  otherConvictionCounts: Map<string, number>;
}) {
  return (
    <ul className={personListStyle}>
      {people.map((p) => (
        <li
          key={p.id}
          className={css({ display: "flex", alignItems: "center", gap: "2", flexWrap: "wrap" })}
        >
          <Link href={personHref(p.name_key)} className={css({ color: "fgAccent" })}>
            {formatPersonName({
              firstName: p.first_name,
              lastName: p.last_name,
              occupation: p.occupation,
              nameQualifier: p.name_qualifier,
              town: p.town_name,
            })}
          </Link>
          {showRole && p.role && <Pill>{p.role}</Pill>}
          <MentionCount count={otherConvictionCounts.get(p.name_key)} />
        </li>
      ))}
    </ul>
  );
}

// name_key is a coarse "every mention of this name" index, not a per-person
// dedup key -- this is a mention count, not a claim that the same real
// individual appears in all of them (see About's "not deduplicated" note).
// Groups the conviction's tagged offence types under their category, then
// renders category -> type as a two-level tree: a vertical stem (border on
// the nested <ul>) with a short horizontal branch (::before on each <li>)
// pointing at each leaf, same visual idiom as a file-tree view. Genuinely
// nested <ul><li> markup underneath the styling, not just visually
// indented flat items, so it degrades to a normal nested list with CSS off.
function OffenceTree({ offences }: { offences: ConvictionOffence[] }) {
  const categories = new Map<string, { count: number; types: ConvictionOffence[] }>();
  for (const o of offences) {
    const existing = categories.get(o.category_name);
    if (existing) existing.types.push(o);
    else categories.set(o.category_name, { count: o.category_count, types: [o] });
  }

  return (
    <ul className={personListStyle}>
      {[...categories.entries()].map(([categoryName, { count, types }]) => {
        const href = offenceHref(categoryName);
        const label = formatOffenceCategory(categoryName);
        return (
          <li key={categoryName}>
            {href ? (
              <Link href={href} className={css({ color: "fgAccent" })}>
                {label}
              </Link>
            ) : (
              label
            )}{" "}
            <CountNote count={count} unit="conviction" />
            <ul
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "2",
                listStyle: "none",
                mt: "2",
                ml: "3",
                pl: "8",
                borderLeftWidth: "lineweight_normal",
                borderLeftStyle: "solid",
                borderLeftColor: "fgMuted",
              })}
            >
              {types.map((t) => (
                <li
                  key={t.id}
                  className={css({
                    position: "relative",
                    pl: "8",
                    _before: {
                      content: '""',
                      position: "absolute",
                      left: "-2rem",
                      top: "0.7em",
                      width: "1.75rem",
                      height: "0",
                      borderTopWidth: "lineweight_normal",
                      borderTopStyle: "solid",
                      borderTopColor: "fgMuted",
                    },
                  })}
                >
                  <span aria-hidden className={css({ color: "fgMuted" })}>
                    └─{" "}
                  </span>
                  {href ? (
                    <Link href={href} className={css({ color: "fgAccent" })}>
                      {t.type_name}
                    </Link>
                  ) : (
                    t.type_name
                  )}{" "}
                  <CountNote count={t.type_count} unit="conviction" />
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

function CountNote({ count, unit }: { count: number; unit: string }) {
  return (
    <span className={css({ fontSize: "small", color: "fgMuted" })}>
      <strong>{count.toLocaleString()}</strong> {unit}
      {count === 1 ? "" : "s"}
    </span>
  );
}

function MentionCount({ count }: { count: number | undefined }) {
  if (!count) return null;
  return (
    <span className={css({ fontSize: "small", color: "fgMuted" })}>
      mentioned in <strong>{count.toLocaleString()}</strong> other record{count === 1 ? "" : "s"}
    </span>
  );
}

const personListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "2",
  listStyle: "none",
  fontSize: "body",
});
