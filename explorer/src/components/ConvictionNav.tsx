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

interface SearchNavState {
  prevId: number | null;
  nextId: number | null;
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
  convictionId,
  serverPrevId,
  serverNextId,
  serverPosition,
  serverTotal,
}: {
  convictionId: number;
  serverPrevId: number | null;
  serverNextId: number | null;
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
      const ids = listConvictionOrder(db, filters);
      const index = ids.indexOf(convictionId);
      // The current record no longer matches these filters (e.g. an edited
      // URL, or filters that have since changed) -- fall back to the
      // whole-dataset default rather than showing a broken position.
      if (index === -1) return null;
      return {
        prevId: index > 0 ? ids[index - 1] : null,
        nextId: index < ids.length - 1 ? ids[index + 1] : null,
        position: index + 1,
        total: ids.length,
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
  const prevId = searchNav ? searchNav.prevId : serverPrevId;
  const nextId = searchNav ? searchNav.nextId : serverNextId;
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
        {prevId !== null ? (
          <Link href={`/convictions/${prevId}${linkQs}`} className={css({ color: "fgAccent" })}>
            ← Previous
          </Link>
        ) : (
          <span className={css({ color: "fgMuted", opacity: 0.5 })}>← Previous</span>
        )}
        {nextId !== null ? (
          <Link href={`/convictions/${nextId}${linkQs}`} className={css({ color: "fgAccent" })}>
            Next →
          </Link>
        ) : (
          <span className={css({ color: "fgMuted", opacity: 0.5 })}>Next →</span>
        )}
      </div>
    </div>
  );
}
