-- Historical Court Records Database Schema
-- SQLite implementation

-- Create TOWN table
CREATE TABLE town (
    town_id INTEGER PRIMARY KEY AUTOINCREMENT,
    town_name TEXT NOT NULL UNIQUE
);

-- Create STREET table
CREATE TABLE street (
    street_id INTEGER PRIMARY KEY AUTOINCREMENT,
    street_name TEXT NOT NULL,
    town_id INTEGER NOT NULL,
    FOREIGN KEY (town_id) REFERENCES town(town_id),
    UNIQUE(street_name, town_id)
);

-- Create OFFENCE_TYPE table
CREATE TABLE offence_type (
    offence_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    offence_type_name TEXT NOT NULL UNIQUE
);

-- Create DEFENDANT table
CREATE TABLE defendant (
    defendant_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    occupation TEXT,
    relationships_and_details TEXT,
    prior_convictions TEXT,
    town_id INTEGER,
    street_id INTEGER,
    FOREIGN KEY (town_id) REFERENCES town(town_id),
    FOREIGN KEY (street_id) REFERENCES street(street_id)
);

-- Create PERSON table
CREATE TABLE person (
    person_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    occupation TEXT,
    relationships_and_details TEXT,
    town_id INTEGER,
    street_id INTEGER,
    FOREIGN KEY (town_id) REFERENCES town(town_id),
    FOREIGN KEY (street_id) REFERENCES street(street_id)
);

-- Create ALIAS table
CREATE TABLE alias (
    alias_id INTEGER PRIMARY KEY AUTOINCREMENT,
    defendant_id INTEGER NOT NULL,
    alias_name TEXT NOT NULL,
    FOREIGN KEY (defendant_id) REFERENCES defendant(defendant_id)
);

-- Create SUMMARY_CONVICTION table
CREATE TABLE summary_conviction (
    summary_conviction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_number TEXT NOT NULL UNIQUE,
    conviction_date DATE,
    offence_day_of_week TEXT,
    offence_day_of_month INTEGER,
    offence_year INTEGER,
    offence_time TIME,
    offence_type_id INTEGER,
    charge_description TEXT,
    sentencing TEXT,
    raw_record TEXT,
    offence_location_town_id INTEGER,
    offence_location_street_id INTEGER,
    court_location_town_id INTEGER,
    archive_url TEXT,
    FOREIGN KEY (offence_type_id) REFERENCES offence_type(offence_type_id),
    FOREIGN KEY (offence_location_town_id) REFERENCES town(town_id),
    FOREIGN KEY (offence_location_street_id) REFERENCES street(street_id),
    FOREIGN KEY (court_location_town_id) REFERENCES town(town_id)
);

-- Create SUMMARY_CONVICTION_DEFENDANT junction table
CREATE TABLE summary_conviction_defendant (
    summary_conviction_id INTEGER NOT NULL,
    defendant_id INTEGER NOT NULL,
    PRIMARY KEY (summary_conviction_id, defendant_id),
    FOREIGN KEY (summary_conviction_id) REFERENCES summary_conviction(summary_conviction_id),
    FOREIGN KEY (defendant_id) REFERENCES defendant(defendant_id)
);

-- Create INVOLVED_PERSONS junction table
CREATE TABLE involved_persons (
    summary_conviction_id INTEGER NOT NULL,
    person_id INTEGER NOT NULL,
    role TEXT,
    PRIMARY KEY (summary_conviction_id, person_id),
    FOREIGN KEY (summary_conviction_id) REFERENCES summary_conviction(summary_conviction_id),
    FOREIGN KEY (person_id) REFERENCES person(person_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_summary_conviction_reference ON summary_conviction(reference_number);
CREATE INDEX idx_summary_conviction_date ON summary_conviction(conviction_date);
CREATE INDEX idx_summary_conviction_offence_year ON summary_conviction(offence_year);
CREATE INDEX idx_defendant_name ON defendant(last_name, first_name);
CREATE INDEX idx_person_name ON person(last_name, first_name);
CREATE INDEX idx_street_town ON street(town_id);
CREATE INDEX idx_alias_defendant ON alias(defendant_id);

-- Insert some common offence types
INSERT INTO offence_type (offence_type_name) VALUES 
    ('vagrancy'),
    ('assault'),
    ('theft'),
    ('being drunk'),
    ('begging'),
    ('poaching'),
    ('refusing to maintain family'),
    ('lodging unlawfully');

-- Insert some common towns from the examples
INSERT INTO town (town_name) VALUES 
    ('Whitby'),
    ('Ruswarp'),
    ('Lythe'),
    ('Barnby'),
    ('Great Moorsholm'),
    ('Little Moorsholm'),
    ('Rosedale East Side'),
    ('Danby'),
    ('Northallerton');