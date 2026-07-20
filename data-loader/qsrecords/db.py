from pathlib import Path

from sqlalchemy import text
from sqlmodel import Session, SQLModel, create_engine

# Import side-effect: registers all table models with SQLModel.metadata.
import qsrecords.models  # noqa: F401
from qsrecords.offence_types import seed_offence_types
from qsrecords.views import create_views

# metadata.create_all only creates missing tables -- it never alters an
# existing one to add a column a model has grown since the db was first
# created. There's no migration framework here (single-developer project,
# SQLite, no concurrent deployments), so new nullable columns are just
# added by hand the one time they're introduced.
_COLUMN_ADDITIONS = [
    ("summary_conviction", "extraction_confidence", "VARCHAR"),
    ("summary_conviction", "uncertain_fields", "VARCHAR"),
    ("summary_conviction", "petty_sessional_division_id", "INTEGER"),
    ("summary_conviction", "monetary_value_raw", "VARCHAR"),
    ("summary_conviction", "game_species", "VARCHAR"),
    ("defendant", "age", "INTEGER"),
    ("defendant", "marital_status", "VARCHAR"),
    ("defendant", "relationship_type", "VARCHAR"),
    ("defendant", "related_to_name", "VARCHAR"),
    ("person", "age", "INTEGER"),
    ("person", "marital_status", "VARCHAR"),
    ("person", "relationship_type", "VARCHAR"),
    ("person", "related_to_name", "VARCHAR"),
]


def get_engine(db_path: Path):
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    return create_engine(f"sqlite:///{db_path}")


def _apply_column_additions(engine) -> None:
    with engine.connect() as conn:
        for table, column, coltype in _COLUMN_ADDITIONS:
            existing = {row[1] for row in conn.execute(text(f"PRAGMA table_info({table})"))}
            if column not in existing:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {coltype}"))
        conn.commit()


def init_db(db_path: Path) -> None:
    engine = get_engine(db_path)
    SQLModel.metadata.create_all(engine)
    _apply_column_additions(engine)
    with Session(engine) as session:
        # Pre-populate the canonical offence_type vocabulary with
        # is_seeded=True, so an LLM-returned match (e.g. "drunkenness") lands
        # on the seeded row instead of silently creating a fresh
        # is_seeded=False duplicate the first time it's encountered.
        seed_offence_types(session)
        # Recreated every call so the view can't drift from qsrecords.views.
        create_views(session)
        session.commit()


def get_session(db_path: Path) -> Session:
    engine = get_engine(db_path)
    return Session(engine)
