import os
import json
from typing import Optional, List
from pydantic import BaseModel, Field, ValidationError
from openai import OpenAI

# === Configuration ===
openai_api_key = os.getenv("OPENAI_KEY")
client = OpenAI(api_key=openai_api_key)

INPUT_DIR = "./data/summary_convictions"
OUTPUT_DIR = "./data/structured"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# === Pydantic Models ===
class Defendant(BaseModel):
    first_name: str
    last_name: str
    occupation: Optional[str] = None
    other_details: Optional[str] = None
    prior_convictions: Optional[str] = None
    town: Optional[str] = None
    street: Optional[str] = None
    aliases: Optional[List[str]] = None
    sex: Optional[str] = None

class InvolvedPerson(BaseModel):
    first_name: str
    last_name: str
    occupation: Optional[str] = None
    other_details: Optional[str] = None
    role: Optional[str] = None
    town: Optional[str] = None
    street: Optional[str] = None

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
    involved_persons: Optional[List[InvolvedPerson]] = Field(default_factory=list)
    offence_type: Optional[str] = None
    offence_town: Optional[str] = None
    offence_street: Optional[str] = None
    court: Court

# Build function schema for function-calling
function_schema = {
    "name": "extract_record",
    "description": "Extract structured court record data",
    "parameters": RecordSchema.model_json_schema(),
}

SYSTEM_PROMPT = (
    "You are an assistant that extracts court record data. "
    "Return exactly one structured JSON matching the schema. "
    "Always include 'involved_persons' (empty list if none)."
)

MODEL_FALLBACKS = ["gpt-3.5-turbo", "gpt-4"]

def extract_structured(content: str):
    for model in MODEL_FALLBACKS:
        try:
            resp = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": content},
                ],
                functions=[function_schema],
                function_call="auto"
            )
            fn_call = resp.choices[0].message.function_call
            args = json.loads(fn_call.arguments)
            return args
        except Exception as e:
            print(f"[{model}] call failed: {e}; trying next model...")
    raise RuntimeError("All models failed to extract structured output")

def write_json(path: str, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def process_file(filename: str) -> bool:
    base = filename.rsplit(".", 1)[0]
    in_path = os.path.join(INPUT_DIR, filename)
    success_path = os.path.join(OUTPUT_DIR, f"{base}.json")
    failed_path = os.path.join(OUTPUT_DIR, f"{base}__FAILED.json")

    if os.path.exists(success_path) or os.path.exists(failed_path):
        print(f"Skipping {filename}, already processed.")
        return True

    content = open(in_path, encoding="utf-8").read()
    print(f"Processing {filename}...")

    try:
        args = extract_structured(content)
        record = RecordSchema.model_validate(args)
        write_json(success_path, record.model_dump())
        print(f"Success: {filename}")
        return True
    except (ValidationError, RuntimeError) as e:
        print(f"Failed {filename}: {e}")
        write_json(failed_path, {"error": str(e), "content": content})
        return False

def process_all(max_files: Optional[int] = None):
    files = [f for f in sorted(os.listdir(INPUT_DIR)) if f.endswith(".txt")]
    total = len(files)
    processed = success = failed = 0

    for idx, fname in enumerate(files, start=1):
        if max_files and processed >= max_files:
            break
        print(f"[{idx}/{total}] {fname}")
        if process_file(fname):
            success += 1
        else:
            failed += 1
        processed += 1
        print(f"Progress: {processed}/{total}, Success: {success}, Failed: {failed}\n")

    print(f"Done. {success} passed, {failed} failed, out of {processed}.")

if __name__ == "__main__":
    process_all(max_files=160)
