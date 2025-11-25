# Scripts Documentation

This directory contains utility scripts for managing images and S3 operations.

## 📸 Image Management Scripts

### Hero Image Generation

**`generate-hero-image.js`**
Generate optimized hero images from source images.

```bash
node scripts/generate-hero-image.js [Category] [ImageName].jpg
```

**Example:**
```bash
node scripts/generate-hero-image.js Warangal Warangal_009.jpg
```

**What it does:**
- Reads source image from `original/[Category]/[ImageName].jpg`
- Generates optimized hero image (1920px width, JPEG format)
- Saves to `[Category]/hero/[Category]_[Number]_hero.jpeg`
- Uses Sharp library for optimization

**Requirements:**
- Source image must exist in `original/[Category]/` directory
- Sharp library installed (`npm install`)

### Image Optimization

**`generate-optimized-images.js`**
Batch generate optimized images (thumbnails, fullscreen) for a category.

```bash
node scripts/generate-optimized-images.js [Category]
```

**What it does:**
- Generates thumbnails (~400px width)
- Generates fullscreen images (~2048px width)
- Maintains aspect ratio
- Saves to respective directories

**`optimize-images.js`**
General image optimization script (referenced in package.json).

```bash
npm run optimize-images
# or
node scripts/optimize-images.js
```

## ☁️ S3 Synchronization Scripts

### Sync to S3

**`sync-to-s3.sh`**
Sync local images to S3 bucket.

```bash
bash scripts/sync-to-s3.sh [Category]
```

**What it does:**
- Uploads hero images
- Uploads thumbnails
- Uploads fullscreen images
- Maintains S3 directory structure
- Uses AWS CLI for uploads

**Requirements:**
- AWS CLI installed and configured
- AWS credentials set up (`source scripts/set-s3-credentials.sh`)
- Appropriate S3 bucket permissions

**`sync-to-s3.js`**
Alternative Node.js-based sync script.

```bash
node scripts/sync-to-s3.js [--dry-run] [--apply]
```

## 🔧 AWS Configuration Scripts

### Set AWS Credentials

**`set-s3-credentials.sh`**
Set AWS credentials as environment variables.

```bash
source scripts/set-s3-credentials.sh
```

**Note:** This script does NOT contain hardcoded credentials. Set them as environment variables:
```bash
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
export AWS_DEFAULT_REGION="ap-south-1"
```

**`setup-s3-credentials.sh`**
Setup instructions and verification for AWS credentials.

```bash
bash scripts/setup-s3-credentials.sh
```

### S3 Debugging & Exploration

**`debug-s3-access.py`**
Debug S3 access issues (permissions, CORS, bucket policy).

```bash
python scripts/debug-s3-access.py
```

**What it does:**
- Tests S3 connection
- Checks bucket permissions
- Verifies CORS configuration
- Tests read/write access

**`explore-s3-structure.py`**
Explore S3 bucket structure and organization.

```bash
python scripts/explore-s3-structure.py
```

**What it does:**
- Lists all directories
- Counts images per category
- Shows bucket structure
- Identifies missing directories

## 📊 Utility Scripts

### Image List Generation

**`generate-image-list.py`**
Generate list of images for a category.

```bash
python scripts/generate-image-list.py [Category]
```

**`scan-local-images.js`**
Scan local images and generate reports.

```bash
node scripts/scan-local-images.js
```

### Category Verification

**`check-categories.py`**
Verify category consistency.

```bash
python scripts/check-categories.py
```

**What it does:**
- Checks category definitions in code
- Verifies S3 structure matches code
- Reports inconsistencies

## 🐍 Python Environment

### Activate Virtual Environment

**`activate-venv.sh`**
Activate Python virtual environment for scripts.

```bash
source scripts/activate-venv.sh
```

**Or manually:**
```bash
source venv/bin/activate
```

### Install Python Dependencies

```bash
pip install -r scripts/requirements-categorize.txt
```

## 📋 Common Workflows

### Add New Hero Image

```bash
# 1. Generate optimized hero image
node scripts/generate-hero-image.js Category ImageName.jpg

# 2. Upload to S3
bash scripts/sync-to-s3.sh Category

# 3. Update code references
# Edit src/app/gallery/[category]/page.tsx
```

### Deploy to Production

```bash
bash deploy.sh
```

### Verify S3 Images

```bash
python scripts/explore-s3-structure.py
```

### Debug S3 Access Issues

```bash
python scripts/debug-s3-access.py
```

## ⚠️ Important Notes

1. **AWS Credentials:** Never hardcode credentials in scripts. Use environment variables.
2. **Backup:** Always backup before running destructive scripts.
3. **Testing:** Test scripts on a small subset before running on all images.
4. **Permissions:** Ensure scripts have appropriate file permissions (`chmod +x`).
5. **Dependencies:** Install required dependencies before running scripts.

## 📚 Related Documentation

- **[README-CATEGORIZATION.md](./README-CATEGORIZATION.md)** - Image categorization guide (for reference)
- **[CLEANUP_PLAN.md](./CLEANUP_PLAN.md)** - Scripts cleanup documentation
- **[CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md)** - Cleanup summary

---

**Last Updated:** November 2025
