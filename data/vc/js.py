import json
import pandas as pd

def json_array_to_dataframe_native(json_str):
    data = json.loads(json_str)
    if not isinstance(data, list):
        raise ValueError("Root JSON element must be an array")
    all_keys = set()
    for item in data:
        all_keys.update(item.keys())
    rows = []
    for item in data:
        row = {}
        for key in all_keys:
            row[key] = item.get(key, None)
        rows.append(row)
    return pd.DataFrame(rows)

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

def add_incident(df, new_incident):
    """
    Add a new incident (dict) to the incidents DataFrame and return the updated DataFrame.
    """
    all_keys = set(df.columns) | set(new_incident.keys())
    row = {key: new_incident.get(key, None) for key in all_keys}
    new_row_df = pd.DataFrame([row])
    df_updated = pd.concat([df, new_row_df], ignore_index=True)
    return df_updated


# === Initial JSON input with 5 incidents ===
json_input = '''
[
  {
    "incident": "a",
    "location": {"city": "Springfield", "state": "IL"},
    "defendants": [
      {"name": "john", "age": 34},
      {"name": "bozo", "age": 50},
      {"name": "Trumpo", "age": 70}
    ]
  },
  {
    "incident": "b",
    "location": {"city": "Shelbyville", "state": "IL"},
    "defendants": [
      {"name": "grutty", "age": 23},
      {"name": "Trumpo", "age": 70}
    ]
  },
  {
    "incident": "c",
    "location": {"city": "Capital City", "state": "IL"},
    "defendants": [
      {"name": "mary", "age": 28},
      {"name": "Trumpo", "age": 70}
    ]
  },
  {
    "incident": "d",
    "location": {"city": "Ogdenville", "state": "IL"},
    "defendants": [
      {"name": "steve", "age": 40},
      {"name": "Trumpo", "age": 70}
    ]
  },
  {
    "incident": "e",
    "location": {"city": "North Haverbrook", "state": "IL"},
    "defendants": [
      {"name": "alice", "age": 35},
      {"name": "Trumpo", "age": 70}
    ]
  }
]
'''

# Load the original incidents into DataFrame
df = json_array_to_dataframe_native(json_input)
print("Original incidents DataFrame:")
print(df, "\n")

# Define a new incident to add
new_incident = {
    "incident": "f",
    "location": {"city": "New City", "state": "NY"},
    "defendants": [
        {"name": "dave", "age": 45},
        {"name": "Trumpo", "age": 70}
    ]
}

# Add new incident
df = add_incident(df, new_incident)
print("DataFrame after adding new incident:")
print(df, "\n")

# Extract defendants from all incidents
defendants_df = extract_defendants(df)
print("All defendants exploded:")
print(defendants_df, "\n")

# Count offences per defendant
offence_counts = count_offences(defendants_df)
print("Offence counts per defendant:")
print(offence_counts)
