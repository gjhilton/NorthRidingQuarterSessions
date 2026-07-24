import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { css } from "styled-system/css";
import { PageContainer, PageTitle } from "@/components/ui";
import { MapViewLoader } from "@/components/MapViewLoader";
import { PlaceOffenceTable } from "@/components/PlaceOffenceTable";
import { PlacePeopleTable } from "@/components/PlacePeopleTable";
import {
  getPlaceAncestry,
  getPlaceChildren,
  getPlaceConvictions,
  getPlaceDetail,
  getPlacePeople,
  listPlaceIds,
  type PlaceConvictionRow,
} from "@/lib/queries/locationTree";
import { sentenceCase } from "@/lib/text";

export async function generateStaticParams() {
  return listPlaceIds().map((id) => ({ id: String(id) }));
}

const sectionHeadingStyle = css({ fontFamily: "serif", fontSize: "XL", fontWeight: "600" });
const offenceTypeHeadingStyle = css({ fontFamily: "serif", fontSize: "M", fontWeight: "600" });

// A root-level region (North Riding of Yorkshire, County Durham, ...) needs
// a wide view; a parish (Whitby) a medium one; a street (Baxtergate) a
// tight one -- scales the map's zoom by how deep this place sits in the
// tree (ancestry length, 0 at the root) rather than one fixed zoom for
// every place regardless of scale. Floors/ceils at the ends of the array
// for anything shallower/deeper than it covers.
const ZOOM_BY_DEPTH: { zoom: number; minZoom: number; maxZoom: number }[] = [
  { zoom: 9, minZoom: 7, maxZoom: 12 }, // depth 0: root regions
  { zoom: 10, minZoom: 8, maxZoom: 13 }, // depth 1: parishes/towns -- pulled out to show more surrounding area
  { zoom: 12, minZoom: 10, maxZoom: 15 }, // depth 2: villages/districts within a town -- same
  { zoom: 15, minZoom: 14, maxZoom: 18 }, // depth 3+: streets/yards
];

function zoomForDepth(depth: number) {
  return ZOOM_BY_DEPTH[Math.min(depth, ZOOM_BY_DEPTH.length - 1)];
}

// Anchor id for an offence-type section's <h3> -- offence_type names are
// plain lowercase phrases (spaces, the odd slash), so a simple non-word ->
// hyphen swap is enough, no need for a general slugifier.
function offenceTypeAnchor(offenceType: string): string {
  return `offence-${offenceType.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase()}`;
}

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
        <nav className={css({ fontSize: "M", color: "fgMuted" })}>
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

      {place.latitude != null && place.longitude != null && (
        <div className={css({ width: "50%", aspectRatio: "1" })}>
          <Suspense fallback={null}>
            <MapViewLoader
              points={[{ name: place.name, count: 1, lat: place.latitude, lon: place.longitude }]}
              center={[place.latitude, place.longitude]}
              {...zoomForDepth(ancestry.length - 1)}
              height="100%"
              interactive={false}
              markerColor="#f00"
            />
          </Suspense>
        </div>
      )}

      {children.length > 0 && (
        <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
          <h2 className={sectionHeadingStyle}>Children</h2>
          <p className={css({ fontSize: "M" })}>
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

      {convictions.length > 0 && (
        <section className={css({ display: "flex", flexDirection: "column", gap: "5" })}>
          <h2 className={sectionHeadingStyle}>Offences</h2>
          {convictionsByType.length > 1 && (
            <p className={css({ fontSize: "M" })}>
              {convictionsByType.map(([offenceType, rows], i) => (
                <span key={offenceType}>
                  {i > 0 && "; "}
                  <a href={`#${offenceTypeAnchor(offenceType)}`} className={css({ color: "fgAccent", fontWeight: "600" })}>
                    {sentenceCase(offenceType)}
                  </a>{" "}
                  <span className={css({ color: "fgMuted" })}>({rows.length})</span>
                </span>
              ))}
            </p>
          )}
          {convictionsByType.map(([offenceType, rows]) => (
            <div key={offenceType} className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
              <h3 id={offenceTypeAnchor(offenceType)} className={offenceTypeHeadingStyle}>
                {sentenceCase(offenceType)}{" "}
                <span className={css({ color: "fgMuted", fontWeight: "400" })}>({rows.length})</span>
              </h3>
              <PlaceOffenceTable rows={rows.slice(0, 10)} />
              {rows.length > 10 && (
                <p className={css({ fontSize: "S", color: "fgMuted" })}>
                  Showing the first 10 of {rows.length}.
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {people.length > 0 && (
        <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
          <h2 className={sectionHeadingStyle}>People</h2>
          <PlacePeopleTable rows={people} />
        </section>
      )}
    </PageContainer>
  );
}
