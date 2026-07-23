import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "styled-system/css";
import { PageContainer, PageTitle, Table, Th, Td } from "@/components/ui";
import { getPlaceAncestry, getPlaceConvictions, getPlaceDetail, listPlaceIds } from "@/lib/queries/locationTree";
import { convictionHref } from "@/lib/referenceSlug";
import { formatDate } from "@/lib/date";

export async function generateStaticParams() {
  return listPlaceIds().map((id) => ({ id: String(id) }));
}

export default async function PlaceDetailPage(props: PageProps<"/locations/[id]">) {
  const { id } = await props.params;
  const placeId = Number(id);
  if (!Number.isFinite(placeId)) notFound();

  const place = getPlaceDetail(placeId);
  if (!place) notFound();

  const ancestry = getPlaceAncestry(placeId);
  const convictions = getPlaceConvictions(placeId);

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
        <PageTitle subtitle={`${place.type}${convictions.length ? ` · ${convictions.length} conviction${convictions.length === 1 ? "" : "s"}` : ""}`}>
          {place.name}
        </PageTitle>
        {place.notes_public && <p className={css({ color: "fgMuted" })}>{place.notes_public}</p>}
      </div>

      {convictions.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>Reference</Th>
              <Th>Date</Th>
              <Th>Charge</Th>
            </tr>
          </thead>
          <tbody>
            {convictions.map((c) => (
              <tr key={c.reference_number}>
                <Td>
                  <Link href={convictionHref(c.reference_number)} className={css({ color: "fgAccent", fontWeight: "600" })}>
                    {c.reference_number}
                  </Link>
                </Td>
                <Td>{formatDate(c.conviction_date) ?? c.conviction_date_raw}</Td>
                <Td>{c.charge_description}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </PageContainer>
  );
}
