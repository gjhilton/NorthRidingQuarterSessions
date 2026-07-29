"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { css } from "styled-system/css";
import { useClientQuery } from "@/lib/useClientQuery";
import { downloadCsv } from "@/lib/csv";
import {
  filtersFromSearchParams,
  isFilteredSearch,
  listConvictions,
  searchParamsFromFilters,
  PAGE_SIZE,
  type BrowseDefendantName,
  type BrowseFilters,
  type BrowseRow,
  type BrowseSortColumn,
} from "@/lib/queries/browseList";
import type { Option, OffenceTypeOption, StreetOption } from "@/lib/queries/filters";
import { convictionHref } from "@/lib/referenceSlug";
import { titleCase } from "@/lib/text";
import { formatDate } from "@/lib/date";
import { formatNameRow } from "@/lib/queries/personFragments";
import {
  Card,
  EmptyState,
  FormField,
  IconButton,
  PaginationNav,
  Table,
  Th,
  Td,
  filterInputStyle,
  formInputStyle,
} from "@/components/ui";
import { ClickableTr, referenceCellStyle } from "@/components/ClickableRow";
import { SearchField } from "@/components/SearchField";
import { FilterIcon } from "@/components/icons/FilterIcon";
import { DownloadIcon } from "@/components/icons/DownloadIcon";

// Large enough to cover "every row matching the current filters" in one
// query -- the whole extracted corpus is a few thousand rows at most, so
// there's no real pagination-of-export concern to design around.
const EXPORT_PAGE_SIZE = 1_000_000;

type CsvRow = Omit<BrowseRow, "defendant_names_json"> & { defendant_names: string };

// defendant_names_json is a JSON array (one object per defendant) rather
// than a pre-joined string, specifically so each name can go through the
// site's standard SURNAME, Firstname formatting instead of a plain
// "First Last" concatenation done in SQL. No occupation here any more --
// personsJsonExpr (personFragments.ts) deliberately doesn't include it,
// since it's a real multi-valued join (person_occupation) now rather than a
// flat column; see browseList.ts's BrowseDefendantName for the full reason.
function parseDefendantNames(json: string | null): string[] {
  if (!json) return [];
  const defendants = JSON.parse(json) as BrowseDefendantName[];
  return defendants.map(formatNameRow);
}

function formatDefendantNames(json: string | null): string {
  const names = parseDefendantNames(json);
  // Semicolons, not commas -- formatPersonName's own "SURNAME, Firstname"
  // already uses a comma, so a comma-joined list of them is ambiguous about
  // where one name ends and the next begins.
  return names.length > 0 ? names.join("; ") : "—";
}

// A hydrated/pasted URL's locationId could be a town or a more specific
// street -- either way, the Street field needs to know which town's list to
// show. Falls back to treating locationId itself as the town when it
// doesn't match a known street (i.e. it already is one).
function deriveSelectedTownId(
  locationId: number | undefined,
  streets: StreetOption[]
): number | undefined {
  if (locationId === undefined) return undefined;
  return streets.find((s) => s.id === locationId)?.townId ?? locationId;
}

