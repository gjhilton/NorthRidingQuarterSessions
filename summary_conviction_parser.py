import re
from datetime import datetime
import spacy
import gender_guesser.detector as gender
from pydantic import BaseModel
from summary_conviction_testcases import Testcases, Case, Person

nlp = spacy.load("en_core_web_sm")
gender_detector = gender.Detector(case_sensitive=False)

def extract_residence(doc, start_idx):
    residence_tokens = []
    i = start_idx
    stop_words = {"for", "on", "offence", "and"}
    leading_phrases = {"of", "from", "at", "in", "the"}
    location_terms = {"village", "township", "town"}

    while i < len(doc):
        token = doc[i]
        lower = token.text.lower()

        if lower in stop_words or (token.pos_ == "NOUN" and token.text[0].islower()):
            break
        if token.is_punct:
            i += 1
            continue
        if (lower in leading_phrases | location_terms or
            token.ent_type_ in {"GPE", "LOC"} or
            token.pos_ == "PROPN"):
            residence_tokens.append(token.text)
            i += 1
            continue
        break

    # Remove leading location prepositions
    while residence_tokens and residence_tokens[0].lower() in (leading_phrases | location_terms):
        residence_tokens.pop(0)

    return " ".join(residence_tokens) if residence_tokens else None

def extract_occupation(doc, start_idx):
    return "todo"
    
def brokem_extract_occupation(doc, start_idx):
    occupation_tokens = []
    stop_words = {"for", "on", "offence", "and"}
    i = start_idx

    while i < len(doc):
        token = doc[i]
        lower = token.text.lower()

        if lower in stop_words or token.is_punct:
            break

        if token.ent_type_ in {"GPE", "LOC"}:
            break

        if token.pos_ in {"NOUN", "ADJ"} or token.text[0].islower():
            occupation_tokens.append(token.text)
        elif occupation_tokens:
            break

        i += 1

    return " ".join(occupation_tokens) if occupation_tokens else None


def detect_gender(forenames: str) -> str | None:
    first_name = forenames.split()[0]
    raw_gender = gender_detector.get_gender(first_name)
    if raw_gender in {"male", "mostly_male"}:
        return "male"
    elif raw_gender in {"female", "mostly_female"}:
        return "female"
    else:
        return None


def create_defendant(name_tokens, doc, end_idx, collective_residence, seen_names):
    if len(name_tokens) < 2:
        return None

    forenames = " ".join(name_tokens[:-1])
    surname = name_tokens[-1]
    full_name = f"{forenames} {surname}"

    if full_name in seen_names:
        return None

    seen_names.add(full_name)
    residence = extract_residence(doc, end_idx + 1) or collective_residence
    occupation = extract_occupation(doc, end_idx + 1)
    gender = detect_gender(forenames)

    return {
        "forenames": forenames,
        "surname": surname,
        "gender": gender,
        "residence": residence,
        "occupation": occupation
    }


def extract_defendants(doc):
    defendants = []
    collecting = False
    name_tokens = []
    end_idx = None
    seen_names = set()
    collective_residence = None
    i = 0

    while i < len(doc):
        token = doc[i]
        lower = token.text.lower()

        if lower == "conviction":
            collecting = True
            i += 1
            continue

        if collecting:
            if lower in {"for", "on", "offence"}:
                break

            if lower == "all" and i + 1 < len(doc) and doc[i + 1].text.lower() == "of":
                i += 2
                collective_residence = extract_residence(doc, i)
                i += len(collective_residence.split()) if collective_residence else 1
                continue

            if token.ent_type_ == "PERSON" or (token.pos_ in {"PROPN", "NOUN"} and token.text.istitle()):
                name_tokens.append(token.text)
                end_idx = i
            elif lower in {"and", ","}:
                if (def_data := create_defendant(name_tokens, doc, end_idx, collective_residence, seen_names)):
                    defendants.append(def_data)
                name_tokens = []
                end_idx = None
            elif name_tokens:
                if (def_data := create_defendant(name_tokens, doc, end_idx, collective_residence, seen_names)):
                    defendants.append(def_data)
                name_tokens = []
                end_idx = None
        i += 1

    if name_tokens:
        if (def_data := create_defendant(name_tokens, doc, end_idx, collective_residence, seen_names)):
            defendants.append(def_data)

    return defendants


def extract_date(doc):
    date_tokens = []
    collecting = False
    for token in doc:
        if token.text.lower() == "on":
            collecting = True
            continue
        if collecting:
            if token.text.isdigit() or token.text in {
                "January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December",
                "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            }:
                date_tokens.append(token.text)
            elif date_tokens:
                break

    for fmt in ("%d %B %Y", "%d %b %Y"):
        try:
            return datetime.strptime(" ".join(date_tokens), fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None


def extract_offence(doc):
    offence_tokens = []
    collecting = False
    for token in doc:
        if token.text.lower() == "for":
            collecting = True
            continue
        if collecting:
            if token.text.lower() in {"offence", "committed"}:
                break
            offence_tokens.append(token.text)
    return " ".join(offence_tokens).rstrip('. ') if offence_tokens else None


def extract_offence_location(doc):
    text = doc.text.lower()
    idx = text.find("offence committed at")
    if idx != -1:
        original_text = doc.text
        after = original_text[idx + len("offence committed at"):]
        words = after.split()
        for word in words:
            stripped_word = word.strip('.,;:"\'?!()[]{}')
            if stripped_word and stripped_word[0].isupper():
                return stripped_word
    return None


def extract_court(doc):
    text = " ".join([token.text for token in doc])
    idx = text.lower().find("case heard at")
    if idx != -1:
        after_text = text[idx + len("case heard at"):].strip()
        court = after_text.split()[0]
        return court
    return None


def parse(input_str: str) -> Case | None:
    input_str = re.sub(r'([a-z])([A-Z])', r'\1. \2', input_str)
    doc = nlp(input_str)

    result = {
        "defendants": [Person(**d) for d in extract_defendants(doc)],
        "date": extract_date(doc),
        "offence": extract_offence(doc),
        "offence_location": extract_offence_location(doc),
        "court": extract_court(doc),
    }

    return Case(**{k: v for k, v in result.items() if v is not None})


def test_occupation_extraction():
    data = Testcases.samoles()
    print("\n")
    for item in data:
        result = None
        if "input" in item:
            input = item["input"]
            print(f"Input: {input}")
            result = parse(input)
        if "output" in item:
            output = item['output']
            occupations = [p.occupation for p in output.defendants]
            print(f"Expected occupations: {occupations}")
        if result:
            hits = [p.occupation for p in result.defendants]
            print(f"Got occupations: {hits}")
        print("\n")


if __name__ == "__main__":
    #Testcases.run_all_tests(parse)
    print(test_occupation_extraction())