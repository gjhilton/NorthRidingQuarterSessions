"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { css, cx } from "styled-system/css";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { primaryLinks, trailingLinks } from "@/lib/navLinks";

const footerNavLinks = [...primaryLinks, ...trailingLinks];

const footerLinkStyle = css({ color: "fg", _hover: { color: "fgAccent" } });

// Same active-section logic as Nav.tsx, so the footer's nav highlights the
// current section the same way the header's does.
function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Inline style, not a Panda class: globals.css's `footer a { color: ... }`
// rule is deliberately unlayered (see that file), which beats a
// component-level "active" class too. Inline styles beat both layered and
// unlayered stylesheet rules, so this is the one way to actually make the
// active link look different -- see Nav.tsx for the same technique.
function footerLinkColor(active: boolean): React.CSSProperties {
  return active ? { fontWeight: 600 } : {};
}

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activePath = isHome ? null : pathname;

  return (
    <footer
      className={css({
        bg: "bg",
        mt: "12",
      })}
    >
      <div
        className={css({
          maxWidth: "72rem",
          mx: "auto",
          px: "6",
          py: "6",
          display: "flex",
          flexDirection: "column",
          gap: "3",
          fontSize: "small",
        })}
      >
        <nav aria-label="Footer">
          <ul
            className={css({
              display: "flex",
              flexWrap: "wrap",
              gap: "4",
              listStyle: "none",
              fontSize: "body",
            })}
          >
            {footerNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={footerLinkStyle}
                  style={footerLinkColor(Boolean(activePath && isActive(activePath, link.href)))}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul
          className={css({
            display: "flex",
            flexWrap: "wrap",
            gap: "4",
            listStyle: "none",
            fontSize: "0.875rem",
          })}
        >
          <li>
            <Link href="/cookies" className={footerLinkStyle}>
              Cookies policy
            </Link>
          </li>
          <li>
            <Link href="/accessibility" className={footerLinkStyle}>
              Accessibility
            </Link>
          </li>
        </ul>

        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "6",
            mt: "4rem",
          })}
        >
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: "0.5",
              color: "fgMuted",
              fontSize: "0.875rem",
            })}
          >
            <p>
              Source data:{" "}
              <a
                href="https://archivesunlocked.northyorks.gov.uk"
                target="_blank"
                rel="noopener noreferrer"
                className={footerLinkStyle}
              >
                Archives Unlocked North Yorkshire
              </a>
              , North Yorkshire County Record Office.
            </p>
            <p className={css({ display: "flex", alignItems: "center", gap: "3", flexWrap: "wrap" })}>
              &copy; {new Date().getFullYear()} G.J. Hilton / Funeral Games.
              <a
                href="https://github.com/gjhilton/NorthRidingQuarterSessions"
                target="_blank"
                rel="noopener noreferrer"
                className={cx(footerLinkStyle, css({ display: "inline-flex", alignItems: "center", gap: "1.5" }))}
              >
                <GitHubIcon size={14} />
                Source code on GitHub
              </a>
            </p>
          </div>

          <a
            href="https://funeralgames.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className={css({ flexShrink: "0" })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/funeral-games-logo.svg" alt="Funeral Games" className={css({ height: "2rem" })} />
          </a>
        </div>
      </div>
    </footer>
  );
}
