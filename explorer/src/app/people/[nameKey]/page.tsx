import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "styled-system/css";
import {
  getPersonNetwork,
  listNameKeys,
  type CaseMention,
  type CaseParticipant,
  type CaseParticipants,
} from "@/lib/queries/peopleNetwork";
import { PageContainer, PageTitle, Table, Th, Td, sectionHeadingStyle } from "@/components/ui";
import { ClickableTr, referenceCellStyle, StopPropagation } from "@/components/ClickableRow";
import { fromSlug, toSlug } from "@/lib/slug";
import { convictionHref } from "@/lib/referenceSlug";
import { personHref } from "@/lib/links";
import { sentenceCase } from "@/lib/text";
import { formatDate } from "@/lib/date";
import { DEFENDANT_ROLE, formatNameRow } from "@/lib/queries/personFragments";

// The set of known name_keys is static (fixed dataset), so every person page
// can be prerendered -- only the free-text search on /people needs
// client-side SQLite.
export async function generateStaticParams() {
  return listNameKeys().map((nameKey) => ({ nameKey: toSlug(nameKey) }));
}

// A case's own cast list, semicolon-joined -- comma can't be the separator
// here since formatPersonName's own "SURNAME, Firstname" already uses one
// (a comma-joined list of two-part names is ambiguous about where one name
// ends and the next begins; semicolons aren't). Every name links to their
// own person page except the one whose page this already is (rendered as
// plain text instead, since a self-link is pointless). Wrapped in
// StopPropagation so clicking a name navigates there instead of also
// triggering the row's own click-through to the conviction.
function ParticipantList({
  people,
  currentNameKey,
}: {
  people: CaseParticipant[];
  currentNameKey: string;
}) {
  if (people.length === 0) return <>—</>;
  return (
    <>
      {people.map((p, i) => {
        const name = formatNameRow(p);
        return (
          <span key={`${p.name_key}-${i}`}>
            {i > 0 && "; "}
            {p.name_key === currentNameKey ? (
              name
            ) : (
              <StopPropagation>
                <Link href={personHref(p.name_key)} className={css({ color: "fgAccent" })}>
                  {name}
                </Link>
              </StopPropagation>
            )}
          </span>
        );
      })}
    </>
  );
}

// 'defendant' first (the most common and most load-bearing role -- the
// literal stored summary_conviction_person.role value now, not a synthetic
// "offender" label; see personFragments.ts's DEFENDANT_ROLE), then every
// other role this person held, most-frequent first -- roles are kept as
// separate groups exactly as recorded (e.g. "victim" and "victim/informant"
// don't get merged into one), since a merged group would blur real
// distinctions in how the record describes each case.
function groupCasesByRole(cases: CaseMention[]): [string, CaseMention[]][] {
  const groups = new Map<string, CaseMention[]>();
  for (const c of cases) {
    const list = groups.get(c.role);
    if (list) list.push(c);
    else groups.set(c.role, [c]);
  }
  return [...groups.entries()].sort(([roleA, casesA], [roleB, casesB]) => {
    if (roleA === DEFENDANT_ROLE) return -1;
    if (roleB === DEFENDANT_ROLE) return 1;
    return casesB.length - casesA.length;
  });
}

// The DB's 'defendant' role reads as "Offender" here too -- same
// translation as roles.ts's classifyInvolvedPersonRole/PeopleBrowseList's
// roleDisplayLabel, applied locally since this page only has the raw role
// string per group, not a person/case row to run through that classifier.
function roleGroupTitle(role: string, count: number): string {
  const label = role === DEFENDANT_ROLE ? "Offender" : sentenceCase(role);
  return `As ${label} (${count})`;
}

// Each of the three "who else was on this case" columns only earns a place
// in a given role-group's table if at least one case in that group actually
// has someone in it -- a person who only ever shows up as, say, an
// unaccompanied informant shouldn't carry three empty "—" columns just
// because other role-groups on other people's pages need them.
function participantsFor(
  c: CaseMention,
  participantsByCase: Map<number, CaseParticipants>
): CaseParticipants {
  return participantsByCase.get(c.summary_conviction_id) ?? { offenders: [], police: [], other: [] };
}

