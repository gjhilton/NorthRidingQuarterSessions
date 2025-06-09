from analyse_module import analyse

def case_william_waters():
    input_text = "Summary conviction of William Waters of the township of Whitby jet worker for being drunk and riotous in BaxtergateOffence committed at the township of Whitby on 16 March 1873. Whitby Strand - case heard at Whitby"
    expected = {
        "defendant_surname": "Waters",
        "defendant_forenames": "William",
        "defendant_residence": "Whitby",
        "defendant_occupation": "jet worker"
    }
    result = analyse(input_text)
    assert result == expected, f"Failed: William Waters — got {result}"

def case_sarah_jane_williams():
    input_text = "Summary conviction of Sarah Jane Williams of the township of Whitby seamstress for theft of a coat from the local shop. Offence committed at the township of Whitby on 5 March 1893. Whitby Strand Petty Sessional division - case heard at Whitby."
    expected = {
        "defendant_surname": "Williams",
        "defendant_forenames": "Sarah Jane",
        "defendant_residence": "Whitby",
        "defendant_occupation": "seamstress"
    }
    result = analyse(input_text)
    assert result == expected, f"Failed: Sarah Jane Williams — got {result}"

def case_thomas_brown():
    input_text = "Summary conviction of Thomas Brown of the village of Pickering, blacksmith, for assaulting a police officer on duty. Offence committed at the village of Pickering on 7 November 1905. Pickering Strand Petty Sessional division - case heard at Pickering."
    expected = {
        "defendant_surname": "Brown",
        "defendant_forenames": "Thomas",
        "defendant_residence": "Pickering",
        "defendant_occupation": "blacksmith"
    }
    result = analyse(input_text)
    assert result == expected, f"Failed: Thomas Brown — got {result}"

def case_mary_elizabeth_adams():
    input_text = "Summary conviction of Mary Elizabeth Adams of Whitby housewife for gambling in a public place. Offence committed at the township of Whitby on 12 July 1880. Whitby Strand Petty Sessional division - case heard at Whitby."
    expected = {
        "defendant_surname": "Adams",
        "defendant_forenames": "Mary Elizabeth",
        "defendant_residence": "Whitby",
        "defendant_occupation": "housewife"
    }
    result = analyse(input_text)
    assert result == expected, f"Failed: Mary Elizabeth Adams — got {result}"

def test_all():
    case_william_waters()
    # case_sarah_jane_williams()
    # case_thomas_brown()
    # case_mary_elizabeth_adams()

    