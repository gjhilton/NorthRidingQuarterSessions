import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "styled-system/css";
import { PageContainer, PageTitle } from "@/components/ui";
import { OffenceConvictionTable } from "@/components/OffenceConvictionTable";
import {
  OFFENCE_PAGE_SIZE,
  getOffenceTypeConvictionCount,
  getOffenceTypeConvictions,
  getOffenceTypeDetail,
} from "@/lib/queries/offences";
import { sentenceCase } from "@/lib/text";

// Shared by /offences/[id] (page 1) and /offences/[id]/[page] (page 2+) --
// same page, two routes, so page 1 can be a clean /offences/[id] URL
// instead of /offences/[id]/1. Fully static (generateStaticParams in both
// route files), same "the dataset doesn't change, prerender all of it"
// reasoning as conviction/location detail pages -- no client-side
// pagination needed since an offence type's membership doesn't depend on
// user input.
export function OffencePageContent({ id, page }: { id: number; page: number }) {
  const offenceType = getOffenceTypeDetail(id);
  if (!offenceType) notFound();

  const total = getOffenceTypeConvictionCount(id);
  const totalPages = Math.max(1, Math.ceil(total / OFFENCE_PAGE_SIZE));
  if (page < 1 || page > totalPages) notFound();

  const convictions = getOffenceTypeConvictions(id, page);

  const prevHref = page > 2 ? `/offences/${id}/${page - 1}` : page === 2 ? `/offences/${id}` : undefined;
  const nextHref = page < totalPages ? `/offences/${id}/${page + 1}` : undefined;

  return (
    <PageContainer>
      <PageTitle subtitle={`${total.toLocaleString()} conviction${total === 1 ? "" : "s"}`}>
        {sentenceCase(offenceType.name)}
      </PageTitle>

      <OffenceConvictionTable rows={convictions} />

      {totalPages > 1 && (
        <nav className={css({ display: "flex", gap: "3", alignItems: "center" })}>
          {prevHref ? (
            <Link href={prevHref} className={css({ fontSize: "M", color: "fgAccent" })}>
              ← Previous
            </Link>
          ) : (
            <span className={css({ fontSize: "M", color: "fgMuted", opacity: 0.5 })}>← Previous</span>
          )}
          <span className={css({ fontSize: "M", color: "fgMuted" })}>
            Page {page} of {totalPages}
          </span>
          {nextHref ? (
            <Link href={nextHref} className={css({ fontSize: "M", color: "fgAccent" })}>
              Next →
            </Link>
          ) : (
            <span className={css({ fontSize: "M", color: "fgMuted", opacity: 0.5 })}>Next →</span>
          )}
        </nav>
      )}
    </PageContainer>
  );
}
