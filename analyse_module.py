import spacy

nlp = spacy.load("en_core_web_sm")

def extract_defendant_name(doc):
    persons = [ent for ent in doc.ents if ent.label_ == "PERSON"]
    if not persons:
        return None, None
    defendant_ent = persons[0]
    full_name = defendant_ent.text.strip().split()
    if len(full_name) > 1:
        surname = full_name[-1]
        forenames = " ".join(full_name[:-1])
    else:
        forenames = full_name[0]
        surname = None
    return surname, forenames

def extract_defendant_residence(doc):
    tokens = list(doc)
    persons = [ent for ent in doc.ents if ent.label_ == "PERSON"]
    if not persons:
        return None
    defendant_ent = persons[0]
    i = defendant_ent.end

    while i < len(tokens) and tokens[i].text.lower() != "of":
        i += 1
    if i == len(tokens):
        return None

    i += 1  # move past "of"
    residence_tokens = []
    while i < len(tokens) and tokens[i].text.lower() not in {"for", ",", "."}:
        residence_tokens.append(tokens[i])
        i += 1

    if residence_tokens:
        start_idx = residence_tokens[0].i
        end_idx = residence_tokens[-1].i + 1
        gpe_entities = [ent for ent in doc.ents if ent.label_ == "GPE" and ent.start >= start_idx and ent.end <= end_idx]
        if gpe_entities:
            return gpe_entities[-1].text
    return None

def extract_defendant_occupation(doc):
    tokens = list(doc)
    persons = [ent for ent in doc.ents if ent.label_ == "PERSON"]
    if not persons:
        return None
    defendant_ent = persons[0]
    i = defendant_ent.end

    while i < len(tokens) and tokens[i].text.lower() != "of":
        i += 1
    if i == len(tokens):
        return None

    i += 1  # move past "of"
    while i < len(tokens) and tokens[i].text.lower() not in {"for", ",", "."}:
        i += 1

    occupation_tokens = []
    while i < len(tokens) and tokens[i].text.lower() != "for":
        if tokens[i].pos_ in {"NOUN", "ADJ"} or tokens[i].text == "-":
            occupation_tokens.append(tokens[i].text)
        elif tokens[i].text in {",", "."}:
            pass
        else:
            if occupation_tokens:
                break
        i += 1

    if occupation_tokens:
        return " ".join(occupation_tokens)
    return None

def analyse(text):
    doc = nlp(text)
    surname, forenames = extract_defendant_name(doc)
    residence = extract_defendant_residence(doc)
    occupation = extract_defendant_occupation(doc)
    return {
        "defendant_surname": surname,
        "defendant_forenames": forenames,
        "defendant_residence": residence,
        "defendant_occupation": occupation,
    }