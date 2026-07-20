"""Step 4: LLM extraction + normalized load, in one pass.

Replaces the old 04_extract_structured_data.py (deprecated OpenAI
`functions`/`function_call` API, one .json/__FAILED.json marker file per
record) AND the never-built 05_load_data.py -- extraction results are
written directly into the normalized SQLite tables, no intermediate JSON
files at all.

Resumable by construction: re-running with no flags just processes the next
batch of `raw_case` rows still in `pending` status (see
qsrecords.extraction_runner). There's no equivalent of v1's "budget counts
skipped files against the quota" bug, since the underlying query only ever
returns rows that still need work.

Usage:
    python3 04_extract_structured_data.py [--limit N] [--batch-size N] \\
        [--provider openai|anthropic] [--model NAME]
"""

import argparse

from qsrecords.config import Settings
from qsrecords.db import get_session, init_db
from qsrecords.extraction_runner import run
from qsrecords.llm.factory import get_provider


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--limit", type=int, default=None, help="Max records to process this run (default: all pending)."
    )
    parser.add_argument("--batch-size", type=int, default=None, help="Records per LLM call.")
    parser.add_argument("--provider", choices=["openai", "anthropic"], default=None)
    parser.add_argument("--model", default=None)
    args = parser.parse_args()

    settings = Settings.from_env()
    init_db(settings.db_path)

    batch_size = args.batch_size or settings.batch_size
    provider = get_provider(name=args.provider, model=args.model)

    processed_total = 0
    succeeded_total = 0
    failed_total = 0

    with get_session(settings.db_path) as session:
        while args.limit is None or processed_total < args.limit:
            stats = run(session, provider, batch_size, settings.max_attempts)
            if stats.processed == 0:
                break
            processed_total += stats.processed
            succeeded_total += stats.succeeded
            failed_total += stats.failed
            print(
                f"Batch done: {stats.succeeded} succeeded, {stats.failed} failed "
                f"(running total: {processed_total} processed)"
            )

    print(
        f"Done. {succeeded_total} succeeded, {failed_total} failed, "
        f"out of {processed_total} processed."
    )


if __name__ == "__main__":
    main()
