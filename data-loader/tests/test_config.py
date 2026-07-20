"""Regression tests for the CWD-independent path resolution added when
data-loader/ was split out into its own directory. Before this, a relative
NRQS_DB_PATH from .env silently resolved against the current working
directory, so running a script from inside data-loader/ pointed at a
different (empty) database than running it from the repo root."""

from pathlib import Path

from qsrecords.config import _REPO_ROOT, _resolve_against_repo_root


def test_absolute_path_is_returned_unchanged():
    absolute = "/tmp/somewhere/db.sqlite"
    assert _resolve_against_repo_root(absolute) == Path(absolute)


def test_relative_path_resolves_against_repo_root_not_cwd():
    resolved = _resolve_against_repo_root("data/db.sqlite")
    assert resolved == _REPO_ROOT / "data" / "db.sqlite"
    # The whole point: this must not depend on where the test runner's CWD
    # happens to be.
    assert resolved.is_absolute()


def test_repo_root_actually_contains_a_data_directory():
    # Sanity check that _REPO_ROOT resolves to the real repo root and not
    # somewhere else entirely (e.g. off-by-one in the parent chain).
    assert (_REPO_ROOT / "data").is_dir()
