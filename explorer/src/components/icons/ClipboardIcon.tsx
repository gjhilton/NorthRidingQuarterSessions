// Standard clipboard glyph (rect with a clip tab), inlined rather than
// pulling in an icon library for one shape -- matches DownloadIcon etc.
export function ClipboardIcon({ size = 16 }: { size?: number }) {
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
      <rect x="3.5" y="2.5" width="9" height="12" rx="1" />
      <path d="M6 2.5V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v.5" />
    </svg>
  );
}
