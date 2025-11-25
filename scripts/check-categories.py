#!/usr/bin/env python3
"""
Check if all categories from the code exist in the original folder
"""

from pathlib import Path

# Categories defined in the code (URL ID -> folder name mapping)
CODE_CATEGORIES = {
    'air-show': 'airshow',
    'b-and-w': 'b&w',
    'bidar': 'bidar',
    'clouds': 'clouds',  # Should include landscapes
    'featured': 'Featured',
    'festivals': 'Festivals',
    'hampi': 'Hampi',
    'heritage': 'heritage',
    'hyderabad': 'Hyderabad',
    'kanhari-caves': 'kanharicaves',
    'kolkata-streets': 'kolkatastreets2001',
    'ladakh': 'Ladakh',
    'lanka': 'lanka',  # Need to check if this exists
    'london': 'london',
    'macro': 'Macro',
    'rajasthan': 'rajasthan',
    'rock-forms': 'rockforms',  # Should include Rachakonda
    'thai': 'thai',
    'tombs': 'tumbs',
    'warangal': 'warangal',
    'wildlife': 'wildlife',
}

# Additional folders that should exist but are merged
MERGED_FOLDERS = {
    'landscapes': 'clouds',  # Merged into clouds
    'Rachakonda': 'rock-forms',  # Merged into rock-forms
}

# System folders to ignore
SYSTEM_FOLDERS = {'watermarked', 'portraits', 'potrait'}

def main():
    base_folder = Path('/Users/rizwaan.shaik/Documents/original')
    
    if not base_folder.exists():
        print(f"ERROR: Base folder does not exist: {base_folder}")
        return
    
    # Get all folders in the directory
    actual_folders = {d.name for d in base_folder.iterdir() if d.is_dir()}
    
    print("=" * 70)
    print("CATEGORY COMPARISON REPORT")
    print("=" * 70)
    print(f"\nBase folder: {base_folder}")
    print(f"Total folders found: {len(actual_folders)}\n")
    
    # Check each category from code
    print("=" * 70)
    print("CATEGORIES IN CODE:")
    print("=" * 70)
    
    missing = []
    found = []
    case_mismatch = []
    
    for url_id, folder_name in CODE_CATEGORIES.items():
        if folder_name in actual_folders:
            found.append((url_id, folder_name))
            print(f"✓ {url_id:20s} → {folder_name:20s} (FOUND)")
        elif folder_name.lower() in {f.lower() for f in actual_folders}:
            # Case mismatch
            actual = next(f for f in actual_folders if f.lower() == folder_name.lower())
            case_mismatch.append((url_id, folder_name, actual))
            print(f"⚠ {url_id:20s} → {folder_name:20s} (CASE MISMATCH: found '{actual}')")
        else:
            missing.append((url_id, folder_name))
            print(f"✗ {url_id:20s} → {folder_name:20s} (MISSING)")
    
    # Check merged folders
    print("\n" + "=" * 70)
    print("MERGED FOLDERS (should be merged into parent category):")
    print("=" * 70)
    
    for merged_folder, parent_category in MERGED_FOLDERS.items():
        if merged_folder in actual_folders:
            print(f"✓ {merged_folder:20s} → should be merged into '{parent_category}'")
        else:
            print(f"✗ {merged_folder:20s} → not found (may already be merged)")
    
    # Check for unexpected folders
    print("\n" + "=" * 70)
    print("UNEXPECTED FOLDERS (not in code, may need attention):")
    print("=" * 70)
    
    expected_folders = set(CODE_CATEGORIES.values()) | set(MERGED_FOLDERS.keys())
    unexpected = actual_folders - expected_folders - SYSTEM_FOLDERS
    
    if unexpected:
        for folder in sorted(unexpected):
            print(f"⚠ {folder:20s} → Not defined in code")
    else:
        print("None")
    
    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY:")
    print("=" * 70)
    print(f"✓ Found: {len(found)} categories")
    print(f"⚠ Case mismatches: {len(case_mismatch)} categories")
    print(f"✗ Missing: {len(missing)} categories")
    print(f"⚠ Unexpected folders: {len(unexpected)} folders")
    
    if missing:
        print("\n⚠ MISSING CATEGORIES:")
        for url_id, folder_name in missing:
            print(f"  - {url_id} (expected folder: {folder_name})")
    
    if case_mismatch:
        print("\n⚠ CASE MISMATCHES:")
        for url_id, expected, actual in case_mismatch:
            print(f"  - {url_id}: expected '{expected}', found '{actual}'")
    
    if unexpected:
        print("\n⚠ UNEXPECTED FOLDERS:")
        for folder in sorted(unexpected):
            print(f"  - {folder}")

if __name__ == '__main__':
    main()

