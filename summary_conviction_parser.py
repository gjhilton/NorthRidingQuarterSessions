import spacy
import gender_guesser.detector as gender
from pydantic import BaseModel
from summary_conviction_testcases import Testcases, Case

nlp = spacy.load("en_core_web_sm")
gender_detector = gender.Detector(case_sensitive=False)

def extract_residence(doc, start_idx):
    residence_tokens = []
    i = start_idx
    stop_words = {"for", "on", "offence", "and"}
    leading_phrases = {"of", "from", "at", "in", "the"}
    location_terms = {"village", "township", "town"}
    occupation_keywords = {
        "blacksmith", "labourer", "ostler", "waggoner", "postboy", "worker", "farmer",
        "servant", "miner", "shoemaker", "sailor", "fisherman", "grocer", "mason"
    }

    while i < len(doc):
        token = doc[i]
        lower = token.text.lower()

        if lower in stop_words:
            break
        if token.pos_ == "NOUN" and (token.text[0].islower() or lower in occupation_keywords):
            break
        if lower in occupation_keywords:
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
                res_start = i + 1
                collective_residence = extract_residence(doc, res_start)
                i += 1
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
                        if not residence:
                            residence = collective_residence
                        defendants.append({
                            "surname": surname,
                            "forenames": forenames,
                            "gender": gender_value,
                            "residence": residence
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
                        if not residence:
                            residence = collective_residence
                        defendants.append({
                            "surname": surname,
                            "forenames": forenames,
                            "gender": gender_value,
                            "residence": residence
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
                if not residence:
                    residence = collective_residence
                defendants.append({
                    "surname": surname,
                    "forenames": forenames,
                    "gender": gender_value,
                    "residence": residence
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

def parse(input_str: str) -> Case | None:
    doc = nlp(input_str)
    result = {
        "defendants": extract_defendants(doc)
    }
    return Case(**result)

if __name__ == "__main__":
    Testcases.run_all_tests(parse)