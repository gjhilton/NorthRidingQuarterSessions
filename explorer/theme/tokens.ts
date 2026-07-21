import { defineSemanticTokens, defineTokens } from "@pandacss/dev";

// The full design-token set for this app, split out of panda.config.ts per
// Panda's convention for larger themes (see defineTokens/defineSemanticTokens
// in the Panda docs). This is deliberately the *only* file that should need
// editing to re-skin the site: every color, border weight, and radius the
// app actually uses either comes from here or from Panda's own default
// preset scale (fontSizes, spacing, the rest of radii) referenced by name --
// nothing in src/ hardcodes a raw color, line weight, or corner radius.
export const tokens = defineTokens({
  colors: {
    // Base palette -- sepia/archival, light and dark variants.
    paper: { value: "#fff" },
    paperDark: { value: "#fff" },
    ink: { value: "#000" },
    inkDark: { value: "#000" },
    muted: { value: "#000" },
    mutedDark: { value: "#000" },
    border: { value: "#999" },
    borderDark: { value: "#999" },
    accent: { value: "#c00000" },
    accentDark: { value: "#c00000" },
    surface: { value: "#fcfcfc" },
    surfaceDark: { value: "#fcfcfc" },

    // Chart/map series palette. Recharts and Leaflet take raw color strings
    // (stroke/fill props, not className), so chart components read these via
    // the `token()` helper from styled-system/tokens rather than css() --
    // same tokens, just consumed a different way. Previously each chart
    // file hardcoded its own copy of these hex values independently.
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
  },
  borderWidths: {
    // Every border in the app is this one weight -- a single token means
    // changing line weight everywhere is a one-line edit here rather than a
    // find-and-replace across src/.
    hairline: { value: "1px" },
  },
  radii: {
    // Every rounded corner in the app (other than Pill's fully-round shape,
    // which is a distinct "capsule" not a corner radius) uses this one value.
    corner: { value: "0rem" },
  },
  fontSizes: {
    // Reduced from Panda's default preset scale (which had 7 sizes in use
    // here: 2xs/xs/sm/lg/xl/2xl/3xl) down to 4 explicit, semantically-named
    // sizes -- everything in src/ now uses one of these four.
    small: { value: "1.125rem" }, // fine print, meta text, small icon glyphs
    body: { value: "1.3125rem" }, // the default text size almost everything uses (21px @ 16px root)
    heading: { value: "1.5rem" }, // card/section headings, nav brand
    display: { value: "2rem" }, // page title, the big number in a stat tile
  },
});

export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: { value: { base: "{colors.paper}", _osDark: "{colors.paperDark}" } },
    fg: { value: { base: "{colors.ink}", _osDark: "{colors.inkDark}" } },
    fgMuted: { value: { base: "{colors.muted}", _osDark: "{colors.mutedDark}" } },
    borderMuted: { value: { base: "{colors.border}", _osDark: "{colors.borderDark}" } },
    fgAccent: { value: { base: "{colors.accent}", _osDark: "{colors.accentDark}" } },
    bgSurface: { value: { base: "{colors.surface}", _osDark: "{colors.surfaceDark}" } },
  },
});
