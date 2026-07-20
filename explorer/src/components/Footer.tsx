import { css } from "styled-system/css";

export function Footer() {
  return (
    <footer
      className={css({
        borderTop: "1px solid",
        borderColor: "borderMuted",
        bg: "bgSurface",
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
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "3",
          fontSize: "xs",
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
        <p>
          <a
            href="https://github.com/gjhilton/NorthRidingQuarterSessions"
            target="_blank"
            rel="noopener noreferrer"
            className={css({ color: "fgAccent" })}
          >
            Source on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
