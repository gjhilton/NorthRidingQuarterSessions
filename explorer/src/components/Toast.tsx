"use client";

import { css } from "styled-system/css";

// Minimal, self-contained (no toast library/provider) -- fixed to the
// viewport so it works regardless of where the triggering button sits on
// the page. role/aria-live differ by status so success is announced
// politely but a failure interrupts, matching how screen readers treat
// status vs alert regions.
export function Toast({ status, message }: { status: "success" | "error"; message: string }) {
  return (
    <div
      role={status === "error" ? "alert" : "status"}
      aria-live={status === "error" ? "assertive" : "polite"}
      className={css({
        position: "fixed",
        bottom: "6",
        left: "50%",
        transform: "translateX(-50%)",
        px: "4",
        py: "2.5",
        borderWidth: "lineweight_normal",
        borderStyle: "solid",
        borderColor: status === "error" ? "fgAccent" : "fg",
        borderRadius: "corner",
        bg: "bg",
        color: "fg",
        fontSize: "body",
        boxShadow: "md",
        zIndex: 50,
      })}
    >
      {message}
    </div>
  );
}
