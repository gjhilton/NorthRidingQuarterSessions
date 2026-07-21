"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { css, cx } from "styled-system/css";
import { useClientQuery } from "@/lib/useClientQuery";
import { downloadCsv } from "@/lib/csv";
import {
  listConvictions,
  PAGE_SIZE,
  type BrowseFilters,
  type BrowseRow,
  type BrowseSortColumn,
} from "@/lib/queries/browseList";
import type { Option } from "@/lib/queries/filters";
import { titleCase } from "@/lib/text";
import { EmptyState, Table, Th, Td, formInputStyle, primaryButtonStyle } from "@/components/ui";

// Large enough to cover "every row matching the current filters" in one
// query -- the whole extracted corpus is a few thousand rows at most, so
// there's no real pagination-of-export concern to design around.
const EXPORT_PAGE_SIZE = 1_000_000;

const DEFAULT_FILTERS: BrowseFilters = { page: 1, pageSize: PAGE_SIZE };

const SORT_COLUMNS: { key: BrowseSortColumn; label: string }[] = [
  { key: "reference_number", label: "Reference" },
  { key: "conviction_date", label: "Date" },
  { key: "defendant_names", label: "Defendant(s)" },
  { key: "offence_type_names", label: "Offence" },
  { key: "location", label: "Location" },
];

const SORT_COLUMN_KEYS = new Set<string>(SORT_COLUMNS.map((c) => c.key));

function isSortColumn(value: string | null): value is BrowseSortColumn {
  return value !== null && SORT_COLUMN_KEYS.has(value);
}

// Bookmarkable/shareable search state -- read once on mount to hydrate a
// filtered view from a pasted URL, and written back on every filter change.
// Not used for the initial server-rendered (unfiltered) page load itself.
function filtersFromSearchParams(params: URLSearchParams): BrowseFilters {
  const get = (key: string) => params.get(key) ?? undefined;
  const sortDir = get("dir");
  return {
    q: get("q"),
    townId: get("town") ? Number(get("town")) : undefined,
    offenceTypeId: get("offence") ? Number(get("offence")) : undefined,
    dateFrom: get("from"),
    dateTo: get("to"),
    sortBy: isSortColumn(params.get("sort")) ? (params.get("sort") as BrowseSortColumn) : undefined,
    sortDir: sortDir === "asc" || sortDir === "desc" ? sortDir : undefined,
    page: get("page") ? Number(get("page")) : 1,
    pageSize: PAGE_SIZE,
  };
}

function searchParamsFromFilters(filters: BrowseFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.townId) params.set("town", String(filters.townId));
  if (filters.offenceTypeId) params.set("offence", String(filters.offenceTypeId));
  if (filters.dateFrom) params.set("from", filters.dateFrom);
  if (filters.dateTo) params.set("to", filters.dateTo);
  if (filters.sortBy) params.set("sort", filters.sortBy);
  if (filters.sortDir) params.set("dir", filters.sortDir);
  if (filters.page > 1) params.set("page", String(filters.page));
  return params.toString();
}

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<BrowseFilters>(DEFAULT_FILTERS);
  const [rows, setRows] = useState(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const { isPending, run } = useClientQuery<{ rows: BrowseRow[]; total: number }>((result) => {
    setRows(result.rows);
    setTotal(result.total);
  });
  const { isPending: isExporting, run: runExport } = useClientQuery<BrowseRow[]>((exportRows) => {
    downloadCsv("nrqs-convictions.csv", exportRows);
  });

  useEffect(() => {
    if (searchParams.size === 0) return;
    const urlFilters = filtersFromSearchParams(searchParams);
    setFilters(urlFilters);
    run((db) => listConvictions(db, urlFilters));
    // Only hydrate from the URL once, on mount -- afterwards this component
    // is the one writing to the URL (see runQuery), not reading from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isFiltered = Boolean(
    filters.q || filters.townId || filters.offenceTypeId || filters.dateFrom || filters.dateTo
  );

  function exportCsv() {
    runExport((db) => listConvictions(db, { ...filters, page: 1, pageSize: EXPORT_PAGE_SIZE }).rows);
  }

  function runQuery(nextFilters: BrowseFilters) {
    setFilters(nextFilters);
    run((db) => listConvictions(db, nextFilters));
    const qs = searchParamsFromFilters(nextFilters);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
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

  const effectiveSortBy = filters.sortBy ?? "conviction_date";
  const effectiveSortDir = filters.sortDir ?? "desc";

  function toggleSort(column: BrowseSortColumn) {
    const isActive = column === effectiveSortBy;
    const nextDir: "asc" | "desc" = isActive
      ? effectiveSortDir === "asc"
        ? "desc"
        : "asc"
      : column === "conviction_date"
        ? "desc"
        : "asc";
    runQuery({ ...filters, sortBy: column, sortDir: nextDir, page: 1 });
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
                {titleCase(t.name)}
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

      <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "3" })}>
        <p className={css({ fontSize: "body", color: "fgMuted" })}>
          {isFiltered
            ? `${total.toLocaleString()} matching record${total === 1 ? "" : "s"} (of ${initialTotal.toLocaleString()} total)`
            : `${total.toLocaleString()} record${total === 1 ? "" : "s"}`}
        </p>
        {rows.length > 0 && (
          <button
            onClick={exportCsv}
            disabled={isExporting}
            className={css({
              px: "3",
              py: "1.5",
              borderWidth: "hairline", borderStyle: "solid",
              borderColor: "borderMuted",
              borderRadius: "corner",
              fontSize: "body",
              color: "fg",
              bg: "bgSurface",
              cursor: "pointer",
              _hover: { borderColor: "fgAccent" },
              _disabled: { opacity: 0.5, cursor: "default" },
            })}
          >
            {isExporting ? "Preparing…" : `Download CSV (${total.toLocaleString()} rows)`}
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <EmptyState>No records match these filters.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              {SORT_COLUMNS.map(({ key, label }) => (
                <Th key={key}>
                  <button
                    type="button"
                    onClick={() => toggleSort(key)}
                    className={css({
                      display: "flex",
                      alignItems: "center",
                      gap: "1",
                      bg: "transparent",
                      border: "none",
                      p: 0,
                      m: 0,
                      font: "inherit",
                      color: "inherit",
                      cursor: "pointer",
                      _hover: { color: "fgAccent" },
                    })}
                  >
                    {label}
                    <span aria-hidden className={css({ fontSize: "small", opacity: key === effectiveSortBy ? 1 : 0.35 })}>
                      {key === effectiveSortBy && effectiveSortDir === "asc" ? "▲" : "▼"}
                    </span>
                  </button>
                </Th>
              ))}
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
                <Td>{r.offence_type_names ?? "—"}</Td>
                <Td>
                  {r.offence_town_name || r.court_town_name
                    ? titleCase(r.offence_town_name ?? r.court_town_name!)
                    : "—"}
                </Td>
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
          <span className={css({ fontSize: "body", color: "fgMuted" })}>
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
        fontSize: "small",
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
  borderWidth: "hairline", borderStyle: "solid",
  borderColor: "borderMuted",
  borderRadius: "corner",
  fontSize: "body",
  color: "fg",
  bg: "bgSurface",
  cursor: "pointer",
  _hover: { borderColor: "fgAccent" },
  _disabled: { opacity: 0.5, cursor: "default" },
});
