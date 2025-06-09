import spacy
import gender_guesser.detector as gender
from pydantic import BaseModel

nlp = spacy.load("en_core_web_sm")
gender_detector = gender.Detector(case_sensitive=False)

class Person(BaseModel):
    surname: str | None
    forenames: str | None
    residence: str | None
    occupation: str | None
    gender: str | None

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

    start_index = None
    for token in doc:
        if token.text == residence:
            start_index = token.i
            break

    if start_index is None or start_index + 1 >= len(doc):
        return None

    occupation_tokens = []
    for token in doc[start_index + 1:]:
        if token.text.lower() == "for":
            break
        if token.is_punct and token.text != ",":
            break
        if token.text == ",":
            continue
        occupation_tokens.append(token.text)

    if occupation_tokens:
        occupation = " ".join(occupation_tokens).strip(" ,")
        return occupation if occupation else None

    return None

def extract_gender(forenames):
    if not forenames:
        return "unknown"
    first_name = forenames.split()[0]
    guess = gender_detector.get_gender(first_name)
    if guess in {"male", "mostly_male"}:
        return "male"
    if guess in {"female", "mostly_female"}:
        return "female"
    return "unknown"

def analyse(text) -> Person:
    doc = nlp(text)
    forenames, surname, person_ent = extract_defendant_name(doc, text)
    residence = extract_residence(doc, person_ent)
    occupation = extract_occupation(doc, residence)
    gender = extract_gender(forenames)
    return Person(
        surname=surname,
        forenames=forenames,
        residence=residence,
        occupation=occupation,
        gender=gender
    )

cases = [
    {
        "input": "Summary conviction of William Waters of the township of Whitby jet worker for being drunk and riotous in BaxtergateOffence committed at the township of Whitby on 16 March 1873. Whitby Strand - case heard at Whitby",
        "expected": Person(
            surname="Waters",
            forenames="William",
            residence="Whitby",
            occupation="jet worker",
            gender="male"
        )
    },
    {
        "input": "Summary conviction of Sarah Jane Williams of the township of Whitby seamstress for theft of a coat from the local shop. Offence committed at the township of Whitby on 5 March 1893. Whitby Strand Petty Sessional division - case heard at Whitby.",
        "expected": Person(
            surname="Williams",
            forenames="Sarah Jane",
            residence="Whitby",
            occupation="seamstress",
            gender="female"
        )
    },
    {
        "input": "Summary conviction of Thomas Brown of the village of Pickering, blacksmith, for assaulting a police officer on duty. Offence committed at the village of Pickering on 7 November 1905. Pickering Strand Petty Sessional division - case heard at Pickering.",
        "expected": Person(
            surname="Brown",
            forenames="Thomas",
            residence="Pickering",
            occupation="blacksmith",
            gender="male"
        )
    },
    {
        "input": "Summary conviction of Mary Elizabeth Adams of Whitby housewife for gambling in a public place. Offence committed at the township of Whitby on 12 July 1880. Whitby Strand Petty Sessional division - case heard at Whitby.",
        "expected": Person(
            surname="Adams",
            forenames="Mary Elizabeth",
            residence="Whitby",
            occupation="housewife",
            gender="female"
        )
    }
]

def check_property(prop):
    for case in cases:
        result = analyse(case["input"])
        expected = getattr(case["expected"], prop)
        actual = getattr(result, prop)
        assert actual == expected, (
            f"\nFAILED {prop}\nInput: {case['input']}\nExpected: {expected}\nGot: {actual}"
        )

def test_defendant_surnames():
    check_property("surname")

def test_defendant_forenames():
    check_property("forenames")

def test_defendant_residences():
    check_property("residence")

def test_defendant_occupations():
    check_property("occupation")

def test_defendant_genders():
    check_property("gender")

def run_all_tests():
    test_defendant_surnames()
    test_defendant_forenames()
    test_defendant_residences()
    test_defendant_occupations()
    test_defendant_genders()

if __name__ == "__main__":
    run_all_tests()
    print("All tests passed.")