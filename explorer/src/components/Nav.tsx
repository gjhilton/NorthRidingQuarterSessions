import Link from "next/link";
import { css } from "styled-system/css";
import { NavDropdown } from "@/components/NavDropdown";

const primaryLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/people", label: "People" },
];

const insightsLinks = [
  { href: "/trends", label: "Trends" },
  { href: "/map", label: "Map" },
  { href: "/streets", label: "Streets" },
];

const trailingLinks = [{ href: "/about", label: "About" }];

export default function Nav() {
  return (
    <header
      className={css({
        borderBottom: "1px solid",
        borderColor: "borderMuted",
        bg: "bgSurface",
      })}
    >
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
        <Link
          href="/"
          className={css({
            fontFamily: "serif",
            fontSize: "lg",
            fontWeight: "600",
            color: "fg",
            whiteSpace: "nowrap",
          })}
        >
          NRQS: Whitby
        </Link>
        <ul className={css({ display: "flex", gap: "6", listStyle: "none", alignItems: "center" })}>
          {primaryLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={css({
                  color: "fgMuted",
                  fontSize: "sm",
                  _hover: { color: "fgAccent" },
                })}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <NavDropdown label="Insights" links={insightsLinks} />
          </li>
          {trailingLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={css({
                  color: "fgMuted",
                  fontSize: "sm",
                  _hover: { color: "fgAccent" },
                })}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
