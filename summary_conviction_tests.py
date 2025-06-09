from pydantic import BaseModel, conlist
from typing import List, Optional, Literal
from datetime import date

class Person(BaseModel):
    surname: Optional[str] = None
    forenames: Optional[str] = None
    residence: Optional[str] = None
    occupation: Optional[str] = None
    gender: Optional[Literal['male', 'female', 'other']] = None

class Case(BaseModel):
    date: Optional[date] = None
    offence: Optional[str] = None
    offence_location: Optional[str] = None
    court: Optional[str] = None
    defendants: Optional[conlist(Person, min_items=1)] = None
    involved_persons: Optional[List[Person]] = None

samole_data = [
    {
        "input": "Summary conviction of William Waters of the township of Whitby jet worker for being drunk and riotous in BaxtergateOffence committed at the township of Whitby on 16 March 1873. Whitby Strand - case heard at Whitby",
        "output": Case(
            date=date(1873, 3, 16),
            offence="being drunk and riotous in Baxtergate",
            offence_location="Baxtergate, Whitby",
            court="Whitby",
            defendants=[
                Person(
                    surname="Waters",
                    forenames="William",
                    residence="Whitby",
                    occupation="jet worker",
                    gender="male"
                )
            ],
            involved_persons=None
        )
    },
    {
        "input": "Summary conviction of Sarah Jane Williams of the township of Whitby seamstress for theft of a coat from the local shop. Offence committed at the township of Whitby on 5 March 1893. Whitby Strand Petty Sessional division - case heard at Whitby.",
        "output": Case(
            date=date(1893, 3, 5),
            offence="theft of a coat from the local shop",
            offence_location="Whitby",
            court="Whitby",
            defendants=[
                Person(
                    surname="Williams",
                    forenames="Sarah Jane",
                    residence="Whitby",
                    occupation="seamstress",
                    gender="female"
                )
            ],
            involved_persons=None
        )
    },
    {
        "input": "Summary conviction of Thomas Brown of the village of Pickering, blacksmith, for assaulting a police officer on duty. Offence committed at the village of Pickering on 7 November 1905. Pickering Strand Petty Sessional division - case heard at Pickering.",
        "output": Case(
            date=date(1905, 11, 7),
            offence="assaulting a police officer on duty",
            offence_location="Pickering",
            court="Pickering",
            defendants=[
                Person(
                    surname="Brown",
                    forenames="Thomas",
                    residence="Pickering",
                    occupation="blacksmith",
                    gender="male"
                )
            ],
            involved_persons=None
        )
    },
    {
        "input": "Summary conviction of Mary Elizabeth Adams of Whitby housewife for gambling in a public place. Offence committed at the township of Whitby on 12 July 1880. Whitby Strand Petty Sessional division - case heard at Whitby.",
        "output": Case(
            date=date(1880, 7, 12),
            offence="gambling in a public place",
            offence_location="Whitby",
            court="Whitby",
            defendants=[
                Person(
                    surname="Adams",
                    forenames="Mary Elizabeth",
                    residence="Whitby",
                    occupation="housewife",
                    gender="female"
                )
            ],
            involved_persons=None
        )
    },
    {
        "input": "Summary conviction of William Nicholson ostler, Jonathan Marsay waggoner and Mark Squires postboy, all of the township of Whitby, and William Norton of the township of Hawsker cum Stainsacre labourer, for trespassing in the daytime in pursuit of game by day on a close of land in the possession and occupation of Peter George Coble. Offence committed at the township of Sneaton on 30 August 1868. Whitby Strand - case heard at Whitby.",
        "output": Case(
            date=date(1868, 8, 30),
            offence="trespassing in the daytime in pursuit of game by day on a close of land in the possession and occupation of Peter George Coble",
            offence_location="Sneaton",
            court="Whitby",
            defendants=[
                Person(
                    surname="Nicholson",
                    forenames="William",
                    residence="Whitby",
                    occupation="ostler",
                    gender="male"
                ),
                Person(
                    surname="Marsay",
                    forenames="Jonathan",
                    residence="Whitby",
                    occupation="waggoner",
                    gender="male"
                ),
                Person(
                    surname="Squires",
                    forenames="Mark",
                    residence="Whitby",
                    occupation="postboy",
                    gender="male"
                ),
                Person(
                    surname="Norton",
                    forenames="William",
                    residence="Hawsker cum Stainsacre",
                    occupation="labourer",
                    gender="male"
                )
            ],
            involved_persons=None
        )
    }
]