export default async function PersonPage(props: PageProps<"/people/[nameKey]">) {
  const { nameKey } = await props.params;
  const network = getPersonNetwork(fromSlug(nameKey));
  if (!network) notFound();

  const roleGroups = groupCasesByRole(network.cases);

  return (
    <PageContainer>
      <div>
        <Link href="/people" className={css({ fontSize: "M", color: "fgMuted" })}>
          ← Back to search
        </Link>
        {/* No separate "also known as" subtitle -- network.display_name
            (formatPersonName) already renders any alias inline, quoted, as
            part of the canonical name itself. */}
        <PageTitle>{network.display_name}</PageTitle>
        {(network.isPolice || network.spouses.length > 0) && (
          <p className={css({ fontSize: "M", color: "fgMuted", mt: "1" })}>
            {network.isPolice && <span>Police officer</span>}
            {network.isPolice && network.spouses.length > 0 && <span> · </span>}
            {network.spouses.length > 0 && (
              <span>
                Spouse:{" "}
                {network.spouses.map((s, i) => (
                  <span key={s.name_key}>
                    {i > 0 && "; "}
                    <Link href={personHref(s.name_key)} className={css({ color: "fgAccent" })}>
                      {s.display_name}
                    </Link>
                  </span>
                ))}
              </span>
            )}
          </p>
        )}
        {network.relationships.length > 0 && (
          <p className={css({ fontSize: "M", color: "fgMuted", mt: "1" })}>
            {network.relationships.map((r, i) => (
              <span key={`${r.name_key}-${r.label}`}>
                {i > 0 && " · "}
                {r.label}{" "}
                <Link href={personHref(r.name_key)} className={css({ color: "fgAccent" })}>
                  {r.display_name}
                </Link>
              </span>
            ))}
          </p>
        )}
        {network.cases.length === 0 && (
          <p className={css({ fontSize: "M", color: "fgMuted", mt: "1" })}>
            No case appearances on record for this person.
          </p>
        )}
        {network.sameNameAlternate && (
          <p className={css({ fontSize: "M", color: "fgMuted", mt: "1" })}>
            Same name, different case record:{" "}
            <Link
              href={personHref(network.sameNameAlternate.name_key)}
              className={css({ color: "fgAccent" })}
            >
              {network.sameNameAlternate.display_name}
            </Link>
            . A shared name between a police officer and an offender is
            treated as two different people and kept on separate pages,
            rather than merged into one.
          </p>
        )}
      </div>

      {roleGroups.map(([role, cases]) => {
        // Just two people-columns -- Police doesn't earn its own column here
        // (it's still tracked via Person.is_police for the conviction
        // detail page's own Police section; on this table police and every
        // other non-offender participant both read as "Involved person(s)").
        const rows = cases.map((c) => {
          const participants = participantsFor(c, network.participantsByCase);
          return {
            case: c,
            offenders: participants.offenders,
            involved: [...participants.other, ...participants.police],
          };
        });
        const showOffenders = rows.some((r) => r.offenders.length > 0);
        const showInvolved = rows.some((r) => r.involved.length > 0);

        return (
          <Section key={role} title={roleGroupTitle(role, cases.length)}>
            <Table fontSize="M">
              <thead>
                <tr>
                  <Th>Reference</Th>
                  <Th>Date</Th>
                  {showOffenders && <Th>Offender(s)</Th>}
                  {showInvolved && <Th>Involved person(s)</Th>}
                  <Th>Charge</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ case: c, offenders, involved }) => (
                  <ClickableTr key={c.summary_conviction_id} href={convictionHref(c.reference_number)}>
                    <Td verticalAlign="middle" className={referenceCellStyle}>
                      <StopPropagation>
                        <Link href={convictionHref(c.reference_number)} className={css({ color: "fgAccent" })}>
                          {c.reference_number}
                        </Link>
                      </StopPropagation>
                    </Td>
                    <Td verticalAlign="middle">{formatDate(c.conviction_date) ?? "—"}</Td>
                    {showOffenders && (
                      <Td verticalAlign="middle">
                        <ParticipantList people={offenders} currentNameKey={network.name_key} />
                      </Td>
                    )}
                    {showInvolved && (
                      <Td verticalAlign="middle">
                        <ParticipantList people={involved} currentNameKey={network.name_key} />
                      </Td>
                    )}
                    <Td verticalAlign="middle">{c.charge_description}</Td>
                  </ClickableTr>
                ))}
              </tbody>
            </Table>
          </Section>
        );
      })}
    </PageContainer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <h2 className={css(sectionHeadingStyle)}>{title}</h2>
      {children}
    </section>
  );
}
