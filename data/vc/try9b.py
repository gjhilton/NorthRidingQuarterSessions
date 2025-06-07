import spacy
import datetime
import gender_guesser.detector as gender
from dateutil import parser
import re

# Load the SpaCy model
nlp = spacy.load("en_core_web_trf")

# Gender guesser
d = gender.Detector()

def infer_gender(first_name):
    """
    Infer the gender of the person based on their first name.
    Returns 'Male', 'Female', or 'Unknown' if not determinable.
    """
    gender_inferred = d.get_gender(first_name)
    if gender_inferred == "male":
        return "Male"
    elif gender_inferred == "female":
        return "Female"
    else:
        return "Unknown"  # Return 'Unknown' for unisex or ambiguous names

def extract_profession_and_residence(text, person_name):
    """
    Extract profession and residence of the person.
    Returns the profession and residence as a tuple.
    """
    profession, residence = None, None
    doc = nlp(text)
    
    # Search for profession and residence based on dependency parsing
    for ent in doc.ents:
        if ent.text == person_name:
            for token in ent.subtree:
                if token.dep_ == "attr" and token.pos_ == "NOUN":  # profession likely
                    profession = token.text
                if token.dep_ == "prep" and token.text.lower() == "of":  # residence likely
                    residence = ' '.join([child.text for child in token.subtree if child.dep_ == "pobj"])
    return profession, residence

def extract_case_details(text):
    doc = nlp(text)
    
    # Initialize data structure
    case = {
        "offenders": [],
        "offense": None,
        "date": None,
        "location": None,
        "case_details": None,
        "involved_people": []
    }

    # Identify named entities and extract professions, residences
    offenders = []
    involved_people = []

    # 1. Extract Offenders and Involved People
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            first_name = name.split()[0]
            gender_inferred = infer_gender(first_name)
            profession, residence = extract_profession_and_residence(text, name)
            
            # Classify as offender or involved person based on context
            if "of the township" in text or "of the village" in text:
                offenders.append({
                    "name": name,
                    "profession": profession,
                    "residence": residence,
                    "gender": gender_inferred
                })
            else:
                involved_people.append({
                    "name": name,
                    "profession": profession,
                    "residence": residence,
                    "gender": gender_inferred
                })

    case["offenders"] = offenders
    case["involved_people"] = involved_people

    # 2. Extract offense (Look for verb phrases after 'for')
    offense_phrase = None
    for sent in doc.sents:
        if "for" in sent.text.lower():
            offense_phrase = sent.text.split("for")[1].strip()
            break
    case["offense"] = offense_phrase

    # 3. Extract date of offense (Handle multiple date formats)
    try:
        date_entities = [ent for ent in doc.ents if ent.label_ == "DATE"]
        if date_entities:
            # Improved date parsing to handle edge cases (e.g., "on the 5th of March 1893")
            case["date"] = parser.parse(date_entities[0].text, fuzzy=True).date()
    except Exception as e:
        case["date"] = None  # In case of date parsing failure

    # 4. Extract location (Places where offenses happened)
    location_entities = [ent for ent in doc.ents if ent.label_ == "GPE"]
    if location_entities:
        case["location"] = location_entities[0].text

    # 5. Extract case details (location where case is heard)
    case_details = None
    for sent in doc.sents:
        if "case heard" in sent.text.lower():
            case_details = sent.text.split("case heard at")[-1].strip()
            break
    case["case_details"] = case_details

    return case

# Example Texts for Testing
examples = [
    "Summary conviction of Sarah Jane Williams of the township of Whitby seamstress for theft of a coat from the local shop. Offence committed at the township of Whitby on 5 March 1893. Whitby Strand Petty Sessional division - case heard at Whitby.",
    "Summary conviction of Thomas Brown of the village of Pickering, blacksmith, for assaulting a police officer on duty. Offence committed at the village of Pickering on 7 November 1905. Pickering Strand Petty Sessional division - case heard at Pickering.",
    "Summary conviction of Mary Elizabeth Adams of Whitby housewife for gambling in a public place. Offence committed at the township of Whitby on 12 July 1880. Whitby Strand Petty Sessional division - case heard at Whitby.",
    "Summary conviction of Richard Morris of Scarborough carpenter for malicious damage to public property. Offence committed at Scarborough on 30 June 1901. Scarborough Strand Petty Sessional division - case heard at Scarborough.",
    "Summary conviction of Emily Grace Bell of the township of Guisborough teacher for using abusive language in a public space. Offence committed at Guisborough on 18 October 1899.",
    "Summary conviction of Alice Moors for lodging in a stackyard with no visible means of subsistence and not giving a good account of herself. Offence committed at the township of Newholm cum Dunsley on 17 July 1870. Whitby Strand - case heard at Whitby.",
    "Summary conviction of Andrew Hill of the township of Whitby jet worker for being drunk on the licensed premises of Joseph Garside Rhodes and refusing to leave when asked by John Alderson Wallace a police constable. Offence committed at the township of Whitby on 30 October 1876. Whitby Strand - case heard at Whitby.",
    "Summary conviction of William Ward of the township of Whitby fruiterer for maliciously damaging three heaps of pears, the property of George Frank; on the oath of James Beattie labourer and H.M. Frank wife of George Frank gardener, both of the township of Hawsker cum Stainsacre, and Robert Carr of the township of Whitby baker. Offence committed at the township of Whitby on 3 October 1874. Whitby Strand - case heard at Whitby.",
    "Summary conviction of William Smith of the township of Whitby labourer for being drunk in Victoria Square; on the oath of George Hewison police constable and John Ryder superintendent of police, both of the township of Whitby. Offence committed at the township of Ruswarp on 13 August 1874. Whitby Strand - case heard at Whitby.",
    "Summary conviction of William Richardson of the township of Whitby fisherman for being drunk and disorderly on Tate Hill. Offence committed at the township of Whitby on 6 September 1873. Whitby Strand - case heard at Whitby.",
    "Summary conviction of William Pinkney Whitby shipwright and John Young sawyer, both of Whitby, for taking other than by angling five salmon trout value 5s, from the river Esk where John Elgie of the township of Ruswarp miller had a private right of fishing. Offence committed at the township of Sneaton on 10 August 1839. Case heard at Whitby."
]

# Process each example and print the extracted details
for example in examples:
    case_details = extract_case_details(example)
    print(case_details)
