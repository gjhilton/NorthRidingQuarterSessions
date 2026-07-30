from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

# Import side-effect: registers all table models with SQLModel.metadata.
import qsrecords.models  # noqa: F401

# NOTE: as of the v3 unified-schema migration, this module no longer calls
# the old offence-taxonomy seed/migrate helpers (qsrecords.offence_types)
# or applies incremental _COLUMN_ADDITIONS -- both were specific to the
# v2 schema's column-by-column evolution and are superseded by the
# one-off migrate_to_unified_schema.py script. qsrecords.offence_types,
# qsrecords.mapping, qsrecords.reports, qsrecords.related_convictions,
# qsrecords.scope_filter, qsrecords.text, and qsrecords.views all still
# reference the retired v2 models (Defendant, OffenceCategory, OffenceType,
# Town, Street, Place, Alias, InvolvedPerson, ...) and will not import
# successfully until they're updated in the follow-up "update the site"
# phase -- explicitly out of scope for the schema migration itself. Don't
# import them from here.


def get_engine(db_path: Path):
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    return create_engine(f"sqlite:///{db_path}")


def init_db(db_path: Path) -> None:
    """Creates any tables in the current model set that don't already
    exist. Does NOT touch pre-existing tables -- there's no migration
    framework here (single-developer project, SQLite, no concurrent
    deployments); one-off structural changes are one-off scripts
    (migrate_to_unified_schema.py), not something this function does."""
    engine = get_engine(db_path)
    SQLModel.metadata.create_all(engine)


def get_session(db_path: Path) -> Session:
    engine = get_engine(db_path)
    return Session(engine)
