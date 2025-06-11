from data_models import Case, Person

tooley = {
    "input": "Summary conviction of William Tooley of Liverton Mines miner for trespassing in the daytime in search of conies on a piece of land in the possession and occupation of Sir Charles Mark PalmerOffence committed at the township of Roxby on 26 September 1888Whitby Strand Petty Sessional division - case heard at Whitby",
    "output": Case(
        date="1888-09-26",
        offence="trespassing in the daytime in search of conies on a piece of land in the possession and occupation of Sir Charles Mark Palmer",
        offence_location="Roxby",
        court="Whitby",
        defendants=[
            Person(
                surname="Tooley",
                forenames="William",
                residence="Liverton Mines",
                occupation="miner",
                gender="male"
            )
        ],
    )
}

waters = {
    "input": "Summary conviction of William Waters of the township of Whitby jet worker for being drunk and riotous in BaxtergateOffence committed at the township of Whitby on 16 March 1873. Whitby Strand - case heard at Whitby",
    "output": Case(
        date="1873-03-16",
        offence="being drunk and riotous in Baxtergate",
        offence_location="Whitby",
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
        
    )
}

williams = {
    "input": "Summary conviction of Sarah Jane Williams of the township of Whitby seamstress for theft of a coat from the local shop. Offence committed at the township of Whitby on 5 March 1893. Whitby Strand Petty Sessional division - case heard at Whitby.",
    "output": Case(
        date="1893-03-05",
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
        
    )
}

brown = {
    "input": "Summary conviction of Thomas Brown of the village of Pickering, blacksmith, for assaulting a police officer on duty. Offence committed at the village of Pickering on 7 November 1905. Pickering Strand Petty Sessional division - case heard at Pickering.",
    "output": Case(
        date="1905-11-07",
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
        
    )
}

adams = {
    "input": "Summary conviction of Mary Elizabeth Adams of Whitby housewife for gambling in a public place. Offence committed at the township of Whitby on 12 July 1880. Whitby Strand Petty Sessional division - case heard at Whitby.",
    "output": Case(
        date="1880-07-12",
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
        
    )
}

nicholson = {
    "input": "Summary conviction of William Nicholson ostler, Jonathan Marsay waggoner and Mark Squires postboy, all of the township of Whitby, and William Norton of the township of Hawsker cum Stainsacre labourer, for trespassing in the daytime in pursuit of game by day on a close of land in the possession and occupation of Peter George Coble. Offence committed at the township of Sneaton on 30 August 1868. Whitby Strand - case heard at Whitby.",
    "output": Case(
        date="1868-08-30",
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
        
    )
}

sample_data = [
    tooley,
    waters,
    williams,
    brown,
    adams,
    nicholson,
]

def assert_equal(actual, expected, field, i=None, entity="", input_text=""):
    prefix = f"{entity} {i} " if i is not None else ""
    snippet = input_text[:80].replace("\n", " ") + ("..." if len(input_text) > 80 else "")
    assert actual == expected, (
        f"\n[FAIL] {prefix}{field} mismatch:\n"
        f"  - Input:    \"{snippet}\"\n"
        f"  - Expected: {expected}\n"
        f"  - Got:      {actual}"
    )

class Testcases:
    @staticmethod
    def test_date(parsing_function):
        for case in sample_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            assert_equal(result.date, case["output"].date, "date", input_text=case["input"])

    @staticmethod
    def test_offence(parsing_function):
        for case in sample_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            assert_equal(result.offence, case["output"].offence, "offence", input_text=case["input"])

    @staticmethod
    def test_offence_location(parsing_function):
        for case in sample_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            assert_equal(result.offence_location, case["output"].offence_location, "offence_location", input_text=case["input"])

    @staticmethod
    def test_court(parsing_function):
        for case in sample_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            assert_equal(result.court, case["output"].court, "court", input_text=case["input"])

    @staticmethod
    def test_defendant_surnames(parsing_function):
        for case in sample_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            for i, (actual, expected) in enumerate(zip(result.defendants, case["output"].defendants)):
                assert_equal(actual.surname, expected.surname, "defendant surname", i, "Defendant", input_text=case["input"])

    @staticmethod
    def test_defendant_forenames(parsing_function):
        for case in sample_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            for i, (actual, expected) in enumerate(zip(result.defendants, case["output"].defendants)):
                assert_equal(actual.forenames, expected.forenames, "defendant forenames", i, "Defendant", input_text=case["input"])

    @staticmethod
    def test_defendant_residence(parsing_function):
        for case in sample_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            for i, (actual, expected) in enumerate(zip(result.defendants, case["output"].defendants)):
                assert_equal(actual.residence, expected.residence, "defendant residence", i, "Defendant", input_text=case["input"])

    @staticmethod
    def test_defendant_occupation(parsing_function):
        for case in sample_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            for i, (actual, expected) in enumerate(zip(result.defendants, case["output"].defendants)):
                assert_equal(actual.occupation, expected.occupation, "defendant occupation", i, "Defendant", input_text=case["input"])

    @staticmethod
    def test_defendant_gender(parsing_function):
        for case in sample_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            for i, (actual, expected) in enumerate(zip(result.defendants, case["output"].defendants)):
                assert_equal(actual.gender, expected.gender, "defendant gender", i, "Defendant", input_text=case["input"])

    @staticmethod
    def test_defendant_count(parsing_function):
        for case in sample_data:
            result = parsing_function(case["input"])
            assert result is not None, "parse() returned None"
            actual_count = len(result.defendants or [])
            expected_count = len(case["output"].defendants or [])
            assert actual_count == expected_count, (
                f"\n[FAIL] defendant count mismatch:\n"
                f"  - Input:    \"{case['input'][:80].replace(chr(10), ' ')}{'...' if len(case['input']) > 80 else ''}\"\n"
                f"  - Expected: {expected_count}\n"
                f"  - Got:      {actual_count}"
            )

    @staticmethod
    def samples():
        return(sample_data)

    @staticmethod
    def run_all_tests(parsing_function):
        Testcases.test_defendant_count(parsing_function)
        Testcases.test_date(parsing_function)
        Testcases.test_offence(parsing_function)
        Testcases.test_offence_location(parsing_function)
        Testcases.test_court(parsing_function)
        Testcases.test_defendant_surnames(parsing_function)
        Testcases.test_defendant_forenames(parsing_function)
        Testcases.test_defendant_gender(parsing_function)
        Testcases.test_defendant_residence(parsing_function)
        Testcases.test_defendant_occupation(parsing_function)
        print("All passed")
        
    
