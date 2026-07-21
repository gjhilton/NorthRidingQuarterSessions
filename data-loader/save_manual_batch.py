"""Persist a manually-extracted batch (Claude reading raw_record text
directly in a session, no API call) from a JSON file, via
qsrecords.manual_batch.run_manual_batch.

Removes the last piece of ceremony the batch-script pattern still had: the
script previously had to live inside data-loader/ (for sys.path to resolve
`import qsrecords`) and got deleted after running, since it was pure scratch
with nothing worth keeping. A JSON data file has no such constraint -- it
can live in a scratchpad directory and just gets pointed at by --file.

JSON shape: an object mapping raw_case_id (string keys -- JSON has no
integer keys) to an ExtractedRecord-shaped object, e.g.:

    {
      "6180": {
        "reference_number": "QSB 1835 3/10/22",
        "offence_date_raw": "Tuesday 5 May 1835",
        "charge_description": "...",
        "offence_types": ["railway offence"],
        "offence_town": "Egton",
        "court_location_town": "Pickering",
        "defendants": [
          {"first_name": "Henry Swinton", "last_name": "Walker", "sex": "male",
           "occupation": "land steward", "town": "Aislaby"}
        ],
        "overall_confidence": "medium",
        "uncertain_fields": ["offence_types"]
      }
    }

Usage:
    python3 save_manual_batch.py <path-to-json> --batch-id manual-parse-... [--model NAME]
"""

import argparse
import sys

from qsrecords.manual_batch import DEFAULT_MODEL, load_records_from_json, run_manual_batch


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("file", help="Path to the JSON batch file.")
    parser.add_argument("--batch-id", required=True, help="Tag for the extraction_attempt audit rows.")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    args = parser.parse_args()

    records = load_records_from_json(args.file)
    if not records:
        print("No records in file -- nothing to do.")
        return

    count = run_manual_batch(records, batch_id=args.batch_id, model=args.model)
    print(f"Persisted {count} records (batch_id={args.batch_id!r}).")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
