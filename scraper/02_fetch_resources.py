import json
import pandas as pd
import requests
from bs4 import BeautifulSoup
import re
import time
from pathlib import Path

pd.set_option("display.max_columns", None)

# Resolved relative to this file, not the CWD -- see 01_list_resources.py
# and data-loader/qsrecords/config.py for the same fix. Anchored to data/
# (not the repo root) since that's where whitby.json actually lives and
# where data-loader's default --csv-path expects whitby.csv.
_REPO_ROOT = Path(__file__).resolve().parent.parent
_DATA_DIR = _REPO_ROOT / "data"

def clean_html_ids(html_string):
    def id_replacer(match):
        return f'id="{match.group(1).replace(" ", "")}"'
    cleaned_html = re.sub(r'id\s*=\s*["\'](.*?)["\']', id_replacer, html_string)
    return re.sub(r'&#x0?[dD];|&#0?13;|&#0?[aA];|&#0?10;', '', cleaned_html)

# Every failed request used to be silently dropped (fetch_webpage caught
# the exception, returned None, and process_json_to_dataframe's `if
# response and response.ok:` just skipped that record with no trace of
# which one or why) -- meaning two runs against the same archive state
# could produce different output depending on transient network reliability,
# with nothing recording that a gap had opened up. Retried with backoff
# and logged by record_id now instead.
_MAX_ATTEMPTS = 3
_RETRY_BACKOFF_SECONDS = 2

def fetch_webpage(url):
    last_error = None
    for attempt in range(1, _MAX_ATTEMPTS + 1):
        time.sleep(1)
        print(f'GET: {url}' + (f' (attempt {attempt}/{_MAX_ATTEMPTS})' if attempt > 1 else ''))
        try:
            return requests.get(url)
        except requests.exceptions.RequestException as e:
            last_error = e
            print(f"Error fetching {url}: {e}")
            if attempt < _MAX_ATTEMPTS:
                time.sleep(_RETRY_BACKOFF_SECONDS * attempt)
    print(f"GIVING UP on {url} after {_MAX_ATTEMPTS} attempts: {last_error}")
    return None

def load_json_file(filename):
    with open(filename, 'r') as f:
        return json.load(f)

def extract_field(soup, row_id):
    # get_text(separator=". ") instead of the bare .text property: the
    # source HTML separates clauses within a cell with <br /><br /> tags
    # (confirmed against live archive HTML), which .text silently drops to
    # zero width instead of inserting any separator -- the root cause of
    # the run-on-sentence bug documented in
    # data-loader/qsrecords/text.py::fix_run_on_spacing (that function
    # repairs already-scraped text; this is the fix for future scrapes).
    td_tag = soup.select_one(f'tr[id="{row_id}"] td.tablevalue')
    return td_tag.get_text(separator=". ").strip() if td_tag else None

def process_json_to_dataframe(json_file):
    data = load_json_file(json_file)
    records = []
    failures = []

    for record in data:
        link = record.get('link').lstrip('.')
        full_url = f"https://archivesunlocked.northyorks.gov.uk/CalmView{link}"
        response = fetch_webpage(full_url)

        if response and response.ok:
            html = clean_html_ids(response.text)
            soup = BeautifulSoup(html, 'html.parser')
            records.append({
                'record_id': record.get('record_id'),
                'title': extract_field(soup, 'Title'),
                'document_date': extract_field(soup, 'Date'),
                'description': extract_field(soup, 'Description'),
                'url': full_url,
            })
        else:
            status = response.status_code if response is not None else 'no response'
            failures.append({'record_id': record.get('record_id'), 'url': full_url, 'status': status})

    return pd.DataFrame(records), failures

if __name__ == "__main__":
    FILE_NAME = 'whitby'
    json_file = _DATA_DIR / (FILE_NAME + '.json')
    df, failures = process_json_to_dataframe(json_file)
    print(df)
    df.to_csv(_DATA_DIR / (FILE_NAME + '.csv'), index=False)

    if failures:
        print(f"\n{len(failures)} record(s) FAILED to fetch and are NOT in {FILE_NAME}.csv:")
        for f in failures:
            print(f"  - {f['record_id']} ({f['url']}): {f['status']}")
        failures_path = _DATA_DIR / (FILE_NAME + '_fetch_failures.json')
        with open(failures_path, 'w') as fh:
            json.dump(failures, fh, indent=2)
        print(f"Failure details written to {failures_path} -- re-run against this same "
              f"{FILE_NAME}.json to retry just the ones that matter, or investigate why "
              f"they failed before trusting the CSV as complete.")
    else:
        print(f"\nAll {len(df)} records fetched successfully, no failures.")