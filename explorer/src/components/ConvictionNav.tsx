"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { css } from "styled-system/css";
import { useClientQuery } from "@/lib/useClientQuery";
import {
  filtersFromSearchParams,
  isFilteredSearch,
  listConvictionOrder,
} from "@/lib/queries/browseList";
import { convictionHrefFromSlug } from "@/lib/referenceSlug";

interface SearchNavState {
  prevSlug: string | null;
  nextSlug: string | null;
  position: number;
  total: number;
  label: string;
  qs: string;
}

// Renders the server-computed whole-dataset fallback (id-order Prev/Next,
// "Record N of M") on first paint, then -- only if the URL carries filter/
// search state from BrowseExplorer -- swaps in the position/Prev/Next
// within that filtered set instead, via a one-off client-side query
// against the same sql.js copy of the db BrowseExplorer itself uses.
// Deliberately starts from the server fallback rather than nothing, so
// there's no loading flash for the common case of arriving here cold
// (a shared link, a search engine, typing the URL directly).
export function ConvictionNav({
  convictionSlug,
  serverPrevSlug,
  serverNextSlug,
  serverPosition,
  serverTotal,
}: {
  convictionSlug: string;
  serverPrevSlug: string | null;
  serverNextSlug: string | null;
  serverPosition: number;
  serverTotal: number;
}) {
  const searchParams = useSearchParams();
  const [searchNav, setSearchNav] = useState<SearchNavState | null>(null);
  const { run } = useClientQuery<SearchNavState | null>(setSearchNav);

  useEffect(() => {
    if (searchParams.size === 0) return;
    const filters = filtersFromSearchParams(searchParams);
    if (!isFilteredSearch(filters)) return;
    const qs = searchParams.toString();
    run((db) => {
      const rows = listConvictionOrder(db, filters);
      const index = rows.findIndex((r) => r.slug === convictionSlug);
      // The current record no longer matches these filters (e.g. an edited
      // URL, or filters that have since changed) -- fall back to the
      // whole-dataset default rather than showing a broken position.
      if (index === -1) return null;
      return {
        prevSlug: index > 0 ? rows[index - 1].slug : null,
        nextSlug: index < rows.length - 1 ? rows[index + 1].slug : null,
        position: index + 1,
        total: rows.length,
        label: filters.q ? `matching search for "${filters.q}"` : "matching filtered results",
        qs,
      };
    });
    // Only ever needs to run once, on mount, against the URL search params
    // as they were when this page loaded -- matches BrowseExplorer's own
    // "hydrate from the URL once" pattern.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backHref = searchNav ? `/convictions?${searchNav.qs}` : "/convictions";
  const backLabel = searchNav ? "← Back to search results" : "← Back to convictions";
  const prevSlug = searchNav ? searchNav.prevSlug : serverPrevSlug;
  const nextSlug = searchNav ? searchNav.nextSlug : serverNextSlug;
  const linkQs = searchNav ? `?${searchNav.qs}` : "";
  const position = searchNav ? searchNav.position : serverPosition;
  const total = searchNav ? searchNav.total : serverTotal;

  return (
    <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "3" })}>
      <Link href={backHref} className={css({ fontSize: "body", color: "fgMuted" })}>
        {backLabel}
      </Link>
      <p className={css({ fontSize: "small", color: "fgMuted", flex: "1", textAlign: "center" })}>
        Record {position.toLocaleString()} of {total.toLocaleString()}
        {searchNav ? ` ${searchNav.label}` : ""}
      </p>
      <div className={css({ display: "flex", gap: "3", fontSize: "body" })}>
        {prevSlug !== null ? (
          <Link href={`${convictionHrefFromSlug(prevSlug)}${linkQs}`} className={css({ color: "fgAccent" })}>
            ← Previous
          </Link>
        ) : (
          <span className={css({ color: "fgMuted", opacity: 0.5 })}>← Previous</span>
        )}
        {nextSlug !== null ? (
          <Link href={`${convictionHrefFromSlug(nextSlug)}${linkQs}`} className={css({ color: "fgAccent" })}>
            Next →
          </Link>
        ) : (
          <span className={css({ color: "fgMuted", opacity: 0.5 })}>Next →</span>
        )}
      </div>
    </div>
  );
}
