"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { css, cx } from "styled-system/css";
import { formInputStyle } from "@/components/ui";
import { SearchIcon } from "@/components/icons/SearchIcon";

// A lightweight entry point into Browse's own filtering (BrowseExplorer
// already reads `q` from the URL on mount) -- this doesn't run its own
// query, it just hands off to /browse?q=...
export function CasesSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/browse?q=${encodeURIComponent(q)}` : "/browse");
  }

  return (
    <form onSubmit={handleSubmit} className={css({ display: "flex" })}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="name, reference, charge…"
        autoComplete="off"
        className={cx(
          formInputStyle,
          css({ flex: "1", borderRightWidth: "0", borderTopRightRadius: "0", borderBottomRightRadius: "0" })
        )}
      />
      <button
        type="submit"
        aria-label="Search"
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2.75rem",
          borderWidth: "hairline",
          borderStyle: "solid",
          borderColor: "borderMuted",
          borderTopRightRadius: "corner",
          borderBottomRightRadius: "corner",
          bg: "fgAccent",
          color: "bgSurface",
          cursor: "pointer",
          _hover: { opacity: 0.9 },
        })}
      >
        <SearchIcon size={16} />
      </button>
    </form>
  );
}
