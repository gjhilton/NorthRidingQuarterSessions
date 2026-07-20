// Plain-JS CSV serializer, deliberately dependency-free so it works
// unchanged in the browser (BrowseExplorer's filtered-export button) --
// scripts/export-csv.mjs (the full-dataset download, a Node build script)
// has its own copy rather than sharing this one, since the two run in
// different module systems (bundled TS vs. a standalone .mjs script).
export function toCsv<T extends object>(rows: T[]): string {
  if (rows.length === 0) return "";
  const columns = Object.keys(rows[0]) as (keyof T)[];
  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    const s = String(value);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [columns.join(",")];
  for (const row of rows) {
    lines.push(columns.map((c) => escape(row[c])).join(","));
  }
  return lines.join("\n");
}

export function downloadCsv<T extends object>(filename: string, rows: T[]): void {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
