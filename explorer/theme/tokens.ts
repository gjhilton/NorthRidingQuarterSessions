import { defineTokens } from "@pandacss/dev";

export const tokens = defineTokens({
  colors: {
    bg: { value: "#fff" },
    fg: { value: "#000" },
    fgMuted: { value: "#563a15" },
    fgAccent: { value: "#c00000" },
    bgSurface: { value: "#f3f3f3" },

    // Chart/map series palette. Recharts and Leaflet take raw color strings
    // (stroke/fill props, not className), so chart components read these via
    // the `token()` helper from styled-system/tokens rather than css() --
    // same tokens, just consumed a different way.
    chart1: { value: "#8a5240" },
    chart2: { value: "#4c6b6b" },
    chart3: { value: "#b08c3e" },
    chart4: { value: "#6b4c8a" },
    chart5: { value: "#4c708a" },
    chart6: { value: "#7a8a4c" },
    chart7: { value: "#9a9284" },
  },
  fonts: {
    serif: { value: "var(--font-serif), Georgia, serif" },
    sans: { value: "var(--font-sans), system-ui, sans-serif" },
    mono: { value: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" },
  },
  borderWidths: {
    lineweight_normal: { value: "1px" },
    lineweight_heavy: { value: "2px" },
  },
  radii: {
    corner: { value: "0rem" },
  },
  fontSizes: {
    small: { value: "1.125rem" }, // fine print, meta text, small icon glyphs
    body: { value: "1.3125rem" }, // the default text size almost everything uses (21px @ 16px root)
    heading: { value: "1.5rem" }, // card/section headings, nav brand
    display: { value: "2rem" }, // the big number in a stat tile, homepage subtitle
    pageTitle: { value: "4rem" }, // every page's <PageTitle> h1 -- see components/ui.tsx
    hero: { value: "3rem" }, // homepage title only -- see src/app/page.tsx
  },
});
