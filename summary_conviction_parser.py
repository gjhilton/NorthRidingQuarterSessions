import re
from datetime import datetime
import spacy
import gender_guesser.detector as gender
from data_models import Case, Person
from summary_conviction_testcases import Testcases

nlp = spacy.load("en_core_web_sm")
gender_detector = gender.Detector(case_sensitive=False)

def find_place_text(name_idx, places):
    return next((place["text"] for place in places if name_idx < place["end"]), None)

def extract_residence(doc, start_idx):
    first_sentence = get_first_sentence(doc)
    trimmed_text = first_sentence[start_idx:].text
    parsed = nlp(trimmed_text)
    return find_place_names(parsed)[0]["text"]

def get_first_sentence(doc):
    return next(doc.sents, None)

def get_span_up_to_first_for(doc):
    for i, token in enumerate(doc):
        if token.text.lower() == "for":
            return doc[:i]
    return doc

def find_place_names(doc):
    return [
        {"text": ent.text, "start": ent.start_char, "end": ent.end_char}
        for ent in doc.ents
        if ent.label_ in {"GPE", "LOC", "FAC", "ORG"}
    ]

def remove_spans_from_text(doc, spans):
    text = doc.text
    for span in sorted(spans, key=lambda x: x["start"], reverse=True):
        text = text[:span["start"]] + text[span["end"]:]
    return text

def get_span_to_first_comma(doc):
    return next((doc[:i] for i, token in enumerate(doc) if token.text == ","), doc)
 
def truncate_span_before_and(span):
    return next((span[:i] for i, token in enumerate(span) if token.text.lower() == "and"), span)

def truncate_from_offset(span, offset_list):
    if not offset_list:
        return span.text
    return span.text[offset_list[0]["end"]:]
    
def extract_occupation(doc, start_idx):
    span = get_first_sentence(doc)[start_idx:]
    span = get_span_up_to_first_for(span)
    places = find_place_names(span)
    if len(places) > 1:
        span = get_span_to_first_comma(span)
        span = truncate_span_before_and(span)
    span = nlp(span.text)
    places = find_place_names(span)
    result = truncate_from_offset(span, places).strip(" ,")
    return result

def detect_gender(forenames: str) -> str | None:
    first_name = forenames.split()[0]
    gender_map = {"male": "male", "mostly_male": "male", "female": "female", "mostly_female": "female"}
    return gender_map.get(gender_detector.get_gender(first_name))

def create_defendant(name_tokens, doc, end_idx, seen_names):
    if len(name_tokens) < 2:
        return None

    forenames, surname = " ".join(name_tokens[:-1]), name_tokens[-1]
    full_name = f"{forenames} {surname}"

    if full_name in seen_names:
        return None

    seen_names.add(full_name)

    start_idx = end_idx + 1
    return {
        "forenames": forenames,
        "surname": surname,
        "gender": detect_gender(forenames),
        "residence": extract_residence(doc, start_idx),
        "occupation": extract_occupation(doc, start_idx)
    }

def extract_defendants(doc):
    defendants = []
    collecting = False
    name_tokens = []
    end_idx = None
    seen_names = set()
    i = 0
    length = len(doc)

    while i < length:
        token = doc[i]
        lower = token.text.lower()

        if lower == "conviction":
            collecting = True
            i += 1
            continue

        if collecting:
            if lower in {"for", "on", "offence"}:
                break

            if lower == "all" and i + 1 < length and doc[i + 1].text.lower() == "of":
                i += 2
                continue

            if token.ent_type_ == "PERSON" or (token.pos_ in {"PROPN", "NOUN"} and token.text.istitle()):
                name_tokens.append(token.text)
                end_idx = i
            elif lower in {"and", ","}:
                if def_data := create_defendant(name_tokens, doc, end_idx, seen_names):
                    defendants.append(def_data)
                name_tokens.clear()
                end_idx = None
            elif name_tokens:
                if def_data := create_defendant(name_tokens, doc, end_idx, seen_names):
                    defendants.append(def_data)
                name_tokens.clear()
                end_idx = None

        i += 1

    if name_tokens and (def_data := create_defendant(name_tokens, doc, end_idx, seen_names)):
        defendants.append(def_data)

    return defendants

def extract_date(doc):
    months = {
        "january", "february", "march", "april", "may", "june", "july",
        "august", "september", "october", "november", "december",
        "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "oct", "nov", "dec"
    }

    date_tokens = []
    collecting = False

    for token in doc:
        lower_text = token.text.lower()
        if lower_text == "on":
            collecting = True
            continue
        if collecting:
            if token.text.isdigit() or lower_text in months:
                date_tokens.append(token.text)
            elif date_tokens:
                break

    date_str = " ".join(date_tokens)
    for fmt in ("%d %B %Y", "%d %b %Y"):
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            pass

    return None

def extract_offence(doc):
    offence_tokens = []
    collecting = False

    for token in doc:
        lower = token.text.lower()
        if lower == "for":
            collecting = True
            continue
        if collecting:
            if lower in {"offence", "committed"}:
                break
            offence_tokens.append(token.text)

    return " ".join(offence_tokens).rstrip('. ') or None

def extract_offence_location(doc):
    phrase = "offence committed at"
    text_lower = doc.text.lower()
    idx = text_lower.find(phrase)
    if idx == -1:
        return None

    after = doc.text[idx + len(phrase):].lstrip()
    for word in after.split():
        stripped = word.strip('.,;:"\'?!()[]{}')
        if stripped and stripped[0].isupper():
            return stripped
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

    filtered_result = {k: v for k, v in result.items() if v}
    return Case(**filtered_result) if filtered_result else None

def test_attribute_extraction(key, mute=False):
    data = Testcases.samoles()
    
    if not mute:
        print("\n***********************************")
        print(f"*           {key}")
        print("***********************************\n")
    
    for item in data:
        result = None
        if "input" in item:
            input_text = item["input"]
            if not mute:
                print(f"Input: {input_text}")
            result = parse(input_text)

        if "output" in item:
            output = item["output"]
            expected = [getattr(p, key) for p in output.defendants]
            if not mute:
                print(f"Expected {key}s: {expected}")

        if result:
            actual = [getattr(p, key) for p in result.defendants]
            if not mute:
                print(f"Got {key}s: {actual}")

        if not mute:
            print("\n")

    
if __name__ == "__main__":
    Testcases.run_all_tests(parse)
    # test_attribute_extraction('occupation')
    #test_attribute_extraction('residence',True)
    #text = "Summary conviction of William Nicholson ostler, Jonathan Marsay waggoner and Mark Squires postboy, all of the township of Whitby, and William Norton of the township of Hawsker cum Stainsacre labourer, for trespassing in the daytime in pursuit of game by day on a close of land in the possession and occupation of Peter George Coble."
    #text = "of Whitby housewife"
    #doc = nlp(text)
    #for ent in doc.ents:
     #    print(ent.text, ent.label_)