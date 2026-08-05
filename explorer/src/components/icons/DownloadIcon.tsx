// Standard download glyph (arrow into a tray), inlined rather than pulling
// in an icon library for one shape.
export function DownloadIcon({ size = 16 }: { size?: number }) {
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
      <path d="M8 1.5v8.5" />
      <path d="M4.5 6.5 8 10l3.5-3.5" />
      <path d="M1.5 11v2.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V11" />
    </svg>
  );
}
