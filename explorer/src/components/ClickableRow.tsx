"use client";

import { useRouter } from "next/navigation";
import { css } from "styled-system/css";

// Whole-row-is-a-link behaviour shared by every results table in the app
// (Convictions listing, Locations detail, Offences detail, People detail):
// router.push on click, pointer cursor, consistent #fffef5 hover. Extracted
// so all four stop reimplementing the same three lines slightly differently.
export function ClickableTr({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <tr onClick={() => router.push(href)} className={css({ cursor: "pointer", _hover: { bg: "#fffef5" } })}>
      {children}
    </tr>
  );
}

// Reference numbers are long relative to every other cell in these tables --
// shrunk and tightened everywhere one appears as its own column.
export const referenceCellStyle = css({ fontSize: "0.8rem", lineHeight: "1.1" });

// Wraps a nested link inside a ClickableTr cell so clicking it navigates to
// that link instead of also triggering the row's own onClick -- an inline
// onClick can't be attached from a Server Component (event handlers can't be
// passed as props across the server/client boundary), so this needs to be
// its own small client component.
export function StopPropagation({ children }: { children: React.ReactNode }) {
  return <span onClick={(e) => e.stopPropagation()}>{children}</span>;
}
