from sqlmodel import select

from qsrecords.mapping import persist_extracted_record
from qsrecords.models.core import Defendant, Person
from qsrecords.models.extraction_schema import (
    ExtractedDefendant,
    ExtractedInvolvedPerson,
    ExtractedRecord,
)
from qsrecords.models.raw import RawCase
from qsrecords.models.reference import PettySessionalDivision, Town


def _make_raw_case(session, **overrides):
    defaults = dict(
        archive_url="https://example.org/record?id=1",
        reference_number="QSB 1857 3/10/18/5",
        title="Summary conviction: Henry Raw",
        document_date_raw="28 Apr 1857",
        description="Summary conviction of Henry Raw...",
    )
    defaults.update(overrides)
    raw_case = RawCase(**defaults)
    session.add(raw_case)
    session.flush()
    return raw_case


def _make_extracted(**overrides):
    defaults = dict(
        reference_number="QSB 1857 3/10/18/5",
        offence_date_raw="26 March 1857",
        offence_time=None,
        charge_description="assaulting Margaret Croft",
        sentencing=None,
        offence_type="assault",
        offence_town="Whitby",
        offence_street=None,
        court_location_town="Whitby",
        defendants=[
            ExtractedDefendant(first_name="Henry", last_name="Raw", occupation="jeweller")
        ],
        involved_persons=[],
        overall_confidence="high",
    )
    defaults.update(overrides)
    return ExtractedRecord(**defaults)


def test_persist_creates_summary_conviction_with_derived_dates(session):
    raw_case = _make_raw_case(session)
    extracted = _make_extracted()

    conviction = persist_extracted_record(session, raw_case, extracted)
    session.flush()

    assert conviction.reference_number == "QSB 1857 3/10/18/5"
    assert conviction.conviction_date.isoformat() == "1857-04-28"
    assert conviction.offence_date.isoformat() == "1857-03-26"
    assert conviction.offence_day_of_month == 26
    assert conviction.offence_year == 1857
    assert conviction.offence_day_of_week == conviction.offence_date.strftime("%A")


def test_two_records_naming_same_town_share_one_town_row(session):
    raw_case_1 = _make_raw_case(session, archive_url="https://example.org/1")
    raw_case_2 = _make_raw_case(
        session, archive_url="https://example.org/2", reference_number="QSB 1857 3/10/18/6"
    )

    persist_extracted_record(
        session, raw_case_1, _make_extracted(offence_town="Whitby")
    )
    persist_extracted_record(
        session,
        raw_case_2,
        _make_extracted(reference_number="QSB 1857 3/10/18/6", offence_town=" whitby "),
    )
    session.flush()

    towns = session.exec(select(Town).where(Town.name == "whitby")).all()
    assert len(towns) == 1


def test_offence_type_summary_conviction_redirects_to_unclassified(session):
    raw_case = _make_raw_case(session)
    extracted = _make_extracted(offence_type="Summary conviction")

    conviction = persist_extracted_record(session, raw_case, extracted)
    session.flush()

    from qsrecords.models.reference import OffenceType

    offence_type = session.get(OffenceType, conviction.offence_type_id)
    assert offence_type.name == "unclassified"


def test_defendants_from_different_cases_share_name_key_but_stay_distinct_rows(session):
    raw_case_1 = _make_raw_case(session, archive_url="https://example.org/1")
    raw_case_2 = _make_raw_case(
        session, archive_url="https://example.org/2", reference_number="QSB 1860 1/10/1"
    )

    persist_extracted_record(
        session,
        raw_case_1,
        _make_extracted(
            defendants=[ExtractedDefendant(first_name="John", last_name="Smith")]
        ),
    )
    persist_extracted_record(
        session,
        raw_case_2,
        _make_extracted(
            reference_number="QSB 1860 1/10/1",
            defendants=[ExtractedDefendant(first_name="JOHN", last_name=" Smith ")],
        ),
    )
    session.flush()

    matches = session.exec(select(Defendant).where(Defendant.name_key == "john smith")).all()
    assert len(matches) == 2
    assert matches[0].id != matches[1].id


def test_persists_petty_sessional_division_monetary_value_and_game_species(session):
    raw_case = _make_raw_case(session)
    extracted = _make_extracted(
        petty_sessional_division="Whitby Strand",
        monetary_value_raw="value 6d",
        game_species="conies",
    )

    conviction = persist_extracted_record(session, raw_case, extracted)
    session.flush()

    assert conviction.monetary_value_raw == "value 6d"
    assert conviction.game_species == "conies"
    division = session.get(PettySessionalDivision, conviction.petty_sessional_division_id)
    assert division.name == "whitby strand"


def test_two_records_naming_same_division_share_one_row(session):
    raw_case_1 = _make_raw_case(session, archive_url="https://example.org/1")
    raw_case_2 = _make_raw_case(
        session, archive_url="https://example.org/2", reference_number="QSB 1857 3/10/18/6"
    )

    persist_extracted_record(
        session, raw_case_1, _make_extracted(petty_sessional_division="Whitby Strand")
    )
    persist_extracted_record(
        session,
        raw_case_2,
        _make_extracted(
            reference_number="QSB 1857 3/10/18/6",
            petty_sessional_division=" whitby strand ",
        ),
    )
    session.flush()

    divisions = session.exec(
        select(PettySessionalDivision).where(PettySessionalDivision.name == "whitby strand")
    ).all()
    assert len(divisions) == 1


def test_persists_age_marital_status_and_relationship_for_defendant_and_person(session):
    raw_case = _make_raw_case(session)
    extracted = _make_extracted(
        defendants=[
            ExtractedDefendant(
                first_name="Maria",
                last_name="Castello",
                sex="female",
                marital_status="married",
                relationship_type="wife",
                related_to_name="Thomas Castello",
            )
        ],
        involved_persons=[
            ExtractedInvolvedPerson(
                first_name="Mary Ellen",
                last_name="Parker",
                age=13,
                relationship_type="daughter",
                related_to_name="Thomas Parker",
                role="victim",
            )
        ],
    )

    persist_extracted_record(session, raw_case, extracted)
    session.flush()

    defendant = session.exec(
        select(Defendant).where(Defendant.last_name == "Castello")
    ).one()
    assert defendant.marital_status == "married"
    assert defendant.relationship_type == "wife"
    assert defendant.related_to_name == "Thomas Castello"

    person = session.exec(select(Person).where(Person.last_name == "Parker")).one()
    assert person.age == 13
    assert person.relationship_type == "daughter"
    assert person.related_to_name == "Thomas Parker"


def test_blank_strings_from_llm_become_none():
    extracted = ExtractedRecord.model_validate(
        {
            "reference_number": "QSB 1900 1/10/1",
            "offence_date_raw": "",
            "charge_description": "theft",
            "offence_type": "theft",
            "sentencing": "",
            "defendants": [{"first_name": "Jane", "last_name": "Doe", "town": ""}],
            "overall_confidence": "high",
        }
    )
    assert extracted.offence_date_raw is None
    assert extracted.sentencing is None
    assert extracted.defendants[0].town is None
