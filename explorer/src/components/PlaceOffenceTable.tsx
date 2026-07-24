"use client";

import { useRouter } from "next/navigation";
import { css } from "styled-system/css";
import { Table, Th, Td } from "@/components/ui";
import { convictionHref } from "@/lib/referenceSlug";
import { formatDate } from "@/lib/date";
import type { PlaceConvictionRow } from "@/lib/queries/locationTree";

// Same row-is-a-link behaviour and styling as the Convictions page's own
// results table (BrowseExplorer.tsx) -- whole row clickable via
// router.push, cursor pointer, #fffef5 hover, reference number in the
// same small/tight font. A client component (needs useRouter) even
// though the page itself is server-rendered, same pattern as
// ConvictionNav.
export function PlaceOffenceTable({ rows }: { rows: PlaceConvictionRow[] }) {
  const router = useRouter();
  return (
    <Table>
      <thead>
        <tr>
          <Th>Offence date</Th>
          <Th>Offender(s)</Th>
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
