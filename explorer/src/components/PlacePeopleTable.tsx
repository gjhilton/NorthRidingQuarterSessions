"use client";

import { useRouter } from "next/navigation";
import { css } from "styled-system/css";
import { Table, Th, Td } from "@/components/ui";
import { convictionHref } from "@/lib/referenceSlug";
import { formatDate } from "@/lib/date";
import type { PlacePersonRow } from "@/lib/queries/locationTree";

// Same row-is-a-link behaviour as PlaceOffenceTable (and the Convictions
// page's own table): whole row clickable via router.push, cursor pointer,
// #fffef5 hover, reference number in the same small/tight font.
export function PlacePeopleTable({ rows }: { rows: PlacePersonRow[] }) {
  const router = useRouter();
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
          <tr
            key={`${p.reference_number}-${p.name_key}-${i}`}
            onClick={() => router.push(convictionHref(p.reference_number))}
            className={css({ cursor: "pointer", _hover: { bg: "#fffef5" } })}
          >
            <Td verticalAlign="middle">{formatDate(p.offence_date) ?? p.offence_date_raw ?? "—"}</Td>
            <Td verticalAlign="middle">{p.display_name}</Td>
            <Td verticalAlign="middle">{p.role}</Td>
            <Td verticalAlign="middle" className={css({ fontSize: "0.8rem", lineHeight: "1.1" })}>
              {p.reference_number}
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
