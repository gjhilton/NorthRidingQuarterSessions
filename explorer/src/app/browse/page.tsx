import Link from "next/link";
import { css } from "styled-system/css";
import { listConvictions } from "@/lib/queries/browse";
import { listTowns, listOffenceTypes } from "@/lib/queries/filters";
import { PageContainer, PageTitle, Table, Th, Td, EmptyState } from "@/components/ui";

const PAGE_SIZE = 25;

function toInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const get = (key: string) => (typeof sp[key] === "string" ? (sp[key] as string) : undefined);

  const filters = {
    q: get("q"),
    townId: toInt(get("town")),
    offenceTypeId: toInt(get("offence")),
    dateFrom: get("from"),
    dateTo: get("to"),
    page: toInt(get("page")) ?? 1,
    pageSize: PAGE_SIZE,
  };

  const [{ rows, total }, towns, offenceTypes] = await Promise.all([
    Promise.resolve(listConvictions(filters)),
    Promise.resolve(listTowns()),
    Promise.resolve(listOffenceTypes()),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.townId) params.set("town", String(filters.townId));
    if (filters.offenceTypeId) params.set("offence", String(filters.offenceTypeId));
    if (filters.dateFrom) params.set("from", filters.dateFrom);
    if (filters.dateTo) params.set("to", filters.dateTo);
    params.set("page", String(page));
    return `/browse?${params.toString()}`;
  };

  return (
    <PageContainer>
      <PageTitle subtitle={`${total} record${total === 1 ? "" : "s"} matched`}>Browse</PageTitle>

      <form
        method="GET"
        className={css({
          display: "flex",
          flexWrap: "wrap",
          gap: "3",
          alignItems: "end",
        })}
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
        <button
          type="submit"
          className={css({
            bg: "fgAccent",
            color: "bgSurface",
            px: "4",
            py: "2",
            borderRadius: "md",
            fontSize: "sm",
            fontWeight: "600",
            cursor: "pointer",
            border: "none",
          })}
        >
          Apply
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
          <Link
            href={pageHref(Math.max(1, filters.page - 1))}
            aria-disabled={filters.page <= 1}
            className={pageLinkStyle}
          >
            ← Prev
          </Link>
          <span className={css({ fontSize: "sm", color: "fgMuted" })}>
            Page {filters.page} of {totalPages}
          </span>
          <Link
            href={pageHref(Math.min(totalPages, filters.page + 1))}
            aria-disabled={filters.page >= totalPages}
            className={pageLinkStyle}
          >
            Next →
          </Link>
        </nav>
      )}
    </PageContainer>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={css({ display: "flex", flexDirection: "column", gap: "1", fontSize: "xs", color: "fgMuted" })}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = css({
  border: "1px solid",
  borderColor: "borderMuted",
  borderRadius: "md",
  px: "2",
  py: "1.5",
  fontSize: "sm",
  bg: "bgSurface",
  color: "fg",
  minWidth: "9rem",
});

const pageLinkStyle = css({
  px: "3",
  py: "1.5",
  border: "1px solid",
  borderColor: "borderMuted",
  borderRadius: "md",
  fontSize: "sm",
  color: "fg",
  _hover: { borderColor: "fgAccent" },
});
