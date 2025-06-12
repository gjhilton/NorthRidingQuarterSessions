import argparse
import pandas as pd
import os
import platform
import sys
from colorama import init, Fore

# Initialize colorama for colored output
init(autoreset=True)

class TouchUp:
    def __init__(self, filename, hero_column=None):
        self.filename = filename
        self.hero_column = hero_column
        self.modified = False  # To track if the DataFrame was modified
        self.df = self.load_csv(filename)
        self.current_row = 0
        self.total_rows = len(self.df)
        self.command_map = {
            'next': self.next_row,
            'prev': self.prev_row,
            'edit': self.edit_row,
            'save': self.save,
            'quit': self.quit,
            'n': self.next_row,
            'p': self.prev_row,
            'e': self.edit_row,
            's': self.save,
            'q': self.quit
        }

    def load_csv(self, filename):
        if not os.path.exists(filename):
            raise FileNotFoundError(f"{Fore.RED}Error: The file '{filename}' does not exist.")
        if os.path.getsize(filename) == 0:  # Correct function name here
            raise ValueError(f"{Fore.RED}Error: The file '{filename}' is empty.")
        
        try:
            df = pd.read_csv(filename)
            if df.empty:
                raise ValueError(f"{Fore.RED}Error: The file '{filename}' does not contain valid data.")
            return df
        except Exception as e:
            raise ValueError(f"{Fore.RED}Error: Unable to parse the file '{filename}'. {e}")

    def save_csv(self):
        try:
            self.df.to_csv(self.filename, index=False)
            print(f"{Fore.GREEN}Changes saved to {self.filename}.")
        except Exception as e:
            print(f"{Fore.RED}Error: Unable to save the file '{self.filename}'. {e}")
        self.modified = False

    def clear_screen(self):
        system = platform.system()
        if system == "Windows":
            os.system('cls')  # Windows
        else:
            os.system('clear')  # Unix-based systems (Linux, macOS)

    def display_row(self):
        """Display the current row with row number and total rows"""
        self.clear_screen()
        if self.hero_column and self.hero_column in self.df.columns:
            print(f"{Fore.CYAN}\n{self.hero_column}: {self.df.iloc[self.current_row][self.hero_column]}")
        
        print(f"{Fore.YELLOW}\nRow {self.current_row + 1}/{self.total_rows}")
        for col in self.df.columns:
            print(f"{col}: {self.df.iloc[self.current_row][col]}")
    
    def display_commands(self):
        """Display available commands"""
        print(f"\n{Fore.MAGENTA}Commands:")
        print(f"  ({Fore.WHITE}n{Fore.GREEN})ext, ({Fore.WHITE}p{Fore.GREEN})rev, ({Fore.WHITE}e{Fore.GREEN})dit, ({Fore.WHITE}s{Fore.GREEN})ave, ({Fore.WHITE}q{Fore.RED})uit")

    def next_row(self):
        """Move to the next row"""
        self.current_row = (self.current_row + 1) % self.total_rows
        self.display_row()
    
    def prev_row(self):
        """Move to the previous row"""
        self.current_row = (self.current_row - 1) % self.total_rows
        self.display_row()

    def save(self):
        """Save the DataFrame to CSV"""
        if self.modified:
            save_prompt = input(f"{Fore.RED}You have unsaved changes. Save before quitting? (y/n): ").strip().lower()
            if save_prompt == 'y':
                self.save_csv()
        else:
            print(f"{Fore.GREEN}No changes to save.")

    def quit(self):
        """Quit the application"""
        if self.modified:
            save_prompt = input(f"{Fore.RED}You have unsaved changes. Save before quitting? (y/n): ").strip().lower()
            if save_prompt == 'y':
                self.save_csv()
        print(f"{Fore.GREEN}Goodbye!")
        sys.exit(0)

    def edit_row(self, *args):
        """Edit a row by providing a column name and new value"""
        if not args:
            # If no arguments are provided, prompt the user to choose a column
            self.handle_edit_column()
        elif len(args) == 1:
            # If one argument is provided, treat it as the column name and prompt for the new value
            self.handle_edit_value(args[0])
        elif len(args) >= 2:
            # Special case for 'edit' where we treat the remaining parts as the value
            column_name = args[0]
            value = " ".join(args[1:])  # Join everything after the first argument as the new value
            self.df.at[self.current_row, column_name] = value
            self.modified = True
            self.display_row()
            print(f"{Fore.GREEN}Successfully updated '{column_name}' to '{value}'.")

    def handle_edit_column(self):
        """Prompt user for the column to edit"""
        column_name = input(f"{Fore.CYAN}Enter the column name to edit (or press enter to cancel): {Fore.WHITE}").strip()
        if not column_name:
            print(f"{Fore.RED}Edit cancelled.")
            return
        if column_name not in self.df.columns:
            print(f"{Fore.RED}Error: Column '{column_name}' does not exist.")
            self.handle_edit_column()  # Retry if column name is invalid
        else:
            self.handle_edit_value(column_name)

    def handle_edit_value(self, column_name):
        """Prompt user for the new value"""
        current_value = self.df.at[self.current_row, column_name]
        new_value = input(f"{Fore.CYAN}Enter new value for '{column_name}' (current value: '{current_value}'): {Fore.WHITE}").strip()
        if new_value == '':
            new_value = current_value  # Default to current value if user presses Enter without input
        self.df.at[self.current_row, column_name] = new_value
        self.modified = True
        self.display_row()
        print(f"{Fore.GREEN}Successfully updated '{column_name}' to '{new_value}'.")

    def parse_command(self, command):
        """Parse the command and execute the corresponding action"""
        parts = command.strip().split()
        cmd = parts[0]
        args = parts[1:]
        
        if cmd in self.command_map:
            self.command_map[cmd](*args)
        else:
            print(f"{Fore.RED}Invalid command '{cmd}'. Try again.")

    def interactive_loop(self):
        """Main interactive loop to handle user input"""
        self.display_row()
        self.display_commands()
        
        while True:
            command = input(f"{Fore.CYAN}Enter command: {Fore.WHITE}").strip()
            self.parse_command(command)


def main():
    parser = argparse.ArgumentParser(description="TouchUp: Command-line CSV data viewer.")
    parser.add_argument('filename', type=str, help="Path to the CSV file")
    parser.add_argument('--hero', type=str, help="Name of the column to display at the top of the page", default=None)
    args = parser.parse_args()

    # Initialize the TouchUp app with provided CSV file
    app = TouchUp(args.filename, hero_column=args.hero)

    # Start the interactive loop
    app.interactive_loop()


if __name__ == '__main__':
    main()