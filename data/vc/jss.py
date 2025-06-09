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

# === Example workflow ===

# Load from JSON file
df = load_json_file('incidents.json')
print("Loaded DataFrame:")
print(df)

# Add a new incident
new_incident = {
    "incident": "f",
    "location": {"city": "New City", "state": "NY"},
    "defendants": [
        {"name": "dave", "age": 45},
        {"name": "Trumpo", "age": 70}
    ]
}
df = add_incident(df, new_incident)
print("\nDataFrame after adding new incident:")
print(df)

# Save updated DataFrame back to JSON
save_json_file(df, 'incidents_updated.json')
print("\nSaved updated DataFrame to 'incidents_updated.json'")

# Extract defendants and count offences
defendants_df = extract_defendants(df)
print("\nAll defendants exploded:")
print(defendants_df)

offence_counts = count_offences(defendants_df)
print("\nOffence counts per defendant:")
print(offence_counts)
