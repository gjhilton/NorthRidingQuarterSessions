import argparse
import pandas as pd
import os
import platform
import sys
from datetime import datetime
from colorama import init, Fore
import io

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
            'redo': self.redo,
            'g': self.go,
            'go': self.go,
            'f': self.find_value,
            'find': self.find_value
        }

    def load_csv(self, filename):
        if not os.path.exists(filename):
            raise FileNotFoundError(f"{Fore.RED}Error: The file '{filename}' does not exist.")
        if os.path.getsize(filename) == 0:
            raise ValueError(f"{Fore.RED}Error: The file '{filename}' is empty.")
        try:
            df = pd.read_csv(filename)
            if df.empty or df.isnull().all().all():
                raise ValueError(f"{Fore.RED}Error: The file '{filename}' does not contain valid data.")
            return df
        except Exception as e:
            raise ValueError(f"{Fore.RED}Error: Unable to parse the file '{filename}'. {e}")

    def save_csv(self, filename=None):
        if filename is None:
            base, ext = os.path.splitext(self.filename)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{base}_{timestamp}{ext}"
        try:
            self.df.to_csv(filename, index=False)
            print(f"{Fore.GREEN}Changes saved to {filename}.")
        except Exception as e:
            print(f"{Fore.RED}Error: Unable to save the file '{filename}'. {e}")
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
        print(f"  ({Fore.WHITE}n{Fore.GREEN})ext, ({Fore.WHITE}p{Fore.GREEN})rev, ({Fore.WHITE}e{Fore.GREEN})dit, "
              f"({Fore.WHITE}s{Fore.GREEN})ave, ({Fore.WHITE}q{Fore.RED})uit, ({Fore.WHITE}undo{Fore.GREEN}), "
              f"({Fore.WHITE}redo{Fore.GREEN}), ({Fore.WHITE}g{Fore.GREEN})o, ({Fore.WHITE}f{Fore.GREEN})ind")

    def next_row(self, *args):
        self.current_row = (self.current_row + 1) % self.total_rows
        self.display_row()

    def prev_row(self, *args):
        self.current_row = (self.current_row - 1) % self.total_rows
        self.display_row()

    def save(self, *args):
        if self.modified:
            save_prompt = input(f"{Fore.RED}You have unsaved changes. Save now? (y/n): ").strip().lower()
            if save_prompt == 'y':
                self.save_csv()
        else:
            print(f"{Fore.GREEN}No changes to save.")

    def quit(self, *args):
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
        else:
            column_name = args[0]
            value = " ".join(args[1:])
            if column_name not in self.df.columns:
                print(f"{Fore.RED}Error: Column '{column_name}' does not exist.")
                return
            self.push_undo()
            self.df.at[self.current_row, column_name] = self.cast_value(column_name, value)
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
        self.push_undo()
        self.df.at[self.current_row, column_name] = self.cast_value(column_name, new_value)
        self.modified = True
        self.redo_stack.clear()
        self.display_row()
        print(f"{Fore.GREEN}Successfully updated '{column_name}' to '{new_value}'.")

    def cast_value(self, column_name, value):
        col_dtype = self.df[column_name].dtype
        try:
            if pd.api.types.is_integer_dtype(col_dtype):
                return int(value)
            elif pd.api.types.is_float_dtype(col_dtype):
                return float(value)
            else:
                return value
        except Exception:
            return value

    def push_undo(self):
        snapshot = self.df.copy(deep=True)
        self.undo_stack.append((snapshot, self.current_row))

    def undo(self, *args):
        if not self.undo_stack:
            print(f"{Fore.YELLOW}Nothing to undo.")
            return
        self.redo_stack.append((self.df.copy(deep=True), self.current_row))
        snapshot, row = self.undo_stack.pop()
        self.df = snapshot
        self.current_row = row
        self.modified = True
        self.display_row()
        print(f"{Fore.GREEN}Undo successful.")

    def redo(self, *args):
        if not self.redo_stack:
            print(f"{Fore.YELLOW}Nothing to redo.")
            return
        self.undo_stack.append((self.df.copy(deep=True), self.current_row))
        snapshot, row = self.redo_stack.pop()
        self.df = snapshot
        self.current_row = row
        self.modified = True
        self.display_row()
        print(f"{Fore.GREEN}Redo successful.")

    def go(self, *args):
        if args:
            try:
                row_num = int(args[0])
            except ValueError:
                print(f"{Fore.RED}Invalid row number '{args[0]}'.")
                return
        else:
            try:
                row_num = int(input(f"{Fore.CYAN}Enter row number to go to (1-{self.total_rows}): {Fore.WHITE}").strip())
            except ValueError:
                print(f"{Fore.RED}Invalid input.")
                return
        if 1 <= row_num <= self.total_rows:
            self.current_row = row_num - 1
            self.display_row()
        else:
            print(f"{Fore.RED}Row number {row_num} out of range (1-{self.total_rows}).")

    def find_value(self, *args):
        if len(args) >= 2:
            column_name = args[0]
            search_value = " ".join(args[1:])
        else:
            column_name = input(f"{Fore.CYAN}Enter column name to search: {Fore.WHITE}").strip()
            if column_name not in self.df.columns:
                print(f"{Fore.RED}Column '{column_name}' does not exist.")
                return
            search_value = input(f"{Fore.CYAN}Enter value to find in '{column_name}': {Fore.WHITE}").strip()
        if column_name not in self.df.columns:
            print(f"{Fore.RED}Column '{column_name}' does not exist.")
            return
        mask = self.df[column_name].astype(str).str.contains(search_value, case=False, na=False)
        if mask.any():
            self.current_row = mask.idxmax()
            self.display_row()
            print(f"{Fore.GREEN}Found match for '{search_value}' in column '{column_name}'.")
        else:
            print(f"{Fore.YELLOW}No match found for '{search_value}' in column '{column_name}'.")

    def parse_command(self, cmd_line):
        if not cmd_line:
            return
        parts = cmd_line.strip().split()
        cmd = parts[0].lower()
        args = parts[1:]
        func = self.command_map.get(cmd)
        if func:
            func(*args)
        else:
            print(f"{Fore.RED}Unknown command '{cmd}'. Please enter a valid command.")

    def run(self):
        self.display_row()
        while True:
            self.display_commands()
            prompt = (f"{Fore.WHITE}Enter command: ")
            cmd_line = input(prompt)
            self.parse_command(cmd_line)


