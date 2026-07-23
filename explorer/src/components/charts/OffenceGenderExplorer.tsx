"use client";

import { useState } from "react";
import { css, cx } from "styled-system/css";
import { formInputStyle } from "@/components/ui";
import { GenderYearLines } from "@/components/charts/GenderYearLines";
import type { OffenceGenderTrend } from "@/lib/queries/gender";

// Both granularities' full year series are precomputed at build time
// (trends.ts is server-only/better-sqlite3) and shipped as props --
// switching the toggle or dropdown just changes which already-loaded
// series renders, no client-side query needed. See useClientQuery for the
// pattern this deliberately avoids: that's for searches over arbitrary
// user input, which this fixed pair of top-N lists isn't.
export function OffenceGenderExplorer({
  categoryTrends,
  leafTrends,
}: {
  categoryTrends: OffenceGenderTrend[];
  leafTrends: OffenceGenderTrend[];
}) {
  const [granularity, setGranularity] = useState<"category" | "leaf">("category");
  const trends = granularity === "category" ? categoryTrends : leafTrends;
  const [index, setIndex] = useState(0);
  const selected = trends[Math.min(index, trends.length - 1)];

  function setGranularityAndReset(next: "category" | "leaf") {
    setGranularity(next);
    setIndex(0);
  }

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <div className={css({ display: "flex", flexWrap: "wrap", gap: "3", alignItems: "center" })}>
        <div className={css({ display: "inline-flex", borderRadius: "corner", overflow: "hidden", borderWidth: "lineweight_normal", borderStyle: "solid", borderColor: "borderMuted" })}>
          {(["category", "leaf"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGranularityAndReset(g)}
              className={cx(
                css({
                  px: "3",
                  py: "1.5",
                  fontSize: "body",
                  border: "none",
                  cursor: "pointer",
                  bg: granularity === g ? "fgAccent" : "bgSurface",
                  color: granularity === g ? "bgSurface" : "fg",
                })
              )}
            >
              {g === "category" ? "By category" : "By offence type"}
            </button>
          ))}
        </div>
        <label className={css({ display: "flex", alignItems: "center", gap: "2", fontSize: "body" })}>
          {granularity === "category" ? "Category:" : "Offence type:"}
          <select
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            className={formInputStyle}
          >
            {trends.map((t, i) => (
              <option key={t.offenceType} value={i}>
                {t.offenceType} ({t.total})
              </option>
            ))}
          </select>
        </label>
      </div>
      <GenderYearLines data={selected.points} />
    </div>
  );
}
