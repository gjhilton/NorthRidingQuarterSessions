"""Corrects run-on text left by the pre-fix version of extract_field() in
02_fetch_resources.py (BeautifulSoup .text silently dropping <br /><br />
tags to zero width instead of a separator -- see that file's current
extract_field() for the root-cause fix applied to future scrapes).

Canonical, fully-tested twin of fix_run_on_spacing lives at
data-loader/qsrecords/text.py -- keep both in sync; tests/test_text_cleanup.py
mirrors data-loader/tests/test_text.py's cases for this copy. Duplicated
rather than imported because scraper/ and data-loader/ are separate,
self-contained parts of the project with no existing cross-import
mechanism (see CLAUDE.md) -- not worth introducing one for a ~15-line
pure function.

CLI usage:
    python3 text_cleanup.py --csv ../data/whitby.csv --columns description
"""

import argparse
import re
from pathlib import Path

import pandas as pd

_RUN_ON_BOUNDARY_RE = re.compile(r"[a-z0-9][A-Z]")


def fix_run_on_spacing(text):
    """See data-loader/qsrecords/text.py::fix_run_on_spacing for full
    docstring/rationale -- identical logic, kept in sync by hand."""
    if not text:
        return text

    def _replace(match):
        pos = match.start()
        lower, upper = match.group(0)
        if lower == "c" and (text[pos - 1 : pos] == "M" or text[pos - 2 : pos] == "Ma"):
            return match.group(0)
        return f"{lower}. {upper}"

    return _RUN_ON_BOUNDARY_RE.sub(_replace, text)


def fix_csv(csv_path: Path, columns: list[str]) -> None:
    # dtype=str + keep_default_na=False: read and write with the same
    # library that originally wrote the file, and avoid pandas coercing
    # blank cells to NaN or reformatting other columns -- keeps the git
    # diff limited to the actual content changes in the named columns.
    df = pd.read_csv(csv_path, dtype=str, keep_default_na=False)
    for col in columns:
        before = df[col].tolist()
        df[col] = df[col].map(fix_run_on_spacing)
        changed = sum(1 for b, a in zip(before, df[col]) if b != a)
        print(f"{col}: {changed} of {len(df)} rows changed")
    df.to_csv(csv_path, index=False)


def fix_txt_dir(dir_path: Path) -> None:
    changed = 0
    files = sorted(dir_path.glob("*.txt"))
    for path in files:
        original = path.read_text(encoding="utf-8")
        fixed = fix_run_on_spacing(original)
        if fixed != original:
            path.write_text(fixed, encoding="utf-8")
            changed += 1
    print(f"{changed} of {len(files)} .txt files changed in {dir_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", type=Path)
    parser.add_argument("--columns", nargs="+", default=["description"])
    parser.add_argument("--txt-dir", type=Path)
    args = parser.parse_args()
    if args.csv:
        fix_csv(args.csv, args.columns)
    if args.txt_dir:
        fix_txt_dir(args.txt_dir)
