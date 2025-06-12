## python3 -m  include_tool

import pandas as pd
import os

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def load_csv(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return None
    return pd.read_csv(filepath)

def save_csv(df, filepath):
    df.to_csv(filepath, index=False)

def ask_user(row, current_num, total_remaining, global_index):
    print(f"📄 Processing row {current_num} of {total_remaining} (CSV index {global_index})\n")
    print(row.drop(labels='include', errors='ignore'))
    while True:
        decision = input("\nInclude this row? (y/n or 'undo'): ").strip().lower()
        if decision in ['y', 'n', 'undo']:
            return decision
        else:
            print("Invalid input. Please enter 'y', 'n', or 'undo'.")

def reset_include_column(df):
    while True:
        response = input("Do you want to clear all existing 'include' values? (y/n): ").strip().lower()
        if response == 'y':
            df['include'] = None
            print("'include' column has been cleared.")
            return
        elif response == 'n':
            return
        else:
            print("Please enter 'y' or 'n'.")

def process_rows(df, filepath):
    if 'include' not in df.columns:
        df['include'] = None
    else:
        reset_include_column(df)
        save_csv(df, filepath)  # Save immediately after reset

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
                print("Nothing to undo.")
                input("Press Enter to continue...")
                continue
            last_idx, previous_value = history.pop()
            df.at[last_idx, 'include'] = previous_value
            save_csv(df, filepath)
            print(f"\nUndo successful. Reverted row {last_idx}.")
            input("Press Enter to continue...")
            index = pending.index(last_idx)
            continue

        history.append((row_idx, df.at[row_idx, 'include']))
        df.at[row_idx, 'include'] = 'yes' if decision == 'y' else 'no'
        save_csv(df, filepath)
        print(f"\n✅ Row {row_idx} updated and saved.")
        input("Press Enter to continue...")
        index += 1

    clear_screen()
    print("🎉 All rows have been processed.")

def main():
    filepath = input("Enter the path to your CSV file: ").strip()
    df = load_csv(filepath)
    if df is not None:
        process_rows(df, filepath)

if __name__ == "__main__":
    main()
