# NYCRO working papers of the North Riding Quarter Sessions Scraper

## PYTHON SETUP

### to clean install brew

brew install pyenv pyenv-virtualenv
(then add lines to .zshrc as instructed)
brew uninstall --ignore-dependencies openssl readline
/usr/bin/arch -arm64 brew install openssl gettext readline

### this makes hashtools (and hence requests) work

/usr/local/bin/brew uninstall --ignore-dependencies libb2
arch -arm64 brew install libb2

(to test do python3 then import hashtools)

### to install a new python

/usr/bin/arch -arm64 pyenv install 3.11.12

### to make a new project 

cd myproject
pyenv virtualenv 3.11.12 myproject
pyenv local myproject

### to install a library

python3 -m pip install requests

## RUNNING THE PROJECT

### Step 1:
01_list_resources.py - executes a search against the QS Bundles collection, and generates a json file of matching resource ids and urls. 

### Step 2:

02_fetch_resources.py - downloads each record in the cached json file (with a pause so as not to DOS the server), and generates a CSV file of the data.

### Step 3:

eg: python3 -m 03_preprocess_resources - splits out the summary convictions into separate text files

### Step 4:

eg: python3 -m 04_extract_structured_data - uses an llm to parse the unstructured data into JSON

### Step 5:

eg: python3 -m 05_load_data - ingests the JSON files into SQLite

## DATABASE SCHEMA

```mermaid
erDiagram
    SUMMARY_CONVICTION {
        int summary_conviction_id PK
        string reference_number
        date conviction_date
        string offence_day_of_week
        int offence_day_of_month
        int offence_year
        time offence_time
        int offence_type_id FK
        text charge_description
        text sentencing
        text raw_record
        int offence_location_town_id FK
        int offence_location_street_id FK
        int court_location_town_id FK
        string archive_url
    }

    DEFENDANT {
        int defendant_id PK
        string first_name
        string last_name
        string sex
        string occupation
        text relationships_and_details
        text prior_convictions
        int town_id FK
        int street_id FK
    }

    PERSON {
        int person_id PK
        string first_name
        string last_name
        string occupation
        text relationships_and_details
        int town_id FK
        int street_id FK
    }

    OFFENCE_TYPE {
        int offence_type_id PK
        string offence_type_name
    }

    TOWN {
        int town_id PK
        string town_name
    }

    STREET {
        int street_id PK
        string street_name
        int town_id FK
    }

    ALIAS {
        int alias_id PK
        int defendant_id FK
        string alias_name
    }

    SUMMARY_CONVICTION_DEFENDANT {
        int summary_conviction_id FK
        int defendant_id FK
    }

    INVOLVED_PERSONS {
        int summary_conviction_id FK
        int person_id FK
        string role
    }

    SUMMARY_CONVICTION ||--o{ SUMMARY_CONVICTION_DEFENDANT : "has"
    DEFENDANT ||--o{ SUMMARY_CONVICTION_DEFENDANT : "involved in"
    SUMMARY_CONVICTION ||--o{ INVOLVED_PERSONS : "involves"
    PERSON ||--o{ INVOLVED_PERSONS : "participates in"
    SUMMARY_CONVICTION }o--|| OFFENCE_TYPE : "classified as"
    SUMMARY_CONVICTION }o--|| TOWN : "offence location"
    SUMMARY_CONVICTION }o--o| STREET : "offence street"
    SUMMARY_CONVICTION }o--|| TOWN : "court location"
    DEFENDANT ||--o{ ALIAS : "has"
    DEFENDANT }o--|| TOWN : "lives in"
    DEFENDANT }o--o| STREET : "street address"
    PERSON }o--|| TOWN : "lives in"
    PERSON }o--o| STREET : "street address"
    STREET }o--|| TOWN : "located in"
```

### SUMMARY_CONVICTION
Primary entity representing individual court cases with summary convictions for petty offences.

### DEFENDANT
Individuals who are defendants in court cases, with support for aliases and address tracking.

### PERSON
Other individuals involved in cases (prosecutors, informants, property owners, witnesses).

### OFFENCE_TYPE
Standardized classification of offence types (vagrancy, assault, theft, etc.).

### TOWN & STREET
Location entities for tracking addresses and case locations.

### Junction Tables
- **SUMMARY_CONVICTION_DEFENDANT**: Handles multiple defendants per case
- **INVOLVED_PERSONS**: Links other persons to cases with their roles

## Notes
- Offence dates are decomposed into separate fields for analysis
- Raw historical records preserved in `raw_record` field