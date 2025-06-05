import pandas as pd
import re

def load_data(input_csv):
    return pd.read_csv(input_csv)

def add_new_properties(row):
    name = extract_name(row["title"])
    row['name'] = name
    return row

def process_data(df):
    return df.apply(add_new_properties, axis=1)

def save_data(df, output_csv):
    df.to_csv(output_csv, index=False)
    print(f"Updated DataFrame saved to {output_csv}")

def extract_name(text):
    text = text.replace("Summary conviction:", "").strip()
    text = re.sub(r"\s+of.*", "", text)
    return text
    

if __name__ == "__main__":
    input_csv = 'sw.csv'
    output_csv = 'sw_processed.csv'
    
    df = load_data(input_csv)
    df = process_data(df)
    save_data(df, output_csv)
