"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { css } from "styled-system/css";

export function NavDropdown({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className={css({ position: "relative" })}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "1",
          color: "fgMuted",
          fontSize: "sm",
          bg: "transparent",
          border: "none",
          cursor: "pointer",
          p: 0,
          font: "inherit",
          _hover: { color: "fgAccent" },
        })}
      >
        {label}
        <span aria-hidden className={css({ fontSize: "2xs", mt: "0.5" })}>
          ▾
        </span>
      </button>
      {open && (
        <ul
          className={css({
            position: "absolute",
            top: "calc(100% + 0.75rem)",
            left: 0,
            listStyle: "none",
            bg: "bgSurface",
            borderWidth: "hairline", borderStyle: "solid",
            borderColor: "borderMuted",
            borderRadius: "md",
            boxShadow: "md",
            minWidth: "9rem",
            py: "1",
            zIndex: 10,
          })}
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={css({
                  display: "block",
                  px: "3",
                  py: "2",
                  fontSize: "sm",
                  color: "fg",
                  _hover: { color: "fgAccent", bg: "bg" },
                })}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
