#!/usr/bin/env python3
"""
Debug S3 access issues - check bucket policy, region, etc.
"""

import boto3
from botocore.exceptions import ClientError

S3_BUCKET = 'rahmansgallerybucket'
S3_REGION = 'ap-south-1'

def debug_s3_access():
    """Debug S3 access step by step"""
    
    print("🔍 Debugging S3 Access...\n")
    
    s3_client = boto3.client('s3', region_name=S3_REGION)
    
    # 1. Check if we can list buckets
    print("1️⃣ Testing: List all buckets")
    try:
        response = s3_client.list_buckets()
        buckets = [b['Name'] for b in response['Buckets']]
        print(f"   ✅ Can list buckets")
        print(f"   Found {len(buckets)} buckets")
        if S3_BUCKET in buckets:
            print(f"   ✅ Target bucket '{S3_BUCKET}' exists")
        else:
            print(f"   ⚠️  Target bucket '{S3_BUCKET}' NOT found in list")
            print(f"   Available buckets: {', '.join(buckets[:5])}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    print()
    
    # 2. Check bucket location
    print(f"2️⃣ Testing: Get bucket location for '{S3_BUCKET}'")
    try:
        location = s3_client.get_bucket_location(Bucket=S3_BUCKET)
        actual_region = location.get('LocationConstraint') or 'us-east-1'
        print(f"   ✅ Bucket location: {actual_region}")
        if actual_region != S3_REGION:
            print(f"   ⚠️  Warning: Bucket is in '{actual_region}' but script uses '{S3_REGION}'")
            print(f"   Try: s3_client = boto3.client('s3', region_name='{actual_region}')")
    except ClientError as e:
        error_code = e.response['Error']['Code']
        print(f"   ❌ Error: {error_code}")
        if error_code == 'AccessDenied':
            print("   This is strange with AdministratorAccess - check bucket policy")
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
    print()
    
    # 3. Check bucket policy
    print(f"3️⃣ Testing: Get bucket policy for '{S3_BUCKET}'")
    try:
        policy = s3_client.get_bucket_policy(Bucket=S3_BUCKET)
        print("   ✅ Bucket has a policy")
        print("   Policy exists (check if it's blocking access)")
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'NoSuchBucketPolicy':
            print("   ✅ No bucket policy (default permissions)")
        else:
            print(f"   ⚠️  {error_code}: {e}")
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
    print()
    
    # 4. Check bucket ACL
    print(f"4️⃣ Testing: Get bucket ACL for '{S3_BUCKET}'")
    try:
        acl = s3_client.get_bucket_acl(Bucket=S3_BUCKET)
        print("   ✅ Can read bucket ACL")
        grants = acl.get('Grants', [])
        print(f"   Found {len(grants)} ACL grants")
    except ClientError as e:
        error_code = e.response['Error']['Code']
        print(f"   ⚠️  {error_code}: {e}")
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
    print()
    
    # 5. Try listing with different methods
    print(f"5️⃣ Testing: List objects (list_objects_v2)")
    try:
        response = s3_client.list_objects_v2(Bucket=S3_BUCKET, MaxKeys=1)
        print("   ✅ Can list objects!")
        if 'Contents' in response:
            print(f"   Found at least {len(response['Contents'])} objects")
            if response['Contents']:
                print(f"   Sample: {response['Contents'][0]['Key']}")
        else:
            print("   Bucket appears to be empty")
    except ClientError as e:
        error_code = e.response['Error']['Code']
        print(f"   ❌ Error: {error_code}")
        print(f"   Message: {e.response['Error']['Message']}")
        
        if error_code == 'AccessDenied':
            print("\n   💡 Possible causes:")
            print("   1. Bucket policy is blocking access")
            print("   2. Bucket is in different region")
            print("   3. Account/credentials mismatch")
            print("\n   Try:")
            print("   - Check bucket policy in S3 Console")
            print("   - Verify bucket region")
            print("   - Check if bucket is in different AWS account")
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
    print()
    
    # 6. Try with different region
    print(f"6️⃣ Testing: Try listing with different regions")
    for region in ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1']:
        try:
            test_client = boto3.client('s3', region_name=region)
            response = test_client.list_objects_v2(Bucket=S3_BUCKET, MaxKeys=1)
            print(f"   ✅ Works with region: {region}")
            break
        except:
            pass
    print()

if __name__ == '__main__':
    debug_s3_access()

