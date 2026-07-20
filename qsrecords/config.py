"""Settings with CLI-flag > env var > default precedence.

Loaded once via Settings.from_env(), then overridden field-by-field by
whatever CLI flags the entry-point scripts pass in (argparse defaults to
None so an unset flag doesn't clobber the env-derived value).
"""

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Settings:
    db_path: Path
    llm_provider: str
    openai_model: str
    anthropic_model: str
    batch_size: int
    max_attempts: int

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            db_path=Path(os.getenv("NRQS_DB_PATH", "data/db.sqlite")),
            llm_provider=os.getenv("NRQS_LLM_PROVIDER", "openai"),
            openai_model=os.getenv("NRQS_OPENAI_MODEL", "gpt-4o-2024-08-06"),
            anthropic_model=os.getenv("NRQS_ANTHROPIC_MODEL", "claude-opus-4-8"),
            batch_size=int(os.getenv("NRQS_BATCH_SIZE", "25")),
            max_attempts=int(os.getenv("NRQS_MAX_ATTEMPTS", "3")),
        )
