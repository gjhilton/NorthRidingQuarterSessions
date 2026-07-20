import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          paper: { value: "#faf6ee" },
          paperDark: { value: "#0f0e0b" },
          ink: { value: "#221f1a" },
          inkDark: { value: "#ece7db" },
          muted: { value: "#6b6355" },
          mutedDark: { value: "#a39e8e" },
          border: { value: "#ddd3bd" },
          borderDark: { value: "#3a362c" },
          accent: { value: "#7a3b2e" },
          accentDark: { value: "#d98e78" },
          surface: { value: "#ffffff" },
          surfaceDark: { value: "#1a1812" },
        },
        fonts: {
          serif: { value: "var(--font-serif), Georgia, serif" },
          sans: { value: "var(--font-sans), system-ui, sans-serif" },
        },
      },
      semanticTokens: {
        colors: {
          bg: { value: { base: "{colors.paper}", _osDark: "{colors.paperDark}" } },
          fg: { value: { base: "{colors.ink}", _osDark: "{colors.inkDark}" } },
          fgMuted: { value: { base: "{colors.muted}", _osDark: "{colors.mutedDark}" } },
          borderMuted: { value: { base: "{colors.border}", _osDark: "{colors.borderDark}" } },
          fgAccent: { value: { base: "{colors.accent}", _osDark: "{colors.accentDark}" } },
          bgSurface: { value: { base: "{colors.surface}", _osDark: "{colors.surfaceDark}" } },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
