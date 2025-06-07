import re
import datetime
import gender_guesser.detector as gender

def extract_case_details(text):
    d = gender.Detector()

    # Extract offenders (multiple offenders can exist, separated by commas)
    offender_pattern = r"Summary conviction of ([\w\s,]+) (?:of|from) the township of ([\w\s]+) ([\w\s]+)"
    offenders_matches = re.findall(offender_pattern, text)
    
    offenders = []
    for offender in offenders_matches:
        # Split multiple offenders by commas if needed
        names, residence, profession = offender
        name_list = names.split(",")
        
        for name in name_list:
            name_parts = name.strip().split()
            first_name = name_parts[0]
            gender_inferred = d.get_gender(first_name)
            gender_value = "Male" if gender_inferred == "male" else "Female" if gender_inferred == "female" else "Unknown"

            offenders.append({
                "name": name.strip(),
                "profession": profession.strip(),
                "residence": residence.strip(),
                "gender": gender_value
            })
    
    # Extract offense
    offense_pattern = r"for (.*?)\. Offence"
    offense_match = re.search(offense_pattern, text)
    offense = offense_match.group(1) if offense_match else None
    
    # Extract date of offense
    date_pattern = r"on (\d{1,2} \w+ \d{4})"
    date_match = re.search(date_pattern, text)
    date = datetime.datetime.strptime(date_match.group(1), "%d %B %Y").date() if date_match else None
    
    # Extract location
    location_pattern = r"at the township of ([\w\s]+)"
    location_match = re.search(location_pattern, text)
    location = location_match.group(1) if location_match else None
    
    # Extract case details
    case_details_pattern = r"case heard at ([\w\s]+)\."
    case_details_match = re.search(case_details_pattern, text)
    case_details = case_details_match.group(1) if case_details_match else None
    
    # Extract involved people (witnesses, victims)
    involved_people = []
    involved_people_pattern = r"on the oath of (.*?)\. Offence"
    involved_people_match = re.findall(involved_people_pattern, text)
    for involved in involved_people_match:
        involved_name_parts = involved.split(" ")
        involved_first_name = involved_name_parts[0]
        involved_gender = d.get_gender(involved_first_name)
        gender_value = "Male" if involved_gender == "male" else "Female" if involved_gender == "female" else "Unknown"
        
        involved_people.append({
            "name": involved.strip(),
            "profession": None,  # This can be updated based on further logic if profession extraction is necessary
            "residence": None,   # This can also be updated if needed
            "gender": gender_value
        })
    
    # Final case structure
    case = {
        "offenders": offenders,
        "offense": offense,
        "date": date,
        "location": location,
        "case_details": case_details,
        "involved_people": involved_people
    }
    
    return case
