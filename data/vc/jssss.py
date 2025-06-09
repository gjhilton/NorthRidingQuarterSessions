import json
import pandas as pd

def load_json_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("Root JSON element must be an array")
    all_keys = set()
    for item in data:
        all_keys.update(item.keys())
    rows = []
    for item in data:
        row = {key: item.get(key, None) for key in all_keys}
        rows.append(row)
    return pd.DataFrame(rows)

def save_json_file(df, filepath):
    def clean_value(v):
        if pd.isna(v):
            return None
        return v

    records = []
    for _, row in df.iterrows():
        record = {k: clean_value(v) for k, v in row.items()}
        records.append(record)

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(records, f, indent=2)

def add_incident(df, new_incident):
    all_keys = set(df.columns) | set(new_incident.keys())
    row = {key: new_incident.get(key, None) for key in all_keys}
    new_row_df = pd.DataFrame([row])
    df_updated = pd.concat([df, new_row_df], ignore_index=True)
    return df_updated

def extract_defendants(df):
    df_exploded = df.explode('defendants').reset_index(drop=True)
    defendants_df = pd.json_normalize(df_exploded['defendants'])
    defendants_df['incident'] = df_exploded['incident']
    return defendants_df

def count_offences(defendants_df):
    offence_counts = (
        defendants_df
        .groupby('name')
        .agg(
            offences=('incident', 'nunique'),
            age=('age', 'first')
        )
        .reset_index()
        .sort_values(by='offences', ascending=False)
    )
    return offence_counts

def save_incidents_to_csv(df, filepath):
    """
    Save the incidents DataFrame to CSV.
    Location dicts will be saved as strings.
    """
    df_copy = df.copy()
    # Convert dicts to JSON strings for CSV
    for col in df_copy.columns:
        if df_copy[col].apply(lambda x: isinstance(x, dict)).any():
            df_copy[col] = df_copy[col].apply(json.dumps)
    df_copy.to_csv(filepath, index=False)
    print(f"Saved incidents to CSV: {filepath}")

def save_offences_to_csv(offence_counts_df, filepath):
    """
    Save offences DataFrame to CSV.
    """
    offence_counts_df.to_csv(filepath, index=False)
    print(f"Saved offences to CSV: {filepath}")


# === Example usage ===

# Load incidents from JSON file
df = load_json_file('incidents.json')

# Add new incident
new_incident = {
    "incident": "f",
    "location": {"city": "New City", "state": "NY"},
    "defendants": [
        {"name": "dave", "age": 45},
        {"name": "Trumpo", "age": 70}
    ]
}
df = add_incident(df, new_incident)

# Save updated incidents to JSON
save_json_file(df, 'incidents_updated.json')

# Extract defendants and count offences
defendants_df = extract_defendants(df)
offence_counts = count_offences(defendants_df)

# Save both incidents and offences to CSV
save_incidents_to_csv(df, 'incidents.csv')
save_offences_to_csv(offence_counts, 'offence_counts.csv')
