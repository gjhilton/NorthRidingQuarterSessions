import os
from typing import Optional

from qsrecords.llm.base import ExtractionProvider


def get_provider(name: Optional[str] = None, model: Optional[str] = None) -> ExtractionProvider:
    """Runtime provider selection: explicit arg > env var > default.

    Callers (04_extract_structured_data.py) pass CLI-flag values here;
    argparse leaves unset flags as None so the env var / default still apply.
    """
    resolved_name = (name or os.getenv("NRQS_LLM_PROVIDER", "openai")).lower()

    if resolved_name == "openai":
        from qsrecords.llm.openai_provider import OpenAIProvider

        resolved_model = model or os.getenv("NRQS_OPENAI_MODEL", "gpt-4o-2024-08-06")
        return OpenAIProvider(model=resolved_model)

    if resolved_name == "anthropic":
        from qsrecords.llm.anthropic_provider import AnthropicProvider

        resolved_model = model or os.getenv("NRQS_ANTHROPIC_MODEL", "claude-opus-4-8")
        return AnthropicProvider(model=resolved_model)

    raise ValueError(f"Unknown provider: {resolved_name!r} (expected 'openai' or 'anthropic')")
