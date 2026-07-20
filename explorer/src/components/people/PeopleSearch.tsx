"use client";

import { useState } from "react";
import Link from "next/link";
import { css, cx } from "styled-system/css";
import { useClientQuery } from "@/lib/useClientQuery";
import { searchPeople, type PersonSearchResult } from "@/lib/queries/peopleSearch";
import { Card, EmptyState, Pill, formInputStyle, primaryButtonStyle } from "@/components/ui";
import { toSlug } from "@/lib/slug";

export function PeopleSearch() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [results, setResults] = useState<PersonSearchResult[]>([]);
  const { isPending, run } = useClientQuery<PersonSearchResult[]>(setResults);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    setSubmitted(q);
    if (!q) {
      setResults([]);
      return;
    }
    run((db) => searchPeople(db, q));
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={css({ display: "flex", gap: "3" })}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name…"
          autoFocus
          className={cx(formInputStyle, css({ flex: "1" }))}
        />
        <button type="submit" disabled={isPending} className={primaryButtonStyle}>
          {isPending ? "Searching…" : "Search"}
        </button>
      </form>

      {submitted && !isPending && results.length === 0 && (
        <EmptyState>No matches for “{submitted}”.</EmptyState>
      )}

      {results.length > 0 && (
        <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
          {results.map((r) => (
            <Link key={r.name_key} href={`/people/${toSlug(r.name_key)}`}>
              <Card
                className={css({
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  _hover: { borderColor: "fgAccent" },
                })}
              >
                <span className={css({ fontWeight: "600" })}>{r.display_name}</span>
                <span className={css({ display: "flex", gap: "2" })}>
                  {r.defendant_mentions > 0 && (
                    <Pill>
                      {r.defendant_mentions} defendant mention{r.defendant_mentions === 1 ? "" : "s"}
                    </Pill>
                  )}
                  {r.person_mentions > 0 && (
                    <Pill>
                      {r.person_mentions} other mention{r.person_mentions === 1 ? "" : "s"}
                    </Pill>
                  )}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
