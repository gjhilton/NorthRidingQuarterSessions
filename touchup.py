import argparse
import pandas as pd
import os
import platform
import sys
from colorama import init, Fore, Style

# Initialize colorama
init(autoreset=True)

# Function to load CSV file into a Pandas DataFrame
def load_csv(filename):
    if not os.path.exists(filename):
        raise FileNotFoundError(f"{Fore.RED}Error: The file '{filename}' does not exist.")
    if os.path.getsize(filename) == 0:
        raise ValueError(f"{Fore.RED}Error: The file '{filename}' is empty.")
    
    try:
        df = pd.read_csv(filename)
        if df.empty:
            raise ValueError(f"{Fore.RED}Error: The file '{filename}' does not contain valid data.")
        return df
    except Exception as e:
        raise ValueError(f"{Fore.RED}Error: Unable to parse the file '{filename}'. {e}")

# Function to save DataFrame back to CSV
def save_csv(df, filename):
    try:
        df.to_csv(filename, index=False)
        print(f"{Fore.GREEN}Changes saved to {filename}.")
    except Exception as e:
        print(f"{Fore.RED}Error: Unable to save the file '{filename}'. {e}")

# Function to clear the screen (platform independent)
def clear_screen():
    system = platform.system()
    if system == "Windows":
        os.system('cls')  # Windows
    else:
        os.system('clear')  # Unix-based systems (Linux, macOS)

# Function to handle interactive paging through the dataframe
def interactive_paging(df, hero_column=None, filename=None):
    current_row = 0
    total_rows = len(df)
    modified = False  # Flag to track if any changes have been made

    while True:
        clear_screen()  # Clear the screen between each page
        
        # Display the hero field if specified
        if hero_column and hero_column in df.columns:
            print(f"{Fore.CYAN}\n{hero_column}: {df.iloc[current_row][hero_column]}")
        
        # Display current row
        print(f"{Fore.YELLOW}\nRow {current_row + 1}/{total_rows}\n")
        print(df.iloc[current_row])  # Show the row as a DataFrame

        # Show the available commands in concise format
        print(f"\n{Fore.MAGENTA}Commands:")
        print(f"  ({Fore.WHITE}n{Fore.GREEN})ext, ({Fore.WHITE}p{Fore.GREEN})rev, ({Fore.WHITE}e{Fore.GREEN})dit, ({Fore.WHITE}s{Fore.GREEN})ave, ({Fore.WHITE}q{Fore.RED})uit")

        print("")

        command = input(f"{Fore.CYAN}Enter command: {Fore.WHITE}").strip().lower()

        # Process the command
        if command in ['next', 'n']:  # Move to the next row
            current_row = (current_row + 1) % total_rows
        elif command in ['prev', 'p']:  # Move to the previous row
            current_row = (current_row - 1) % total_rows
        elif command in ['quit', 'q']:  # Quit the program
            if modified:
                save_prompt = input(f"{Fore.RED}You have unsaved changes. Save before quitting? (y/n): ").strip().lower()
                if save_prompt == 'y' and filename:
                    save_csv(df, filename)
            print(f"{Fore.GREEN}Goodbye!")
            break
        elif command in ['edit', 'e']:  # Edit the current row
            handle_edit_command(df, current_row)
            modified = True  # Mark as modified
        elif command in ['save', 's']:  # Save the updated DataFrame to CSV
            if filename:
                save_csv(df, filename)
                modified = False  # Reset modified flag after save
            else:
                print(f"{Fore.RED}Error: No file to save to. Make sure you specified a filename.")
        else:
            print(f"{Fore.RED}Invalid command '{command}'. Try again.")

# Function to handle the edit command
def handle_edit_command(df, row_index):
    print(f"{Fore.YELLOW}\nEditing Row: ", df.iloc[row_index])

    column_name = input(f"{Fore.CYAN}Enter column name: {Fore.WHITE}").strip()
    if column_name not in df.columns:
        print(f"{Fore.RED}Error: Column '{column_name}' does not exist.")
        return

    new_value = input(f"{Fore.CYAN}Enter new value for '{column_name}': {Fore.WHITE}").strip()
    
    if not new_value:
        print(f"{Fore.RED}Error: New value cannot be empty.")
        return
    
    # Update the value in the DataFrame
    old_value = df.at[row_index, column_name]
    df.at[row_index, column_name] = new_value
    print(f"{Fore.GREEN}Updated '{column_name}' from '{old_value}' to '{new_value}'.")

    # Display the updated row immediately
    clear_screen()
    print(f"{Fore.YELLOW}\nUpdated Row {row_index + 1}:")
    print(df.iloc[row_index])

def main():
    # Argument parsing
    parser = argparse.ArgumentParser(description="TouchUp: Command-line CSV data viewer.")
    parser.add_argument('filename', type=str, help="Path to the CSV file")
    parser.add_argument('--hero', type=str, help="Name of the column to display at the top of the page", default=None)
    args = parser.parse_args()

    # Load CSV data into a Pandas DataFrame
    try:
        df = load_csv(args.filename)
    except Exception as e:
        print(e)
        sys.exit(1)

    # Start the interactive paging through the DataFrame with optional hero column
    interactive_paging(df, hero_column=args.hero, filename=args.filename)

if __name__ == '__main__':
    main()