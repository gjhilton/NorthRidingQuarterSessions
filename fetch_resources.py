import json
import pandas as pd
import requests
from bs4 import BeautifulSoup
import re
import time

pd.set_option("display.max_columns", None)

def clean_html_ids(html_string):
    def id_replacer(match):
        return f'id="{match.group(1).replace(" ", "")}"'
    cleaned_html = re.sub(r'id\s*=\s*["\'](.*?)["\']', id_replacer, html_string)
    return re.sub(r'&#x0?[dD];|&#0?13;|&#0?[aA];|&#0?10;', '', cleaned_html)

def fetch_webpage(url):
    time.sleep(1)
    print(f'GET: {url}')
    try:
        return requests.get(url)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")

def load_json_file(filename):
    with open(filename, 'r') as f:
        return json.load(f)

def extract_field(soup, row_id):
    td_tag = soup.select_one(f'tr[id="{row_id}"] td.tablevalue')
    return td_tag.text.strip() if td_tag else None

def process_json_to_dataframe(json_file):
    data = load_json_file(json_file)
    records = []

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

    return pd.DataFrame(records)

if __name__ == "__main__":
    FILE_NAME = 'whitby'
    json_file = FILE_NAME + '.json'
    df = process_json_to_dataframe(json_file)
    print(df)
    df.to_csv(FILE_NAME + '.csv', index=False)