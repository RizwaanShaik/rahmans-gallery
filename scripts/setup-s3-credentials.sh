#!/bin/bash
# Setup AWS credentials for S3 bucket account (808162501188)

echo "🔧 Setting up AWS credentials for S3 bucket account"
echo "Account: 808162501188"
echo ""

# Option 1: Use AWS profiles
echo "Option 1: Configure AWS Profile (Recommended)"
echo "Run: aws configure --profile rahmans-s3"
echo ""
echo "Then use: export AWS_PROFILE=rahmans-s3"
echo ""

# Option 2: Environment variables
echo "Option 2: Set Environment Variables"
echo "export AWS_ACCESS_KEY_ID=your_key_for_account_808162501188"
echo "export AWS_SECRET_ACCESS_KEY=your_secret_for_account_808162501188"
echo "export AWS_DEFAULT_REGION=ap-south-1"
echo ""

# Option 3: Update ~/.aws/credentials
echo "Option 3: Add to ~/.aws/credentials"
echo ""
echo "[rahmans-s3]"
echo "aws_access_key_id = YOUR_KEY"
echo "aws_secret_access_key = YOUR_SECRET"
echo "region = ap-south-1"
echo ""

echo "After setting up, verify with:"
echo "python scripts/check-aws-account.py"

