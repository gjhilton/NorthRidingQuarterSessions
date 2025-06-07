import spacy
import re
import pandas as pd
from datetime import datetime

# Load the pre-trained spaCy model
nlp = spacy.load("en_core_web_sm")

# Function to extract structured information from the text
def extract_case_details(text):
    # Process the text with spaCy NLP pipeline
    doc = nlp(text)
    
    # Initialize the structured case details dictionary
    case_details = {
        "offender_name": [],
        "offender_profession": [],
        "offense": None,
        "date": None,
        "location": None,
        "case_details": None
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

    # Extract professions dynamically from dependency parsing
    for token in doc:
        # We try to detect occupation related nouns based on the relationship between person and occupation
        if token.dep_ in ['attr', 'prep', 'pobj'] and token.pos_ == 'NOUN' and (token.head.pos_ == 'VERB' or token.head.dep_ == 'prep'):
            if token.text.lower() not in case_details["offender_profession"]:
                case_details["offender_profession"].append(token.text.lower())
    
    # Extract the offense based on syntactic parsing (looking for verbs indicating the offense)
    offense_keywords = [
        "for", "committed", "assaulting", "theft", "malicious damage", "being drunk", "gambling", "abusive language", "trespassing"
    ]
    
    offense_found = []
    for i, token in enumerate(doc):
        if token.text.lower() in offense_keywords:
            # Extract the full offense description starting from the keyword
            offense = ' '.join([t.text for t in doc[i:]])
            case_details["offense"] = offense
            break

    # Identify court details (e.g., case hearing location)
    court_patterns = [
        r"case heard at (.*?)\.",
        r"case heard at (.*)"
    ]
    
    for pattern in court_patterns:
        match = re.search(pattern, text)
        if match:
            case_details["case_details"] = match.group(1).strip()
            break

    return case_details


# Function to pretty print the dataframe
def pretty_print(df):
    print(df.to_string(index=False))


# Example usage
examples = [
    "Summary conviction of Sarah Jane Williams of the township of Whitby seamstress for theft of a coat from the local shop. Offence committed at the township of Whitby on 5 March 1893. Whitby Strand Petty Sessional division - case heard at Whitby.",
    "Summary conviction of Thomas Brown of the village of Pickering, blacksmith, for assaulting a police officer on duty. Offence committed at the village of Pickering on 7 November 1905. Pickering Strand Petty Sessional division - case heard at Pickering.",
    "Summary conviction of Mary Elizabeth Adams of Whitby housewife for gambling in a public place. Offence committed at the township of Whitby on 12 July 1880. Whitby Strand Petty Sessional division - case heard at Whitby.",
    "Summary conviction of William Nicholson ostler, Jonathan Marsay waggoner and Mark Squires postboy, all of the township of Whitby, and William Norton of the township of Hawsker cum Stainsacre labourer, for trespassing in the daytime in pursuit of game by day on a close of land in the possession and occupation of Peter George Coble. Offence committed at the township of Sneaton on 30 August 1868. Whitby Strand - case heard at Whitby."
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
            "offense": case["offense"],
            "date": case["date"],
            "location": case["location"],
            "case_details": case["case_details"]
        }
        cases_data.append(case_row)

# Create a Pandas DataFrame from the list of cases data
df = pd.DataFrame(cases_data)

# Pretty print the dataframe
pretty_print(df)
