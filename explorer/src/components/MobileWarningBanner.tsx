import { css } from "styled-system/css";

// Pure-CSS visibility (no JS/hydration needed): hidden by default, shown
// only when both conditions hold at once -- narrow AND portrait, so a
// landscape phone or a narrow-but-desktop window doesn't trigger it. This
// is an orientation+width combination Panda's own responsive props (width
// breakpoints only) can't express, hence the raw arbitrary media key.
export function MobileWarningBanner() {
  return (
    <div
      role="note"
      className={css({
        display: "none",
        "@media (max-width: 30em) and (orientation: portrait)": {
          display: "block",
        },
        bg: "fgAccent",
        color: "bg",
        fontSize: "small",
        textAlign: "center",
        px: "3",
        py: "2",
      })}
    >
      This site isn't designed for mobile -- you may run into display
      issues. It works best on a larger screen.
    </div>
  );
}
