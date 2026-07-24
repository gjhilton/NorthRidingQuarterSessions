// A horizontal bar with an upward-pointing caret underneath it (not a
// shafted arrow) -- inlined rather than pulling in an icon library for one
// shape, matches DownloadIcon etc. Used for "back to top".
export function ArrowUpIcon({ size = 16 }: { size?: number }) {
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
      <path d="M3 3h10" />
      <path d="M4 11.5 8 7.5l4 4" />
    </svg>
  );
}
