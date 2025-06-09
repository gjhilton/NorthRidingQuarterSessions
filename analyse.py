import spacy

nlp = spacy.load("en_core_web_sm")

def extract_defendant_name(doc, text):
    for ent in doc.ents:
        if ent.label_ == "PERSON" and "conviction of" in text[max(0, ent.start_char - 15):ent.start_char].lower():
            full_name = ent.text.split()
            if len(full_name) >= 2:
                forenames = " ".join(full_name[:-1])
                surname = full_name[-1]
            else:
                forenames = full_name[0]
                surname = None
            return forenames, surname, ent
    return None, None, None

def extract_residence(doc, person_ent):
    if not person_ent:
        return None
    for token in doc:
        if token.text.lower() == "of" and token.i > person_ent.end:
            for i in range(token.i + 1, len(doc)):
                t = doc[i]
                if t.text.lower() == "for" or t.is_punct:
                    break
                if t.ent_type_ == "GPE":
                    return t.text
                if t.pos_ in {"NOUN", "PROPN"} and t.text.istitle():
                    return t.text
    return None

def extract_occupation(doc, residence):
    if not residence:
        return None
    residence_token = None
    for token in doc:
        if token.text == residence:
            residence_token = token.i
            break
    if residence_token is not None:
        for chunk in doc.noun_chunks:
            if chunk.start > residence_token:
                for token in doc[residence_token:chunk.start]:
                    if token.text.lower() == "for":
                        return None
                return chunk.text.strip(" ,")
    return None

def analyse(text):
    doc = nlp(text)
    forenames, surname, person_ent = extract_defendant_name(doc, text)
    residence = extract_residence(doc, person_ent)
    occupation = extract_occupation(doc, residence)
    return {
        "defendant_surname": surname,
        "defendant_forenames": forenames,
        "defendant_residence": residence,
        "defendant_occupation": occupation
    }

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

def check_property(prop):
    for case in cases:
        result = analyse(case["input"])
        expected = case["expected"][prop]
        actual = result[prop]
        assert actual == expected, (
            f"\nFAILED {prop}\nInput: {case['input']}\nExpected: {expected}\nGot: {actual}"
        )

def test_defendant_surnames():
    check_property("defendant_surname")

def test_defendant_forenames():
    check_property("defendant_forenames")

def test_defendant_residences():
    check_property("defendant_residence")

def test_defendant_occupations():
    check_property("defendant_occupation")

def run_all_tests():
    test_defendant_surnames()
    test_defendant_forenames()
    test_defendant_residences()
    test_defendant_occupations()

if __name__ == "__main__":
    run_all_tests()
    print("All tests passed.")