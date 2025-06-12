## python3 -m  include_tool --file data.csv --reset
## python3 -m  include_tool --file data.csv
## python3 -m  include_tool 

import pandas as pd
import os
import argparse
from datetime import datetime
from colorama import init, Fore, Style

init(autoreset=True)

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def timestamp():
    return f"{Style.DIM}[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}]"

def load_csv(filepath):
    if not os.path.exists(filepath):
        print(f"{timestamp()} {Fore.RED}❌ File not found: {filepath}")
        return None
    return pd.read_csv(filepath)

def save_csv(df, filepath):
    df.to_csv(filepath, index=False)

def reset_reviewed_column(df):
    df['reviewed'] = None
    print(f"{timestamp()} {Fore.YELLOW}🔄 All 'reviewed' values reset.")

def prompt_for_file_and_reset():
    filepath = input(f"{Fore.CYAN}Enter path to CSV file: ").strip()
    reset = None
    while reset not in ['y', 'n']:
        reset = input(f"{Fore.CYAN}Reset all 'reviewed' values? (y/n): ").strip().lower()
    return filepath, (reset == 'y')

def cast_value(df, row_idx, column, value_str):
    dtype = df[column].dtype
    try:
        if pd.api.types.is_integer_dtype(dtype):
            return int(value_str)
        elif pd.api.types.is_float_dtype(dtype):
            return float(value_str)
        elif pd.api.types.is_bool_dtype(dtype):
            val = value_str.lower()
            if val in ['true', '1', 'yes', 'y']:
                return True
            elif val in ['false', '0', 'no', 'n']:
                return False
            else:
                raise ValueError(f"Cannot convert '{value_str}' to bool.")
        else:
            return value_str
    except Exception as e:
        print(f"{Fore.RED}⚠️ Value conversion error: {e}")
        return value_str

def print_row(row, exclude_cols=['reviewed']):
    for col in row.index:
        if col not in exclude_cols:
            print(f"{Fore.YELLOW}{col}: {Style.RESET_ALL}{row[col]}")

def print_help():
    clear_screen()
    print(f"""{Fore.CYAN}
Usage Commands:

 y          - Mark the row as reviewed with YES
 n          - Mark the row as reviewed with NO
 skip / s   - Skip this row and review later
 undo       - Undo last reviewed change
 edit       - Enter field editing mode
 edit <field>             - Edit the specified field interactively
 edit <field> <new_value> - Edit the specified field with new value directly
 help / h   - Show this help message
{Style.RESET_ALL}
Press Enter to return to the current row...
""")
    input()

def edit_row_fields(df, row_idx, filepath):
    editable_cols = [col for col in df.columns if col != 'reviewed']

    while True:
        clear_screen()
        print(f"{Fore.MAGENTA}✏️ Editing row {row_idx}\n")
        print_row(df.loc[row_idx])

        print(f"\n{Fore.CYAN}Type the field name to edit or {Fore.GREEN}'done'{Fore.CYAN} to finish editing.")
        choice = input(f"{Fore.CYAN}Field to edit (or done): ").strip()

        if choice.lower() == 'done':
            clear_screen()
            print(f"{Fore.GREEN}✔ Finished editing row {row_idx}.\n")
            break

        if choice.lower() in ['help', 'h']:
            print_help()
            continue

        if choice not in editable_cols:
            print(f"{Fore.RED}❌ Field '{choice}' does not exist or is not editable.")
            input(f"{Style.DIM}Press Enter to try again...")
            continue

        old_value = df.at[row_idx, choice]
        new_value = input(f"{Fore.CYAN}Enter new value for {choice} [{old_value}]: ").strip()
        if new_value != "":
            new_value_casted = cast_value(df, row_idx, choice, new_value)
            df.at[row_idx, choice] = new_value_casted
            save_csv(df, filepath)
            print(f"{Fore.GREEN}✓ Updated '{choice}' to '{new_value_casted}'")
        else:
            print(f"{Fore.YELLOW}No change made to '{choice}'.")
        input(f"{Style.DIM}Press Enter to continue...")

def ask_user(row, current_num, total_remaining, global_index, df):
    clear_screen()
    print(f"{Fore.CYAN}📄 Row {current_num}/{total_remaining} (CSV index {global_index})\n")
    print_row(row)

    prompt = (
        f"\n{Fore.GREEN}Mark this row as reviewed? {Fore.YELLOW}[y]{Style.RESET_ALL}/"
        f"{Fore.RED}[n]{Style.RESET_ALL}, {Fore.CYAN}'skip'{Style.RESET_ALL}, "
        f"{Fore.MAGENTA}'undo'{Style.RESET_ALL}, {Fore.BLUE}'edit <field> [value]'{Style.RESET_ALL}, "
        f"{Fore.CYAN}'help'{Style.RESET_ALL}\n"
        f"Choice: "
    )
    while True:
        decision = input(prompt).strip()
        lower = decision.lower()

        if lower in ['y', 'n', 'undo', 'skip', 's']:
            return lower, None, None

        if lower in ['help', 'h']:
            print_help()
            continue

        if lower.startswith('edit'):
            parts = decision.split(maxsplit=2)
            editable_cols = [col for col in df.columns if col != 'reviewed']
            if len(parts) == 1:
                return 'edit', None, None
            elif len(parts) == 2:
                field = parts[1]
                if field in editable_cols:
                    return 'edit_field', field, None
                else:
                    print(f"{Fore.RED}❌ Field '{field}' does not exist or is not editable.")
                    continue
            else:
                field = parts[1]
                value = parts[2]
                if field in editable_cols:
                    return 'edit_field_value', field, value
                else:
                    print(f"{Fore.RED}❌ Field '{field}' does not exist or is not editable.")
                    continue

        print(f"{Fore.RED}❌ Invalid input. Please enter one of: y, n, skip, undo, edit <field> [value], help.")

