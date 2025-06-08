import pandas as pd
import pprint

def load_data(path):
    return pd.read_csv(path)

def save_data(df, path):
    df.to_csv(path, index=False)

# record_types(df,3) will return all the unique three word beginnings of the title field. useful when working out what rows are in the unmodified data which you would like to include.
# def record_types(df, n):
#    if 'title' not in df.columns:
#        raise ValueError("DataFrame must contain a 'title' column")
#    truncated_titles = df['title'].apply(lambda x: ' '.join(str(x).split()[:n]))
#    unique_titles = sorted(truncated_titles.unique())
#    return unique_titles

def process_conviction(row):
    row['Processed'] = "Conviction"
    return row

def process_indictment(row):
    row['Processed'] = "Indictment"
    return row

ROW_PARSERS = {
    'Summary conviction': process_conviction,
    'Bill of indictment': process_indictment
}

def process_dataframe(df):
    def process_row(row):
        title = row['title']
        for key, fn in ROW_PARSERS.items():
            if title.startswith(key):
                return fn(row)
        return row
    
    df = df.apply(process_row, axis=1)
    df = df[df['Processed'].notnull()]
    return df

if __name__ == "__main__":
    df = load_data('data/whitby.csv')
    df_processed = process_dataframe(df)
    print(df_processed)
