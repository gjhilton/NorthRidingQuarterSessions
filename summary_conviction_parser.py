import datetime
from summary_conviction_testcases import Testcases, Case


def parse(input_str: str) -> Case | None:
    result = {
        "date": datetime.datetime.now(),
        "offence": "being drunk and riotous in Baxtergate",
        "offence_location": "Baxtergate, Whitby",
        "court": "Whitby",
        "defendants": [
            {
                "surname": "Waters",
                "forenames": "William",
                "residence": "Whitby",
                "occupation": "jet worker",
                "gender": "male"
            }
        ],
        "involved_persons": None
    }
    # Create a Case instance instead of returning dict
    return Case(**result)

if __name__ == "__main__":
    #Testcases.run_all_tests(parse)
    print(Testcases.samoles())
