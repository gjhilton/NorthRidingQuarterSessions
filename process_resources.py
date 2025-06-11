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
    df = df.copy()
    df = subset_data(df, ROW_PARSERS.keys(), start, end)
 
    total_rows = len(df)
    error_count = 0

    for idx, row in df.iterrows():
        print(f'Working: {idx + 1} of {total_rows}')
        try:
            for prefix, func in ROW_PARSERS.items():
                if row['title'].startswith(prefix):
                    case_obj = func(row['description'])
                    props = {k: v for k, v in vars(case_obj).items() if not k.startswith('_')}
                    for k, v in props.items():
                        df.at[idx, k] = v
                    break
        except Exception as e:
            print(f'Error processing row {idx + 1} (title="{row["title"]}"): {e}')
            error_count += 1

    print(f'Processing complete. Total errors: {error_count}')
    return df


def get_description(df, row_num):
    return df.at[row_num, 'description']

def debug_parse_conviction_row(df, row_num):
    df = subset_data(df, ["Summary conviction"])
    print(f"{row_num}: {get_description(df, row_num)}")

## python3 -m process_resources        
if __name__ == "__main__":
    df = load_data(INPUT_FILE)
    #debug_parse_conviction_row(df, 2)

    processed_df = process_dataframe(df,1,10)
    #print(processed_df)

    base = os.path.splitext(os.path.basename(INPUT_FILE))[0]
    folder = os.path.dirname(INPUT_FILE)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(folder, f"{base}_processed_{timestamp}.csv")

    save_data(processed_df, output_path)
    print(f"wrote {output_path}")
