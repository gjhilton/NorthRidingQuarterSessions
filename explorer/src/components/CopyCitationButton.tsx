"use client";

import { useState } from "react";
import { css } from "styled-system/css";

export function CopyCitationButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={css({
        display: "inline-flex",
        alignItems: "center",
        gap: "1",
        mt: "2",
        px: "2.5",
        py: "1",
        borderWidth: "lineweight_normal", borderStyle: "solid",
        borderColor: "borderMuted",
        borderRadius: "corner",
        fontSize: "small",
        color: "fg",
        bg: "bgSurface",
        cursor: "pointer",
        _hover: { borderColor: "fgAccent" },
      })}
    >
      {copied ? "Copied" : "Copy citation"}
    </button>
  );
}
