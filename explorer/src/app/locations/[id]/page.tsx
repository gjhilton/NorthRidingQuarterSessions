import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { css } from "styled-system/css";
import { PageContainer, PageTitle, Table, Th, Td } from "@/components/ui";
import { MapViewLoader } from "@/components/MapViewLoader";
import {
  getPlaceAncestry,
  getPlaceChildren,
  getPlaceConvictions,
  getPlaceDetail,
  getPlacePeople,
  listPlaceIds,
  type PlaceConvictionRow,
} from "@/lib/queries/locationTree";
import { convictionHref } from "@/lib/referenceSlug";
import { personHref } from "@/lib/links";
import { formatDate } from "@/lib/date";

export async function generateStaticParams() {
  return listPlaceIds().map((id) => ({ id: String(id) }));
}

const sectionHeadingStyle = css({ fontFamily: "serif", fontSize: "display", fontWeight: "600" });
const offenceTypeHeadingStyle = css({ fontFamily: "serif", fontSize: "heading", fontWeight: "600" });

// Groups the (conviction, offence type) rows getPlaceConvictions returns
// into one bucket per offence type -- a conviction tagged with more than
// one type appears once in each of its types' buckets. Ordered by bucket
// size (most common offence type here first), not alphabetically, since
// "what mostly happens at this place" is the more useful lead.
function groupByOffenceType(rows: PlaceConvictionRow[]): [string, PlaceConvictionRow[]][] {
  const groups = new Map<string, PlaceConvictionRow[]>();
  for (const row of rows) {
    const group = groups.get(row.offence_type);
    if (group) group.push(row);
    else groups.set(row.offence_type, [row]);
  }
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
}

export default async function PlaceDetailPage(props: PageProps<"/locations/[id]">) {
  const { id } = await props.params;
  const placeId = Number(id);
  if (!Number.isFinite(placeId)) notFound();

  const place = getPlaceDetail(placeId);
  if (!place) notFound();

  const ancestry = getPlaceAncestry(placeId);
  const children = getPlaceChildren(placeId);
  const convictions = getPlaceConvictions(placeId);
  const convictionsByType = groupByOffenceType(convictions);
  const people = getPlacePeople(placeId);

  return (
    <PageContainer>
      <div>
        <nav className={css({ fontSize: "body", color: "fgMuted" })}>
          {ancestry.map((a, i) => (
            <span key={a.id}>
              {i > 0 && " → "}
              {a.id === placeId ? a.name : <Link href={`/locations/${a.id}`}>{a.name}</Link>}
            </span>
          ))}
        </nav>
        <PageTitle>{place.name}</PageTitle>
        {place.notes_public && <p className={css({ color: "fgMuted" })}>{place.notes_public}</p>}
      </div>

      {children.length > 0 && (
        <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
          <h2 className={sectionHeadingStyle}>Children</h2>
          <p className={css({ fontSize: "body" })}>
            {children.map((c, i) => (
              <span key={c.id}>
                {i > 0 && "; "}
                <Link href={`/locations/${c.id}`} className={css({ color: "fgAccent", fontWeight: "600" })}>
                  {c.name}
                </Link>
              </span>
            ))}
          </p>
        </section>
      )}

      {place.latitude != null && place.longitude != null && (
        <div className={css({ maxWidth: "28rem" })}>
          <Suspense fallback={null}>
            <MapViewLoader
              points={[{ name: place.name, count: 1, lat: place.latitude, lon: place.longitude }]}
              center={[place.latitude, place.longitude]}
              zoom={13}
              minZoom={9}
              maxZoom={17}
              height="20rem"
              interactive={false}
              markerColor="#f00"
            />
          </Suspense>
        </div>
      )}

      {convictions.length > 0 && (
        <section className={css({ display: "flex", flexDirection: "column", gap: "5" })}>
          <h2 className={sectionHeadingStyle}>Offences</h2>
          {convictionsByType.map(([offenceType, rows]) => (
            <div key={offenceType} className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
              <h3 className={offenceTypeHeadingStyle}>
                {offenceType} <span className={css({ color: "fgMuted", fontWeight: "400" })}>({rows.length})</span>
              </h3>
              <Table>
                <thead>
                  <tr>
                    <Th>Reference</Th>
                    <Th>Date</Th>
                    <Th>Defendant(s)</Th>
                    <Th>Charge</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={`${c.reference_number}-${offenceType}`}>
                      <Td>
                        <Link
                          href={convictionHref(c.reference_number)}
                          className={css({ color: "fgAccent", fontWeight: "600" })}
                        >
                          {c.reference_number}
                        </Link>
                      </Td>
                      <Td>{formatDate(c.conviction_date) ?? c.conviction_date_raw}</Td>
                      <Td>{c.defendant_names ?? "—"}</Td>
                      <Td>{c.charge_description}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </section>
      )}

      {people.length > 0 && (
        <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
          <h2 className={sectionHeadingStyle}>People</h2>
          <ul className={css({ display: "flex", flexDirection: "column", gap: "1" })}>
            {people.map((p) => (
              <li key={p.name_key}>
                <Link href={personHref(p.name_key)} className={css({ color: "fgAccent", fontWeight: "600" })}>
                  {p.display_name}
                </Link>
                <span className={css({ color: "fgMuted", fontSize: "small" })}>
                  {" "}
                  ({p.mentions} mention{p.mentions === 1 ? "" : "s"})
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageContainer>
  );
}
