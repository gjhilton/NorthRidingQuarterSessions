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

def ask_user(row, current_num, total_remaining, global_index):
    print(f"{Fore.CYAN}📄 Processing row {current_num} of {total_remaining} (CSV index {global_index})\n")
    print(row.drop(labels='include', errors='ignore'))
    while True:
        decision = input(f"\n{Fore.CYAN}Include this row? (y/n or 'undo'): ").strip().lower()
        if decision in ['y', 'n', 'undo']:
            return decision
        else:
            print(f"{Fore.RED}Invalid input. Please enter 'y', 'n', or 'undo'.")

def reset_include_column(df):
    df['include'] = None
    print(f"{timestamp()} {Fore.YELLOW}🔄 'include' column has been reset.")

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

        decision = ask_user(row, current, total, row_idx)

        if decision == 'undo':
            if not history:
                print(f"{Fore.YELLOW}Nothing to undo.")
                input(f"{Style.DIM}Press Enter to continue...")
                continue
            last_idx, previous_value = history.pop()
            df.at[last_idx, 'include'] = previous_value
            save_csv(df, filepath)
            print(f"\n{timestamp()} {Fore.YELLOW}🔙 Undo successful. Reverted row {last_idx}.")
            input(f"{Style.DIM}Press Enter to continue...")
            index = pending.index(last_idx)
            continue

        history.append((row_idx, df.at[row_idx, 'include']))
        df.at[row_idx, 'include'] = 'yes' if decision == 'y' else 'no'
        save_csv(df, filepath)
        print(f"\n{timestamp()} {Fore.GREEN}✅ Row {row_idx} updated and saved.")
        input(f"{Style.DIM}Press Enter to continue...")
        index += 1

    clear_screen()
    print(f"{timestamp()} {Fore.GREEN}🎉 All rows have been processed.")

def main():
    parser = argparse.ArgumentParser(description="Interactive CSV row inclusion tool.")
    parser.add_argument('--file', required=True, help="Path to the CSV file.")
    parser.add_argument('--reset', action='store_true', help="Reset all 'include' values.")

    args = parser.parse_args()
    df = load_csv(args.file)
    if df is not None:
        process_rows(df, args.file, do_reset=args.reset)

if __name__ == "__main__":
    main()
