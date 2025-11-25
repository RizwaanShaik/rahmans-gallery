#!/bin/bash

# Script to sync all category folders from local to S3 bucket
# Usage: ./scripts/sync-to-s3.sh [--dry-run]

set -e

# Configuration
SOURCE_DIR="/Users/rizwaan.shaik/Documents/original"
BUCKET_NAME="rahmansgallerybucket"
REGION="ap-south-1"

# System folders to skip
SYSTEM_FOLDERS=("watermarked")

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if AWS credentials are set, if not try to load from set-s3-credentials.sh
if [ -z "$AWS_ACCESS_KEY_ID" ] && [ -z "$AWS_PROFILE" ]; then
    CREDENTIALS_SCRIPT="$(dirname "$0")/set-s3-credentials.sh"
    if [ -f "$CREDENTIALS_SCRIPT" ]; then
        echo -e "${YELLOW}Loading AWS credentials from set-s3-credentials.sh...${NC}"
        source "$CREDENTIALS_SCRIPT"
    fi
fi

# Verify AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured or invalid.${NC}"
    echo -e "${YELLOW}Please run: source scripts/set-s3-credentials.sh${NC}"
    echo -e "${YELLOW}Or configure AWS CLI: aws configure${NC}"
    exit 1
fi

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}Error: Source directory does not exist: $SOURCE_DIR${NC}"
    exit 1
fi

# Check if dry-run mode
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo -e "${YELLOW}Running in DRY-RUN mode - no files will be uploaded${NC}\n"
fi

# Function to check if folder is a system folder
is_system_folder() {
    local folder_name=$1
    for sys_folder in "${SYSTEM_FOLDERS[@]}"; do
        if [ "$folder_name" == "$sys_folder" ]; then
            return 0
        fi
    done
    return 1
}

# Function to sync a category folder to S3
sync_category() {
    local category_folder=$1
    local category_name=$(basename "$category_folder")
    
    if is_system_folder "$category_name"; then
        echo -e "${YELLOW}⏭ Skipping system folder: $category_name${NC}"
        return
    fi
    
    echo -e "${GREEN}📁 Syncing category: $category_name${NC}"
    
    # Sync the entire category folder to S3
    # This will maintain the folder structure: Category/fullscreen/, Category/hero/, Category/thumbnails/, Category/{original_images}
    local s3_path="s3://${BUCKET_NAME}/${category_name}/"
    
    if [ "$DRY_RUN" = true ]; then
        echo "  Would sync: $category_folder -> $s3_path"
        aws s3 sync "$category_folder" "$s3_path" --region "$REGION" --dryrun --exclude "*.DS_Store" --exclude "*.git/*"
    else
        echo "  Syncing: $category_folder -> $s3_path"
        aws s3 sync "$category_folder" "$s3_path" \
            --region "$REGION" \
            --exclude "*.DS_Store" \
            --exclude "*.git/*" \
            --exclude "*.gitignore" \
            --delete
        
        echo -e "  ${GREEN}✓ Completed: $category_name${NC}"
    fi
    
    echo ""
}

# Main execution
echo "=========================================="
echo "S3 SYNC SCRIPT"
echo "=========================================="
echo "Source: $SOURCE_DIR"
echo "Bucket: s3://$BUCKET_NAME"
echo "Region: $REGION"
echo "=========================================="
echo ""

# Get all category folders
category_folders=$(find "$SOURCE_DIR" -maxdepth 1 -type d ! -path "$SOURCE_DIR" | sort)

if [ -z "$category_folders" ]; then
    echo -e "${RED}No category folders found in $SOURCE_DIR${NC}"
    exit 1
fi

# Count categories
category_count=$(echo "$category_folders" | wc -l | tr -d ' ')
echo "Found $category_count category folders"
echo ""

# Confirm before proceeding (unless dry-run)
if [ "$DRY_RUN" = false ]; then
    echo -e "${YELLOW}⚠ WARNING: This will upload files to S3 bucket: $BUCKET_NAME${NC}"
    echo -e "${YELLOW}Press Ctrl+C to cancel, or wait 5 seconds to proceed...${NC}"
    sleep 5
    echo ""
fi

# Sync each category
success_count=0
failed_count=0

while IFS= read -r folder; do
    if sync_category "$folder"; then
        ((success_count++))
    else
        ((failed_count++))
    fi
done <<< "$category_folders"

# Summary
echo "=========================================="
echo "SUMMARY"
echo "=========================================="
echo -e "${GREEN}✓ Successfully synced: $success_count categories${NC}"
if [ $failed_count -gt 0 ]; then
    echo -e "${RED}✗ Failed: $failed_count categories${NC}"
fi
echo "=========================================="

if [ "$DRY_RUN" = true ]; then
    echo ""
    echo "This was a DRY-RUN. To actually upload, run:"
    echo "  ./scripts/sync-to-s3.sh"
fi

