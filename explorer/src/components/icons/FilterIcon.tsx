// Standard funnel/filter glyph, inlined rather than pulling in an icon
// library for one shape.
export function FilterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1.5 2.5h13l-5 6v4.5l-3 1.5V8.5l-5-6z" />
    </svg>
  );
}
