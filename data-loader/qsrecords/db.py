from pathlib import Path

from sqlalchemy import text
from sqlmodel import Session, SQLModel, create_engine

# Import side-effect: registers all table models with SQLModel.metadata.
import qsrecords.models  # noqa: F401
from qsrecords.offence_types import migrate_offence_taxonomy, seed_offence_taxonomy
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
    ("summary_conviction", "correction_note", "VARCHAR"),
    ("summary_conviction", "of_especial_interest", "BOOLEAN DEFAULT 0"),
    ("defendant", "age", "INTEGER"),
    ("defendant", "marital_status", "VARCHAR"),
    ("defendant", "relationship_type", "VARCHAR"),
    ("defendant", "related_to_name", "VARCHAR"),
    ("person", "age", "INTEGER"),
    ("person", "marital_status", "VARCHAR"),
    ("person", "relationship_type", "VARCHAR"),
    ("person", "related_to_name", "VARCHAR"),
    ("offence_type", "category_id", "INTEGER"),
    ("defendant", "name_qualifier", "VARCHAR"),
    ("person", "name_qualifier", "VARCHAR"),
    # Place tree migration (see qsrecords.models.reference.Place) -- new
    # single leaf-node location columns, added alongside the still-present
    # old town_id/street_id-family columns (not modelled in Python anymore,
    # but not yet dropped from the database either, so the manual place-by-
    # place migration has the old data to read from and check against).
    ("defendant", "location_id", "INTEGER"),
    ("person", "location_id", "INTEGER"),
    ("summary_conviction", "offence_location_id", "INTEGER"),
    ("summary_conviction", "court_location_id", "INTEGER"),
    ("place", "path_geometry", "TEXT"),
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


def _migrate_offence_type_to_junction(engine) -> None:
    """One-time structural migration: summary_conviction.offence_type_id used
    to be a single scalar FK. Replaced by summary_conviction_offence_type (a
    conviction can charge more than one genuinely distinct offence, e.g.
    "assaulting and resisting a constable"). Runs only if the old column is
    still present -- idempotent, and a no-op on any DB created after this
    migration was introduced (create_all never adds the old column in the
    first place).

    SQLite's ALTER TABLE DROP COLUMN refuses to drop a column referenced by
    an inline FOREIGN KEY constraint (offence_type_id is), so this can't be
    a plain ADD-then-DROP like _apply_column_additions. Instead: rename the
    old table aside, let create_all build a fresh summary_conviction from
    the current model (no offence_type_id), copy every other column's data
    across by explicit name (order-independent, survives future column
    additions), backfill the junction table from the old table's
    offence_type_id, then drop the old table.
    """
    with engine.connect() as conn:
        old_columns = [
            row[1] for row in conn.execute(text("PRAGMA table_info(summary_conviction)"))
        ]
        if "offence_type_id" not in old_columns:
            return
        # legacy_alter_table=ON stops SQLite "helpfully" rewriting every
        # other table's FOREIGN KEY text (summary_conviction_defendant,
        # involved_persons, summary_conviction_offence_type all reference
        # summary_conviction) to follow this table under its new name --
        # exactly the opposite of what's wanted: those FK clauses should
        # keep saying "summary_conviction" so they resolve to the table
        # that inherits that name below, not to the one being retired.
        conn.execute(text("PRAGMA legacy_alter_table = ON"))
        conn.execute(text("ALTER TABLE summary_conviction RENAME TO summary_conviction_old"))
        conn.execute(text("PRAGMA legacy_alter_table = OFF"))
        # Indexes keep their original name after a table rename -- drop them
        # so create_all can recreate same-named indexes on the fresh table
        # below without a name collision. Auto-indexes (UNIQUE constraints)
        # are dropped automatically with the table itself, so skip those.
        index_names = [
            row[1]
            for row in conn.execute(text("PRAGMA index_list(summary_conviction_old)"))
            if not row[1].startswith("sqlite_autoindex_")
        ]
        for index_name in index_names:
            conn.execute(text(f"DROP INDEX {index_name}"))
        conn.commit()

    SQLModel.metadata.tables["summary_conviction"].create(engine)

    with engine.connect() as conn:
        new_columns = [
            row[1] for row in conn.execute(text("PRAGMA table_info(summary_conviction)"))
        ]
        shared_columns = ", ".join(c for c in new_columns if c in old_columns)
        conn.execute(
            text(
                f"INSERT INTO summary_conviction ({shared_columns}) "
                f"SELECT {shared_columns} FROM summary_conviction_old"
            )
        )
        conn.execute(
            text(
                """
                INSERT OR IGNORE INTO summary_conviction_offence_type
                    (summary_conviction_id, offence_type_id)
                SELECT id, offence_type_id FROM summary_conviction_old
                WHERE offence_type_id IS NOT NULL
                """
            )
        )
        conn.execute(text("DROP TABLE summary_conviction_old"))
        conn.commit()


def init_db(db_path: Path) -> None:
    engine = get_engine(db_path)
    SQLModel.metadata.create_all(engine)
    _apply_column_additions(engine)
    _migrate_offence_type_to_junction(engine)
    with Session(engine) as session:
        # Pre-populate the canonical offence_type/offence_category vocabulary,
        # so an LLM-returned match (e.g. "drunkenness") lands on the seeded
        # row instead of silently creating a fresh is_seeded=False duplicate
        # the first time it's encountered.
        seed_offence_taxonomy(session)
        # Idempotent merge of any pre-taxonomy duplicate offence_type rows
        # (e.g. "truancy"/"school attendance offence"/...) into their
        # canonical leaf -- runs on every startup, not just once, so it's
        # self-healing across every entry point (manual batches, LLM
        # extraction) rather than a migration someone has to remember to run.
        migrate_offence_taxonomy(session)
        # Recreated every call so the view can't drift from qsrecords.views.
        create_views(session)
        session.commit()


def get_session(db_path: Path) -> Session:
    engine = get_engine(db_path)
    return Session(engine)
