#!/bin/bash
# Quick script to set AWS credentials for S3 account (808162501188)
# Usage: source scripts/set-s3-credentials.sh
#
# IMPORTANT: Set your AWS credentials as environment variables before sourcing this script:
#   export AWS_ACCESS_KEY_ID=your_access_key_id
#   export AWS_SECRET_ACCESS_KEY=your_secret_access_key
#   source scripts/set-s3-credentials.sh

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "❌ Error: AWS credentials not set"
    echo "   Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables"
    echo "   Or create a .env file with your credentials (this file is gitignored)"
    return 1 2>/dev/null || exit 1
fi

export AWS_DEFAULT_REGION=ap-south-1

echo "✅ AWS credentials set for S3 account (808162501188)"
echo "   Verify with: python scripts/check-aws-account.py"

