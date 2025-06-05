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

def filter_titles(df):
    if 'title' not in df.columns:
        raise ValueError("DataFrame must contain a 'title' column.")
    filtered_df = df[df['title'].str.startswith(('Summary conviction:', 'Bill of indictment:'), na=False)]
    
    return filtered_df

def filter_township_rows(df):
    def should_keep(description):
        desc = str(description).lower()
        if "the township of" not in desc:
            return True
        return bool(re.search(r"\bthe township of whitby\b", desc))
    return df[df['description'].apply(should_keep)]

def exclude_inhabitants_rows(df):
    def should_keep(title):
        desc = str(title).lower()
        if "the inhabitants of" not in desc:
            return True
        return bool(re.search(r"\bthe inhabitats of whitby\b", desc))
    return df[df['description'].apply(should_keep)]

def exclude_comitted_at(df):
    def should_keep(title):
        desc = str(title).lower()
        if "offence committed at" not in desc:
            return True
        return bool(re.search(r"\boffence committed at whitby\b", desc))
    return df[df['description'].apply(should_keep)]

if __name__ == "__main__":
    input_csv = 'data/whitby.csv'
    output_csv = 'data/whitby_postprocessed.csv'
    
    df = load_data(input_csv)
    df = filter_titles(df)
    df = process_data(df)
    df = exclude_inhabitants_rows(df)
    df = exclude_comitted_at(df)
    save_data(df, output_csv)
