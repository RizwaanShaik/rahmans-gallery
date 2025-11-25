#!/usr/bin/env python3
"""
Explore S3 bucket structure to understand current organization
"""

import boto3
from collections import defaultdict
from typing import Dict, List
import json

S3_BUCKET = 'rahmansgallerybucket'
S3_REGION = 'ap-south-1'

def explore_s3_structure():
    """Explore and map the S3 bucket structure"""
    # Check which account we're using
    try:
        sts = boto3.client('sts')
        identity = sts.get_caller_identity()
        current_account = identity.get('Account')
        expected_account = '808162501188'
        
        if current_account != expected_account:
            print(f"⚠️  WARNING: You're authenticated to account {current_account}")
            print(f"   S3 bucket is in account {expected_account}")
            print(f"   Please switch to the correct account credentials")
            print(f"\n   Run: python scripts/setup-s3-credentials.sh for instructions")
            return None
    except Exception as e:
        print(f"⚠️  Could not verify account: {e}")
    
    # Use default credential chain (checks env vars, ~/.aws/credentials, IAM roles, etc.)
    try:
        # Try to use profile if set
        import os
        profile = os.getenv('AWS_PROFILE')
        if profile:
            session = boto3.Session(profile_name=profile)
            s3_client = session.client('s3', region_name=S3_REGION)
        else:
            s3_client = boto3.client('s3', region_name=S3_REGION)
    except Exception as e:
        print(f"❌ Error creating S3 client: {e}")
        print("\nTrying with explicit credentials from environment...")
        import os
        access_key = os.getenv('AWS_ACCESS_KEY_ID')
        secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
        if access_key and secret_key:
            s3_client = boto3.client(
                's3',
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
                region_name=S3_REGION
            )
        else:
            raise Exception("No AWS credentials found. Run: python scripts/check-aws-config.py")
    
    print("🔍 Exploring S3 bucket structure...")
    print(f"Bucket: {S3_BUCKET}\n")
    
    # Get all objects
    paginator = s3_client.get_paginator('list_objects_v2')
    
    structure = {
        'categories': defaultdict(lambda: {'original': [], 'thumbnails': [], 'fullscreen': []}),
        'other_paths': [],
        'total_images': 0,
        'category_counts': defaultdict(int)
    }
    
    print("📂 Scanning bucket...")
    
    for page in paginator.paginate(Bucket=S3_BUCKET):
        if 'Contents' not in page:
            continue
            
        for obj in page['Contents']:
            key = obj['Key']
            size = obj['Size']
            
            # Skip directories
            if key.endswith('/'):
                continue
            
            # Check if it's an image
            if not key.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif')):
                continue
            
            structure['total_images'] += 1
            
            # Parse path: categories/{type}/{category}/{filename}
            parts = key.split('/')
            
            if len(parts) >= 3 and parts[0] == 'categories':
                category_type = parts[1]  # original, thumbnails, or fullscreen
                category_name = parts[2]  # category folder name
                filename = '/'.join(parts[3:]) if len(parts) > 3 else parts[2]
                
                if category_type in ['original', 'thumbnails', 'fullscreen']:
                    structure['categories'][category_name][category_type].append({
                        'key': key,
                        'filename': filename,
                        'size': size
                    })
                    structure['category_counts'][category_name] += 1
                else:
                    structure['other_paths'].append(key)
            else:
                structure['other_paths'].append(key)
    
    # Print summary
    print(f"\n📊 Summary:")
    print(f"   Total images found: {structure['total_images']}")
    print(f"   Categories found: {len(structure['categories'])}")
    print(f"\n📁 Category breakdown:\n")
    
    for category, files in sorted(structure['categories'].items()):
        orig_count = len(files['original'])
        thumb_count = len(files['thumbnails'])
        full_count = len(files['fullscreen'])
        total = orig_count + thumb_count + full_count
        
        print(f"   {category}:")
        print(f"      Original: {orig_count}")
        print(f"      Thumbnails: {thumb_count}")
        print(f"      Fullscreen: {full_count}")
        print(f"      Total: {total}")
        
        # Show sample filenames
        if files['original']:
            sample = files['original'][0]['filename']
            print(f"      Sample: {sample}")
        print()
    
    # Show other paths (uncategorized or unexpected structure)
    if structure['other_paths']:
        print(f"\n⚠️  Other paths found ({len(structure['other_paths'])}):")
        for path in structure['other_paths'][:10]:
            print(f"   {path}")
        if len(structure['other_paths']) > 10:
            print(f"   ... and {len(structure['other_paths']) - 10} more")
    
    # Save detailed structure to JSON
    output_file = 's3_structure.json'
    
    # Convert defaultdict to regular dict for JSON serialization
    categories_dict = {}
    for cat, files in structure['categories'].items():
        categories_dict[cat] = {
            'original': files['original'],
            'thumbnails': files['thumbnails'],
            'fullscreen': files['fullscreen']
        }
    
    output_data = {
        'total_images': structure['total_images'],
        'categories': categories_dict,
        'category_counts': dict(structure['category_counts']),
        'other_paths': structure['other_paths'][:50]  # Limit to first 50
    }
    
    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\n💾 Detailed structure saved to {output_file}")
    
    return structure

def analyze_category_distribution(structure):
    """Analyze image distribution across categories"""
    print("\n📈 Category Distribution Analysis:\n")
    
    category_totals = {}
    for category, files in structure['categories'].items():
        total = len(files['original']) + len(files['thumbnails']) + len(files['fullscreen'])
        category_totals[category] = total
    
    # Sort by count
    sorted_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
    
    print("   Categories by image count:")
    for category, count in sorted_categories:
        print(f"      {category:20s}: {count:4d} images")
    
    # Check for imbalances (categories with very few images might be wrong)
    print("\n   ⚠️  Categories with < 5 images (might need review):")
    for category, count in sorted_categories:
        if count < 5:
            print(f"      {category}: {count} images")

if __name__ == '__main__':
    try:
        structure = explore_s3_structure()
        analyze_category_distribution(structure)
        
        print("\n✅ Exploration complete!")
        print("\nNext steps:")
        print("1. Review s3_structure.json for detailed breakdown")
        print("2. Check categories with very few images")
        print("3. Run categorization validation script")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Check credentials: python scripts/check-aws-config.py")
        print("2. If AccessDenied, your IAM user needs these permissions:")
        print("   - s3:ListBucket")
        print("   - s3:GetBucketLocation")
        print("   - s3:GetObject")
        print("3. Update IAM policy in AWS Console:")
        print("   https://console.aws.amazon.com/iam/")

