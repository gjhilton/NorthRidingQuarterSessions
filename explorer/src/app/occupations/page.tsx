import Link from "next/link";
import { css } from "styled-system/css";
import { occupationByOffenceCategory, topOccupations } from "@/lib/queries/occupations";
import { HorizontalBarStat } from "@/components/charts/BarStat";
import { Card, ChartTitle, EmptyState, PageContainer, PageTitle, Table, Td, Th } from "@/components/ui";

export default function OccupationsPage() {
  const occupations = topOccupations();
  const occupationMatrix = occupationByOffenceCategory();

  return (
    <PageContainer>
      <PageTitle subtitle="The working lives behind the charge sheet — see Gender for how this splits by sex">
        Occupations
      </PageTitle>

      <Card>
        <ChartTitle>Offender occupations</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Whole archive, both sexes combined — see{" "}
          <Link href="/gender" className={css({ color: "fgAccent" })}>
            Gender
          </Link>{" "}
          for the male/female split, which looks structurally different from this combined view.
        </p>
        {occupations.length === 0 ? (
          <EmptyState>No occupation data yet.</EmptyState>
        ) : (
          <HorizontalBarStat data={occupations.map((o) => ({ name: o.label, count: o.count }))} />
        )}
      </Card>

      <Card>
        <ChartTitle>What each occupation was prosecuted for</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Top occupations against top offence categories, whole archive, offender-mention
          counts. Occupation text is taken as-extracted (not a controlled vocabulary), so close
          variants of the same trade may appear as separate rows.
        </p>
        {occupationMatrix.occupations.length === 0 ? (
          <EmptyState>No occupation data yet.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Occupation</Th>
                {occupationMatrix.categories.map((c) => (
                  <Th key={c}>{c}</Th>
                ))}
                <Th>Total</Th>
              </tr>
            </thead>
            <tbody>
              {occupationMatrix.occupations.map((occ) => (
                <tr key={occ}>
                  <Td>{occ}</Td>
                  {occupationMatrix.categories.map((c) => (
                    <Td key={c}>{occupationMatrix.cells[occ][c] || "—"}</Td>
                  ))}
                  <Td className={css({ fontWeight: "600" })}>{occupationMatrix.rowTotals[occ]}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </PageContainer>
  );
}
