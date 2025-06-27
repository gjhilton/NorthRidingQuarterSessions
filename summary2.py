import re
import spacy
from transformers import pipeline
from typing import List

# Load spaCy's English model for tokenization and basic NLP tasks
nlp_spacy = spacy.load("en_core_web_sm")

# Load Hugging Face's transformers pipeline for NER (use BERT-based model)
nlp_hf = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

# Define the Person and Case classes to store structured data
class Person:
    def __init__(self, surname: str, forenames: str, residence: str, occupation: str, gender: str):
        self.surname = surname
        self.forenames = forenames
        self.residence = residence
        self.occupation = occupation
        self.gender = gender
    
    def __repr__(self):
        return f"Person(surname={self.surname}, forenames={self.forenames}, residence={self.residence}, occupation={self.occupation}, gender={self.gender})"

class Case:
    def __init__(self, date: str, offence: str, offence_location: str, court: str, defendants: List[Person]):
        self.date = date
        self.offence = offence
        self.offence_location = offence_location
        self.court = court
        self.defendants = defendants
    
    def __repr__(self):
        return f"Case(date={self.date}, offence={self.offence}, offence_location={self.offence_location}, court={self.court}, defendants={self.defendants})"

# Preprocess the text: cleaning and tokenization
def preprocess_text(text):
    """
    Clean and preprocess the input text.
    - Strip leading/trailing whitespace
    - Normalize spaces and punctuation
    """
    # Remove extra spaces and normalize punctuation
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'([.,!?;])', r' \1', text)  # Add space before punctuation

    # Tokenize and remove stop words if needed (using spaCy for this)
    doc = nlp_spacy(text)
    cleaned_text = ' '.join([token.text for token in doc if not token.is_stop])
    
    return cleaned_text

# Extract entities using spaCy and Hugging Face transformers NER
def extract_entities(text):
    """
    Use spaCy for tokenization and Hugging Face transformers for NER.
    """
    entities = {
        "persons": [],
        "dates": [],
        "locations": [],
        "offence": "",
    }

    # Use Hugging Face's transformer pipeline for NER
    ner_results = nlp_hf(text)

    # Process Hugging Face NER results
    for entity in ner_results:
        label = entity['entity']
        word = entity['word']
        if label == 'B-PER':
            entities["persons"].append(word)  # Add to persons list
        elif label == 'B-DATE':
            entities["dates"].append(word)  # Add to dates list
        elif label == 'B-LOC':
            entities["locations"].append(word)  # Add to locations list

    # Manually define a basic pattern for the offence (for simplicity)
    offence_pattern = r"for ([a-zA-Z\s]+(?:\w+))"
    match = re.search(offence_pattern, text)
    if match:
        entities["offence"] = match.group(1)

    return entities

# Map extracted entities to structured data (Case and Person)
def map_to_case_structure(entities):
    """
    Take extracted entities and map them to a Case and Person structure.
    """
    # Extract date, location, and offence
    case_date = entities["dates"][0] if entities["dates"] else "Unknown Date"
    offence = entities["offence"]
    offence_location = entities["locations"][0] if entities["locations"] else "Unknown Location"
    court = "Whitby"  # Assume a default court for simplicity, this can be expanded

    # Extract defendant information
    defendants = []
    for person in entities["persons"]:
        # Simple extraction logic to split names into forenames and surname
        name_parts = person.split()
        surname = name_parts[-1]
        forenames = " ".join(name_parts[:-1])
        residence = "Unknown"  # This could be extracted or refined
        occupation = "Unknown"  # This could be extracted or refined
        gender = "Unknown"  # Gender could be inferred or passed manually

        defendants.append(Person(surname, forenames, residence, occupation, gender))

    # Create the Case object
    return Case(date=case_date, offence=offence, offence_location=offence_location, court=court, defendants=defendants)

# End-to-end extraction test: from raw text to structured data
def test_case_extraction(input_text):
    """
    Perform end-to-end extraction: preprocess, extract entities, and map to structured data.
    """
    # Step 1: Preprocess the input text
    cleaned_text = preprocess_text(input_text)

    # Step 2: Extract entities using spaCy + Hugging Face
    entities = extract_entities(cleaned_text)

    # Step 3: Map to structured data (Case and Person)
    case_structure = map_to_case_structure(entities)

    # Output the result
    return case_structure

# Sample test data (from your example)
input_text = "Summary conviction of William Tooley of Liverton Mines miner for trespassing in the daytime in search of conies on a piece of land in the possession and occupation of Sir Charles Mark Palmer. Offence committed at the township of Roxby on 26 September 1888. Whitby Strand Petty Sessional division - case heard at Whitby."

# Test the extraction function
result = test_case_extraction(input_text)

# Print the result (structured Case object)
print(result)