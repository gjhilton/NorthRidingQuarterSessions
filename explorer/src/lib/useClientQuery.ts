"use client";

// Shared by the two search islands (BrowseExplorer, PeopleSearch): both need
// the same "lazy-load sql.js, run a query against it, patch state" shape,
// just with different queries and result handling.
import { useTransition } from "react";
import { getClientDb } from "@/lib/clientDb";
import type { DbLike } from "@/lib/dbTypes";

export function useClientQuery<T>(onResult: (result: T) => void) {
  const [isPending, startTransition] = useTransition();

  function run(query: (db: DbLike) => T) {
    startTransition(async () => {
      const db = await getClientDb();
      onResult(query(db));
    });
  }

  return { isPending, run };
}
