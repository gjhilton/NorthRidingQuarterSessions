import Link from "next/link";
import { css } from "styled-system/css";

const links = [
  { href: "/browse", label: "Browse" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/trends", label: "Trends" },
  { href: "/people", label: "People" },
  { href: "/streets", label: "Streets" },
  { href: "/data-quality", label: "Data quality" },
  { href: "/methodology", label: "Methodology" },
];

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
          })}
        >
          NRQS Explorer
        </Link>
        <ul className={css({ display: "flex", gap: "6", listStyle: "none" })}>
          {links.map((link) => (
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