export function BrowseExplorer({
  initialRows,
  initialTotal,
  towns,
  streets,
  offenceCategories,
  offenceTypes,
  dateRange,
  sentenceDateRange,
  defendantCounts,
}: {
  initialRows: BrowseRow[];
  initialTotal: number;
  towns: Option[];
  streets: StreetOption[];
  offenceCategories: Option[];
  offenceTypes: OffenceTypeOption[];
  dateRange: { min: string | null; max: string | null };
  sentenceDateRange: { min: string | null; max: string | null };
  defendantCounts: number[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<BrowseFilters>({ page: 1, pageSize: PAGE_SIZE });
  // Mirrors which town filters.locationId currently falls under (itself, if
  // it's a town-level id, or that street's own town if it's more specific)
  // but updates live as the Town field changes (before submit), so the
  // Street/Type fields -- scoped to whichever town/category is currently
  // selected -- can show/hide/repopulate immediately rather than only after
  // the next search.
  const [selectedTownId, setSelectedTownId] = useState<number | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  // Bumped on reset to remount the form -- the uncontrolled fields (date
  // inputs, sex, checkbox) only go back to their defaults if React tears
  // them down and recreates them, not just from clearing filters state.
  const [formKey, setFormKey] = useState(0);
  const [rows, setRows] = useState(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const { isPending, run } = useClientQuery<{ rows: BrowseRow[]; total: number }>((result) => {
    setRows(result.rows);
    setTotal(result.total);
  });
  const { isPending: isExporting, run: runExport } = useClientQuery<CsvRow[]>((exportRows) => {
    downloadCsv("nrqs-convictions.csv", exportRows);
  });

  useEffect(() => {
    if (searchParams.size === 0) return;
    const urlFilters = filtersFromSearchParams(searchParams);
    setFilters(urlFilters);
    setSelectedTownId(deriveSelectedTownId(urlFilters.locationId, streets));
    setSelectedCategoryId(
      urlFilters.offenceCategoryId ?? offenceTypes.find((o) => o.id === urlFilters.offenceTypeId)?.categoryId ?? undefined
    );
    run((db) => listConvictions(db, urlFilters));
    // Only hydrate from the URL once, on mount -- afterwards this component
    // is the one writing to the URL (see runQuery), not reading from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (filters.page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(filters.page * PAGE_SIZE, total);
  const isFiltered = isFilteredSearch(filters);
  // Carried onto each row's link so the detail page can show "Record N of M
  // matching search for..." and keep Prev/Next scoped to this same filtered
  // set, instead of losing that context the moment a record is opened.
  const rowLinkQs = searchParamsFromFilters(filters);

  function exportCsv() {
    runExport((db) => {
      const rows = listConvictions(db, { ...filters, page: 1, pageSize: EXPORT_PAGE_SIZE }).rows;
      // Swap the raw JSON column for the same formatted name list the table
      // shows -- a CSV column of json_group_array output would be useless.
      return rows.map(({ defendant_names_json, ...rest }) => ({
        ...rest,
        defendant_names: formatDefendantNames(defendant_names_json),
      }));
    });
  }

  function runQuery(nextFilters: BrowseFilters) {
    setFilters(nextFilters);
    run((db) => listConvictions(db, nextFilters));
    const qs = searchParamsFromFilters(nextFilters);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function resetFilters() {
    setSelectedTownId(undefined);
    setSelectedCategoryId(undefined);
    setFormKey((k) => k + 1);
    runQuery({ page: 1, pageSize: PAGE_SIZE });
  }

  // Reads the current state of every field in the form, with room for a
  // caller to override specific values -- needed when a change handler
  // fires before React has re-rendered a dependent field (e.g. picking a
  // new town should drop any previously-selected street immediately, not
  // whatever stale value is still sitting in that select's DOM node).
  function filtersFromForm(form: HTMLFormElement, overrides: Partial<BrowseFilters> = {}): BrowseFilters {
    const data = new FormData(form);
    const field = (name: string) => (data.get(name) as string) || undefined;
    const sex = field("sex");
    // The more specific field wins when both are set -- street implies its
    // town, not an additional narrowing.
    const locationId = field("street")
      ? Number(field("street"))
      : field("town")
        ? Number(field("town"))
        : undefined;
    return {
      q: field("q"),
      locationId,
      offenceCategoryId: field("category") ? Number(field("category")) : undefined,
      offenceTypeId: field("offence") ? Number(field("offence")) : undefined,
      dateFrom: field("from"),
      dateTo: field("to"),
      sentenceDateFrom: field("sentenceFrom"),
      sentenceDateTo: field("sentenceTo"),
      sex: sex === "male" || sex === "female" ? sex : undefined,
      minorDefendant: field("minor") === "on" ? true : undefined,
      defendantCount: field("defendants") ? Number(field("defendants")) : undefined,
      page: 1,
      pageSize: PAGE_SIZE,
      ...overrides,
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    runQuery(filtersFromForm(e.currentTarget));
  }

  // Every advanced-search field applies itself immediately, the moment it
  // changes -- only the free-text field keeps an explicit submit (its
  // magnifier button), since querying on every keystroke there would be
  // excessive.
  function handleFieldChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    runQuery(filtersFromForm(e.currentTarget.form!));
  }

  function goToPage(page: number) {
    runQuery({ ...filters, page });
  }

  const streetsForSelectedTown = streets.filter((s) => s.townId === selectedTownId);
  const offenceTypesForSelectedCategory = offenceTypes.filter((o) => o.categoryId === selectedCategoryId);

  const effectiveSortBy = filters.sortBy ?? "conviction_date";
  const effectiveSortDir = filters.sortDir ?? "asc";

  function toggleSort(column: BrowseSortColumn) {
    const isActive = column === effectiveSortBy;
    const nextDir: "asc" | "desc" = isActive
      ? effectiveSortDir === "asc"
        ? "desc"
        : "asc"
      : "asc";
    runQuery({ ...filters, sortBy: column, sortDir: nextDir, page: 1 });
  }

  function sortButton(column: BrowseSortColumn, label: string) {
    return (
      <button
        type="button"
        onClick={() => toggleSort(column)}
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
        <span aria-hidden className={css({ fontSize: "M", opacity: column === effectiveSortBy ? 1 : 0.35 })}>
          {column === effectiveSortBy && effectiveSortDir === "asc" ? "▲" : "▼"}
        </span>
      </button>
    );
  }

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "6" })}>
      {/* EXPERIMENTAL: tinted background on the whole search/filters box --
          revert to the plain Card default if it doesn't work out. */}
      <Card bg="bgSurface" borderWidth="0">
        <form
          key={formKey}
          onSubmit={handleSubmit}
          className={css({ display: "flex", flexDirection: "column", gap: "3" })}
        >
          <SearchField type="text" name="q" defaultValue={filters.q ?? ""} placeholder="name, reference, charge…" />

          <details className={css({ fontSize: "M" })}>
            <summary
              className={css({
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                color: "fgMuted",
                _hover: { color: "fgAccent" },
              })}
            >
              <span className={css({ display: "inline-flex", alignItems: "center", gap: "2" })}>
                <FilterIcon size={14} />
                {isFiltered ? "Filtered" : "Filter"}
              </span>
              {isFiltered && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    resetFilters();
                  }}
                  className={css({ color: "fgAccent", fontWeight: "600", cursor: "pointer" })}
                >
                  Clear filters
                </span>
              )}
            </summary>
            <div
              className={css({
                display: "grid",
                gridTemplateColumns: { base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
                gap: "4",
                mt: "4",
              })}
            >
              <fieldset
                className={css({
                  gridColumn: "1 / -1",
                  border: "none",
                  p: "0",
                  m: "0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1",
                })}
              >
                <legend className={css({ fontSize: "M", color: "fgMuted", fontWeight: "600", p: "0" })}>
                  Offence location
                </legend>
                <div className={css({ display: "flex", gap: "3" })}>
                  <FormField label="Town" className={css({ flex: "1" })}>
                    <select
                      name="town"
                      value={selectedTownId ?? ""}
                      onChange={(e) => {
                        const townId = e.target.value ? Number(e.target.value) : undefined;
                        setSelectedTownId(townId);
                        runQuery(filtersFromForm(e.currentTarget.form!, { locationId: townId }));
                      }}
                      className={inputStyle}
                    >
                      <option value="">All towns</option>
                      {towns.map((t) => (
                        <option key={t.id} value={t.id}>
                          {titleCase(t.name)}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  {streetsForSelectedTown.length > 0 && (
                    <FormField label="Street" className={css({ flex: "1" })}>
                      <select
                        key={selectedTownId}
                        name="street"
                        defaultValue={
                          streetsForSelectedTown.some((s) => s.id === filters.locationId)
                            ? (filters.locationId ?? "")
                            : ""
                        }
                        onChange={handleFieldChange}
                        className={inputStyle}
                      >
                        <option value="">All streets</option>
                        {streetsForSelectedTown.map((s) => (
                          <option key={s.id} value={s.id}>
                            {titleCase(s.name)}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  )}
                </div>
              </fieldset>
              <fieldset
                className={css({
                  gridColumn: "1 / -1",
                  border: "none",
                  p: "0",
                  m: "0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1",
                })}
              >
                <legend className={css({ fontSize: "M", color: "fgMuted", fontWeight: "600", p: "0" })}>
                  Offence
                </legend>
                <div className={css({ display: "flex", gap: "3" })}>
                  <FormField label="Category" className={css({ flex: "1" })}>
                    <select
                      name="category"
                      value={selectedCategoryId ?? ""}
                      onChange={(e) => {
                        const offenceCategoryId = e.target.value ? Number(e.target.value) : undefined;
                        setSelectedCategoryId(offenceCategoryId);
                        runQuery(
                          filtersFromForm(e.currentTarget.form!, { offenceCategoryId, offenceTypeId: undefined })
                        );
                      }}
                      className={inputStyle}
                    >
                      <option value="">All categories</option>
                      {offenceCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  {offenceTypesForSelectedCategory.length > 0 && (
                    <FormField label="Type" className={css({ flex: "1" })}>
                      <select
                        key={selectedCategoryId}
                        name="offence"
                        defaultValue={filters.offenceCategoryId === selectedCategoryId ? (filters.offenceTypeId ?? "") : ""}
                        onChange={handleFieldChange}
                        className={inputStyle}
                      >
                        <option value="">All types</option>
                        {offenceTypesForSelectedCategory.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  )}
                </div>
              </fieldset>
              <fieldset
                className={css({
                  gridColumn: "1 / -1",
                  border: "none",
                  p: "0",
                  m: "0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1",
                })}
              >
                <legend className={css({ fontSize: "M", color: "fgMuted", fontWeight: "600", p: "0" })}>
                  Offence date
                </legend>
                <div className={css({ display: "flex", gap: "3" })}>
                  <FormField label="From" className={css({ flex: "1" })}>
                    <input
                      type="date"
                      name="from"
                      defaultValue={filters.dateFrom ?? dateRange.min ?? ""}
                      min={dateRange.min ?? undefined}
                      max={dateRange.max ?? undefined}
                      onChange={handleFieldChange}
                      className={inputStyle}
                    />
                  </FormField>
                  <FormField label="To" className={css({ flex: "1" })}>
                    <input
                      type="date"
                      name="to"
                      defaultValue={filters.dateTo ?? dateRange.max ?? ""}
                      min={dateRange.min ?? undefined}
                      max={dateRange.max ?? undefined}
                      onChange={handleFieldChange}
                      className={inputStyle}
                    />
                  </FormField>
                </div>
              </fieldset>
              <fieldset
                className={css({
                  gridColumn: "1 / -1",
                  border: "none",
                  p: "0",
                  m: "0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1",
                })}
              >
                <legend className={css({ fontSize: "M", color: "fgMuted", fontWeight: "600", p: "0" })}>
                  Conviction date
                </legend>
                <div className={css({ display: "flex", gap: "3" })}>
                  <FormField label="From" className={css({ flex: "1" })}>
                    <input
                      type="date"
                      name="sentenceFrom"
                      defaultValue={filters.sentenceDateFrom ?? sentenceDateRange.min ?? ""}
                      min={sentenceDateRange.min ?? undefined}
                      max={sentenceDateRange.max ?? undefined}
                      onChange={handleFieldChange}
                      className={inputStyle}
                    />
                  </FormField>
                  <FormField label="To" className={css({ flex: "1" })}>
                    <input
                      type="date"
                      name="sentenceTo"
                      defaultValue={filters.sentenceDateTo ?? sentenceDateRange.max ?? ""}
                      min={sentenceDateRange.min ?? undefined}
                      max={sentenceDateRange.max ?? undefined}
                      onChange={handleFieldChange}
                      className={inputStyle}
                    />
                  </FormField>
                </div>
              </fieldset>
              <fieldset
                className={css({
                  gridColumn: "1 / -1",
                  border: "none",
                  p: "0",
                  m: "0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1",
                })}
              >
                <legend className={css({ fontSize: "M", color: "fgMuted", fontWeight: "600", p: "0" })}>
                  Offenders
                </legend>
                <div className={css({ display: "flex", gap: "3" })}>
                  <FormField label="Gender" className={css({ flex: "1" })}>
                    <select name="sex" defaultValue={filters.sex ?? ""} onChange={handleFieldChange} className={inputStyle}>
                      <option value="">Any</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </FormField>
                  <FormField label="Number" className={css({ flex: "1" })}>
                    <select
                      name="defendants"
                      defaultValue={filters.defendantCount ?? ""}
                      onChange={handleFieldChange}
                      className={inputStyle}
                    >
                      <option value="">Any</option>
                      {defendantCounts.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Minor" className={css({ flex: "1" })}>
                    <select
                      name="minor"
                      defaultValue={filters.minorDefendant ? "on" : ""}
                      onChange={handleFieldChange}
                      className={inputStyle}
                    >
                      <option value="">Any</option>
                      <option value="on">Under 16</option>
                    </select>
                  </FormField>
                </div>
              </fieldset>
            </div>
          </details>
        </form>
      </Card>

      <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "3" })}>
        <p className={css({ fontSize: "M", color: "fgMuted" })}>
          {total === 1 ? (
            <>
              Showing <strong className={css({ color: "fg" })}>1</strong> matching record
            </>
          ) : total <= PAGE_SIZE ? (
            <>
              Showing all <strong className={css({ color: "fg" })}>{total.toLocaleString()}</strong> matching
              records
            </>
          ) : (
            <>
              Showing{" "}
              <strong className={css({ color: "fg" })}>
                {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()}
              </strong>{" "}
              of <strong className={css({ color: "fg" })}>{total.toLocaleString()}</strong> matching records
            </>
          )}
        </p>
        {rows.length > 0 && (
          <IconButton icon={<DownloadIcon size={18} />} onClick={exportCsv} disabled={isExporting}>
            <span
              className={css({
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: "1.15",
              })}
            >
              <span className={css({ fontSize: "M" })}>
                {isExporting ? "Preparing…" : "Download CSV"}
              </span>
              {!isExporting && (
                <span className={css({ fontSize: "M", opacity: 0.7 })}>
                  {total.toLocaleString()} row{total === 1 ? "" : "s"}
                </span>
              )}
            </span>
          </IconButton>
        )}
      </div>

      {rows.length === 0 ? (
        <EmptyState>No records match these filters.</EmptyState>
      ) : (
        <Table borderWidth="lineweight_heavy" fontSize="M">
          <thead>
            <tr>
              <Th rowSpan={2}>Record ID</Th>
              <Th rowSpan={2}>{sortButton("conviction_date", "Date")}</Th>
              <Th rowSpan={2}>Offender(s)</Th>
              <Th colSpan={3}>Offence</Th>
            </tr>
            <tr>
              <Th>{sortButton("offence_type_names", "Type")}</Th>
              <Th>{sortButton("offence_date", "Date")}</Th>
              <Th>{sortButton("location", "Place")}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <ClickableTr
                key={r.id}
                href={`${convictionHref(r.reference_number)}${rowLinkQs ? `?${rowLinkQs}` : ""}`}
              >
                <Td verticalAlign="middle" className={referenceCellStyle}>{r.reference_number}</Td>
                <Td verticalAlign="middle">{formatDate(r.conviction_date) ?? "—"}</Td>
                <Td verticalAlign="middle">{formatDefendantNames(r.defendant_names_json)}</Td>
                <Td verticalAlign="middle" className={truncateCellStyle}>{r.offence_type_names ?? "—"}</Td>
                <Td verticalAlign="middle" className={truncateCellStyle}>{formatDate(r.offence_date) ?? r.offence_date_raw ?? "—"}</Td>
                <Td verticalAlign="middle" className={truncateCellStyle}>
                  {r.offence_town_name || r.court_town_name
                    ? titleCase(r.offence_town_name ?? r.court_town_name!)
                    : "—"}
                </Td>
              </ClickableTr>
            ))}
          </tbody>
        </Table>
      )}

      <PaginationNav
        page={filters.page}
        totalPages={totalPages}
        disabled={isPending}
        onPrev={() => goToPage(Math.max(1, filters.page - 1))}
        onNext={() => goToPage(Math.min(totalPages, filters.page + 1))}
      />
    </div>
  );
}

const inputStyle = css(formInputStyle, filterInputStyle);

// The three Offence-group columns (Type, Date, Place) truncate long content
// with an ellipsis instead of wrapping the row taller -- Type especially can
// be a long comma-joined list of offence names.
const truncateCellStyle = css({
  maxWidth: "12rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

