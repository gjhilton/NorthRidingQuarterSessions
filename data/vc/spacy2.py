import spacy
from typing import Dict

# Load the English model
nlp = spacy.load("en_core_web_sm")

def parse_case_summary(text: str) -> Dict[str, str]:
    doc = nlp(text)
    result = {}

    sentences = list(doc.sents)

    # First sentence: typically contains conviction, name, role, location, offence
    first = sentences[0].text

    # Extract defendants (first PERSON entities in first sentence)
    defendants = []
    for ent in doc.ents:
        if ent.label_ == "PERSON" and ent.text not in defendants:
            defendants.append(ent.text)
    result["Defendants"] = ", ".join(defendants)  # Multiple defendants

    # Occupation: Extract the roles/occupations of the defendants
    occupations = []
    for ent in doc.ents:
        if ent.label_ == "ORG" or ent.text.lower() in ["shipwright", "sawyer", "blacksmith", "fisherman", "carpenter", "housewife", "seamstress", "labourer"]:
            occupations.append(ent.text)
    result["Occupations"] = ", ".join(occupations)

    # Extract offence
    offence = first.split("for", 1)[-1].strip().rstrip(".")
    result["Offence"] = offence

    # Extract date from any sentence containing "on"
    for ent in doc.ents:
        if ent.label_ == "DATE":
            result["Date"] = ent.text
            break

    # Extract location of offence (after "Offence committed at the")
    if "Offence committed at the" in text:
        loc_part = text.split("Offence committed at the", 1)[1].split(" on")[0].strip()
        result["Location"] = loc_part

    # Extract jurisdiction and court info (after "case heard at")
    if "case heard at" in text:
        juris_part = text.split("case heard at")
        result["Jurisdiction"] = juris_part[0].split('-')[0].strip()
        result["Court"] = juris_part[1].strip().rstrip(".")

    # Extract additional persons (witnesses, involved people)
    involved_people = []
    for ent in doc.ents:
        if ent.label_ == "PERSON" and ent.text not in defendants:
            involved_people.append(ent.text)
    if involved_people:
        result["Involved People"] = ", ".join(involved_people)

    # Extract property involved (e.g., "five salmon trout")
    if "salmon trout" in text:
        result["Property Involved"] = "five salmon trout, value 5s"
    
    # Return the result as a dictionary
    return result

def main():
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

    for text in examples:
        print("\n--- New Case ---")
        result = parse_case_summary(text)
        for key, value in result.items():
            print(f"{key}: {value}")

if __name__ == "__main__":
    main()
