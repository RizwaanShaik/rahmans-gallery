# Automated Image Categorization Validation

This script uses AI models to **validate existing categorizations** and identify images that might be in the wrong category.

## Features

- 🔍 Scans ALL categorized images in S3
- ✅ Validates if images are in correct categories
- 🔄 Suggests moves for misplaced images
- 📊 Provides confidence scores and differences
- 💾 Saves suggestions to JSON for review
- 🔄 Dry-run mode (safe testing)

## Setup

### Option 1: CLIP Model (Free, Recommended)

```bash
# Install dependencies
pip install torch transformers pillow boto3

# Set AWS credentials
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_DEFAULT_REGION=ap-south-1
```

### Option 2: OpenAI Vision API

```bash
# Install dependencies
pip install openai boto3

# Set API key
export OPENAI_API_KEY=your_api_key
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
```

### Option 3: AWS Rekognition

```bash
# Install dependencies
pip install boto3

# Set AWS credentials (Rekognition access required)
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_DEFAULT_REGION=ap-south-1
```

## Usage

### 1. Dry Run (Safe - Only Suggestions)

```bash
# Using CLIP (free) - validates existing categorizations
python scripts/categorize-images.py --method clip --dry-run --min-confidence-diff 0.2

# Using OpenAI Vision
python scripts/categorize-images.py --method openai --dry-run --min-confidence-diff 0.2

# Using AWS Rekognition
python scripts/categorize-images.py --method rekognition --dry-run --min-confidence-diff 0.2
```

**Parameters:**
- `--min-confidence-diff`: Minimum confidence difference to suggest a move (default: 0.2)
  - Higher = more conservative (only suggests obvious mismatches)
  - Lower = more aggressive (suggests more potential moves)

### 2. Review Suggestions

The script generates `categorization_suggestions.json`:

```json
{
  "categories/original/wildlife/image1.jpg": {
    "current_category": "wildlife",
    "suggested_category": "landscapes",
    "confidence": 0.85,
    "current_confidence": 0.45,
    "confidence_diff": 0.40,
    "needs_move": true
  },
  "categories/original/heritage/image2.jpg": {
    "current_category": "heritage",
    "suggested_category": "heritage",
    "confidence": 0.92,
    "current_confidence": 0.88,
    "confidence_diff": 0.04,
    "needs_move": false
  }
}
```

### 3. Apply Corrections (After Review)

```bash
# First, test with dry-run (only shows what would be moved)
python scripts/apply-categorization.py categorization_suggestions.json --min-confidence 0.7

# Then apply for real (moves misplaced images to correct categories)
python scripts/apply-categorization.py categorization_suggestions.json --min-confidence 0.7 --apply
```

**Note**: The apply script only moves images where `needs_move: true` and confidence meets your threshold.

## How It Works

1. **Scans S3**: Finds all images in existing category folders
2. **Validates**: Checks if each image matches its current category
3. **Analyzes**: Uses AI to determine the correct category
4. **Compares**: Calculates confidence for current vs suggested category
5. **Suggests**: Only suggests moves if confidence difference is significant
6. **Reports**: Shows which images might be misplaced

## Categories Supported

- Wildlife, Heritage, Ladakh, London, Macro
- Air Show, Black & White, Bidar, Clouds, Festivals
- Hampi, Hyderabad, Kanhari Caves, Kolkata Streets
- Landscapes, Lanka, Lockdown, Rachakonda, Rajasthan
- Rock Forms, Tadoba, Thailand, Tombs, Warangal, Featured

## Customization

Edit `CATEGORIES` dictionary in `categorize-images.py` to:
- Add more keywords for each category
- Adjust category descriptions
- Add new categories

## Notes

- CLIP model downloads ~500MB on first run
- OpenAI API costs ~$0.01-0.02 per image
- AWS Rekognition costs ~$1 per 1000 images
- Start with dry-run to test before applying changes

## Understanding the Results

The script will show:
- ✅ **Correctly categorized**: Images that match their current category
- ⚠️ **Potential mismatches**: Images that might be in wrong category
- 📊 **Confidence scores**: How confident AI is about each category

**Example output:**
```
📸 DSC_0011.jpg
   Current category: wildlife
   AI suggests: landscapes (confidence: 0.85)
   Current category confidence: 0.45
   ⚠ MISMATCH: Should be in 'landscapes' (diff: 0.40)
```

## Next Steps

After getting suggestions:
1. Review high-confidence mismatches (confidence_diff > 0.3)
2. Manually verify before applying (especially for edge cases)
3. Start with conservative threshold (--min-confidence-diff 0.3)
4. Apply corrections using the apply script
5. The script handles thumbnails and fullscreen versions automatically

