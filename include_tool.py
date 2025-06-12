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

def reset_include_column(df):
    df['include'] = None
    print(f"{timestamp()} {Fore.YELLOW}🔄 'include' column has been reset.")

def prompt_for_file_and_reset():
    filepath = input("Enter the path to your CSV file: ").strip()
    reset = None
    while reset not in ['y', 'n']:
        reset = input("Would you like to reset all 'include' values? (y/n): ").strip().lower()
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
            # fallback to string/object dtype
            return value_str
    except Exception as e:
        print(f"{Fore.RED}Error casting value: {e}")
        return value_str

def edit_row_fields(df, row_idx, filepath):
    editable_cols = [col for col in df.columns if col != 'include']

    while True:
        clear_screen()
        print(f"{Fore.MAGENTA}Editing fields for row {row_idx}\n")

        for col in editable_cols:
            print(f"{col}: {df.at[row_idx, col]}")

        print("\nType the field name to edit, or 'done' to finish editing.")

        choice = input("Field to edit (or done): ").strip()
        if choice.lower() == 'done':
            clear_screen()
            print(f"{Fore.GREEN}Finished editing fields for row {row_idx}.\n")
            break
        if choice not in editable_cols:
            print(f"{Fore.RED}Field '{choice}' does not exist or cannot be edited.")
            input(f"{Style.DIM}Press Enter to continue...")
            continue

        old_value = df.at[row_idx, choice]
        new_value = input(f"Enter new value for {choice} [{old_value}]: ").strip()
        if new_value != "":
            new_value_casted = cast_value(df, row_idx, choice, new_value)
            df.at[row_idx, choice] = new_value_casted
            save_csv(df, filepath)
            print(f"{Fore.YELLOW}  → Updated '{choice}' to '{new_value_casted}'")
        input(f"{Style.DIM}Press Enter to continue...")

def ask_user(row, current_num, total_remaining, global_index, df):
    print(f"{Fore.CYAN}📄 Processing row {current_num} of {total_remaining} (CSV index {global_index})\n")
    print(row.drop(labels='include', errors='ignore'))

    editable_cols = [col for col in df.columns if col != 'include']

    while True:
        decision = input(f"\n{Fore.CYAN}Include this row? (y/n, skip, undo, edit <field> [value]): ").strip()
        lower = decision.lower()

        if lower in ['y', 'n', 'undo', 'skip', 's']:
            return lower, None, None

        if lower.startswith('edit'):
            parts = decision.split(maxsplit=2)  # up to 3 parts: edit, field, value
            if len(parts) == 1:
                # Just 'edit' - open full edit menu
                return 'edit', None, None
            elif len(parts) == 2:
                field = parts[1].strip()
                if field in editable_cols:
                    return 'edit_field', field, None
                else:
                    print(f"{Fore.RED}Field '{field}' does not exist or cannot be edited.")
                    continue
            else:
                field = parts[1].strip()
                value = parts[2].strip()
                if field in editable_cols:
                    return 'edit_field_value', field, value
                else:
                    print(f"{Fore.RED}Field '{field}' does not exist or cannot be edited.")
                    continue
        print(f"{Fore.RED}Invalid input. Please enter 'y', 'n', 'skip', 'undo', 'edit', or 'edit <field> [value]'.")

def process_rows(df, filepath, do_reset=False):
    if 'include' not in df.columns:
        df['include'] = None
    elif do_reset:
        reset_include_column(df)
        save_csv(df, filepath)

    history = []
    index = 0
    pending = df[df['include'].isna()].index.tolist()

    while index < len(pending):
        clear_screen()

        row_idx = pending[index]
        row = df.loc[row_idx]
        total = len(pending)
        current = index + 1

        while True:
            decision, field, value = ask_user(row, current, total, row_idx, df)

            if decision == 'edit':
                edit_row_fields(df, row_idx, filepath)
                row = df.loc[row_idx]  # refresh after edit
                continue

            elif decision == 'edit_field':
                old_value = df.at[row_idx, field]
                new_value = input(f"Enter new value for {field} [{old_value}]: ").strip()
                if new_value != "":
                    new_value_casted = cast_value(df, row_idx, field, new_value)
                    df.at[row_idx, field] = new_value_casted
                    save_csv(df, filepath)
                    print(f"{Fore.YELLOW}  → Updated '{field}' to '{new_value_casted}'")
                input(f"{Style.DIM}Press Enter to continue...")
                clear_screen()
                row = df.loc[row_idx]  # refresh
                continue

            elif decision == 'edit_field_value':
                new_value_casted = cast_value(df, row_idx, field, value)
                df.at[row_idx, field] = new_value_casted
                save_csv(df, filepath)
                print(f"{Fore.YELLOW}  → Updated '{field}' to '{new_value_casted}'")
                input(f"{Style.DIM}Press Enter to continue...")
                clear_screen()
                row = df.loc[row_idx]  # refresh
                continue

            elif decision == 'undo':
                if not history:
                    print(f"{Fore.YELLOW}Nothing to undo.")
                    input(f"{Style.DIM}Press Enter to continue...")
                    clear_screen()
                    break  # re-prompt this row
                last_idx, previous_value = history.pop()
                df.at[last_idx, 'include'] = previous_value
                save_csv(df, filepath)
                print(f"\n{timestamp()} {Fore.YELLOW}🔙 Undo successful. Reverted row {last_idx}.")
                input(f"{Style.DIM}Press Enter to continue...")
                index = pending.index(last_idx)
                clear_screen()
                break  # restart from undone row

            elif decision in ['skip', 's']:
                print(f"\n{timestamp()} {Fore.YELLOW}⏭️ Skipped row {row_idx}, no changes made.")
                input(f"{Style.DIM}Press Enter to continue...")
                index += 1
                break

            elif decision in ['y', 'n']:
                history.append((row_idx, df.at[row_idx, 'include']))
                df.at[row_idx, 'include'] = 'yes' if decision == 'y' else 'no'

                save_csv(df, filepath)
                print(f"\n{timestamp()} {Fore.GREEN}✅ Row {row_idx} updated and saved.")
                input(f"{Style.DIM}Press Enter to continue...")
                index += 1
                break

def main():
    parser = argparse.ArgumentParser(description="Interactive CSV row inclusion tool.")
    parser.add_argument('--file', help="Path to the CSV file.")
    parser.add_argument('--reset', action='store_true', help="Reset all 'include' values.")

    args = parser.parse_args()

    if not args.file:
        filepath, do_reset = prompt_for_file_and_reset()
    else:
        filepath = args.file
        do_reset = args.reset

    df = load_csv(filepath)
    if df is not None:
        process_rows(df, filepath, do_reset=do_reset)

if __name__ == "__main__":
    main()
