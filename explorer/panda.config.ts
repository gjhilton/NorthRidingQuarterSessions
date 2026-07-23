import { defineConfig } from "@pandacss/dev";
import { tokens } from "./theme/tokens";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Design tokens live in theme/tokens.ts, not here -- see that file.
  theme: {
    extend: {
      tokens,
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
