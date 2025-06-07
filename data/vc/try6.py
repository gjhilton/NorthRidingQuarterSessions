import spacy
import re
from datetime import datetime
import gender_guesser.detector as gender

# Load the pre-trained spaCy model
nlp = spacy.load("en_core_web_sm")

# Initialize the gender detector
d = gender.Detector()

# Function to extract structured information from the text
def extract_case_details(text):
    # Process the text with spaCy NLP pipeline
    doc = nlp(text)
    
    # Initialize the structured case details dictionary
    case_details = {
        "offender_name": [],
        "offender_profession": [],
        "offender_residence": [],
        "offender_gender": [],
        "offense": None,
        "date": None,
        "location": None,
        "case_details": None,
        "involved_people": []
    }
    
    # Extract named entities (people, dates, locations)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            # Append offender name (handling multiple offenders)
            case_details["offender_name"].append(ent.text)
        elif ent.label_ == "GPE" or ent.label_ == "LOC":
            # Identifying location names (townships, villages, etc.)
            if case_details["location"] is None:
                case_details["location"] = ent.text
        elif ent.label_ == "DATE":
            # Identifying the date of the offense
            if case_details["date"] is None:
                try:
                    case_details["date"] = datetime.strptime(ent.text, "%d %B %Y").date()
                except ValueError:
                    # Fallback if date parsing fails
                    pass
    
    # Extract professions dynamically from noun chunks and dependency parsing
    for token in doc:
        # If the token is linked to the subject and describes a profession
        if token.dep_ in ['attr', 'prep', 'pobj'] and token.pos_ == 'NOUN' and (token.head.pos_ == 'VERB' or token.head.dep_ == 'prep'):
            if token.text.lower() not in case_details["offender_profession"]:
                case_details["offender_profession"].append(token.text.lower())
    
    # Extract the offense based on verb-object relationships
    offense_found = []
    for sent in doc.sents:
        # Look for verb actions that likely describe an offense
        for token in sent:
            if token.dep_ in ['dobj', 'attr'] and token.pos_ == 'NOUN':
                offense_found.append(token.text)
        
        # If we find a plausible offense description, set it
        if offense_found:
            case_details["offense"] = " ".join(offense_found)
            break

    # Identify the location where the case was heard
    court_patterns = [
        r"case heard at (.*?)\.",
        r"case heard at (.*)"
    ]
    
    for pattern in court_patterns:
        match = re.search(pattern, text)
        if match:
            case_details["case_details"] = match.group(1).strip()
            break
    
    # Extract the place of residence for each offender
    for i, offender in enumerate(case_details["offender_name"]):
        # Look for the location of residence near the offender's name
        residence_found = None
        for token in doc:
            if token.text.lower() == offender.lower() and token.i + 1 < len(doc):
                # Check for the "of" or "from" relationship indicating residence
                next_token = doc[token.i + 1]
                if next_token.dep_ in ['prep', 'pobj'] and next_token.pos_ == 'ADP':
                    # Look for a location following "of" or "from"
                    for j in range(token.i + 2, len(doc)):
                        if doc[j].dep_ in ['pobj', 'GPE'] and doc[j].pos_ == 'PROPN':
                            residence_found = doc[j].text
                            break
            if residence_found:
                break
        
        case_details["offender_residence"].append(residence_found)
    
    # Infer gender for each offender using their first name
    for offender in case_details["offender_name"]:
        # Extract the first name (assuming it's the first part of the full name)
        first_name = offender.split()[0]
        gender_inferred = d.get_gender(first_name)
        
        # Map gender inference to a more readable form (Male, Female, Unknown)
        if gender_inferred == 'male':
            case_details["offender_gender"].append("Male")
        elif gender_inferred == 'female':
            case_details["offender_gender"].append("Female")
        else:
            case_details["offender_gender"].append("Unknown")
    
    # Now extract the involved people (witnesses, victims)
    involved_people = []
    for ent in doc.ents:
        if ent.label_ == "PERSON" and ent.text not in case_details["offender_name"]:
            # This is an involved person, not an offender
            involved_person = {
                "name": ent.text,
                "profession": None,
                "residence": None,
                "gender": None
            }

            # Try to infer the profession for involved people (similar to offenders)
            for token in doc:
                if token.dep_ in ['attr', 'prep', 'pobj'] and token.pos_ == 'NOUN' and (token.head.pos_ == 'VERB' or token.head.dep_ == 'prep'):
                    if token.text.lower() not in involved_person["profession"]:
                        involved_person["profession"] = token.text.lower()

            # Try to find the residence for involved people (similar to offenders)
            residence_found = None
            for token in doc:
                if token.text.lower() == ent.text.lower() and token.i + 1 < len(doc):
                    # Check for the "of" or "from" relationship indicating residence
                    next_token = doc[token.i + 1]
                    if next_token.dep_ in ['prep', 'pobj'] and next_token.pos_ == 'ADP':
                        # Look for a location following "of" or "from"
                        for j in range(token.i + 2, len(doc)):
                            if doc[j].dep_ in ['pobj', 'GPE'] and doc[j].pos_ == 'PROPN':
                                residence_found = doc[j].text
                                break
                if residence_found:
                    break
            
            involved_person["residence"] = residence_found

            # Infer gender for involved people (same as offenders)
            first_name = ent.text.split()[0]
            gender_inferred = d.get_gender(first_name)
            
            if gender_inferred == 'male':
                involved_person["gender"] = "Male"
            elif gender_inferred == 'female':
                involved_person["gender"] = "Female"
            else:
                involved_person["gender"] = "Unknown"

            involved_people.append(involved_person)
    
    case_details["involved_people"] = involved_people

    return case_details


# Example usage
examples = [
    "Summary conviction of William Ward of the township of Whitby fruiterer for maliciously damaging three heaps of pears, the property of George Frank; on the oath of James Beattie labourer and H.M. Frank wife of George Frank gardener, both of the township of Hawsker cum Stainsacre, and Robert Carr of the township of Whitby baker. Offence committed at the township of Whitby on 3 October 1874. Whitby Strand - case heard at Whitby."
]

# List to hold extracted case data
cases_data = []

# Process each example and extract case details
for example in examples:
    case = extract_case_details(example)
    
    # Handle multiple offenders in the case
    num_offenders = len(case["offender_name"])
    for i in range(num_offenders):
        case_row = {
            "offender_name": case["offender_name"][i],
            "offender_profession": case["offender_profession"][i] if i < len(case["offender_profession"]) else None,
            "offender_residence": case["offender_residence"][i] if i < len(case["offender_residence"]) else None,
            "offender_gender": case["offender_gender"][i] if i < len(case["offender_gender"]) else None,
            "offense": case["offense"],
            "date": case["date"],
            "location": case["location"],
            "case_details": case["case_details"],
            "involved_people": case["involved_people"]
        }
        cases_data.append(case_row)

# Return the cases data as a list of dictionaries
for case in cases_data:
    print(case)
