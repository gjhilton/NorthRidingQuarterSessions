# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Python-based scraper for historical court records from the North Riding Quarter Sessions archives. The project extracts, processes, and stores Summary Conviction records from Whitby historical court documents into a structured SQLite database.

## Core Workflow
The project follows a multi-step data processing pipeline:

### Phase 1: Data Extraction (Complete)
1. **scraper/01_list_resources.py** - Searches the archives website and generates JSON files of matching resource IDs and URLs
2. **scraper/02_fetch_resources.py** - Downloads individual records from the cached JSON file and generates CSV data

### Phase 2: Data Parsing (Planned - LLM-Based)
4. **LLM Parsing Pipeline** - Parse unstructured text files into structured JSON using Large Language Models:
   - Process each summary conviction text file individually
   - Extract structured data elements (defendants, charges, dates, locations, etc.)
   - Output standardized JSON format matching database schema
   - Handle edge cases and validation

### Phase 3: Database Ingestion (Planned)
5. **JSON to Database Import** - Ingest structured JSON into SQLite database following the relational schema

## Key Commands

### Running the Pipeline
```bash
# Step 1: Search and list resources
python3 scraper/01_list_resources.py

# Step 2: Fetch individual records  
python3 scraper/02_fetch_resources.py

# Step 3+: Stage records and run LLM extraction (data-loader/ -- see
# data-loader/qsrecords for the SQLModel schema, pluggable LLM providers,
# and cost-estimate-before-you-spend confirmation prompt)
python3 data-loader/03_load_raw_cases.py
python3 data-loader/04_extract_structured_data.py --provider anthropic

# Data-quality reports (repeated names, unreviewed offence categories)
python3 data-loader/report.py
```

### Database Operations
```bash
# Database file location (shared by 01/02's CSV output and data-loader/'s
# SQLModel schema -- data-loader/ is one part of a larger project built on
# top of this shared data/ directory)
data/db.sqlite
```

### Python Environment Setup
```bash
# Install dependencies
python3 -m pip install requests beautifulsoup4 cssutils pandas

# The project uses standard Python libraries plus:
# - requests (web scraping)
# - beautifulsoup4 (HTML parsing) 
# - cssutils (CSS parsing for visibility checks)
# - pandas (data processing)
```

## Architecture

### Data Sources
- **Primary Source**: Archives Unlocked North Yorkshire (archivesunlocked.northyorks.gov.uk)
- **Search Target**: QSB (Quarter Sessions Bundles) records
- **Focus**: Historical court records from Whitby area

### Data Flow
1. **Web Scraping Layer**: Handles session management, form submission, and pagination for the archives website
2. **Data Processing Layer**: Converts raw HTML records to structured CSV format
3. **Storage Layer**: SQLite database with normalized schema for historical court records

### Database Schema
The database implements a relational model with these core entities:
- **SUMMARY_CONVICTION**: Primary court case records
- **DEFENDANT**: Individuals charged in cases (with alias support)
- **PERSON**: Other involved parties (prosecutors, witnesses, etc.)
- **TOWN/STREET**: Location normalization
- **OFFENCE_TYPE**: Standardized offense categorization

### File Structure
- `data/` - Shared output files (JSON, CSV, SQLite database), used by both `scraper/` and `data-loader/`
- `scraper/` - The archive-scraping scripts: `01_list_resources.py`, `02_fetch_resources.py`
- `data-loader/` - The SQLModel/LLM-extraction pipeline (steps 3+): `qsrecords/` package, its tests, `03_load_raw_cases.py`, `04_extract_structured_data.py`, `report.py`. Self-contained (own `pyproject.toml`, `.env`) -- one part of a larger project
- Root level - Shared docs (`CLAUDE.md`, `README.md`, `court-records-erd.md`) and `data/`

## Important Implementation Details

### Web Scraping Considerations
- Implements session persistence for stateful navigation
- Includes rate limiting (1 second delay) to avoid overwhelming the server
- Handles ASP.NET ViewState and form validation parameters
- Uses CSS visibility checks for pagination detection

### Data Processing Features
- Blacklist filtering for excluding known problematic records (data/id_blacklist.txt)
- HTML entity cleaning and ID normalization
- Reference number sanitization for filesystem compatibility (spaces→underscores, slashes→dashes)

### Database Design
- Supports multiple defendants per case via junction table
- Tracks both offense and court locations separately
- Preserves raw historical records while providing normalized fields
- Includes performance indexes on commonly queried fields

## Record Format and Data Structure

### Raw Record Format (CSV/Text Files)
Each Summary conviction record contains comma-separated fields:
1. **Reference Number**: QSB YYYY Q/Bundle/Section/Item (e.g., "QSB 1864 4/10/16/1")
2. **Title**: Brief case description with defendant names
3. **Date**: Case/conviction date 
4. **Description**: Full case details including:
   - Defendant names, occupations, and locations
   - Specific charges and offense details
   - Location and time of offense
   - Court location and hearing details
   - Informant/prosecutor information
