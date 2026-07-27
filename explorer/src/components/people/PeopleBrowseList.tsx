"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { css, cx } from "styled-system/css";
import { useClientQuery } from "@/lib/useClientQuery";
import {
  filtersFromSearchParams,
  isFilteredSearch,
  listLetterCounts,
  listPeople,
  searchParamsFromFilters,
  PAGE_SIZE,
  type PeopleFilters,
  type PeopleSortColumn,
  type PersonListRow,
} from "@/lib/queries/peopleList";
import { personHref } from "@/lib/links";
import { formatPersonName, titleCase } from "@/lib/text";
import { Card, EmptyState, Table, Th, Td, formInputStyle } from "@/components/ui";
import { ClickableTr } from "@/components/ClickableRow";
import { FilterIcon } from "@/components/icons/FilterIcon";
import { PeopleSearch } from "@/components/people/PeopleSearch";

// Close clone of BrowseExplorer (the Convictions listing) -- same
// filter-box/URL-sync/client-query/pagination shape, applied to people
// instead of convictions. See peopleList.ts for the query side.
export function PeopleBrowseList({
  initialRows,
  initialTotal,
  initialLetterCounts,
  letters,
  roles,
  towns,
  occupations,
  convictionDateRange,
}: {
  initialRows: PersonListRow[];
  initialTotal: number;
  initialLetterCounts: Record<string, number>;
  letters: string[];
  roles: string[];
  towns: string[];
  occupations: string[];
  convictionDateRange: { min: string | null; max: string | null };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<PeopleFilters>({ page: 1, pageSize: PAGE_SIZE });
  const [formKey, setFormKey] = useState(0);
  const [rows, setRows] = useState(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const [letterCounts, setLetterCounts] = useState(initialLetterCounts);
  const { isPending, run } = useClientQuery<{ rows: PersonListRow[]; total: number }>((result) => {
    setRows(result.rows);
    setTotal(result.total);
  });
  // Separate from the main results query -- this recomputes which letters
  // have zero matches under the current (non-letter) filters, so the A-Z nav
  // can grey those out, independent of which letter (if any) is selected.
  const { run: runLetterCounts } = useClientQuery<Record<string, number>>(setLetterCounts);

  useEffect(() => {
    if (searchParams.size === 0) return;
    const urlFilters = filtersFromSearchParams(searchParams);
    setFilters(urlFilters);
    run((db) => listPeople(db, urlFilters));
    runLetterCounts((db) => listLetterCounts(db, urlFilters));
    // Only hydrate from the URL once, on mount -- afterwards this component
    // is the one writing to the URL (see runQuery), not reading from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (filters.page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(filters.page * PAGE_SIZE, total);
  const isFiltered = isFilteredSearch(filters);

  function runQuery(nextFilters: PeopleFilters) {
    setFilters(nextFilters);
    run((db) => listPeople(db, nextFilters));
    runLetterCounts((db) => listLetterCounts(db, nextFilters));
    const qs = searchParamsFromFilters(nextFilters);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function resetFilters() {
    setFormKey((k) => k + 1);
    runQuery({ page: 1, pageSize: PAGE_SIZE });
  }

  function filtersFromForm(form: HTMLFormElement, overrides: Partial<PeopleFilters> = {}): PeopleFilters {
    const data = new FormData(form);
    const field = (name: string) => (data.get(name) as string) || undefined;
    const sex = field("sex");
    return {
      letter: filters.letter,
      role: field("role"),
      sex: sex === "male" || sex === "female" ? sex : undefined,
      town: field("town"),
      occupation: field("occupation"),
      convictedFrom: field("from"),
      convictedTo: field("to"),
      page: 1,
      pageSize: PAGE_SIZE,
      ...overrides,
    };
  }

  function handleFieldChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    runQuery(filtersFromForm(e.currentTarget.form!));
  }

  function goToPage(page: number) {
    runQuery({ ...filters, page });
  }

  function selectLetter(letter: string) {
    const isSame = filters.letter === letter;
    runQuery({ ...filters, letter: isSame ? undefined : letter, page: 1 });
  }

  const effectiveSortBy = filters.sortBy ?? "name";
  const effectiveSortDir = filters.sortDir ?? "asc";

  function toggleSort(column: PeopleSortColumn) {
    const isActive = column === effectiveSortBy;
    const nextDir: "asc" | "desc" = isActive ? (effectiveSortDir === "asc" ? "desc" : "asc") : "asc";
    runQuery({ ...filters, sortBy: column, sortDir: nextDir, page: 1 });
  }

  function sortButton(column: PeopleSortColumn, label: string) {
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
      <Card bg="bgSurface" borderWidth="0">
        <form key={formKey} className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
          <PeopleSearch autoFocus={false} />

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
              <FormField label="Role">
                <select
                  name="role"
                  defaultValue={filters.role ?? ""}
                  onChange={handleFieldChange}
                  className={inputStyle}
                >
                  <option value="">Any role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {titleCase(r)}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Sex">
                <select
                  name="sex"
                  defaultValue={filters.sex ?? ""}
                  onChange={handleFieldChange}
                  className={inputStyle}
                >
                  <option value="">Women and men</option>
                  <option value="male">Men</option>
                  <option value="female">Women</option>
                </select>
              </FormField>
              <FormField label="Town of residence">
                <select
                  name="town"
                  defaultValue={filters.town ?? ""}
                  onChange={handleFieldChange}
                  className={inputStyle}
                >
                  <option value="">Any town</option>
                  {towns.map((t) => (
                    <option key={t} value={t}>
                      {titleCase(t)}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Occupation">
                <select
                  name="occupation"
                  defaultValue={filters.occupation ?? ""}
                  onChange={handleFieldChange}
                  className={inputStyle}
                >
                  <option value="">Any occupation</option>
                  {occupations.map((o) => (
                    <option key={o} value={o}>
                      {titleCase(o)}
                    </option>
                  ))}
                </select>
              </FormField>
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
                  Date of conviction
                </legend>
                <div className={css({ display: "flex", gap: "3" })}>
                  <FormField label="From" className={css({ flex: "1" })}>
                    <input
                      type="date"
                      name="from"
                      defaultValue={filters.convictedFrom ?? ""}
                      min={convictionDateRange.min ?? undefined}
                      max={convictionDateRange.max ?? undefined}
                      onChange={handleFieldChange}
                      className={inputStyle}
                    />
                  </FormField>
                  <FormField label="To" className={css({ flex: "1" })}>
                    <input
                      type="date"
                      name="to"
                      defaultValue={filters.convictedTo ?? ""}
                      min={convictionDateRange.min ?? undefined}
                      max={convictionDateRange.max ?? undefined}
                      onChange={handleFieldChange}
                      className={inputStyle}
                    />
                  </FormField>
                </div>
              </fieldset>
            </div>
          </details>
        </form>
      </Card>

      <nav className={css({ display: "flex", flexWrap: "wrap", gap: "1", fontSize: "small" })}>
        {letters.map((letter) => {
          const isSelected = letter === filters.letter;
          const isEmpty = (letterCounts[letter] ?? 0) === 0;
          return (
            <button
              key={letter}
              type="button"
              disabled={isEmpty}
              onClick={() => selectLetter(letter)}
              aria-current={isSelected || undefined}
              className={css({
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "corner",
                cursor: isEmpty ? "default" : "pointer",
                border: "none",
                fontWeight: isSelected ? "700" : "400",
                bg: isSelected ? "fg" : "transparent",
                // Empty-under-current-filters letters render in the page's
                // own background colour rather than a dimmed grey -- they
                // don't just look disabled, they're meant to disappear.
                color: isEmpty ? "bg" : isSelected ? "bg" : "fgAccent",
                _hover: isSelected || isEmpty ? {} : { bg: "bgSurface" },
              })}
            >
              {letter}
            </button>
          );
        })}
      </nav>

      <p className={css({ fontSize: "M", color: "fgMuted" })}>
        {total === 1 ? (
          <>
            Showing <strong className={css({ color: "fg" })}>1</strong> matching name
          </>
        ) : total <= PAGE_SIZE ? (
          <>
            Showing all <strong className={css({ color: "fg" })}>{total.toLocaleString()}</strong> matching
            names
          </>
        ) : (
          <>
            Showing{" "}
            <strong className={css({ color: "fg" })}>
              {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()}
            </strong>{" "}
            of <strong className={css({ color: "fg" })}>{total.toLocaleString()}</strong> matching names
          </>
        )}
      </p>

      {rows.length === 0 ? (
        <EmptyState>No names match these filters.</EmptyState>
      ) : (
        <Table borderWidth="lineweight_heavy" fontSize="M">
          <thead>
            <tr>
              <Th>{sortButton("name", "Name")}</Th>
              <Th>Role(s)</Th>
              <Th>Occupation</Th>
              <Th>Town</Th>
              <Th>{sortButton("total_mentions", "Mentions")}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <ClickableTr key={p.name_key} href={personHref(p.name_key)}>
                <Td verticalAlign="middle">
                  {formatPersonName({
                    firstName: p.first_name,
                    lastName: p.last_name,
                    nameQualifier: p.name_qualifier,
                  })}
                </Td>
                <Td verticalAlign="middle" className={truncateCellStyle}>
                  {p.roles
                    .split(",")
                    .map((r) => titleCase(r))
                    .join(", ")}
                </Td>
                <Td verticalAlign="middle" className={truncateCellStyle}>
                  {p.occupation ? titleCase(p.occupation) : "—"}
                </Td>
                <Td verticalAlign="middle" className={truncateCellStyle}>
                  {p.location_name ? titleCase(p.location_name) : "—"}
                </Td>
                <Td verticalAlign="middle">{p.total_mentions}</Td>
              </ClickableTr>
            ))}
          </tbody>
        </Table>
      )}

      {totalPages > 1 && (
        <nav className={css({ display: "flex", gap: "3", alignItems: "center" })}>
          {filters.page > 1 && !isPending ? (
            <button
              type="button"
              onClick={() => goToPage(Math.max(1, filters.page - 1))}
              className={css({ fontSize: "M", color: "fgAccent", bg: "transparent", border: "none", p: "0", cursor: "pointer" })}
            >
              ← Previous
            </button>
          ) : (
            <span className={css({ fontSize: "M", color: "fgMuted", opacity: 0.5 })}>← Previous</span>
          )}
          <span className={css({ fontSize: "M", color: "fgMuted" })}>
            Page {filters.page} of {totalPages}
          </span>
          {filters.page < totalPages && !isPending ? (
            <button
              type="button"
              onClick={() => goToPage(Math.min(totalPages, filters.page + 1))}
              className={css({ fontSize: "M", color: "fgAccent", bg: "transparent", border: "none", p: "0", cursor: "pointer" })}
            >
              Next →
            </button>
          ) : (
            <span className={css({ fontSize: "M", color: "fgMuted", opacity: 0.5 })}>Next →</span>
          )}
        </nav>
      )}
    </div>
  );
}

function FormField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cx(
        css({
          display: "flex",
          flexDirection: "column",
          gap: "1",
          fontSize: "M",
          color: "fgMuted",
        }),
        className
      )}
    >
      {label}
      {children}
    </label>
  );
}

const inputStyle = css(formInputStyle, { px: "2", py: "1.5", width: "100%", colorScheme: "light" });

const truncateCellStyle = css({
  maxWidth: "12rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
