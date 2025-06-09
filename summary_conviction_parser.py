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
    seen_names = set()
    pending_occupation = None
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
            elif token.pos_ in {"PROPN", "NOUN"} and token.text.istitle():
                current_name.append(token.text)
            elif token.text.lower() in {"and", ","}:
                if len(current_name) >= 2:
                    forenames = " ".join(current_name[:-1])
                    surname = current_name[-1]
                    full_name = forenames + " " + surname
                    if full_name not in seen_names:
                        occupation = extract_occupation(doc, i)
                        gender_value = detect_gender(forenames)
                        defendants.append({
                            "surname": surname,
                            "forenames": forenames,
                            "gender": gender_value,
                            "occupation": occupation
                        })
                        seen_names.add(full_name)
                current_name = []
            elif current_name:
                if len(current_name) >= 2:
                    forenames = " ".join(current_name[:-1])
                    surname = current_name[-1]
                    full_name = forenames + " " + surname
                    if full_name not in seen_names:
                        occupation = extract_occupation(doc, i)
                        gender_value = detect_gender(forenames)
                        defendants.append({
                            "surname": surname,
                            "forenames": forenames,
                            "gender": gender_value,
                            "occupation": occupation
                        })
                        seen_names.add(full_name)
                current_name = []
        i += 1

    if current_name:
        if len(current_name) >= 2:
            forenames = " ".join(current_name[:-1])
            surname = current_name[-1]
            full_name = forenames + " " + surname
            if full_name not in seen_names:
                occupation = extract_occupation(doc, i)
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


def extract_occupation(doc, start_index):
    occupation_tokens = []
    for j in range(start_index, min(start_index + 5, len(doc))):
        t = doc[j]
        if t.pos_ == "NOUN" and not t.ent_type_:
            if t.text.islower() or (t.text[0].islower() and t.text[1:].isalpha()):
                occupation_tokens.append(t.text)
            else:
                break
        elif occupation_tokens:
            break
    occupation = " ".join(occupation_tokens) if occupation_tokens else None
    return occupation

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
    Testcases.test_defendant_occupation(parse)
    Testcases.test_defendant_gender(parse)
