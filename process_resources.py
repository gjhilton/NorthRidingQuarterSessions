import pandas as pd
import os
from datetime import datetime
from summary_conviction_parser import parse_conviction
# from indictment_processor import process_indictment

INPUT_FILE = "data/whitby.csv"

def load_data(path):
    return pd.read_csv(path)

def save_data(df, path):
    df.to_csv(path, index=False)

ROW_PARSERS = {
    'Summary conviction':parse_conviction,
    # 'Bill of indictment': process_indictment
}

def filter_rows_by_prefix(df, prefixes):
    prefixes = tuple(prefixes)
    mask = df['title'].astype(str).str.startswith(prefixes, na=False)
    return df.loc[mask]

def slice_rows(df, start=None, end=None):
    total = len(df)
    if start is None:
        start = 0
    if end is None or end > total:
        end = total
    if start < 0 or end < 0 or start > end or start > total:
        raise ValueError(f"Invalid start ({start}) or end ({end}) range for dataframe of length {total}")
    return df.iloc[start:end].copy()

def subset_data (df, prefixes, start=None, end=None):
    filtered_df = filter_rows_by_prefix(df, prefixes)
    sliced_df = slice_rows(filtered_df, start, end)
    sliced_df.reset_index(drop=True, inplace=True)
    return sliced_df

def process_dataframe(df, start=None, end=None):
    sliced_df = subset_data (df, ROW_PARSERS.keys(), start, end)
    total_rows = len(sliced_df)

    def process_row(row):
        title = row.get('title', '')
        description= row.get('description', '')
        if not isinstance(title, str):
            title = str(title)
        idx = row.name
        print(f"Processing row {idx + 1} of {total_rows}: {title}")
        try:
            for key, fn in ROW_PARSERS.items():
                if title.startswith(key):
                    return fn(description)
        except Exception as e:
            print(f"Error processing row {idx + 1} with title '{title}': {e}")
        return row

    processed_df = sliced_df.apply(process_row, axis=1)
    processed_df.reset_index(drop=True, inplace=True)
    return processed_df

def get_description(df, row_num):
    return df.at[row_num, 'description']

def debug_parse_conviction_row(df, row_num):
    sliced_df = subset_data (df, ["Summary conviction"])
    desc = get_description(sliced_df, row_num)
    print(f"{row_num}: {desc}")

if __name__ == "__main__":
    df = pd.read_csv(INPUT_FILE)
    sliced_df = subset_data (df, ["Summary conviction"])
    debug_parse_conviction_row(df,2)
    #processed_df = process_dataframe(df,start=1,end=10)
    #filepath = os.path.dirname(INPUT_FILE)
    #filename = os.path.splitext(os.path.basename(INPUT_FILE))[0]
    #timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    #output_file = f"{filepath}/{filename}_processed_{timestamp}.csv"
    #processed_df.to_csv(output_file, index=False)
    #print(f"wrote {output_file}")
