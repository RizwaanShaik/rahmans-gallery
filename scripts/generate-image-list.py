#!/usr/bin/env python3
"""
Scan local folders and generate categoryPhotosData for the API route
"""

import os
import json
from pathlib import Path
from collections import defaultdict

LOCAL_BASE_DIR = Path('/Users/rizwaan.shaik/Documents/original')
SYSTEM_FOLDERS = {'watermarked', 'Rachakonda'}

# Map local folder names to URL-friendly category IDs
FOLDER_TO_CATEGORY_ID = {
    'Aviation': 'air-show',
    'Black': 'b-and-w',
    'bidar': 'bidar',
    'Featured': 'featured',
    'Culture': 'festivals',
    'Hampi': 'hampi',
    'Heritage': 'heritage',
    'Hyderabad': 'hyderabad',
    'KanhariCaves': 'kanhari-caves',
    'Kolkata': 'kolkata-streets',
    'Ladakh': 'ladakh',
    'Landscapes': 'landscapes',
    'London': 'london',
    'Macro': 'macro',
    'Rajasthan': 'rajasthan',
    'RockFormations': 'rock-forms',
    'Thailand': 'thai',
    'Tombs': 'tombs',
    'Warangal': 'warangal',
    'Wildlife': 'wildlife',
    'Portraits': 'portraits'
}

def get_image_files(category_folder):
    """Get all image files excluding hero images"""
    files = []
    for file in category_folder.iterdir():
        if file.is_file():
            ext = file.suffix.lower()
            if ext in ['.jpg', '.jpeg', '.png', '.webp']:
                base_name = file.stem  # Name without extension
                if 'hero' not in base_name.lower():
                    files.append(base_name)
    return sorted(files)

def main():
    print("=" * 70)
    print("GENERATING IMAGE LIST FOR API ROUTE")
    print("=" * 70)
    print(f"\nScanning: {LOCAL_BASE_DIR}\n")

    if not LOCAL_BASE_DIR.exists():
        print(f"ERROR: Directory does not exist: {LOCAL_BASE_DIR}")
        return

    category_data = {}
    
    for folder in sorted(LOCAL_BASE_DIR.iterdir()):
        if not folder.is_dir():
            continue
            
        folder_name = folder.name
        if folder_name in SYSTEM_FOLDERS:
            continue
            
        category_id = FOLDER_TO_CATEGORY_ID.get(folder_name)
        if not category_id:
            print(f"⚠ Warning: No mapping for {folder_name}")
            continue
        
        images = get_image_files(folder)
        images.append('hero')  # Add hero at the end
        
        category_data[category_id] = images
        print(f"✓ {folder_name:20s} → {category_id:20s}: {len(images)-1} images")

    # Generate TypeScript code
    print("\n" + "=" * 70)
    print("GENERATED categoryPhotosData:")
    print("=" * 70)
    print("\nconst categoryPhotosData: { [key: string]: string[] } = {")
    
    for category_id in sorted(category_data.keys()):
        images = category_data[category_id]
        image_list = ', '.join([f"'{img}'" for img in images])
        print(f"  '{category_id}': [{image_list}],")
    
    print("};")
    
    # Save to JSON for reference
    output_file = Path(__file__).parent.parent / 'category_photos_data.json'
    with open(output_file, 'w') as f:
        json.dump(category_data, f, indent=2)
    
    print(f"\n✓ Saved to: {output_file}")
    print("=" * 70)

if __name__ == '__main__':
    main()

