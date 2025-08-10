#!/usr/bin/env python3
"""
03_postprocess_resources.py

Extracts Summary conviction records from whitby.csv and saves each record
to individual text files in the summary_convictions directory.

The filename is created from the reference number (text before first comma)
with spaces converted to underscores and slashes converted to dashes.
"""

import os
import csv
import sys

def sanitize_filename(reference):
    """
    Convert reference number to valid filename.
    
    Args:
        reference (str): Reference number like "QSB 1882 1/10/11/29"
    
    Returns:
        str: Sanitized filename like "QSB_1882_1-10-11-29.txt"
    """
    # Replace spaces with underscores
    filename = reference.replace(' ', '_')
    # Replace forward slashes with dashes
    filename = filename.replace('/', '-')
    # Add .txt extension
    return filename + '.txt'

def process_whitby_csv(input_file='data/whitby.csv', output_dir='summary_convictions'):
    """
    Process the whitby.csv file and extract Summary conviction records.
    
    Args:
        input_file (str): Path to input CSV file
        output_dir (str): Directory to save individual text files
    """
    try:
        # Check if input file exists
        if not os.path.exists(input_file):
            print(f"Error: Input file '{input_file}' not found.")
            return False
        
        # Create output directory if it doesn't exist
        if not os.path.exists(output_dir):
            print(f"Creating output directory: {output_dir}")
            os.makedirs(output_dir)
        
        processed_count = 0
        skipped_count = 0
        error_count = 0
        
        print(f"Processing records from: {input_file}")
        print(f"Output directory: {output_dir}")
        print("-" * 50)
        
        # Read the CSV file
        with open(input_file, 'r', encoding='utf-8') as csvfile:
            # Read line by line to handle any CSV parsing issues
            for line_num, line in enumerate(csvfile, 1):
                line = line.strip()
                
                # Skip empty lines
                if not line:
                    continue
                
                # Check if line contains "Summary conviction"
                if "Summary conviction" in line:
                    try:
                        # Extract reference number (text before first comma)
                        if ',' in line:
                            reference = line.split(',', 1)[0].strip()
                        else:
                            print(f"Warning: Line {line_num} has no comma, skipping")
                            skipped_count += 1
                            continue
                        
                        # Create filename
                        filename = sanitize_filename(reference)
                        filepath = os.path.join(output_dir, filename)
                        
                        # Check if file already exists
                        if os.path.exists(filepath):
                            print(f"Warning: File {filename} already exists, skipping")
                            skipped_count += 1
                            continue
                        
                        # Write the entire line to the file
                        with open(filepath, 'w', encoding='utf-8') as outfile:
                            outfile.write(line + '\n')
                        
                        processed_count += 1
                        print(f"Created: {filename}")
                        
                    except Exception as e:
                        print(f"Error processing line {line_num}: {e}")
                        error_count += 1
        
        print("-" * 50)
        print(f"Processing complete!")
        print(f"Records processed: {processed_count}")
        print(f"Records skipped: {skipped_count}")
        print(f"Errors encountered: {error_count}")
        
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Main function to run the postprocessing."""
    print("Summary Conviction Records Extractor")
    print("=" * 40)
    
    # Process the records
    success = process_whitby_csv()
    
    if success:
        print("\n✓ Postprocessing completed successfully!")
    else:
        print("\n✗ Postprocessing failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()