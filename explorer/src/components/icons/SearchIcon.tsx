// Standard magnifying-glass glyph, inlined rather than pulling in an icon
// library for one shape.
export function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="7" cy="7" r="5.5" />
      <line x1="11.5" y1="11.5" x2="15" y2="15" />
    </svg>
  );
}
