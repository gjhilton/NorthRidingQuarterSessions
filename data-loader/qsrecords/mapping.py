"""Maps an LLM ExtractedRecord (flat strings for places) onto normalized DB
rows (FK ids), via get-or-create dedup for Town/Street/OffenceType.

This is the layer that resolves the deliberate schema divergence described in
the plan: the LLM naturally extracts "Whitby" as a string, but the DB stores
a single deduplicated Town row referenced by FK from every case/defendant/
person that mentions it.
"""

from typing import Optional

from sqlmodel import Session, select

from qsrecords.dates import parse_historical_date
from qsrecords.models.core import (
    Alias,
    Defendant,
    InvolvedPerson,
    Person,
    SummaryConviction,
    SummaryConvictionDefendant,
)
from qsrecords.models.extraction_schema import ExtractedRecord
from qsrecords.models.raw import RawCase
from qsrecords.models.reference import PettySessionalDivision, Street, Town
from qsrecords.offence_types import get_or_create_offence_type
from qsrecords.text import normalize_key, normalize_name


def get_or_create_town(session: Session, raw_name: Optional[str]) -> Optional[Town]:
    if not raw_name or not raw_name.strip():
        return None
    key = normalize_key(raw_name)
    existing = session.exec(select(Town).where(Town.name == key)).first()
    if existing:
        return existing
    town = Town(name=key)
    session.add(town)
    session.flush()
    return town


def get_or_create_street(
    session: Session, raw_name: Optional[str], town_id: Optional[int]
) -> Optional[Street]:
    if not raw_name or not raw_name.strip():
        return None
    key = normalize_key(raw_name)
    existing = session.exec(
        select(Street).where(Street.name == key, Street.town_id == town_id)
    ).first()
    if existing:
        return existing
    street = Street(name=key, town_id=town_id)
    session.add(street)
    session.flush()
    return street


def get_or_create_petty_sessional_division(
    session: Session, raw_name: Optional[str]
) -> Optional[PettySessionalDivision]:
    if not raw_name or not raw_name.strip():
        return None
    key = normalize_key(raw_name)
    existing = session.exec(
        select(PettySessionalDivision).where(PettySessionalDivision.name == key)
    ).first()
    if existing:
        return existing
    division = PettySessionalDivision(name=key)
    session.add(division)
    session.flush()
    return division


def persist_extracted_record(
    session: Session, raw_case: RawCase, extracted: ExtractedRecord
) -> SummaryConviction:
    conviction_parsed = parse_historical_date(raw_case.document_date_raw)
    offence_parsed = parse_historical_date(extracted.offence_date_raw)

    offence_type = get_or_create_offence_type(session, extracted.offence_type)
    offence_town = get_or_create_town(session, extracted.offence_town)
    offence_street = get_or_create_street(
        session, extracted.offence_street, offence_town.id if offence_town else None
    )
    court_town = get_or_create_town(session, extracted.court_location_town)
    petty_sessional_division = get_or_create_petty_sessional_division(
        session, extracted.petty_sessional_division
    )

    conviction = SummaryConviction(
        raw_case_id=raw_case.id,
        reference_number=raw_case.reference_number,
        conviction_date=conviction_parsed.iso_date if conviction_parsed else None,
        conviction_date_raw=raw_case.document_date_raw,
        offence_date=offence_parsed.iso_date if offence_parsed else None,
        offence_date_raw=extracted.offence_date_raw,
        offence_day_of_week=offence_parsed.day_of_week if offence_parsed else None,
        offence_day_of_month=offence_parsed.day_of_month if offence_parsed else None,
        offence_year=offence_parsed.year if offence_parsed else None,
        offence_time=extracted.offence_time,
        offence_type_id=offence_type.id,
        charge_description=extracted.charge_description,
        sentencing=extracted.sentencing,
        raw_record=raw_case.description,
        offence_location_town_id=offence_town.id if offence_town else None,
        offence_location_street_id=offence_street.id if offence_street else None,
        court_location_town_id=court_town.id if court_town else None,
        archive_url=raw_case.archive_url,
        extraction_confidence=extracted.overall_confidence,
        uncertain_fields=", ".join(extracted.uncertain_fields) or None,
        petty_sessional_division_id=(
            petty_sessional_division.id if petty_sessional_division else None
        ),
        monetary_value_raw=extracted.monetary_value_raw,
        game_species=extracted.game_species,
    )
    session.add(conviction)
    session.flush()

    for extracted_defendant in extracted.defendants:
        town = get_or_create_town(session, extracted_defendant.town)
        street = get_or_create_street(
            session, extracted_defendant.street, town.id if town else None
        )
        defendant = Defendant(
            first_name=extracted_defendant.first_name,
            last_name=extracted_defendant.last_name,
            sex=extracted_defendant.sex,
            age=extracted_defendant.age,
            marital_status=extracted_defendant.marital_status,
            relationship_type=extracted_defendant.relationship_type,
            related_to_name=extracted_defendant.related_to_name,
            occupation=extracted_defendant.occupation,
            relationships_and_details=extracted_defendant.relationships_and_details,
            prior_convictions=extracted_defendant.prior_convictions,
            town_id=town.id if town else None,
            street_id=street.id if street else None,
            name_key=normalize_name(
                extracted_defendant.first_name, extracted_defendant.last_name
            ),
        )
        session.add(defendant)
        session.flush()

        for alias_name in extracted_defendant.aliases:
            if alias_name and alias_name.strip():
                session.add(Alias(defendant_id=defendant.id, alias_name=alias_name))

        session.add(
            SummaryConvictionDefendant(
                summary_conviction_id=conviction.id, defendant_id=defendant.id
            )
        )

    for extracted_person in extracted.involved_persons:
        town = get_or_create_town(session, extracted_person.town)
        street = get_or_create_street(
            session, extracted_person.street, town.id if town else None
        )
        person = Person(
            first_name=extracted_person.first_name,
            last_name=extracted_person.last_name,
            age=extracted_person.age,
            marital_status=extracted_person.marital_status,
            relationship_type=extracted_person.relationship_type,
            related_to_name=extracted_person.related_to_name,
            occupation=extracted_person.occupation,
            relationships_and_details=extracted_person.relationships_and_details,
            town_id=town.id if town else None,
            street_id=street.id if street else None,
            name_key=normalize_name(extracted_person.first_name, extracted_person.last_name),
        )
        session.add(person)
        session.flush()

        session.add(
            InvolvedPerson(
                summary_conviction_id=conviction.id,
                person_id=person.id,
                role=extracted_person.role,
            )
        )

    session.flush()
    return conviction
