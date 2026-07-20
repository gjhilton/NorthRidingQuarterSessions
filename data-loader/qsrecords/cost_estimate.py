"""Pre-run cost estimate for the extraction step.

This is an estimate, not a guarantee:
- Input tokens are measured for real via Anthropic's free count_tokens
  endpoint when the provider is Anthropic. For OpenAI (no equivalent free
  endpoint) and as a fallback if count_tokens fails (no key, no network),
  a chars/4 heuristic is used instead.
- Output tokens use a fixed per-record estimate derived from a real batch
  of extracted Whitby summary-conviction records (see
  ESTIMATED_OUTPUT_TOKENS_PER_RECORD below) -- actual output size varies
  per record depending on how much text the model extracts.
"""

from dataclasses import dataclass
from typing import Optional, Sequence

from qsrecords.llm.base import build_batch_prompt, build_system_prompt
from qsrecords.models.extraction_schema import ExtractionBatchInput
from qsrecords.offence_types import SEED_OFFENCE_TYPES
from qsrecords.pricing import get_pricing

# Measured from a real batch of 5 fully-extracted Whitby summary-conviction
# records (reconstructed ExtractionBatchOutput JSON, counted via Anthropic's
# count_tokens endpoint): 1420 tokens / 5 records = 284/record. Treat this as
# an order-of-magnitude estimate, not a per-run prediction.
ESTIMATED_OUTPUT_TOKENS_PER_RECORD = 284


@dataclass
class CostEstimate:
    record_count: int
    input_tokens: int
    estimated_output_tokens: int
    input_cost: float
    output_cost: float
    input_tokens_measured: bool  # True if via count_tokens, False if heuristic

    @property
    def total_cost(self) -> float:
        return self.input_cost + self.output_cost


def _count_input_tokens_anthropic(
    model: str, records: Sequence[ExtractionBatchInput]
) -> Optional[int]:
    try:
        from anthropic import Anthropic

        client = Anthropic()
        system_prompt = build_system_prompt(SEED_OFFENCE_TYPES)
        result = client.messages.count_tokens(
            model=model,
            system=system_prompt,
            messages=[{"role": "user", "content": build_batch_prompt(records)}],
        )
        return result.input_tokens
    except Exception:
        return None


def _approximate_input_tokens(records: Sequence[ExtractionBatchInput]) -> int:
    """chars/4 heuristic, used when a real token count isn't available."""
    system_prompt = build_system_prompt(SEED_OFFENCE_TYPES)
    user_prompt = build_batch_prompt(records)
    return (len(system_prompt) + len(user_prompt)) // 4


def _estimate_one_batch(
    provider: str, model: str, records: Sequence[ExtractionBatchInput]
) -> tuple[int, bool]:
    """Returns (input_tokens, was_measured_for_real)."""
    if provider == "anthropic":
        measured = _count_input_tokens_anthropic(model, records)
        if measured is not None:
            return measured, True
    return _approximate_input_tokens(records), False


def estimate_total_cost(
    provider: str,
    model: str,
    batch_size: int,
    pending_records: Sequence[ExtractionBatchInput],
) -> Optional[CostEstimate]:
    """Estimate total cost to process every record in `pending_records`,
    batched at `batch_size`. Measures one real sample batch's token shape
    (via a single free count_tokens call, for Anthropic) and scales across
    however many batches the full record count implies, rather than
    re-measuring every batch.
    """
    if not pending_records:
        return None

    pricing = get_pricing(provider, model)
    if pricing is None:
        return None

    sample = pending_records[:batch_size]
    sample_input_tokens, measured = _estimate_one_batch(provider, model, sample)
    sample_output_tokens = len(sample) * ESTIMATED_OUTPUT_TOKENS_PER_RECORD

    total_records = len(pending_records)
    num_full_batches, remainder = divmod(total_records, len(sample))

    total_input_tokens = sample_input_tokens * num_full_batches
    total_output_tokens = sample_output_tokens * num_full_batches

    if remainder:
        # Prorate the sample batch's per-record share for the partial last
        # batch. This slightly overcounts the fixed system-prompt overhead
        # (which doesn't actually shrink proportionally), but that overhead
        # is a small fraction of a batch's total cost, so the error is minor.
        fraction = remainder / len(sample)
        total_input_tokens += round(sample_input_tokens * fraction)
        total_output_tokens += round(sample_output_tokens * fraction)

    input_cost = total_input_tokens / 1_000_000 * pricing.input_per_million
    output_cost = total_output_tokens / 1_000_000 * pricing.output_per_million

    return CostEstimate(
        record_count=total_records,
        input_tokens=total_input_tokens,
        estimated_output_tokens=total_output_tokens,
        input_cost=input_cost,
        output_cost=output_cost,
        input_tokens_measured=measured,
    )
