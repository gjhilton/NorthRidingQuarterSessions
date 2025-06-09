import spacy
import gender_guesser.detector as gender
from pydantic import BaseModel
from summary_conviction_testcases import Testcases, Case

nlp = spacy.load("en_core_web_sm")
gender_detector = gender.Detector(case_sensitive=False)

def extract_defendants(doc):
    defendants = []
    collecting = False
    current_name = []
    current_name_end_idx = None
    seen_names = set()
    i = 0

    while i < len(doc):
        token = doc[i]
        if token.text.lower() == "conviction":
            collecting = True
            i += 1
            continue

        if collecting:
            if token.text.lower() in {"for", "on", "offence"}:
                break

            if token.ent_type_ == "PERSON":
                current_name.append(token.text)
                current_name_end_idx = i
            elif token.pos_ in {"PROPN", "NOUN"} and token.text.istitle():
                current_name.append(token.text)
                current_name_end_idx = i
            elif token.text.lower() in {"and", ","}:
                if len(current_name) >= 2:
                    forenames = " ".join(current_name[:-1])
                    surname = current_name[-1]
                    full_name = forenames + " " + surname
                    if full_name not in seen_names:
                        occupation = extract_occupation(doc, current_name_end_idx + 1)
                        gender_value = detect_gender(forenames)
                        defendants.append({
                            "surname": surname,
                            "forenames": forenames,
                            "gender": gender_value,
                            "occupation": occupation
                        })
                        seen_names.add(full_name)
                current_name = []
                current_name_end_idx = None
            elif current_name:
                if len(current_name) >= 2:
                    forenames = " ".join(current_name[:-1])
                    surname = current_name[-1]
                    full_name = forenames + " " + surname
                    if full_name not in seen_names:
                        occupation = extract_occupation(doc, current_name_end_idx + 1)
                        gender_value = detect_gender(forenames)
                        defendants.append({
                            "surname": surname,
                            "forenames": forenames,
                            "gender": gender_value,
                            "occupation": occupation
                        })
                        seen_names.add(full_name)
                current_name = []
                current_name_end_idx = None
        i += 1

    if current_name:
        if len(current_name) >= 2:
            forenames = " ".join(current_name[:-1])
            surname = current_name[-1]
            full_name = forenames + " " + surname
            if full_name not in seen_names:
                occupation = extract_occupation(doc, current_name_end_idx + 1)
                gender_value = detect_gender(forenames)
                defendants.append({
                    "surname": surname,
                    "forenames": forenames,
                    "gender": gender_value,
                    "occupation": occupation
                })

    return defendants


def detect_gender(forenames: str) -> str | None:
    first_name = forenames.split()[0]
    raw_gender = gender_detector.get_gender(first_name)
    if raw_gender in {"male", "mostly_male"}:
        return "male"
    elif raw_gender in {"female", "mostly_female"}:
        return "female"
    else:
        return None

# doesnt work
def extract_occupation(doc, name_end_idx):
    location_keywords = {"township", "village", "town", "city", "county", "parish", "district"}
    prepositions = {"of", "in", "at", "on", "from"}
    determiners = {"the", "a", "an"}
    stop_words = {"for", "offence", "and"}

    i = name_end_idx + 1
    length = len(doc)

    # 1. Skip to start of location phrase (first 'of')
    while i < length and doc[i].text.lower() != "of":
        i += 1
    if i < length:
        i += 1

    # 2. Consume tokens part of location phrase
    while i < length:
        token = doc[i]
        low = token.text.lower()
        if (low in prepositions or
            low in determiners or
            low in location_keywords or
            token.pos_ == "PROPN" or
            token.is_punct):
            i += 1
        else:
            break

    # 👇 New logic: if next token is a comma, handle "comma case"
    if i < length and doc[i].text == ",":
        i += 1  # skip comma
        # Now collect next token(s) as occupation, until stop word or another comma
        occupation_tokens = []
        while i < length:
            token = doc[i]
            if token.text.lower() in stop_words:
                break
            if token.is_punct and token.text != ",":
                break
            if token.pos_ in {"NOUN", "ADJ"}:
                occupation_tokens.append(token.text)
            i += 1
        if occupation_tokens:
            return " ".join(occupation_tokens)
        return None

    # 👇 Handle non-comma case: look for NOUN/ADJ after location
    occupation_tokens = []
    while i < length:
        token = doc[i]
        low = token.text.lower()
        if low in stop_words or (token.is_punct and token.text != ","):
            break
        if token.pos_ in {"NOUN", "ADJ"} and token.text.islower():
            occupation_tokens.append(token.text)
        else:
            if token.is_punct and token.text == ",":
                i += 1
                continue
            break
        i += 1

    if occupation_tokens:
        return " ".join(occupation_tokens)
    return None       
        
def parse(input_str: str) -> Case | None:
    doc = nlp(input_str)
    result = {
        "defendants": extract_defendants(doc)
    }
    return Case(**result)


if __name__ == "__main__":
    #Testcases.run_all_tests(parse)
    Testcases.test_defendant_count(parse)
    Testcases.test_defendant_surnames(parse)
    Testcases.test_defendant_forenames(parse)
    #Testcases.test_defendant_residence(parse)
    #Testcases.test_defendant_occupation(parse)
    Testcases.test_defendant_gender(parse)
