# NYCRO working papers of the North Riding Quarter Sessions Scraper

## Step 1:
list_resources.py - executes a search against the QS Bundles collection, and generates a json file of matching resource ids and urls. 

## Step 2:

fetch_resources.py - downloads each reward in the cached json file (with a pause so as not to DOS the server), and generates a CSV file of the data.

## Step 3:

process_resourcs.py - clean and filter the resource data to generate a new CSV file of manicured data. Note that a list of blacklisted resource IDs is filtered out here. This will defijnitely be specific to the search youre doing, so if doing multiple searches, you'll likely need multiple blacklitss.

eg: python3 -m process_resources 

## Step 4

Import the cleaned CSV into a spreadheet app.