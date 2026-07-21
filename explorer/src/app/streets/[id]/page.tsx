import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "styled-system/css";
import { getStreetCases, getStreetDetail, listStreetIds } from "@/lib/queries/streets";
import { PageContainer, PageTitle, Table, Th, Td } from "@/components/ui";
import { titleCase } from "@/lib/text";

export async function generateStaticParams() {
  return listStreetIds().map((id) => ({ id: String(id) }));
}

export default async function StreetDetailPage(props: PageProps<"/streets/[id]">) {
  const { id } = await props.params;
  const streetId = Number(id);
  if (!Number.isFinite(streetId)) notFound();

  const street = getStreetDetail(streetId);
  if (!street) notFound();

  const cases = getStreetCases(streetId);

  return (
    <PageContainer>
      <div>
        <Link href="/streets" className={css({ fontSize: "body", color: "fgMuted" })}>
          ← Back to streets
        </Link>
        <PageTitle
          subtitle={`${cases.length} case${cases.length === 1 ? "" : "s"}${
            street.town_name ? ` · ${titleCase(street.town_name)}` : ""
          }`}
        >
          {titleCase(street.name)}
        </PageTitle>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Reference</Th>
            <Th>Date</Th>
            <Th>Defendant(s)</Th>
            <Th>Offence</Th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <Td>
                <Link
                  href={`/browse/${c.id}`}
                  className={css({ color: "fgAccent", fontWeight: "600" })}
                >
                  {c.reference_number}
                </Link>
              </Td>
              <Td>{c.conviction_date ?? c.conviction_date_raw}</Td>
              <Td>{c.defendant_names ?? "—"}</Td>
              <Td>{c.offence_type_names ?? "—"}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageContainer>
  );
}
