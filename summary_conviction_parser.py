import re
from datetime import datetime
import spacy
import gender_guesser.detector as gender
from summary_conviction_testcases import Testcases, Case, Person

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
    if len(offset_list) < 1:
        return span.text 

    end_char = offset_list[0]["end"]

    return span.text[end_char:]
    
def extract_occupation(doc, start_idx):
    interesting_bit = get_first_sentence(doc)
    interesting_bit = interesting_bit[start_idx:]
    interesting_bit = get_span_up_to_first_for(interesting_bit)
    places = find_place_names(interesting_bit)
    if len(places) > 1:
        interesting_bit = get_span_to_first_comma(interesting_bit)
        interesting_bit = truncate_span_before_and(interesting_bit)
    interesting_bit = nlp(interesting_bit.text)
    places = find_place_names(interesting_bit)
    interesting_str = truncate_from_offset(interesting_bit, places)
    interesting_str = interesting_str.strip(" ,")
    return interesting_str

def detect_gender(forenames: str) -> str | None:
    first_name = forenames.split()[0]
    raw_gender = gender_detector.get_gender(first_name)
    if raw_gender in {"male", "mostly_male"}:
        return "male"
    elif raw_gender in {"female", "mostly_female"}:
        return "female"
    else:
        return None


def create_defendant(name_tokens, doc, end_idx, seen_names):
    if len(name_tokens) < 2:
        return None

    forenames = " ".join(name_tokens[:-1])
    surname = name_tokens[-1]
    full_name = f"{forenames} {surname}"

    if full_name in seen_names:
        return None

    seen_names.add(full_name)
    residence = extract_residence(doc, end_idx + 1)
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
                

            if token.ent_type_ == "PERSON" or (token.pos_ in {"PROPN", "NOUN"} and token.text.istitle()):
                name_tokens.append(token.text)
                end_idx = i
            elif lower in {"and", ","}:
                if (def_data := create_defendant(name_tokens, doc, end_idx, seen_names)):
                    defendants.append(def_data)
                name_tokens = []
                end_idx = None
            elif name_tokens:
                if (def_data := create_defendant(name_tokens, doc, end_idx, seen_names)):
                    defendants.append(def_data)
                name_tokens = []
                end_idx = None
        i += 1

    if name_tokens:
        if (def_data := create_defendant(name_tokens, doc, end_idx, seen_names)):
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