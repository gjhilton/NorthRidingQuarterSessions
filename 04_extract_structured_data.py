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

Before doing any LLM work, prints an estimated cost for the records this run
will process and asks for confirmation (skip with --yes) -- this is a real
cost per run, and the estimate has caught real surprises during development.

Usage:
    python3 04_extract_structured_data.py [--limit N] [--batch-size N] \\
        [--provider openai|anthropic] [--model NAME] [--yes]
"""

import argparse
import sys

from qsrecords.config import Settings
from qsrecords.cost_estimate import estimate_total_cost
from qsrecords.db import get_session, init_db
from qsrecords.extraction_runner import get_pending_inputs, run
from qsrecords.llm.factory import get_provider


def print_cost_estimate_and_confirm(
    provider_name: str, model: str, batch_size: int, pending_inputs: list, skip_confirm: bool
) -> bool:
    """Prints an estimated cost for processing `pending_inputs` and asks the
    user to confirm. Returns True if the run should proceed."""
    if not pending_inputs:
        print("No pending records -- nothing to do.")
        return False

    estimate = estimate_total_cost(provider_name, model, batch_size, pending_inputs)
    num_batches = -(-len(pending_inputs) // batch_size)  # ceil division

    print(f"\nAbout to extract {len(pending_inputs)} record(s) in {num_batches} batch(es) "
          f"of up to {batch_size}, using {provider_name}/{model}.")

    if estimate is None:
        print("No pricing data for this provider/model -- cost estimate unavailable.")
    else:
        measured_note = (
            "measured via Anthropic's count_tokens"
            if estimate.input_tokens_measured
            else "approximate -- no free token-counting endpoint for this provider"
        )
        print(
            f"Estimated cost: ${estimate.total_cost:.2f} "
            f"(~{estimate.input_tokens:,} input tokens [{measured_note}], "
            f"~{estimate.estimated_output_tokens:,} output tokens [estimated per-record average])."
        )
        print("This is an estimate, not a guarantee -- actual cost depends on what the model returns.")

    if skip_confirm:
        return True

    answer = input("Proceed? [y/N]: ").strip().lower()
    return answer in ("y", "yes")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--limit", type=int, default=None, help="Max records to process this run (default: all pending)."
    )
    parser.add_argument("--batch-size", type=int, default=None, help="Records per LLM call.")
    parser.add_argument("--provider", choices=["openai", "anthropic"], default=None)
    parser.add_argument("--model", default=None)
    parser.add_argument(
        "--yes", "-y", action="store_true", help="Skip the cost-estimate confirmation prompt."
    )
    args = parser.parse_args()

    settings = Settings.from_env()
    init_db(settings.db_path)

    batch_size = args.batch_size or settings.batch_size
    provider = get_provider(name=args.provider, model=args.model)

    processed_total = 0
    succeeded_total = 0
    failed_total = 0

    with get_session(settings.db_path) as session:
        pending_inputs = get_pending_inputs(session, limit=args.limit)
        if not print_cost_estimate_and_confirm(
            provider.name, provider.model, batch_size, pending_inputs, args.yes
        ):
            print("Aborted.")
            sys.exit(0)

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