def assert_equal(actual, expected, field, i=None, entity=""):
    prefix = f"{entity} {i} " if i is not None else ""
    assert actual == expected, f"{prefix}{field} mismatch: got {actual}, expected {expected}"

class Testcases:
    @staticmethod
    def test_date(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            assert_equal(result.date, case["output"].date, "date")

    @staticmethod
    def test_offence(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            assert_equal(result.offence, case["output"].offence, "offence")

    @staticmethod
    def test_offence_location(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            assert_equal(result.offence_location, case["output"].offence_location, "offence_location")

    @staticmethod
    def test_court(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            assert_equal(result.court, case["output"].court, "court")

    @staticmethod
    def test_defendant_surnames(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            for i, (actual, expected) in enumerate(zip(result.defendants, case["output"].defendants)):
                assert_equal(actual.surname, expected.surname, "defendant surname", i)

    @staticmethod
    def test_defendant_forenames(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            for i, (actual, expected) in enumerate(zip(result.defendants, case["output"].defendants)):
                assert_equal(actual.forenames, expected.forenames, "defendant forenames", i)

    @staticmethod
    def test_defendant_residence(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            for i, (actual, expected) in enumerate(zip(result.defendants, case["output"].defendants)):
                assert_equal(actual.residence, expected.residence, "defendant residence", i)

    @staticmethod
    def test_defendant_occupation(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            for i, (actual, expected) in enumerate(zip(result.defendants, case["output"].defendants)):
                assert_equal(actual.occupation, expected.occupation, "defendant occupation", i)

    @staticmethod
    def test_defendant_gender(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            for i, (actual, expected) in enumerate(zip(result.defendants, case["output"].defendants)):
                assert_equal(actual.gender, expected.gender, "defendant gender", i)

    @staticmethod
    def test_involved_person_surnames(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            actual_list = result.involved_persons or []
            expected_list = case["output"].involved_persons or []
            for i, (actual, expected) in enumerate(zip(actual_list, expected_list)):
                assert_equal(actual.surname, expected.surname, "involved_person surname", i)

    @staticmethod
    def test_involved_person_forenames(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            actual_list = result.involved_persons or []
            expected_list = case["output"].involved_persons or []
            for i, (actual, expected) in enumerate(zip(actual_list, expected_list)):
                assert_equal(actual.forenames, expected.forenames, "involved_person forenames", i)

    @staticmethod
    def test_involved_person_residence(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            actual_list = result.involved_persons or []
            expected_list = case["output"].involved_persons or []
            for i, (actual, expected) in enumerate(zip(actual_list, expected_list)):
                assert_equal(actual.residence, expected.residence, "involved_person residence", i)

    @staticmethod
    def test_involved_person_occupation(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            actual_list = result.involved_persons or []
            expected_list = case["output"].involved_persons or []
            for i, (actual, expected) in enumerate(zip(actual_list, expected_list)):
                assert_equal(actual.occupation, expected.occupation, "involved_person occupation", i)

    @staticmethod
    def test_involved_person_gender(parsing_function):
        for case in samole_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            actual_list = result.involved_persons or []
            expected_list = case["output"].involved_persons or []
            for i, (actual, expected) in enumerate(zip(actual_list, expected_list)):
                assert_equal(actual.gender, expected.gender, "involved_person gender", i)

    @staticmethod
    def run_all_tests(parsing_function):
        Testcases.test_date(parsing_function)
        Testcases.test_offence(parsing_function)
        Testcases.test_offence_location(parsing_function)
        Testcases.test_court(parsing_function)
        Testcases.test_defendant_surnames(parsing_function)
        Testcases.test_defendant_forenames(parsing_function)
        Testcases.test_defendant_residence(parsing_function)
        Testcases.test_defendant_occupation(parsing_function)
        Testcases.test_defendant_gender(parsing_function)
        Testcases.test_involved_person_surnames(parsing_function)
        Testcases.test_involved_person_forenames(parsing_function)
        Testcases.test_involved_person_residence(parsing_function)
        Testcases.test_involved_person_occupation(parsing_function)
        Testcases.test_involved_person_gender(parsing_function)

