import pandas as pd
from conviction_processor import process_conviction
from indictment_processor import process_indictment

def load_data(path):
    return pd.read_csv(path)

def save_data(df, path):
    df.to_csv(path, index=False)

ROW_PARSERS = {
    'Summary conviction': process_conviction,
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

def process_dataframe(df, start=None, end=None):
    filtered_df = filter_rows_by_prefix(df, ROW_PARSERS.keys())
    sliced_df = slice_rows(filtered_df, start, end)
    sliced_df.reset_index(drop=True, inplace=True)
    total_rows = len(sliced_df)

    def process_row(row):
        title = row.get('title', '')
        if not isinstance(title, str):
            title = str(title)
        idx = row.name
        print(f"Processing row {idx + 1} of {total_rows}: {title}")
        try:
            for key, fn in ROW_PARSERS.items():
                if title.startswith(key):
                    return fn(row)
        except Exception as e:
            print(f"Error processing row {idx + 1} with title '{title}': {e}")
        return row

    processed_df = sliced_df.apply(process_row, axis=1)
    processed_df.reset_index(drop=True, inplace=True)
    return processed_df

if __name__ == "__main__":
    df = load_data('data/whitby.csv')
    #df_processed = process_dataframe(df, start=10, end=20)
    df_processed = process_dataframe(df)
    save_data(df_processed, 'data/whitby_processed.csv')
