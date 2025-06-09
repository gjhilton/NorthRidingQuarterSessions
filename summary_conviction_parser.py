import datetime
from summary_conviction_testcases import Testcases, Case

def parse(input_str: str) -> Case | None:
    # dummy daya for now
    result = {
        "defendants": [
            {
                "surname": "Waters",
                "forenames": "William",
            }
        ]
    }
    return Case(**result)

if __name__ == "__main__":
    #Testcases.run_all_tests(parse)
    Testcases.test_defendant_count(parse)
    Testcases.test_defendant_surnames(parse)
