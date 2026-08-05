import { css } from "styled-system/css";

// PLACEHOLDER: generic silhouette on a muted circle, standing in until
// there's an actual per-person image/thumbnail source to wire up.
export function PersonThumbnail({ size = 40 }: { size?: number }) {
  return (
    <div
      className={css({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        borderRadius: "9999px",
        bg: "bgSurface",
        borderWidth: "lineweight_normal",
        borderStyle: "solid",
        borderColor: "fg",
        overflow: "hidden",
      })}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size * 0.6}
        height={size * 0.6}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={css({ color: "fgMuted" })}
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </svg>
    </div>
  );
}
