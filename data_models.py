from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class Person(BaseModel):
    surname: Optional[str] = None
    forenames: Optional[str] = None
    residence: Optional[str] = None
    occupation: Optional[str] = None
    gender: Optional[Literal['male', 'female', 'other']] = None

class Case(BaseModel):
    date: Optional[str] = Field(default=None)  # date as string
    offence: Optional[str] = None
    offence_location: Optional[str] = None
    court: Optional[str] = None
    defendants: Optional[List[Person]] = None
    
def person_to_dict(person_instance: Person) -> dict:
    return person_instance.dict()

def case_to_dict(case_instance: Case) -> dict:
    return case_instance.dict()