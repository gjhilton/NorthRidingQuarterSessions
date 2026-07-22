"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { css } from "styled-system/css";
import { NavDropdown } from "@/components/NavDropdown";
import { SiteTitle } from "@/components/SiteTitle";
import { primaryLinks, insightsLinks, trailingLinks } from "@/lib/navLinks";

const navLinkStyle = css({
  fontSize: "body",
});

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Inline style, not a Panda class: globals.css's `header a { color: ... }`
// rule is deliberately unlayered so it can override every component's own
// color classes without exceptions (see that file) -- which means a
// component-level "active" class would lose to it too. Inline styles beat
// both layered and unlayered stylesheet rules, so this is the one way to
// actually make the active link look different.
function navLinkColor(active: boolean): React.CSSProperties {
  return active ? { color: "var(--colors-fg)", fontWeight: 600 } : {};
}

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // No section of the nav is ever "current" on the homepage itself -- it's
  // not one of the listed sections, so nothing should look selected there.
  const activePath = isHome ? null : pathname;

  return (
    <header className={css({ bg: "bg" })}>
      <nav
        className={css({
          maxWidth: "72rem",
          mx: "auto",
          px: "6",
          py: "4",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8",
        })}
      >
        <ul
          className={css({
            display: "flex",
            gap: "6",
            listStyle: "none",
            alignItems: "center",
          })}
        >
          {primaryLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={navLinkStyle}
                style={navLinkColor(Boolean(activePath && isActive(activePath, link.href)))}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <NavDropdown label="Insights" links={insightsLinks} activePath={activePath} />
          </li>
          {trailingLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={navLinkStyle}
                style={navLinkColor(Boolean(activePath && isActive(activePath, link.href)))}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {!isHome && (
          <Link
            href="/"
            className={css({
              fontFamily: "serif",
              fontSize: "heading",
              fontWeight: "600",
              color: "fg",
              whiteSpace: "nowrap",
              ml: "auto",
            })}
          >
            <SiteTitle />
          </Link>
        )}
      </nav>
    </header>
  );
}
