import pandas as pd
import os
from datetime import datetime
from summary_conviction_parser import parse_conviction
# from indictment_processor import process_indictment

INPUT_FILE = "data/whitby.csv"

ROW_PARSERS = {
    'Summary conviction': parse_conviction,
    # 'Bill of indictment': process_indictment
}

def load_data(path):
    return pd.read_csv(path)

def save_data(df, path):
    df.to_csv(path, index=False)

def filter_rows_by_prefix(df, prefixes):
    prefixes = tuple(prefixes)
    return df[df['title'].astype(str).str.startswith(prefixes, na=False)]

def slice_rows(df, start=None, end=None):
    start = 0 if start is None else start
    end = len(df) if end is None or end > len(df) else end
    if not (0 <= start <= end <= len(df)):
        raise ValueError(f"Invalid start ({start}) or end ({end}) range for dataframe of length {len(df)}")
    return df.iloc[start:end].copy()

def subset_data(df, prefixes, start=None, end=None):
    df = filter_rows_by_prefix(df, prefixes)
    df = slice_rows(df, start, end)
    df.reset_index(drop=True, inplace=True)
    return df

def process_dataframe(df, start=None, end=None):
    df = subset_data(df, ROW_PARSERS.keys(), start, end)
    total_rows = len(df)
    num_errors = 0

    def process_row(row):
        nonlocal num_errors
        title = str(row.get("title", ""))
        description = row.get("description", "")
        idx = row.name
        print(f"Processing row {idx + 1} of {total_rows}: {title}")
        try:
            for prefix, fn in ROW_PARSERS.items():
                if title.startswith(prefix):
                    return fn(description)
        except Exception as e:
            num_errors += 1
            print()
            print(f"> Error processing row {idx + 1} ('{title}'): {e}")
            print(f"> {description}")
            print()
        return row

    result = df.apply(process_row, axis=1)
    result.reset_index(drop=True, inplace=True)
    print(f"{num_errors} errors occurred")
    return result


def get_description(df, row_num):
    return df.at[row_num, 'description']

def debug_parse_conviction_row(df, row_num):
    df = subset_data(df, ["Summary conviction"])
    print(f"{row_num}: {get_description(df, row_num)}")

## python3 -m process_resources        
if __name__ == "__main__":
    df = load_data(INPUT_FILE)
    #debug_parse_conviction_row(df, 2)

    processed_df = process_dataframe(df)

    base = os.path.splitext(os.path.basename(INPUT_FILE))[0]
    folder = os.path.dirname(INPUT_FILE)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(folder, f"{base}_processed_{timestamp}.csv")

    save_data(processed_df, output_path)
    print(f"wrote {output_path}")
