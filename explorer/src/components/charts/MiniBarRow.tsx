import { css } from "styled-system/css";

// Plain CSS proportional bar, not recharts -- for single ranked-list
// facets (one bar per row) where spinning up SVG/recharts per row would be
// overkill. `max` is passed in rather than computed per-row so a whole
// list of MiniBarRows can share one scale.
export function MiniBarRow({
  label,
  value,
  max,
  formattedValue,
}: {
  label: string;
  value: number;
  max: number;
  formattedValue?: string;
}) {
  const pct = max > 0 ? Math.max((value / max) * 100, 2) : 0;
  return (
    <div className={css({ display: "flex", alignItems: "center", gap: "3", py: "1" })}>
      <span
        className={css({
          fontSize: "small",
          width: "12rem",
          flexShrink: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        })}
      >
        {label}
      </span>
      <div
        className={css({
          flex: "1",
          height: "1rem",
          bg: "bg",
          borderWidth: "lineweight_normal",
          borderStyle: "solid",
          borderColor: "fg",
          borderRadius: "corner",
          overflow: "hidden",
        })}
      >
        <div
          className={css({ height: "100%", bg: "chart1" })}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={css({
          fontSize: "small",
          color: "fgMuted",
          width: "3.5rem",
          textAlign: "right",
          flexShrink: 0,
        })}
      >
        {formattedValue ?? value.toLocaleString()}
      </span>
    </div>
  );
}
