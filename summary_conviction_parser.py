import spacy
import gender_guesser.detector as gender
from pydantic import BaseModel
from summary_conviction_testcases import Testcases, Case, Person
from datetime import datetime
import re

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

        if lower in stop_words:
            break
        if token.pos_ == "NOUN" and token.text[0].islower():
            break
        if token.is_punct:
            i += 1
            continue
        if lower in leading_phrases or lower in location_terms or token.ent_type_ in {"GPE", "LOC"} or token.pos_ == "PROPN":
            residence_tokens.append(token.text)
            i += 1
            continue
        break

    while residence_tokens and residence_tokens[0].lower() in leading_phrases | location_terms:
        residence_tokens.pop(0)

    return " ".join(residence_tokens) if residence_tokens else None

def extract_occupation(doc, start_idx):
    occupation_tokens = []
    i = start_idx

    while i < len(doc):
        token = doc[i]
        if token.pos_ == "NOUN" and token.text[0].islower():
            occupation_tokens.append(token.text)
            i += 1
            break
        i += 1

    while i < len(doc):
        token = doc[i]
        if token.pos_ == "NOUN" and token.text[0].islower():
            break
        occupation_tokens.append(token.text)
        i += 1

    return " ".join(occupation_tokens) if occupation_tokens else None

def extract_defendants(doc):
    defendants = []
    collecting = False
    current_name = []
    current_name_end_idx = None
    seen_names = set()
    collective_residence = None
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

            if token.text.lower() == "all" and i + 1 < len(doc) and doc[i + 1].text.lower() == "of":
                res_start = i + 2
                collective_residence = extract_residence(doc, res_start)
                i += 2
                i += len(collective_residence.split()) if collective_residence else 1
                continue

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
                        gender_value = detect_gender(forenames)
                        residence = extract_residence(doc, current_name_end_idx + 1)
                        occupation = extract_occupation(doc, current_name_end_idx + 1)
                        if not residence:
                            residence = collective_residence
                        defendants.append({
                            "surname": surname,
                            "forenames": forenames,
                            "gender": gender_value,
                            "residence": residence,
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
                        gender_value = detect_gender(forenames)
                        residence = extract_residence(doc, current_name_end_idx + 1)
                        occupation = extract_occupation(doc, current_name_end_idx + 1)
                        if not residence:
                            residence = collective_residence
                        defendants.append({
                            "surname": surname,
                            "forenames": forenames,
                            "gender": gender_value,
                            "residence": residence,
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
                gender_value = detect_gender(forenames)
                residence = extract_residence(doc, current_name_end_idx + 1)
                occupation = extract_occupation(doc, current_name_end_idx + 1)
                if not residence:
                    residence = collective_residence
                defendants.append({
                    "surname": surname,
                    "forenames": forenames,
                    "gender": gender_value,
                    "residence": residence,
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

def extract_date(doc):
    date_tokens = []
    collecting = False
    for token in doc:
        if token.text.lower() == "on":
            collecting = True
            continue
        if collecting:
            if token.text.isdigit() or token.text in {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"}:
                date_tokens.append(token.text)
            else:
                if len(date_tokens) > 0:
                    break

    if len(date_tokens) == 3:
        try:
            date = datetime.strptime(" ".join(date_tokens), "%d %B %Y")
            return date.strftime("%Y-%m-%d")
        except ValueError:
            try:
                date = datetime.strptime(" ".join(date_tokens), "%d %b %Y")
                return date.strftime("%Y-%m-%d")
            except ValueError:
                pass

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
    offence = " ".join(offence_tokens) if offence_tokens else None
    return offence.rstrip('. ') if offence else None              
                
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
        after_idx = idx + len("case heard at")
        after_text = text[after_idx:].strip()
        court = after_text.split()[0]
        return court
    return None

def parse(input_str: str) -> Case | None:
    input_str = re.sub(r'([a-z])([A-Z])', r'\1. \2', input_str)
    doc = nlp(input_str)
    defendants = extract_defendants(doc)
    date = extract_date(doc)
    offence = extract_offence(doc)
    offence_location = extract_offence_location(doc)
    court = extract_court(doc)

    result = {
        "defendants": [Person(**d) for d in defendants],
        "date": date,
        "offence": offence,
        "offence_location": offence_location,
        "court": court
    }

    return Case(**{k: v for k, v in result.items() if v is not None})
    
if __name__ == "__main__":
    Testcases.run_all_tests(parse)