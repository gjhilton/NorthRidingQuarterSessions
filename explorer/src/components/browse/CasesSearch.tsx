"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchField } from "@/components/SearchField";

// A lightweight entry point into Cases' own filtering (BrowseExplorer
// already reads `q` from the URL on mount) -- this doesn't run its own
// query, it just hands off to /cases?q=...
export function CasesSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/convictions?q=${encodeURIComponent(q)}` : "/convictions");
  }

  return (
    <form onSubmit={handleSubmit}>
      <SearchField
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="name, reference, charge…"
        autoComplete="off"
      />
    </form>
  );
}
