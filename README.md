# NYCRO working papers of the North Riding Quarter Sessions Scraper

## Step 1:
list_resources.py - executes a search against the QS Bundles collection, and generates a json file of matching resource ids and urls. 

## Step 2:

fetch_resources.py - downloads each record in the cached json file (with a pause so as not to DOS the server), and generates a CSV file of the data.

## Step 3:

eg: python3 -m process_resources 

process_resources.py - clean and filter the resource data to generate a new CSV file of manicured data. 

Based on (beginning of) the title of each row, we apply a processing function from 

- conviction_processor.py
- indictment_processor.py

Rows which dont begin with a configured prefix are dropped.

## Step 4

Import the cleaned CSV into a spreadheet app.