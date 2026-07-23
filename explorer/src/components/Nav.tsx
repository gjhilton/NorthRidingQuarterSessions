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
// actually make the active link look different. Inactive links fall
// through to globals.css's header a rule (black, matching the header's
// white background); active ones are explicitly black + bold here since
// that rule alone can't add the font-weight.
function navLinkColor(active: boolean): React.CSSProperties {
  return active ? { color: "var(--colors-fg)", fontWeight: 600 } : {};
}

// A bullet before each top-nav item, coloured the same as the header's own
// (white) background so it's invisible by default -- except on whichever
// section is current, where it's red. Inline style for the same reason
// navLinkColor() is: needs to win regardless of active state, and a plain
// Panda class can't override the parent <a>'s color inheritance reliably
// here either way since this needs its OWN colour, independent of the
// link text's.
function navBulletColor(active: boolean): React.CSSProperties {
  return { color: active ? "#f00" : "var(--colors-bg)" };
}

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // No section of the nav is ever "current" on the homepage itself -- it's
  // not one of the listed sections, so nothing should look selected there.
  const activePath = isHome ? null : pathname;

  return (
    // White header background, black links (globals.css's header a rule).
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
          {primaryLinks.map((link) => {
            const active = Boolean(activePath && isActive(activePath, link.href));
            return (
              <li key={link.href}>
                <Link href={link.href} className={navLinkStyle} style={navLinkColor(active)}>
                  <span aria-hidden style={navBulletColor(active)}>
                    •{" "}
                  </span>
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <NavDropdown label="Insights" links={insightsLinks} activePath={activePath} />
          </li>
          {trailingLinks.map((link) => {
            const active = Boolean(activePath && isActive(activePath, link.href));
            return (
              <li key={link.href}>
                <Link href={link.href} className={navLinkStyle} style={navLinkColor(active)}>
                  <span aria-hidden style={navBulletColor(active)}>
                    •{" "}
                  </span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {!isHome && (
          <Link
            href="/"
            className={css({
              fontFamily: "serif",
              fontSize: "heading",
              fontWeight: "600",
              fontStyle: "italic",
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
