import spacy
import gender_guesser.detector as gender
from collections import defaultdict

nlp = spacy.load("en_core_web_sm")
gender_detector = gender.Detector()

def process_conviction(row):
    return row
    #result=extract_case_details(row['description'])
    #return(result)

def extract_case_details(text):
    case_data = defaultdict(list)
    doc = nlp(text)

    offenders = []
    offenders_section = doc.ents

    for ent in offenders_section:
        # We check if the entity might be a person
        if ent.label_ == "PERSON":
            name = ent.text.strip()
            profession = None
            residence = None
            gender = gender_detector.get_gender(name.split()[0])
            
            # Attempt to detect profession and residence
            for token in doc:
                if token.dep_ == "pobj" and 'township' in token.text:
                    residence = token.text

            # Add offender
            offenders.append({
                "name": name,
                "profession": profession if profession else "Unknown",
                "residence": residence if residence else "Unknown",
                "gender": gender if gender != "unknown" else "Unknown"
            })
    
    # Process offense
    offense_section = None
    for sent in doc.sents:
        if "for" in sent.text.lower():
            offense_section = sent.text
            break
    
    case_data['offense'] = offense_section if offense_section else "Unknown offense"

    # Process date and location (assume dates and locations are mentioned explicitly)
    date_section = None
    location_section = None
    for sent in doc.sents:
        if "on" in sent.text.lower():
            date_section = sent.text
            break
    
    case_data['date'] = date_section if date_section else "Unknown date"
    
    location_section = [ent.text for ent in doc.ents if ent.label_ == "GPE"]
    case_data['location'] = location_section if location_section else "Unknown location"
    
    # Determine case details and involved people
    case_details = "Unknown"
    involved_people = []
    
    if "heard" in text.lower():
        case_details = text.split('heard')[-1].strip()
    
    # Extract involved people
    for sent in doc.sents:
        if "on the oath" in sent.text.lower():
            involved_people.append({
                "name": sent.text.split("on the oath of")[-1].strip(),
                "profession": "Unknown",
                "residence": "Unknown",
                "gender": "Unknown"
            })
    
    # Add the results to case_data
    case_data['involved_people'] = involved_people
    case_data['case_details'] = case_details
    
    case_data['offenders'] = offenders
    
    return case_data

test_cases = [
    "Summary conviction of William Weatherill of the township of Whitby jet worker for being drunk and riotous in Church StreetOffence committed at the township of Whitby on 28 December 1872Whitby Strand - case heard at Whitby",
    "Summary conviction of William Weatherill of the township of Whitby jet worker for assaulting Richard Thompson; on the oath of the said Richard Thompson of the township of Whitby innkeeperOffence committed at the township of Whitby on 2 October 1871Whitby Strand - case heard at Whitby",
    "Summary conviction of William Weatherill of the township of Whitby jet worker for assaulting Thomas WeatherillOffence committed at the township of Whitby on 24 July 1883Whitby Strand Petty Sessional division - case heard at Whitby",
    "Summary conviction of William Wear of the township of Whitby painter for being drunk and disorderly in Church StreetOffence committed at the township of Whitby on 30 March 1875 Whitby Strand - case heard at Whitby",
    "Summary conviction of William Watson of the township of Whitby labourer for being on the licensed premises of Robert Jefferson outside licensing hoursOffence committed at the township of Whitby on 12 April 1874Whitby Strand: case heard at Whitby",
    "Summary conviction of William Waters of the township of Whitby jet worker for being drunk and riotous in BaxtergateOffence committed at the township of Whitby on 16 March 1873Whitby Strand - case heard at Whitby",
    "Summary conviction of William Waters of the township of Whitby jet worker for being drunkOffence committed at the township of Whitby on 19 November 1867Case heard at Whitby",
    "Summary conviction of William Waters of the township of Whitby jet worker for being drunkOffence committed at the township of Whitby on 20 August 1866Case heard at Whitby",
    "Summary conviction of William Warters, apprentice to Thomas Harker of the township of Ruswarp shipowner, for absenting himself from the service of his master without leave or lawful excuseOffence committed on 9 July 1860Case heard at Whitby",
    "Summary conviction of William Ward of the township of Whitby fruiterer for assaulting James Beattie; on the oath of the said James Beattie labourer and H.M. Frank wife of George Frank gardener, both of the township of Hawsker cum Stainsacre, and Robert Carr of the township of Whitby bakerOffence committed at the township of Whitby on 3 October 1874Whitby Strand - case heard at Whitby",
]

# Testing the function on each case
#for case in test_cases:
 #   result = extract_case_details(case)
  #  print(result)
  #  print("\n" + "-"*50 + "\n")
