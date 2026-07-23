"use client";

import { useState } from "react";
import { css } from "styled-system/css";
import { ClipboardIcon } from "@/components/icons/ClipboardIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { Toast } from "@/components/Toast";

// Icon-only -- the visible label was dropped in favour of a plain clipboard
// glyph, so the copied/not-copied state (and the button's purpose at all)
// relies on the icon swap plus aria-label rather than button text. The
// toast additionally surfaces failure, which the icon swap alone can't --
// navigator.clipboard.writeText can reject (permissions, insecure context).
export function CopyCitationButton({ text, label = "Copy citation" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ status: "success" | "error"; message: string } | null>(null);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setToast({ status: "success", message: "Citation copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setToast({ status: "error", message: "Couldn't copy citation — please copy it by hand" });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={copied ? "Copied" : label}
        title={copied ? "Copied" : label}
        className={css({
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "2",
          p: "1.5",
          borderWidth: "lineweight_normal", borderStyle: "solid",
          borderColor: "fg",
          borderRadius: "corner",
          color: "fg",
          bg: "bgSurface",
          cursor: "pointer",
          _hover: { borderColor: "fgAccent" },
        })}
      >
        {copied ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
      </button>
      {toast && <Toast status={toast.status} message={toast.message} />}
    </>
  );
}
