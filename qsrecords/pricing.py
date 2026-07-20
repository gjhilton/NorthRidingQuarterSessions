"""Per-model token pricing, used only to print a cost estimate before a run.

Prices are USD per 1,000,000 tokens. There's no API that returns this, so
it's a hand-maintained table -- update it when prices change. If a model
isn't listed, cost estimation is skipped with a warning rather than
guessing at a number.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class Pricing:
    input_per_million: float
    output_per_million: float


PRICING: dict[tuple[str, str], Pricing] = {
    ("anthropic", "claude-opus-4-8"): Pricing(5.00, 25.00),
    ("anthropic", "claude-sonnet-5"): Pricing(2.00, 10.00),  # intro price through 2026-08-31
    ("anthropic", "claude-haiku-4-5"): Pricing(1.00, 5.00),
    ("openai", "gpt-4o-2024-08-06"): Pricing(2.50, 10.00),
}


def get_pricing(provider: str, model: str) -> Optional[Pricing]:
    return PRICING.get((provider, model))
