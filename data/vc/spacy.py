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

    # Extract defendant (first PERSON entity in first sentence)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            result["Defendant"] = ent.text
            break

    # Occupation: if not found, leave it blank or mark as "Unknown"
    if "Defendant" not in result:
        result["Defendant"] = "Unknown"

    # Extract offence (everything after "for" in the first sentence, handling cases where no "for" appears)
    if "for" in first:
        result["Offence"] = first.split("for", 1)[-1].strip().rstrip(".")
    else:
        result["Offence"] = first.split("at", 1)[-1].strip().rstrip(".")

    # Extract date from any sentence containing "on"
    for ent in doc.ents:
        if ent.label_ == "DATE":
            result["Date"] = ent.text
            break

    # Extract location of offence (after "Offence committed at the")
    if "Offence committed at the" in text:
        loc_part = text.split("Offence committed at the", 1)[1].split(" on")[0].strip()
        result["Location"] = loc_part

    # Extract jurisdiction and court info (after "Petty Sessional division - case heard at")
    if "case heard at" in text:
        juris_part = text.split("case heard at")
        result["Jurisdiction"] = juris_part[0].split('-')[0].strip()
        result["Court"] = juris_part[1].strip().rstrip(".")

    return result

def main():
    examples = [
        "Summary conviction of Sarah Jane Williams of the township of Whitby seamstress for theft of a coat from the local shop. Offence committed at the township of Whitby on 5 March 1893. Whitby Strand Petty Sessional division - case heard at Whitby.",
        "Summary conviction of Thomas Brown of the village of Pickering, blacksmith, for assaulting a police officer on duty. Offence committed at the village of Pickering on 7 November 1905. Pickering Strand Petty Sessional division - case heard at Pickering.",
        "Summary conviction of Mary Elizabeth Adams of Whitby housewife for gambling in a public place. Offence committed at the township of Whitby on 12 July 1880. Whitby Strand Petty Sessional division - case heard at Whitby.",
        "Summary conviction of Richard Morris of Scarborough carpenter for malicious damage to public property. Offence committed at Scarborough on 30 June 1901. Scarborough Strand Petty Sessional division - case heard at Scarborough.",
        "Summary conviction of Emily Grace Bell of the township of Guisborough teacher for using abusive language in a public space. Offence committed at Guisborough on 18 October 1899.",
        "Summary conviction of Alice Moors for lodging in a stackyard with no visible means of subsistence and not giving a good account of herself. Offence committed at the township of Newholm cum Dunsley on 17 July 1870. Whitby Strand - case heard at Whitby."
    ]

    for text in examples:
        print("\n--- New Case ---")
        result = parse_case_summary(text)
        for key, value in result.items():
            print(f"{key}: {value}")

if __name__ == "__main__":
    main()
