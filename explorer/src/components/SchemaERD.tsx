"use client";

import { useEffect, useId, useState } from "react";
import { css } from "styled-system/css";

// Renders a mermaid erDiagram to inline SVG in the browser, and lets it be
// opened fullscreen. Client-only: mermaid needs the DOM to lay the diagram
// out. Rendered to SVG (not a pre-baked PNG) so it stays crisp at any zoom,
// including the fullscreen view, matching the vector-first approach the
// rest of this site takes for maps/charts.
export function SchemaERD({ diagram }: { diagram: string }) {
  const containerId = useId().replace(/:/g, "");
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const { default: mermaid } = await import("mermaid");
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          fontFamily: "inherit",
          primaryColor: "#f3f3f3",
          primaryBorderColor: "#000",
          primaryTextColor: "#000",
          lineColor: "#000",
          tertiaryColor: "#fff",
          relationLabelColor: "#563a15",
          relationLabelBackground: "#fff",
        },
        er: { fontSize: 14 },
      });
      try {
        const { svg } = await mermaid.render(`schema-erd-${containerId}`, diagram);
        if (!cancelled) setSvgMarkup(svg);
      } catch {
        if (!cancelled) setError("The schema diagram couldn't be rendered.");
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [diagram, containerId]);

  useEffect(() => {
    if (!isFullscreen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFullscreen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  if (error) {
    return <p className={css({ color: "fgMuted", fontStyle: "italic" })}>{error}</p>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsFullscreen(true)}
        disabled={!svgMarkup}
        aria-label="Open the schema diagram fullscreen"
        title="Click to expand"
        className={css({
          display: "flex",
          justifyContent: "center",
          width: "100%",
          overflowX: "auto",
          p: "4",
          bg: "bgSurface",
          borderWidth: "lineweight_normal",
          borderStyle: "solid",
          borderColor: "fg",
          borderRadius: "corner",
          cursor: svgMarkup ? "zoom-in" : "default",
          _hover: svgMarkup ? { borderColor: "fgAccent" } : undefined,
          "& svg": { maxWidth: "none", height: "auto" },
        })}
        // biome-ignore lint: mermaid's render output is trusted, generated from the fixed diagram source above
        dangerouslySetInnerHTML={svgMarkup ? { __html: svgMarkup } : undefined}
      />

      {isFullscreen && svgMarkup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Database schema diagram, fullscreen"
          onClick={() => setIsFullscreen(false)}
          className={css({
            position: "fixed",
            inset: 0,
            zIndex: 100,
            bg: "rgba(0, 0, 0, 0.97)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: "6",
            overflow: "auto",
            cursor: "zoom-out",
          })}
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close"
            className={css({
              position: "fixed",
              top: "4",
              right: "4",
              width: "10",
              height: "10",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2xl",
              lineHeight: 1,
              color: "#fff",
              bg: "transparent",
              borderWidth: "lineweight_normal",
              borderStyle: "solid",
              borderColor: "#fff",
              borderRadius: "corner",
              cursor: "pointer",
            })}
          >
            ×
          </button>
          <div
            onClick={(event) => event.stopPropagation()}
            className={css({
              bg: "#fff",
              p: "6",
              borderRadius: "corner",
              cursor: "default",
              "& svg": { maxWidth: "none", width: "95vw", height: "auto" },
            })}
            // biome-ignore lint: same trusted mermaid output as the inline copy above
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        </div>
      )}
    </>
  );
}
