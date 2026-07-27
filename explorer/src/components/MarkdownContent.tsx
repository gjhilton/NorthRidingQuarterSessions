import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import { css } from "styled-system/css";

// Renders a page's prose content from a markdown string with the site's own
// typography/link conventions applied, rather than each page hand-writing
// its own <p>/<a> JSX for what is, underneath, just paragraphs of text --
// see src/content/*/*.md for the source files this reads. Server-only
// (no "use client"): react-markdown's synchronous Markdown export renders
// to plain React elements at build time, no client JS shipped for this.
const components: Components = {
  // Bare, unstyled -- every one of these tags is unstyled in the page this
  // was extracted from too (no explicit fontSize/fontWeight, just browser
  // defaults for <p>/<strong>/<em>/<code>). Matched exactly, not
  // "improved," so migrating a section to markdown can't itself change how
  // it looks.
  p: ({ children }) => <p>{children}</p>,
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  code: ({ children }) => <code>{children}</code>,
  // Internal links go through next/link (client-side nav, no full reload);
  // anything else is a real external link, opened in a new tab -- same
  // distinction every hand-written link elsewhere on the site already
  // makes, just applied automatically here based on the href's shape.
  a: ({ href, children }) => {
    if (!href) return <>{children}</>;
    const isInternal = href.startsWith("/") || href.startsWith("#");
    return isInternal ? (
      <Link href={href} className={css({ color: "fgAccent" })}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={css({ color: "fgAccent" })}>
        {children}
      </a>
    );
  },
};

export function MarkdownContent({ children }: { children: string }) {
  return <Markdown components={components}>{children}</Markdown>;
}
