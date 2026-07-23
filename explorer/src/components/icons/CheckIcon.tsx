// Standard checkmark glyph, inlined rather than pulling in an icon library
// for one shape -- matches DownloadIcon etc. Used for "copied" confirmation.
export function CheckIcon({ size = 16 }: { size?: number }) {
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
      <path d="M3 8.5 6.5 12l6.5-8" />
    </svg>
  );
}
