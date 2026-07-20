from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

# Import side-effect: registers all table models with SQLModel.metadata.
import qsrecords.models  # noqa: F401
from qsrecords.offence_types import seed_offence_types
from qsrecords.views import create_views


def get_engine(db_path: Path):
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    return create_engine(f"sqlite:///{db_path}")


def init_db(db_path: Path) -> None:
    engine = get_engine(db_path)
    SQLModel.metadata.create_all(engine)
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
