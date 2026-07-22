import Link from "next/link";
import { css } from "styled-system/css";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { primaryLinks, trailingLinks } from "@/lib/navLinks";

const footerNavLinks = [...primaryLinks, ...trailingLinks];

const footerLinkStyle = css({ color: "fgMuted", _hover: { color: "fgAccent" } });

export function Footer() {
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
          gap: "4",
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
            })}
          >
            {footerNavLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLinkStyle}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={css({
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "3",
            color: "fgMuted",
          })}
        >
          <p>
            &copy; {new Date().getFullYear()} G.J. Hilton, Funeral Games. Source data from{" "}
            <a
              href="https://archivesunlocked.northyorks.gov.uk"
              target="_blank"
              rel="noopener noreferrer"
              className={css({ color: "fgAccent" })}
            >
              Archives Unlocked North Yorkshire
            </a>
            , North Yorkshire County Record Office.
          </p>
          <div className={css({ display: "flex", gap: "4" })}>
            <Link href="/cookies" className={footerLinkStyle}>
              Cookies policy
            </Link>
            <Link href="/accessibility" className={footerLinkStyle}>
              Accessibility
            </Link>
            <a
              href="https://github.com/gjhilton/NorthRidingQuarterSessions"
              target="_blank"
              rel="noopener noreferrer"
              className={css({ color: "fgAccent", display: "inline-flex", alignItems: "center", gap: "1.5" })}
            >
              <GitHubIcon size={14} />
              Source on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
