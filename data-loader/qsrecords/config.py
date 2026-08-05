"""Settings with CLI-flag > env var > default precedence.

Loaded once via Settings.from_env(), then overridden field-by-field by
whatever CLI flags the entry-point scripts pass in (argparse defaults to
None so an unset flag doesn't clobber the env-derived value).

data-loader is one part of a larger project (see repo layout), so paths are
resolved relative to this package's own location, not the current working
directory -- these scripts work correctly whether invoked as
`python3 data-loader/03_load_raw_cases.py` from the repo root or as
`python3 03_load_raw_cases.py` from inside data-loader/.
"""

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

_DATA_LOADER_ROOT = Path(__file__).resolve().parent.parent  # data-loader/
_REPO_ROOT = _DATA_LOADER_ROOT.parent
_DEFAULT_DB_PATH = _REPO_ROOT / "data" / "db.sqlite"

load_dotenv(_DATA_LOADER_ROOT / ".env")


def _resolve_against_repo_root(value: str) -> Path:
    """A relative NRQS_DB_PATH (e.g. from a .env file written before this
    package moved into data-loader/) must not be interpreted relative to
    the CWD -- that silently pointed at a different, empty database when
    this script was run from inside data-loader/ instead of the repo root.
    """
    path = Path(value)
    return path if path.is_absolute() else (_REPO_ROOT / path)


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
            db_path=_resolve_against_repo_root(os.getenv("NRQS_DB_PATH", str(_DEFAULT_DB_PATH))),
            llm_provider=os.getenv("NRQS_LLM_PROVIDER", "openai"),
            openai_model=os.getenv("NRQS_OPENAI_MODEL", "gpt-4o-2024-08-06"),
            anthropic_model=os.getenv("NRQS_ANTHROPIC_MODEL", "claude-opus-4-8"),
            batch_size=int(os.getenv("NRQS_BATCH_SIZE", "25")),
            max_attempts=int(os.getenv("NRQS_MAX_ATTEMPTS", "3")),
        )