def main():
    parser = argparse.ArgumentParser(description="TouchUp CSV Editor")
    parser.add_argument("filename", help="CSV file to edit")
    parser.add_argument("--hero", help="Column name to highlight")
    parser.add_argument("--test", action="store_true", help="Run test suite")
    args = parser.parse_args()

    if args.test:
        import pytest
        sys.exit(pytest.main([__file__]))

    try:
        app = TouchUp(args.filename, args.hero)
        app.run()
    except Exception as e:
        print(e)
        sys.exit(1)


if __name__ == "__main__":
    main()


########### TESTS BELOW ##############

import pytest

@pytest.fixture
def sample_csv(tmp_path):
    p = tmp_path / "test.csv"
    p.write_text("Name,Age,City\nAlice,30,London\nBob,25,Paris\nCharlie,35,Berlin\n")
    return str(p)

@pytest.fixture
def app(sample_csv):
    return TouchUp(sample_csv, hero_column="Name")

def test_load_csv_valid(sample_csv):
    app = TouchUp(sample_csv)
    assert len(app.df) == 3
    assert "Name" in app.df.columns

def test_load_csv_invalid(tmp_path):
    bad_file = tmp_path / "bad.csv"
    bad_file.write_text(",,,,\n,,,,")
    with pytest.raises(ValueError):
        TouchUp(str(bad_file))

def test_save_with_modifications(app, tmp_path, capsys):
    app.modified = True
    # forcibly save with a known filename
    filename = tmp_path / "out.csv"
    app.save_csv(str(filename))
    captured = capsys.readouterr()
    assert "Changes saved" in captured.out
    assert os.path.exists(str(filename))

def test_clear_screen(app):
    # just call - no error expected
    app.clear_screen()

def test_display_row(app, capsys):
    app.display_row()
    out = capsys.readouterr().out
    assert "Name" in out
    assert "Age" in out

def test_next_prev_row(app):
    first = app.current_row
    app.next_row()
    assert app.current_row == (first + 1) % app.total_rows
    app.prev_row()
    assert app.current_row == first

def test_edit_row_one_arg(monkeypatch, app, capsys):
    monkeypatch.setattr('builtins.input', lambda _: "50")
    app.edit_row("Age")
    out = capsys.readouterr().out
    assert "Successfully updated" in out
    assert app.df.at[app.current_row, "Age"] == 50

def test_edit_row_two_args(app, capsys):
    old_val = app.df.at[app.current_row, "Age"]
    app.edit_row("Age", "45")
    out = capsys.readouterr().out
    assert "Successfully updated" in out
    assert app.df.at[app.current_row, "Age"] == 45
    assert app.modified

def test_undo_redo(app, capsys):
    old_val = app.df.at[app.current_row, "Age"]
    app.push_undo()
    app.df.at[app.current_row, "Age"] = 100
    app.modified = True
    app.undo()
    out = capsys.readouterr().out
    assert app.df.at[app.current_row, "Age"] == old_val
    app.redo()
    out2 = capsys.readouterr().out
    assert app.df.at[app.current_row, "Age"] == 100

def test_go_valid(app, capsys):
    app.go("2")
    assert app.current_row == 1

def test_go_invalid(app, capsys):
    app.go("999")
    out = capsys.readouterr().out
    assert "out of range" in out

def test_find_value_exact(app, capsys):
    app.find_value("Name", "Bob")
    assert app.current_row == 1
    out = capsys.readouterr().out
    assert "Found match" in out

def test_find_value_none(app, capsys):
    app.find_value("Name", "Zed")
    out = capsys.readouterr().out
    assert "No match" in out

def test_parse_command_valid(app, capsys):
    app.parse_command("n")
    out = capsys.readouterr().out
    assert "Row" in out

def test_parse_command_invalid(app, capsys):
    app.parse_command("xyz")
    out = capsys.readouterr().out
    assert "Unknown command" in out

def test_cast_value(app):
    assert isinstance(app.cast_value("Age", "123"), int)
    assert isinstance(app.cast_value("Name", "abc"), str)