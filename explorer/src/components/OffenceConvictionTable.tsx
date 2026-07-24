"use client";

import { useRouter } from "next/navigation";
import { css } from "styled-system/css";
import { Table, Th, Td } from "@/components/ui";
import { convictionHref } from "@/lib/referenceSlug";
import { formatDate } from "@/lib/date";
import type { OffenceConvictionRow } from "@/lib/queries/offences";

// Same row-is-a-link behaviour/styling as PlaceOffenceTable (Locations
// page) and the Convictions page's own table -- whole row clickable via
// router.push, cursor pointer, #fffef5 hover, reference number in the same
// small/tight font. A separate component (not a reuse of PlaceOffenceTable)
// since this page's rows don't carry an offence_type (redundant -- you're
// already looking at one type's own page).
export function OffenceConvictionTable({ rows }: { rows: OffenceConvictionRow[] }) {
  const router = useRouter();
  return (
    <Table>
      <thead>
        <tr>
          <Th>Offence date</Th>
          <Th>Defendant(s)</Th>
          <Th>Reference</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((c) => (
          <tr
            key={c.reference_number}
            onClick={() => router.push(convictionHref(c.reference_number))}
            className={css({ cursor: "pointer", _hover: { bg: "#fffef5" } })}
          >
            <Td verticalAlign="middle">{formatDate(c.offence_date) ?? c.offence_date_raw ?? "—"}</Td>
            <Td verticalAlign="middle">{c.defendant_names ?? "—"}</Td>
            <Td verticalAlign="middle" className={css({ fontSize: "0.8rem", lineHeight: "1.1" })}>
              {c.reference_number}
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
