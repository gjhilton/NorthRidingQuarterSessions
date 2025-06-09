import pandas as pd
from conviction_processor import process_conviction
from indictment_processor import process_indictment

def load_data(path):
    return pd.read_csv(path)

def save_data(df, path):
    df.to_csv(path, index=False)

ROW_PARSERS = {
    'Summary conviction': process_conviction,
    #'Bill of indictment': process_indictment
}

def process_dataframe(df):
    def process_row(row):
        title = row['title']
        print(f"Processing: {title}")
        for key, fn in ROW_PARSERS.items():
            if title.startswith(key):
                return fn(row)
        return row

    prefixes = tuple(ROW_PARSERS.keys())
    mask = df['title'].astype(str).str.startswith(prefixes)
    df.drop(index=df[~mask].index, inplace=True)
    df.reset_index(drop=True, inplace=True)
    df = df.apply(process_row, axis=1)
    return df

if __name__ == "__main__":
    df = load_data('data/whitby.csv')
    df_processed = process_dataframe(df)
    #pd.set_option('display.max\_columns', None)
    #print(df_processed)
    save_data(df_processed,'data/whitby_processed.csv')
