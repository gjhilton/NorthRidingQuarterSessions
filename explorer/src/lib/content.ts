import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

// Reads a markdown source file from src/content/<section>/<slug>.md -- see
// components/MarkdownContent.tsx for how it's rendered. A plain
// build-time fs read (this only ever runs in a Server Component during
// static export), same idea as getDb() reading the sqlite file directly
// rather than going through an API route.
export function readContent(section: string, slug: string): string {
  const filePath = path.join(process.cwd(), "src", "content", section, `${slug}.md`);
  return readFileSync(filePath, "utf-8");
}