5. **Archive URL**: Direct link to original document

### Sample Record Structure
```
QSB 1864 4/10/16/1,"Summary conviction: William Thompson, George Peart, Joseph Lyth and Francis Walker",18 Jun 1864,"Summary conviction of William Thompson, George Peart, Joseph Lyth and Francis Walker for wilfully damaging a boat and a mooring chain belonging to George Sutherland, by leaping on the boat and forcing the chain from its fastenings, and causing one-shillingsworth of damage. Offence committed at the township of Whitby on 16 June 1864. Case heard at Whitby"
```

### Data Scale
- **6,256 individual Summary conviction records** (each as separate .txt file)
- Records span approximately **1803-1889** 
- Focus on **Whitby and surrounding townships** (Ruswarp, Goathland, Egton, etc.)

### Common Offense Types in Data
Based on sample records, typical offenses include:
- Property damage and theft
- Trespassing and poaching 
- Licensing violations (Sunday sales, drunkenness)
- Weights and measures fraud
- Public order offenses

The database has a real two-level taxonomy for this: `offence_category` →
`offence_type` (see `data-loader/qsrecords/offence_types.py`'s
`OFFENCE_TAXONOMY`, and `/taxonomy` in the explorer for the browsable
version). **Before extracting or hand-entering a record's `offence_types`,
check `OFFENCE_TAXONOMY` (or the live `offence_type` table) for an existing
leaf that fits** rather than inventing new phrasing for the same charge --
that's exactly how the vocabulary fragmented to 91 near-duplicate strings
the first time (six different names for "child not sent to school" alone)
before the taxonomy migration collapsed it back to 55 canonical leaves.

## LLM Parsing Implementation Guide

### Target JSON Schema
The LLM parser should extract structured data matching the database schema. Here's a comprehensive example based on the actual record `QSB 1864 4/10/16/1`:

**Original Text:**
```
QSB 1864 4/10/16/1,"Summary conviction: William Thompson, George Peart, Joseph Lyth and Francis Walker",18 Jun 1864,"Summary conviction of William Thompson, George Peart, Joseph Lyth and Francis Walker for wilfully damaging a boat and a mooring chain belonging to George Sutherland, by leaping on the boat and forcing the chain from its fastenings, and causing one-shillingsworth of damage. Offence committed at the township of Whitby on 16 June 1864. Case heard at Whitby"
```

**Parsed JSON Output:**
```json
{
  "reference_number": "QSB 1864 4/10/16/1",
  "conviction_date": "1864-06-18",
  "offence_date": "1864-06-16",
  "offence_day_of_week": null,
  "offence_day_of_month": 16,
  "offence_year": 1864,
  "offence_time": null,
  "offence_type": "property damage",
  "offence_town": "Whitby",
  "offence_street": null,
  "charge_description": "wilfully damaging a boat and a mooring chain belonging to George Sutherland, by leaping on the boat and forcing the chain from its fastenings, and causing one-shillingsworth of damage",
  "sentencing": null,
  "raw_record": "Summary conviction of William Thompson, George Peart, Joseph Lyth and Francis Walker for wilfully damaging a boat and a mooring chain belonging to George Sutherland, by leaping on the boat and forcing the chain from its fastenings, and causing one-shillingsworth of damage. Offence committed at the township of Whitby on 16 June 1864. Case heard at Whitby",
  "archive_url": "https://archivesunlocked.northyorks.gov.uk/CalmView/Record.aspx?src=CalmView.Catalog&id=Q%2fSB%2f1864-Q4%2f10%2f16-1&pos=6072",
  "defendants": [
    {
      "first_name": "William",
      "last_name": "Thompson",
      "occupation": null,
      "relationships_and_details": null,
      "prior_convictions": null,
      "town": null,
      "street": null,
      "aliases": [],
      "sex": "Male"
    },
    {
      "first_name": "George",
      "last_name": "Peart",
      "occupation": null,
      "relationships_and_details": null,
      "prior_convictions": null,
      "town": null,
      "street": null,
      "aliases": [],
      "sex": "male"
    },
    {
      "first_name": "Joseph",
      "last_name": "Lyth",
      "occupation": null,
      "relationships_and_details": null,
      "prior_convictions": null,
      "town": null,
      "street": null,
      "aliases": [],
      "sex": "male"
    },
    {
      "first_name": "Francis",
      "last_name": "Walker",
      "occupation": null,
      "relationships_and_details": null,
      "prior_convictions": null,
      "town": null,
      "street": null,
      "aliases": [],
      "sex": "male"
    }
  ],
  "involved_persons": [
    {
      "first_name": "George",
      "last_name": "Sutherland",
      "occupation": null,
      "relationships_and_details": "boat and mooring chain owner/victim",
      "role": "victim",
      "town": null,
      "street": null
    }
  ],
  "court": {
    "location_town": "Whitby"
  }
}
```
