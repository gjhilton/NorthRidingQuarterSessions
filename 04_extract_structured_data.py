import os
import json
import openai
from typing import Optional, List
from pydantic import BaseModel, ValidationError

# === Configuration ===
openai.api_key = os.getenv("OPENAI_API_KEY")
INPUT_DIR = "./data/summary_convictions"
OUTPUT_DIR = "./data/structured"
os.makedirs(OUTPUT_DIR, exist_ok=True)

SYSTEM_PROMPT = """
You will be given a historical court record. Extract structured data from it in JSON format using the following keys:

- reference_number
- conviction_date
- offence_date
- offence_day_of_week
- offence_day_of_month
- offence_year
- offence_time
- charge_description
- sentencing
- raw_record
- archive_url
- defendants: list of { first_name, last_name, occupation, relationships_and_details, prior_convictions, town, street, aliases }
- involved_persons: list of { first_name, last_name, occupation, relationships_and_details, role, town, street }
- offence: { type, location_town, location_street }
- court: { location_town }

Return only the JSON.
"""

class Defendant(BaseModel):
    first_name: str
    last_name: str
    occupation: Optional[str] = None
    relationships_and_details: Optional[str] = None
    prior_convictions: Optional[str] = None
    town: Optional[str] = None
    street: Optional[str] = None
    aliases: Optional[List[str]] = None

class InvolvedPerson(BaseModel):
    first_name: str
    last_name: str
    occupation: Optional[str] = None
    relationships_and_details: Optional[str] = None
    role: Optional[str] = None
    town: Optional[str] = None
    street: Optional[str] = None

class Offence(BaseModel):
    type: str
    location_town: Optional[str] = None
    location_street: Optional[str] = None

class Court(BaseModel):
    location_town: str

class RecordSchema(BaseModel):
    reference_number: str
    conviction_date: str
    offence_date: Optional[str] = None
    offence_day_of_week: Optional[str] = None
    offence_day_of_month: Optional[int] = None
    offence_year: Optional[int] = None
    offence_time: Optional[str] = None
    charge_description: str
    sentencing: Optional[str] = None
    raw_record: str
    archive_url: str
    defendants: List[Defendant]
    involved_persons: List[InvolvedPerson]
    offence: Optional[Offence] = None
    court: Court

def call_openai_model(content: str, model: str) -> Optional[str]:
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT.strip()},
                {"role": "user", "content": content}
            ],
            temperature=0,
        )
        return response.choices[0].message["content"]
    except Exception as e:
        print(f"OpenAI API error ({model}): {e}")
        return None

def write_json(filepath: str, data):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def process_single_file(filename: str) -> bool:
    """
    Process a single input file (filename is relative to INPUT_DIR).
    Saves output JSON or failed JSON in OUTPUT_DIR.
    Returns True on success, False on failure.
    """
    input_path = os.path.join(INPUT_DIR, filename)
    base_name = filename.rsplit(".", 1)[0]

    success_path = os.path.join(OUTPUT_DIR, f"{base_name}.json")
    failed_path = os.path.join(OUTPUT_DIR, f"{base_name}__FAILED.json")

    # Skip if output already exists
    if os.path.exists(success_path) or os.path.exists(failed_path):
        print(f"Skipping {filename}, output already exists.")
        return True

    with open(input_path, "r", encoding="utf-8") as f:
        content = f.read()

    print(f"Processing {filename} with GPT-3.5...")
    result = call_openai_model(content, "gpt-3.5-turbo")

    if not result:
        print("↪️ GPT-3.5 failed, retrying with GPT-4...")
        result = call_openai_model(content, "gpt-4-turbo")

    if not result:
        print(f"❌ Both GPT-3.5 and GPT-4 calls failed for {filename}")
        write_json(failed_path, {"error": "API failure", "raw_output": ""})
        return False

    try:
        parsed = json.loads(result)
        validated = RecordSchema(**parsed)
        write_json(success_path, validated.dict())
        print(f"✅ Successfully processed {filename}")
        return True
    except (json.JSONDecodeError, ValidationError) as e:
        print(f"❌ Validation error for {filename}: {e}")
        write_json(failed_path, {"error": "Validation error", "raw_output": result})
        return False

def process_all_files():
    input_files = sorted(f for f in os.listdir(INPUT_DIR) if f.endswith(".txt"))
    total = len(input_files)
    processed = success = failed = 0

    for idx, filename in enumerate(input_files, start=1):
        print(f"[{idx}/{total}] Processing {filename}")
        result = process_single_file(filename)
        processed += 1
        if result:
            success += 1
        else:
            failed += 1
        print(f"Progress: {processed}/{total} | Success: {success} | Failed: {failed}\n")

    print(f"Finished processing. Success: {success}, Failed: {failed}, Total: {processed}")

if __name__ == "__main__":
    # Example usage: process all files
    # process_all_files()

    # Or for quick testing, uncomment and use:
    process_single_file("QSB_1864_4-10-16-1.txt")
