#!/usr/bin/env python3
"""
Initialize SQLite database for Historical Court Records

This script creates and initializes the court records database using the schema.sql file.
It will create a new SQLite database file called 'data.sqlite' in the current directory.
"""

import sqlite3
import os
import sys

def initialize_database(db_path='data.sqlite', schema_path='schema.sql'):
    """
    Initialize the SQLite database with the court records schema.
    
    Args:
        db_path (str): Path to the SQLite database file
        schema_path (str): Path to the SQL schema file
    """
    try:
        # Check if schema file exists
        if not os.path.exists(schema_path):
            print(f"Error: Schema file '{schema_path}' not found.")
            print("Make sure schema.sql exists in the current directory.")
            return False
        
        # Remove existing database if it exists
        if os.path.exists(db_path):
            print(f"Removing existing database: {db_path}")
            os.remove(db_path)
        
        # Create new database connection
        print(f"Creating new database: {db_path}")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Read and execute schema file
        print(f"Loading schema from: {schema_path}")
        with open(schema_path, 'r', encoding='utf-8') as schema_file:
            schema_sql = schema_file.read()
        
        # Execute the schema (split by semicolon to handle multiple statements)
        cursor.executescript(schema_sql)
        
        # Commit changes
        conn.commit()
        
        # Verify tables were created
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("\nDatabase initialized successfully!")
        print(f"Created {len(tables)} tables:")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Close connection
        conn.close()
        
        print(f"\nDatabase file created: {os.path.abspath(db_path)}")
        return True
        
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Main function to run the database initialization."""
    print("Historical Court Records Database Initializer")
    print("=" * 50)
    
    # Initialize the database
    success = initialize_database()
    
    if success:
        print("\n✓ Database initialization completed successfully!")
        print("You can now use data.sqlite with your court records application.")
    else:
        print("\n✗ Database initialization failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()