import spacy

nlp = spacy.load("en_core_web_sm")

def analyse(text):
    doc = nlp(text)
    result = {
        "defendant_surname": None,
        "defendant_forenames": None,
        "defendant_residence": None,
        "defendant_occupation": None,
    }

    # Extract defendant full name: look for PERSON entity after "conviction of"
    for ent in doc.ents:
        if ent.label_ == "PERSON" and "conviction of" in text[max(0, ent.start_char - 15):ent.start_char].lower():
            full_name = ent.text.split()
            if len(full_name) >= 2:
                result["defendant_forenames"] = " ".join(full_name[:-1])
                result["defendant_surname"] = full_name[-1]
            else:
                result["defendant_forenames"] = full_name[0]
            break

    # Extract residence: look for GPE after "of the township/village of" or "of"
    residence = None
    for ent in doc.ents:
        if ent.label_ == "GPE":
            window_start = max(0, ent.start_char - 20)
            window_text = text[window_start:ent.start_char].lower()
            if ("of the township of" in window_text or
                "of the village of" in window_text or
                "of " in window_text):
                residence = ent.text
                break
    result["defendant_residence"] = residence

    # Extract occupation: assume noun chunks following residence mention and before "for"
    occupation = None
    if residence:
        # Find the token index of residence
        residence_token = None
        for token in doc:
            if token.text == residence:
                residence_token = token.i
                break
        if residence_token is not None:
            # Look for noun chunks after residence token before 'for'
            for chunk in doc.noun_chunks:
                if chunk.start > residence_token:
                    # Check if 'for' appears between residence and chunk start - if yes, stop
                    for token in doc[residence_token:chunk.start]:
                        if token.text.lower() == "for":
                            occupation = None
                            break
                    else:
                        occupation = chunk.text
                        break
    if occupation:
        result["defendant_occupation"] = occupation.strip(" ,")

    return result

cases = [
    {
        "input": "Summary conviction of William Waters of the township of Whitby jet worker for being drunk and riotous in BaxtergateOffence committed at the township of Whitby on 16 March 1873. Whitby Strand - case heard at Whitby",
        "expected": {
            "defendant_surname": "Waters",
            "defendant_forenames": "William",
            "defendant_residence": "Whitby",
            "defendant_occupation": "jet worker"
        }
    },
    {
        "input": "Summary conviction of Sarah Jane Williams of the township of Whitby seamstress for theft of a coat from the local shop. Offence committed at the township of Whitby on 5 March 1893. Whitby Strand Petty Sessional division - case heard at Whitby.",
        "expected": {
            "defendant_surname": "Williams",
            "defendant_forenames": "Sarah Jane",
            "defendant_residence": "Whitby",
            "defendant_occupation": "seamstress"
        }
    },
    {
        "input": "Summary conviction of Thomas Brown of the village of Pickering, blacksmith, for assaulting a police officer on duty. Offence committed at the village of Pickering on 7 November 1905. Pickering Strand Petty Sessional division - case heard at Pickering.",
        "expected": {
            "defendant_surname": "Brown",
            "defendant_forenames": "Thomas",
            "defendant_residence": "Pickering",
            "defendant_occupation": "blacksmith"
        }
    },
    {
        "input": "Summary conviction of Mary Elizabeth Adams of Whitby housewife for gambling in a public place. Offence committed at the township of Whitby on 12 July 1880. Whitby Strand Petty Sessional division - case heard at Whitby.",
        "expected": {
            "defendant_surname": "Adams",
            "defendant_forenames": "Mary Elizabeth",
            "defendant_residence": "Whitby",
            "defendant_occupation": "housewife"
        }
    }
]

def test_defendant_surnames():
    for case in cases:
        result = analyse(case["input"])
        assert result["defendant_surname"] == case["expected"]["defendant_surname"], (
            f"Failed surname for input: {case['input']}\nExpected: {case['expected']['defendant_surname']}, Got: {result['defendant_surname']}"
        )

def test_defendant_forenames():
    for case in cases:
        result = analyse(case["input"])
        assert result["defendant_forenames"] == case["expected"]["defendant_forenames"], (
            f"Failed forenames for input: {case['input']}\nExpected: {case['expected']['defendant_forenames']}, Got: {result['defendant_forenames']}"
        )

def test_defendant_residences():
    for case in cases:
        result = analyse(case["input"])
        assert result["defendant_residence"] == case["expected"]["defendant_residence"], (
            f"Failed residence for input: {case['input']}\nExpected: {case['expected']['defendant_residence']}, Got: {result['defendant_residence']}"
        )

def test_defendant_occupations():
    for case in cases:
        result = analyse(case["input"])
        assert result["defendant_occupation"] == case["expected"]["defendant_occupation"], (
            f"Failed occupation for input: {case['input']}\nExpected: {case['expected']['defendant_occupation']}, Got: {result['defendant_occupation']}"
        )

def run_all_tests():
    test_defendant_surnames()
    test_defendant_forenames()
    test_defendant_residences()
    # test_defendant_occupations()

if __name__ == "__main__":
    run_all_tests()
    print("All tests passed.")