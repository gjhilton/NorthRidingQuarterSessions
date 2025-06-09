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

    for token in doc:
        if token.text.lower() == "conviction":
            collecting = True
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
                    name_parts = current_name[:]
                    forenames = " ".join(name_parts[:-1])
                    surname = name_parts[-1]
                    full_name = forenames + " " + surname
                    if full_name not in seen_names:
                        defendants.append({
                            "surname": surname,
                            "forenames": forenames
                        })
                        seen_names.add(full_name)
                current_name = []
            elif current_name:
                if len(current_name) >= 2:
                    name_parts = current_name[:]
                    forenames = " ".join(name_parts[:-1])
                    surname = name_parts[-1]
                    full_name = forenames + " " + surname
                    if full_name not in seen_names:
                        defendants.append({
                            "surname": surname,
                            "forenames": forenames
                        })
                        seen_names.add(full_name)
                current_name = []

    if current_name:
        if len(current_name) >= 2:
            name_parts = current_name
            forenames = " ".join(name_parts[:-1])
            surname = name_parts[-1]
            full_name = forenames + " " + surname
            if full_name not in seen_names:
                defendants.append({
                    "surname": surname,
                    "forenames": forenames
                })

    return defendants

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
    
