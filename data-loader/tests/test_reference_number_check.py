from qsrecords.reference_number_check import (
    canonical_tokens,
    canonical_tokens_from_archive_url,
    reference_number_mismatch,
)


def test_canonical_tokens_strips_qsb_and_q_prefixed_quarter():
    assert canonical_tokens("QSB 1872 4/10/10/19") == ["1872", "4", "10", "10", "19"]
    assert canonical_tokens("QSB 1869 Q4/10/14-3") == ["1869", "4", "10", "14", "3"]


def test_canonical_tokens_from_archive_url_decodes_and_tokenizes():
    url = "https://archivesunlocked.northyorks.gov.uk/CalmView/Record.aspx?src=CalmView.Catalog&id=Q%2fSB%2f1872-Q4%2f10%2f10-119&pos=3312"
    assert canonical_tokens_from_archive_url(url) == ["1872", "4", "10", "10", "119"]


def test_canonical_tokens_from_archive_url_returns_none_without_id_param():
    assert canonical_tokens_from_archive_url("https://example.com/no-id-here") is None


def test_reference_number_mismatch_true_for_the_known_dropped_digit_case():
    url = "https://archivesunlocked.northyorks.gov.uk/CalmView/Record.aspx?src=CalmView.Catalog&id=Q%2fSB%2f1872-Q4%2f10%2f10-119&pos=3312"
    assert reference_number_mismatch("QSB 1872 4/10/10/19", url) is True


def test_reference_number_mismatch_true_for_the_known_inserted_digit_case():
    url = "https://archivesunlocked.northyorks.gov.uk/CalmView/Record.aspx?src=CalmView.Catalog&id=Q%2fSB%2f1886-Q4%2f10%2f10-74&pos=7785"
    assert reference_number_mismatch("QSB 1886 4/10/10/774", url) is True


def test_reference_number_mismatch_false_when_consistent():
    url = "https://archivesunlocked.northyorks.gov.uk/CalmView/Record.aspx?src=CalmView.Catalog&id=Q%2fSB%2f1869-Q4%2f10%2f14-3&pos=1"
    assert reference_number_mismatch("QSB 1869 Q4/10/14-3", url) is False


def test_reference_number_mismatch_false_without_id_param():
    assert reference_number_mismatch("QSB 1872 4/10/10/19", "https://example.com/no-id") is False