def process_rows(df, filepath, do_reset=False):
    if 'reviewed' not in df.columns:
        df['reviewed'] = None
    elif do_reset:
        clear_screen()
        print(f"{Fore.YELLOW}⚠️ You chose to reset all 'reviewed' values.")
        confirm = input(f"{Fore.CYAN}Confirm reset? This cannot be undone. (y/n): ").strip().lower()
        if confirm == 'y':
            reset_reviewed_column(df)
            save_csv(df, filepath)
        else:
            print(f"{Fore.GREEN}✅ Reset cancelled.")
            input(f"{Style.DIM}Press Enter to continue...")

    history = []
    unreviewed = df[df['reviewed'].isna()].index.tolist()
    skipped = []
    index = 0

    clear_screen()
    print(f"{Fore.CYAN}Processing file: {filepath}")
    print(f"{Fore.CYAN}Total rows: {len(df)}")
    print(f"{Fore.CYAN}Rows to review: {len(unreviewed)}")
    input(f"{Style.DIM}Press Enter to start reviewing...")

    if not unreviewed:
        print(f"{Fore.GREEN}✅ All rows have already been processed.")
        return

    while unreviewed or skipped:
        if index >= len(unreviewed):
            unreviewed, skipped = skipped, []
            index = 0
            if not unreviewed:
                break

        row_idx = unreviewed[index]
        row = df.loc[row_idx]
        current = index + 1
        total = len(unreviewed)

        decision, field, value = ask_user(row, current, total, row_idx, df)

        if decision == 'edit':
            edit_row_fields(df, row_idx, filepath)
            continue

        elif decision == 'edit_field':
            old_value = df.at[row_idx, field]
            new_value = input(f"{Fore.CYAN}Enter new value for {field} [{old_value}]: ").strip()
            if new_value != "":
                new_value_casted = cast_value(df, row_idx, field, new_value)
                df.at[row_idx, field] = new_value_casted
                save_csv(df, filepath)
                print(f"{Fore.GREEN}✓ Updated '{field}' to '{new_value_casted}'")
            else:
                print(f"{Fore.YELLOW}No change made to '{field}'.")
            input(f"{Style.DIM}Press Enter to continue...")
            continue

        elif decision == 'edit_field_value':
            new_value_casted = cast_value(df, row_idx, field, value)
            df.at[row_idx, field] = new_value_casted
            save_csv(df, filepath)
            print(f"{Fore.GREEN}✓ Updated '{field}' to '{new_value_casted}'")
            input(f"{Style.DIM}Press Enter to continue...")
            continue

        elif decision == 'undo':
            if not history:
                print(f"{Fore.YELLOW}⚠️ Nothing to undo.")
                input(f"{Style.DIM}Press Enter to continue...")
                continue
            last_idx, prev_value = history.pop()
            df.at[last_idx, 'reviewed'] = prev_value
            save_csv(df, filepath)
            print(f"\n{timestamp()} {Fore.MAGENTA}↩️ Undo: Reverted 'reviewed' on row {last_idx}.")
            input(f"{Style.DIM}Press Enter to continue...")
            unreviewed = df[df['reviewed'].isna()].index.tolist()
            skipped = []
            index = 0
            continue

        elif decision in ['skip', 's']:
            print(f"\n{timestamp()} {Fore.YELLOW}⏭️ Skipped row {row_idx} — no changes made.")
            input(f"{Style.DIM}Press Enter to continue...")
            skipped.append(row_idx)
            index += 1
            continue

        elif decision in ['y', 'n']:
            prev_value = df.at[row_idx, 'reviewed']
            history.append((row_idx, prev_value))
            df.at[row_idx, 'reviewed'] = 'yes' if decision == 'y' else 'no'
            save_csv(df, filepath)
            print(f"\n{timestamp()} {Fore.GREEN}✔ Row {row_idx} marked as reviewed: {'yes' if decision=='y' else 'no'}. Saved.")
            input(f"{Style.DIM}Press Enter to continue...")
            index += 1
            continue

def main():
    parser = argparse.ArgumentParser(
        description="Interactive CSV row review tool.",
        epilog="Example usage:\n  python tool.py --file data.csv --reset\n\n"
               "If no arguments are given, you will be prompted interactively.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--file', help="Path to the CSV file.")
    parser.add_argument('--reset', action='store_true', help="Reset all 'reviewed' values.")

    args = parser.parse_args()

    if not args.file:
        filepath, do_reset = prompt_for_file_and_reset()
    else:
        filepath = args.file
        do_reset = args.reset

    df = load_csv(filepath)
    if df is not None:
        process_rows(df, filepath, do_reset=do_reset)
        clear_screen()
        print(f"{Fore.GREEN}🎉 All done! CSV saved to {filepath}")

if __name__ == "__main__":
    main()
