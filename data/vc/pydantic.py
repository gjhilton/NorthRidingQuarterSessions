from pydantic import BaseModel, Field, constr, conint, HttpUrl, ValidationError
from typing import List, Optional
from datetime import date

class Person(BaseModel):
    forenames: constr(min_length=1)
    surname: constr(min_length=1)
    age: conint(ge=0, le=120)

class Case(BaseModel):
    url: HttpUrl  # Use Pydantic's robust HttpUrl type instead of regex
    defendants: List[Person] = Field(..., min_items=1)
    involved_persons: Optional[List[Person]] = Field(default_factory=list)
    date: date  # native Python date object

valid_data = {
    "url": "https://example.com/2",
    "defendants": [
        {"forenames": "Jane", "surname": "Doe", "age": 30}
    ],
    "involved_persons": [
        {"forenames": "Mark", "surname": "Lee", "age": 40},
        {"forenames": "Anna", "surname": "Bell", "age": 25}
    ],
    "date": date(2023, 5, 15)
}

try:
    case = Case(**valid_data)
    print(case)
    print("Date type:", type(case.date))
except ValidationError as e:
    print("Validation error:")
    print(e)