import { Table, Th, Td } from "@/components/ui";
import { ClickableTr, referenceCellStyle } from "@/components/ClickableRow";
import { convictionHref } from "@/lib/referenceSlug";
import { formatDate } from "@/lib/date";

interface ConvictionTableRow {
  reference_number: string;
  offence_date: string | null;
  offence_date_raw: string | null;
  defendant_names: string | null;
}

// Shared by every page that lists convictions as (Offence date / people /
// Reference) rows -- the Locations detail page's per-offence-type tables and
// the Offences detail page's paginated conviction list were previously two
// byte-for-byte identical components (PlaceOffenceTable, OffenceConvictionTable)
// differing only in the people-column label, which is now just a prop.
export function ConvictionsTable({
  rows,
  peopleLabel = "Offender(s)",
}: {
  rows: ConvictionTableRow[];
  peopleLabel?: string;
}) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Offence date</Th>
          <Th>{peopleLabel}</Th>
          <Th>Reference</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((c) => (
          <ClickableTr key={c.reference_number} href={convictionHref(c.reference_number)}>
            <Td verticalAlign="middle">{formatDate(c.offence_date) ?? c.offence_date_raw ?? "—"}</Td>
            <Td verticalAlign="middle">{c.defendant_names ?? "—"}</Td>
            <Td verticalAlign="middle" className={referenceCellStyle}>
              {c.reference_number}
            </Td>
          </ClickableTr>
        ))}
      </tbody>
    </Table>
  );
}
