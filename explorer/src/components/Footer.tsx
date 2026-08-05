"use client";

import Link from "next/link";
import { css, cx } from "styled-system/css";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { ArrowUpIcon } from "@/components/icons/ArrowUpIcon";

const footerLinkStyle = css({ color: "fg", _hover: { color: "fgAccent" } });

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
          gap: "3",
        })}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={cx(
            footerLinkStyle,
            css({
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              bg: "transparent",
              border: "none",
              p: "0",
              cursor: "pointer",
              // The label is a sibling span, not this element's own text, so
              // its reveal has to be driven by the button's :hover matching
              // a descendant selector -- Panda passes "& x" keys through as
              // real CSS nesting.
              "& > .top-label": {
                display: "inline-block",
                maxWidth: "0",
                overflow: "hidden",
                whiteSpace: "nowrap",
                opacity: "0",
                transition: "max-width 0.2s ease, opacity 0.2s ease, margin-left 0.2s ease",
              },
              _hover: {
                "& > .top-label": {
                  maxWidth: "10rem",
                  opacity: "1",
                  ml: "2",
                },
              },
            })
          )}
        >
          <ArrowUpIcon size={32} />
          <span className={cx("top-label", css({ fontSize: "M", fontWeight: "600" }))}>go to top</span>
        </button>

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
            })}
          >
            <p className={css({ fontSize: "M" })}>
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
            <p
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "3",
                flexWrap: "wrap",
                fontSize: "S",
              })}
            >
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
              <Link href="/about#cookies" className={footerLinkStyle}>
                Cookies
              </Link>
              <Link href="/about#accessibility" className={footerLinkStyle}>
                Accessibility
              </Link>
            </p>
          </div>

          <a
            href="https://funeralgames.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className={css({ flexShrink: "0" })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/funeral-games-logo.svg"
              alt="Funeral Games"
              className={css({ height: "2rem", mt: "1" })}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
