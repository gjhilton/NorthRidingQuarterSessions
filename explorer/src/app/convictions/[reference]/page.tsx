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
  getConvictionLocation,
  type ConvictionLocation,
  getConvictionPosition,
  getOtherConvictionCounts,
  getRelatedConvictions,
  listConvictionSlugs,
} from "@/lib/queries/browseDetail";
import { Card, PageContainer, PageTitle, Pill } from "@/components/ui";
import { ConvictionNav } from "@/components/ConvictionNav";
import { personHref, offenceHref, streetHref, placeHref } from "@/lib/links";
import { convictionHref } from "@/lib/referenceSlug";
import { formatOffenceCategory, formatPersonName, titleCase } from "@/lib/text";
import { Roles, roleLabel, classifyInvolvedPersonRole } from "@/lib/roles";
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
  const offenceTreeNodes = groupOffencesByCategory(offences);
  const location = getConvictionLocation(convictionId);
  const locationTreeNodes = locationToTreeNodes(location);
  // Section headings singular/plural by how many things are actually
  // listed underneath, not hardcoded -- People counts every individual
  // across all three role lists combined; Locations counts the town itself
  // plus its street when one's known (so "Location" alone, "Locations" for
  // a town-and-street pair).
  const peopleTitle = pluralize(defendants.length + police.length + otherPersons.length, "Person", "People");
  const offencesTitle = pluralize(offences.length, "Offence", "Offences");
  // Always singular: a conviction has at most one offence location, and a
  // known street is a sub-detail of that same location, not a second one --
  // unlike People/Offences, there's no scenario where "Locations" (plural)
  // is actually correct here.
  const locationsTitle = "Location";
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
          subtitle={
            conviction.offence_date || conviction.offence_date_raw
              ? `Offence date: ${formatDate(conviction.offence_date) ?? conviction.offence_date_raw}`
              : undefined
          }
        >
          {conviction.reference_number}
        </PageTitle>
        <p className={css({ fontSize: "M", color: "fg" })}>
          Conviction date: {formatDate(conviction.conviction_date) ?? conviction.conviction_date_raw}
        </p>
        {conviction.court_town_name && (
          <p className={css({ fontSize: "M", color: "fg" })}>
            Court: {titleCase(conviction.court_town_name)}
          </p>
        )}
      </div>

      <Card bg="bgSurface" borderWidth="0">
        <p className={css({ fontSize: "L", fontWeight: "600", color: "fg", whiteSpace: "pre-wrap" })}>
          &ldquo;{conviction.raw_record}&rdquo;
        </p>
        <div className={css({ display: "flex", justifyContent: "flex-end", mt: "3" })}>
          <a
            href={conviction.archive_url}
            target="_blank"
            rel="noopener noreferrer"
            className={css({ fontSize: "M", color: "fgAccent" })}
          >
            View original record at NYCRO →
          </a>
        </div>
      </Card>

      <Section title="Citing this record">
        <p className={css({ fontSize: "M", fontStyle: "italic" })}>
          Please cite the original record held by NYCRO, not this website (
          <Link href="/about" className={css({ color: "fgAccent" })}>
            why?
          </Link>
          )
        </p>
        <div className={css({ display: "flex", alignItems: "flex-start", gap: "3" })}>
          <p className={css({ fontSize: "M", overflowWrap: "break-word" })}>
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
        <Section title={peopleTitle}>
        {defendants.length > 0 && (
          <SubSection title={roleLabel(Roles.offender, defendants.length)}>
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
          <SubSection title={roleLabel(Roles.police, police.length)}>
          <PersonList people={police} showRole={false} otherConvictionCounts={otherConvictionCounts} />
          </SubSection>
        )}

        {otherPersons.length > 0 && (
          <SubSection title={roleLabel(Roles.other, otherPersons.length)}>
          <PersonList people={otherPersons} otherConvictionCounts={otherConvictionCounts} />
          </SubSection>
        )}
        </Section>
      )}

      {offenceTreeNodes.length > 0 && (
        <Section title={offencesTitle}>
          <Tree nodes={offenceTreeNodes} unit="conviction" />
        </Section>
      )}

      {locationTreeNodes.length > 0 && (
        <Section title={locationsTitle}>
          <Tree nodes={locationTreeNodes} unit="conviction" />
        </Section>
      )}

      {relatedConvictions.length > 0 && (
        <Section title="Related cases">
          <p className={css({ fontSize: "M", color: "fgMuted", mt: "-2"})}>
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
                <p className={css({ fontSize: "M", color: "fgMuted", mt: "1" })}>
                  {formatDate(rc.conviction_date) ?? rc.conviction_date_raw}
                </p>
                <p className={css({ fontSize: "M", mt: "1" })}>{rc.charge_description}</p>
                {rc.note && (
                  <p className={css({ fontSize: "M", color: "fgMuted", mt: "2" })}>{rc.note}</p>
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
function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

function bySurname(a: { last_name: string | null }, b: { last_name: string | null }): number {
  if (!a.last_name) return b.last_name ? 1 : 0;
  if (!b.last_name) return -1;
  return a.last_name.localeCompare(b.last_name);
}

function groupOffencesByCategory(offences: ConvictionOffence[]): TreeParent[] {
  const categories = new Map<string, { count: number; types: ConvictionOffence[] }>();
  for (const o of offences) {
    const existing = categories.get(o.category_name);
    if (existing) existing.types.push(o);
    else categories.set(o.category_name, { count: o.category_count, types: [o] });
  }
  return [...categories.entries()].map(([categoryName, { count, types }]) => ({
    key: categoryName,
    label: formatOffenceCategory(categoryName),
    // No category-level page (see TODO.md's resolved "type or category?"
    // question -- it's type) -- undefined here means the Tree component
    // renders this as plain text, not a link to nowhere.
    href: undefined,
    count,
    children: types.map((t) => ({
      key: t.id,
      label: t.type_name,
      href: offenceHref(t.id),
      count: t.type_count,
    })),
  }));
}

// A conviction has at most one offence town/street (not a many-tagged
// relationship like offence types), so this is always 0 or 1 top-level
// node -- still built as a Tree node list for the same shared rendering,
// rather than a bespoke one-off layout, so Locations looks and behaves
// exactly like Offences.
function locationToTreeNodes(location: ConvictionLocation | undefined): TreeParent[] {
  if (!location?.town_id || !location.town_name) return [];
  const children: TreeLeaf[] = [];
  if (location.street_id && location.street_name) {
    children.push({
      key: location.street_id,
      label: titleCase(location.street_name),
      href: streetHref(location.street_id),
      count: location.street_count,
    });
  }
  return [
    {
      key: location.town_id,
      label: location.town_name.toUpperCase(),
      href: placeHref(location.town_id),
      count: location.town_count,
      children,
    },
  ];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <h2 className={css({ fontFamily: "serif", fontSize: "XL", fontWeight: "600" })}>{title}</h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <h3 className={css({ fontFamily: "serif", fontSize: "M", fontWeight: "600" })}>{title}</h3>
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
interface TreeLeaf {
  key: string | number;
  label: string;
  href?: string;
  count: number;
}

interface TreeParent extends TreeLeaf {
  children: TreeLeaf[];
}

// Shared two-level tree rendering (parent -> children, with a stem line +
// corner-bullet leaf marker) -- used by both the Offences section
// (category -> type) and the Locations section (town -> street) below, so
// the visual/structural pattern stays identical between the two rather
// than being duplicated per section.
function Tree({ nodes, unit }: { nodes: TreeParent[]; unit: string }) {
  return (
    <ul className={personListStyle}>
      {nodes.map((node) => (
        <li key={node.key}>
          {node.href ? (
            <Link href={node.href} className={css({ color: "fgAccent" })}>
              {node.label}
            </Link>
          ) : (
            node.label
          )}{" "}
          <CountNote count={node.count} unit={unit} />
          {node.children.length > 0 && (
            <ul
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "2",
                listStyle: "none",
                mt: "2",
                ml: "2",
                pl: "2",
              })}
            >
              {node.children.map((leaf) => (
                <li key={leaf.key}>
                  <span aria-hidden className={css({ color: "fgMuted" })}>
                    └─{" "}
                  </span>
                  {leaf.href ? (
                    <Link href={leaf.href} className={css({ color: "fgAccent" })}>
                      {leaf.label}
                    </Link>
                  ) : (
                    leaf.label
                  )}{" "}
                  <CountNote count={leaf.count} unit={unit} />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function CountNote({ count, unit }: { count: number; unit: string }) {
  return (
    <span className={css({ fontSize: "M", color: "fgMuted" })}>
      <strong>{count.toLocaleString()}</strong> {unit}
      {count === 1 ? "" : "s"}
    </span>
  );
}

function MentionCount({ count }: { count: number | undefined }) {
  if (!count) return null;
  return (
    <span className={css({ fontSize: "M", color: "fgMuted" })}>
      mentioned in <strong>{count.toLocaleString()}</strong> other record{count === 1 ? "" : "s"}
    </span>
  );
}

const personListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "2",
  listStyle: "none",
  fontSize: "M",
});
