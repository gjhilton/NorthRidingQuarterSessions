import argparse
import pandas as pd
import os
import platform
import sys
from colorama import init, Fore
import readline

init(autoreset=True)

class TouchUp:
    def __init__(self, filename, hero_column=None):
        self.filename = filename
        self.hero_column = hero_column
        self.modified = False
        self.df = self.load_csv(filename)
        self.current_row = 0
        self.total_rows = len(self.df)
        self.undo_stack = []
        self.redo_stack = []
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
            'q': self.quit,
            'undo': self.undo,
            'u': self.undo,
            'redo': self.redo,
            'r': self.redo,
            'help': self.show_help,
            '?': self.show_help
        }
        self.commands = list(self.command_map.keys())
        readline.set_completer(self.completer)
        readline.parse_and_bind("tab: complete")

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
            old_value = self.df.at[self.current_row, column_name]
            self.push_undo(self.current_row, column_name, old_value)
            self.df.at[self.current_row, column_name] = value
            self.modified = True
            self.redo_stack.clear()
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
        self.push_undo(self.current_row, column_name, current_value)
        self.df.at[self.current_row, column_name] = new_value
        self.modified = True
        self.redo_stack.clear()
        self.display_row()
        print(f"{Fore.GREEN}Successfully updated '{column_name}' to '{new_value}'.")

    def push_undo(self, row, column, old_value):
        self.undo_stack.append((row, column, old_value))
        if len(self.undo_stack) > 100:
            self.undo_stack.pop(0)

    def undo(self):
        if not self.undo_stack:
            print(f"{Fore.YELLOW}Nothing to undo.")
            return
        row, column, old_value = self.undo_stack.pop()
        current_value = self.df.at[row, column]
        self.redo_stack.append((row, column, current_value))
        self.df.at[row, column] = old_value
        self.modified = True
        self.current_row = row
        self.display_row()
        print(f"{Fore.GREEN}Undo: Restored '{column}' to '{old_value}' in row {row + 1}.")

    def redo(self):
        if not self.redo_stack:
            print(f"{Fore.YELLOW}Nothing to redo.")
            return
        row, column, value = self.redo_stack.pop()
        old_value = self.df.at[row, column]
        self.undo_stack.append((row, column, old_value))
        self.df.at[row, column] = value
        self.modified = True
        self.current_row = row
        self.display_row()
        print(f"{Fore.GREEN}Redo: Reapplied '{column}' to '{value}' in row {row + 1}.")

    def show_help(self):
        print(f"\n{Fore.MAGENTA}Available Commands:")
        print(f"  {Fore.GREEN}n{Fore.WHITE} or {Fore.GREEN}next{Fore.WHITE}     - Go to next row")
        print(f"  {Fore.GREEN}p{Fore.WHITE} or {Fore.GREEN}prev{Fore.WHITE}     - Go to previous row")
        print(f"  {Fore.GREEN}e{Fore.WHITE} or {Fore.GREEN}edit{Fore.WHITE}     - Edit current row")
        print(f"  {Fore.GREEN}s{Fore.WHITE} or {Fore.GREEN}save{Fore.WHITE}     - Save changes to file")
        print(f"  {Fore.RED}q{Fore.WHITE} or {Fore.RED}quit{Fore.WHITE}     - Quit the application")
        print(f"  {Fore.GREEN}u{Fore.WHITE} or {Fore.GREEN}undo{Fore.WHITE}     - Undo last edit")
        print(f"  {Fore.GREEN}r{Fore.WHITE} or {Fore.GREEN}redo{Fore.WHITE}     - Redo last undo")
        print(f"  {Fore.GREEN}help{Fore.WHITE} or {Fore.GREEN}?{Fore.WHITE}     - Show this help menu")

    def completer(self, text, state):
        matches = [cmd for cmd in self.commands if cmd.startswith(text)]
        return matches[state] if state < len(matches) else None

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
        while True:
            prompt = (
                f"{Fore.CYAN}Enter command "
                f"{Fore.WHITE}("
                f"{Fore.GREEN}n{Fore.WHITE}:next, "
                f"{Fore.GREEN}p{Fore.WHITE}:prev, "
                f"{Fore.GREEN}e{Fore.WHITE}:edit, "
                f"{Fore.GREEN}s{Fore.WHITE}:save, "
                f"{Fore.RED}q{Fore.WHITE}:quit, "
                f"{Fore.GREEN}u{Fore.WHITE}:undo, "
                f"{Fore.GREEN}r{Fore.WHITE}:redo, "
                f"{Fore.GREEN}?{Fore.WHITE}:help"
                f"{Fore.WHITE}): "
            )
            try:
                command = input(prompt).strip()
                self.parse_command(command)
            except (EOFError, KeyboardInterrupt):
                print(f"\n{Fore.RED}Interrupted. Type 'q' to quit safely.")

def main():
    parser = argparse.ArgumentParser(description="TouchUp: Command-line CSV data viewer.")
    parser.add_argument('filename', type=str, help="Path to the CSV file")
    parser.add_argument('--hero', type=str, help="Name of the column to display at the top of the page", default=None)
    args = parser.parse_args()

    app = TouchUp(args.filename, hero_column=args.hero)
    app.interactive_loop()

if __name__ == '__main__':
    main()