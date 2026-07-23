"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { css } from "styled-system/css";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavDropdown({
  label,
  links,
  activePath,
}: {
  label: string;
  links: { href: string; label: string }[];
  activePath?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasActiveLink = Boolean(activePath && links.some((l) => isActive(activePath, l.href)));

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
        // EXPERIMENTAL: white text (this is a <button>, not an <a>, so it's
        // untouched by globals.css's header a rule and needs its own
        // white-on-black colour here -- see Nav.tsx's header background.
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "1",
          color: "bg",
          opacity: hasActiveLink ? 1 : 0.7,
          fontWeight: hasActiveLink ? "600" : "400",
          fontSize: "body",
          bg: "transparent",
          border: "none",
          cursor: "pointer",
          p: 0,
          font: "inherit",
          // #f00, not the fgAccent token -- matches globals.css's header a:hover.
          _hover: { color: "#f00", opacity: 1 },
        })}
      >
        {label}
        <span aria-hidden className={css({ fontSize: "small", mt: "0.5" })}>
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
            borderWidth: "lineweight_normal", borderStyle: "solid",
            borderColor: "fg",
            borderRadius: "corner",
            boxShadow: "md",
            minWidth: "9rem",
            py: "1",
            zIndex: 10,
          })}
        >
          {links.map((l) => {
            const active = Boolean(activePath && isActive(activePath, l.href));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={css({
                    display: "block",
                    px: "3",
                    py: "2",
                    fontSize: "body",
                    _hover: { color: "fgAccent", bg: "bg" },
                  })}
                  style={active ? { color: "var(--colors-fg)", fontWeight: 600 } : undefined}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
