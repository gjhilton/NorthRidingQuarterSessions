import csv

from sqlmodel import select

from qsrecords.csv_ingest import load_raw_cases
from qsrecords.models.raw import RawCase

FIELDNAMES = ["record_id", "title", "document_date", "description", "url"]


def _write_csv(path, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)


def test_retains_both_rows_of_a_true_duplicate_reference_number(session, tmp_path):
    # Reproduces the real QSB 1872 4/10/10/19 case: same reference_number,
    # genuinely different content and url (an upstream truncation bug in the
    # archive site, out of scope to fix -- but must not silently drop data).
    csv_path = tmp_path / "whitby.csv"
    _write_csv(
        csv_path,
        [
            {
                "record_id": "QSB 1872 4/10/10/19",
                "title": "Summary conviction: Mary Ann Stonehouse",
                "document_date": "1 Jan 1872",
                "description": "Summary conviction of Mary Ann Stonehouse for...",
                "url": "https://example.org/record?id=10-119",
            },
            {
                "record_id": "QSB 1872 4/10/10/19",
                "title": "Summary conviction: George Raw",
                "document_date": "2 Jan 1872",
                "description": "Summary conviction of George Raw for...",
                "url": "https://example.org/record?id=10-19",
            },
        ],
    )

    inserted, skipped = load_raw_cases(session, csv_path)

    assert inserted == 2
    assert skipped == 0
    rows = session.exec(select(RawCase)).all()
    assert len(rows) == 2
    assert {r.archive_url for r in rows} == {
        "https://example.org/record?id=10-119",
        "https://example.org/record?id=10-19",
    }


def test_reingesting_same_csv_inserts_nothing_new(session, tmp_path):
    csv_path = tmp_path / "whitby.csv"
    _write_csv(
        csv_path,
        [
            {
                "record_id": "QSB 1809 2/10/1",
                "title": "Summary conviction: Richard Bulmer of Whitby",
                "document_date": "8 Jan 1809",
                "description": "Summary conviction of Richard Bulmer of Whitby...",
                "url": "https://example.org/record?id=1",
            }
        ],
    )

    first_inserted, first_skipped = load_raw_cases(session, csv_path)
    second_inserted, second_skipped = load_raw_cases(session, csv_path)

    assert (first_inserted, first_skipped) == (1, 0)
    assert (second_inserted, second_skipped) == (0, 1)
    assert len(session.exec(select(RawCase)).all()) == 1


def test_ignores_non_summary_conviction_rows(session, tmp_path):
    csv_path = tmp_path / "whitby.csv"
    _write_csv(
        csv_path,
        [
            {
                "record_id": "QSB 1874 1/10",
                "title": "Quarter Sessions Bundle",
                "document_date": "1874",
                "description": "This bundle contains records of summary convictions for the area.",
                "url": "https://example.org/record?id=bundle",
            }
        ],
    )

    inserted, skipped = load_raw_cases(session, csv_path)

    assert inserted == 0
    assert skipped == 0
    assert session.exec(select(RawCase)).all() == []
