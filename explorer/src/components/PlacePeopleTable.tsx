import { Table, Th, Td } from "@/components/ui";
import { ClickableTr, referenceCellStyle } from "@/components/ClickableRow";
import { convictionHref } from "@/lib/referenceSlug";
import { formatDate } from "@/lib/date";
import type { PlacePersonRow } from "@/lib/queries/locationTree";

// One row per (person, conviction) appearance, not per conviction -- a
// different granularity from ConvictionsTable (which joins all defendants
// into one cell), so it stays its own component, but shares the same
// row-click and reference-cell styling.
export function PlacePeopleTable({ rows }: { rows: PlacePersonRow[] }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Offence date</Th>
          <Th>Person</Th>
          <Th>Role</Th>
          <Th>Reference</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p, i) => (
          <ClickableTr key={`${p.reference_number}-${p.name_key}-${i}`} href={convictionHref(p.reference_number)}>
            <Td verticalAlign="middle">{formatDate(p.offence_date) ?? p.offence_date_raw ?? "—"}</Td>
            <Td verticalAlign="middle">{p.display_name}</Td>
            <Td verticalAlign="middle">{p.role}</Td>
            <Td verticalAlign="middle" className={referenceCellStyle}>
              {p.reference_number}
            </Td>
          </ClickableTr>
        ))}
      </tbody>
    </Table>
  );
}
