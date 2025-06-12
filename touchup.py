"""
TouchUp CLI CSV Editor - Private Developer Notes and Context

PROJECT OVERVIEW:
- Interactive command-line app to view and edit CSV files row-by-row.
- Supports paging, editing, saving, and quitting with unsaved changes warnings.
- Optional 'hero' column to highlight at the top of each row display.
- Clean, concise UI with colored output for usability.

KEY FEATURES IMPLEMENTED:
- Load CSV with error handling for file existence, emptiness, and parse errors.
- Page forward/backward through rows, looping around edges.
- Clear screen between views (cross-platform).
- Display current row number and total rows, plus hero column if specified.
- Show only column names and values (no Pandas metadata clutter).
- Commands: next (n), prev (p), edit (e), save (s), quit (q).
- Flexible edit command syntax handling:
    1) edit                   -> prompt for field, then value
    2) edit <field>           -> prompt for value
    3) edit <field> <value>   -> update immediately, multi-word value supported
- Track if data has been modified since last save.
- Prompt to save before quitting if there are unsaved changes.

CODE ARCHITECTURE NOTES:
- Encapsulated in a TouchUp class holding DataFrame, filename, current index, and state flags.
- Command map dictionary maps command strings to methods.
- Modular command methods for maintainability and extensibility.
- Uses colorama for color output; platform-agnostic screen clearing.
- Input parsing carefully handles edit command's unique argument structure.
- No external dependencies besides pandas and colorama.

FUTURE WORK / EXTENSIONS:
- Add more commands (filter, search, batch edit, undo/redo).
- Better input validation for types/formats.
- Richer CLI UI frameworks for improved UX.
- Comprehensive automated tests.
- Possibly refactor display logic into a separate class/module.

IMPORTANT TECH DETAILS:
- Use os.path.getsize() correctly to check file size.
- Validate column names on edits to prevent crashes.
- On edit prompts, default to current value if user enters nothing.
- Always sync DataFrame updates with on-screen display immediately.
- Save overwrites original CSV file without backup.
- Command parsing treats everything after fieldname as a single value for 'edit'.
- Colorama auto-resets colors after each print.
- Case sensitivity of commands is exact (can consider improving later).

KNOWN THINGS TO WATCH:
- Avoid showing Pandas Series metadata in display.
- Handle empty or invalid user inputs gracefully.
- The 'edit' command is a multi-stage state machine:
    * If no field specified, prompt for it.
    * If field specified but no value, prompt for value.
    * If both given, update directly.
- Confirm modified flag is set properly whenever an edit happens.

HOW TO RESUME WORK:
- Focus on making the edit command bulletproof with flexible inputs.
- Add new commands to command_map following existing patterns.
- Improve input validation and UX polish.
- Add automated tests covering all edge cases.

This comment block should provide all the context needed to pick up development quickly and maintain code quality.

"""

import argparse
import pandas as pd
import os
import platform
import sys
from colorama import init, Fore

init(autoreset=True)

class TouchUp:
    def __init__(self, filename, hero_column=None):
        self.filename = filename
        self.hero_column = hero_column
        self.modified = False
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
        if os.path.getsize(filename) == 0:
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
            os.system('cls')
        else:
            os.system('clear')

    def display_row(self):
        self.clear_screen()
        if self.hero_column and self.hero_column in self.df.columns:
            print(f"{Fore.CYAN}\n{self.hero_column}: {self.df.iloc[self.current_row][self.hero_column]}")
        print(f"{Fore.YELLOW}\nRow {self.current_row + 1}/{self.total_rows}")
        for col in self.df.columns:
            print(f"{col}: {self.df.iloc[self.current_row][col]}")
    
    def display_commands(self):
        print(f"\n{Fore.MAGENTA}Commands:")
        print(f"  ({Fore.WHITE}n{Fore.GREEN})ext, ({Fore.WHITE}p{Fore.GREEN})rev, ({Fore.WHITE}e{Fore.GREEN})dit, ({Fore.WHITE}s{Fore.GREEN})ave, ({Fore.WHITE}q{Fore.RED})uit")

    def next_row(self):
        self.current_row = (self.current_row + 1) % self.total_rows
        self.display_row()
    
    def prev_row(self):
        self.current_row = (self.current_row - 1) % self.total_rows
        self.display_row()

    def save(self):
        if self.modified:
            save_prompt = input(f"{Fore.RED}You have unsaved changes. Save before quitting? (y/n): ").strip().lower()
            if save_prompt == 'y':
                self.save_csv()
        else:
            print(f"{Fore.GREEN}No changes to save.")

    def quit(self):
        if self.modified:
            save_prompt = input(f"{Fore.RED}You have unsaved changes. Save before quitting? (y/n): ").strip().lower()
            if save_prompt == 'y':
                self.save_csv()
        print(f"{Fore.GREEN}Goodbye!")
        sys.exit(0)

    def edit_row(self, *args):
        if not args:
            self.handle_edit_column()
        elif len(args) == 1:
            self.handle_edit_value(args[0])
        elif len(args) >= 2:
            column_name = args[0]
            value = " ".join(args[1:])
            if column_name not in self.df.columns:
                print(f"{Fore.RED}Error: Column '{column_name}' does not exist.")
                return
            self.df.at[self.current_row, column_name] = value
            self.modified = True
            self.display_row()
            print(f"{Fore.GREEN}Successfully updated '{column_name}' to '{value}'.")

    def handle_edit_column(self):
        column_name = input(f"{Fore.CYAN}Enter the column name to edit (or press enter to cancel): {Fore.WHITE}").strip()
        if not column_name:
            print(f"{Fore.RED}Edit cancelled.")
            return
        if column_name not in self.df.columns:
            print(f"{Fore.RED}Error: Column '{column_name}' does not exist.")
            self.handle_edit_column()
        else:
            self.handle_edit_value(column_name)

    def handle_edit_value(self, column_name):
        current_value = self.df.at[self.current_row, column_name]
        new_value = input(f"{Fore.CYAN}Enter new value for '{column_name}' (current value: '{current_value}'): {Fore.WHITE}").strip()
        if new_value == '':
            new_value = current_value
        self.df.at[self.current_row, column_name] = new_value
        self.modified = True
        self.display_row()
        print(f"{Fore.GREEN}Successfully updated '{column_name}' to '{new_value}'.")

    def parse_command(self, command):
        parts = command.strip().split()
        if not parts:
            return
        cmd = parts[0]
        args = parts[1:]
        if cmd in self.command_map:
            self.command_map[cmd](*args)
        else:
            print(f"{Fore.RED}Invalid command '{cmd}'. Try again.")

    def interactive_loop(self):
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

    app = TouchUp(args.filename, hero_column=args.hero)
    app.interactive_loop()

if __name__ == '__main__':
    main()