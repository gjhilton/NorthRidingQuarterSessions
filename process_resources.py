import pandas as pd
import re

def load_data(path):
    return pd.read_csv(path)

def extract_name(title):
    title = title.replace("Summary conviction:", "").strip()
    return re.sub(r"\s+of.*", "", title)

def add_name_column(df):
    df["name"] = df["title"].apply(extract_name)
    return df

def filter_titles(df):
    if "title" not in df.columns:
        raise ValueError("Missing 'title' column.")
    return df[df["title"].str.startswith(("Summary conviction:", "Bill of indictment:"), na=False)]

def conditional_filter(df, column, phrase, town):
    def keep(text):
        text = str(text).lower()
        return phrase not in text or f"{phrase} {town.lower()}" in text
    return df[df[column].apply(keep)]

def filter_township(df, town):
    return conditional_filter(df, "description", "the township of", town)

def exclude_inhabitants(df, town):
    return conditional_filter(df, "description", "the inhabitants of", town)

def exclude_committed_at(df, town):
    return conditional_filter(df, "description", "offence committed at", town)

def save_data(df, path):
    df.to_csv(path, index=False)
    print(f"Saved to {path}")

if __name__ == "__main__":
    town_name = "whitby"
    input_path = "data/whitby.csv"
    output_path = "data/whitby_cleaned.csv"

    df = load_data(input_path)
    df = filter_titles(df)
    df = add_name_column(df)
    df = exclude_inhabitants(df, town_name)
    df = exclude_committed_at(df, town_name)
    df = filter_township(df, town_name)
    save_data(df, output_path)