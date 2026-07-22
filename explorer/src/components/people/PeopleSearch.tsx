"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { css, cx } from "styled-system/css";
import { useClientQuery } from "@/lib/useClientQuery";
import { searchPeople, type PersonSearchResult } from "@/lib/queries/peopleSearch";
import { formInputStyle } from "@/components/ui";
import { toSlug } from "@/lib/slug";
import { formatPersonName } from "@/lib/text";

const SUGGESTION_LIMIT = 8;
const DEBOUNCE_MS = 150;

export function PeopleSearch({ autoFocus = true }: { autoFocus?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PersonSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const { run } = useClientQuery<PersonSearchResult[]>((r) => {
    setResults(r);
    setHighlighted(-1);
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setOpen(false);
      return;
    }
    const timer = setTimeout(() => {
      run((db) => searchPeople(db, q, SUGGESTION_LIMIT));
      setOpen(true);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goTo(nameKey: string) {
    setOpen(false);
    router.push(`/people/${toSlug(nameKey)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[highlighted] ?? results[0];
      if (pick) goTo(pick.name_key);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={css({ position: "relative" })}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search by name…"
        autoFocus={autoFocus}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className={cx(formInputStyle, css({ width: "100%" }))}
      />

      {open && results.length > 0 && (
        <div
          className={css({
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 10,
            bg: "bgSurface",
            borderWidth: "hairline",
            borderStyle: "solid",
            borderColor: "borderMuted",
            borderRadius: "corner",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
          })}
        >
          {results.map((r, i) => (
            <div
              key={r.name_key}
              onMouseDown={() => goTo(r.name_key)}
              onMouseEnter={() => setHighlighted(i)}
              className={css({
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                px: "3",
                py: "2",
                borderBottomWidth: "hairline",
                borderBottomStyle: "solid",
                borderColor: "borderMuted",
                bg: i === highlighted ? "bg" : "bgSurface",
                _last: { borderBottomWidth: "0" },
              })}
            >
              <span className={css({ fontWeight: "600" })}>
                {formatPersonName(r.first_name, r.last_name, r.occupation)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
