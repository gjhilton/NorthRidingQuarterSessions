"use client";

import { useState } from "react";
import Link from "next/link";
import { css, cx } from "styled-system/css";
import { useClientQuery } from "@/lib/useClientQuery";
import {
  listConvictions,
  PAGE_SIZE,
  type BrowseFilters,
  type BrowseRow,
} from "@/lib/queries/browseList";
import type { Option } from "@/lib/queries/filters";
import { EmptyState, Table, Th, Td, formInputStyle, primaryButtonStyle } from "@/components/ui";

const DEFAULT_FILTERS: BrowseFilters = { page: 1, pageSize: PAGE_SIZE };

export function BrowseExplorer({
  initialRows,
  initialTotal,
  towns,
  offenceTypes,
}: {
  initialRows: BrowseRow[];
  initialTotal: number;
  towns: Option[];
  offenceTypes: Option[];
}) {
  const [filters, setFilters] = useState<BrowseFilters>(DEFAULT_FILTERS);
  const [rows, setRows] = useState(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const { isPending, run } = useClientQuery<{ rows: BrowseRow[]; total: number }>((result) => {
    setRows(result.rows);
    setTotal(result.total);
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function runQuery(nextFilters: BrowseFilters) {
    setFilters(nextFilters);
    run((db) => listConvictions(db, nextFilters));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const field = (name: string) => (data.get(name) as string) || undefined;
    runQuery({
      q: field("q"),
      townId: field("town") ? Number(field("town")) : undefined,
      offenceTypeId: field("offence") ? Number(field("offence")) : undefined,
      dateFrom: field("from"),
      dateTo: field("to"),
      page: 1,
      pageSize: PAGE_SIZE,
    });
  }

  function goToPage(page: number) {
    runQuery({ ...filters, page });
  }

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "6" })}>
      <form
        onSubmit={handleSubmit}
        className={css({ display: "flex", flexWrap: "wrap", gap: "3", alignItems: "end" })}
      >
        <FormField label="Search">
          <input
            type="text"
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="name, reference, charge…"
            className={inputStyle}
          />
        </FormField>
        <FormField label="Town">
          <select name="town" defaultValue={filters.townId ?? ""} className={inputStyle}>
            <option value="">All towns</option>
            {towns.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Offence type">
          <select name="offence" defaultValue={filters.offenceTypeId ?? ""} className={inputStyle}>
            <option value="">All offence types</option>
            {offenceTypes.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="From">
          <input type="date" name="from" defaultValue={filters.dateFrom ?? ""} className={inputStyle} />
        </FormField>
        <FormField label="To">
          <input type="date" name="to" defaultValue={filters.dateTo ?? ""} className={inputStyle} />
        </FormField>
        <button type="submit" className={primaryButtonStyle} disabled={isPending}>
          {isPending ? "Loading…" : "Apply"}
        </button>
      </form>

      {rows.length === 0 ? (
        <EmptyState>No records match these filters.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Reference</Th>
              <Th>Date</Th>
              <Th>Defendant(s)</Th>
              <Th>Offence</Th>
              <Th>Location</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <Td>
                  <Link
                    href={`/browse/${r.id}`}
                    className={css({ color: "fgAccent", fontWeight: "600" })}
                  >
                    {r.reference_number}
                  </Link>
                </Td>
                <Td>{r.conviction_date ?? r.conviction_date_raw}</Td>
                <Td>{r.defendant_names ?? "—"}</Td>
                <Td>{r.offence_type_name ?? "—"}</Td>
                <Td>{r.offence_town_name ?? r.court_town_name ?? "—"}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {totalPages > 1 && (
        <nav className={css({ display: "flex", gap: "2", alignItems: "center" })}>
          <button
            onClick={() => goToPage(Math.max(1, filters.page - 1))}
            disabled={filters.page <= 1 || isPending}
            className={pageButtonStyle}
          >
            ← Prev
          </button>
          <span className={css({ fontSize: "sm", color: "fgMuted" })}>
            Page {filters.page} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(Math.min(totalPages, filters.page + 1))}
            disabled={filters.page >= totalPages || isPending}
            className={pageButtonStyle}
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "1",
        fontSize: "xs",
        color: "fgMuted",
      })}
    >
      {label}
      {children}
    </label>
  );
}

const inputStyle = cx(formInputStyle, css({ px: "2", py: "1.5", minWidth: "9rem" }));

const pageButtonStyle = css({
  px: "3",
  py: "1.5",
  border: "1px solid",
  borderColor: "borderMuted",
  borderRadius: "md",
  fontSize: "sm",
  color: "fg",
  bg: "bgSurface",
  cursor: "pointer",
  _hover: { borderColor: "fgAccent" },
  _disabled: { opacity: 0.5, cursor: "default" },
});
