const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration for hero image
const heroConfig = {
  width: 1920,
  quality: 85,
  format: 'jpeg'
};

const sourceDir = '/Users/rizwaan.shaik/Documents/original';

// Get command line arguments
const categoryName = process.argv[2];
const imageFileName = process.argv[3]; // Optional: specific image file

if (!categoryName) {
  console.error('❌ Error: Category name is required');
  console.log('\nUsage:');
  console.log('  node scripts/generate-hero-image.js <CategoryName> [imageFileName]');
  console.log('\nExamples:');
  console.log('  node scripts/generate-hero-image.js Heritage');
  console.log('  node scripts/generate-hero-image.js Heritage Heritage_005.jpg');
  console.log('  node scripts/generate-hero-image.js Wildlife Wildlife_010.jpg');
  process.exit(1);
}

const categoryFolder = path.join(sourceDir, categoryName);

// Check if category folder exists
if (!fs.existsSync(categoryFolder)) {
  console.error(`❌ Error: Category folder does not exist: ${categoryFolder}`);
  console.log('\nAvailable categories:');
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  entries
    .filter(entry => entry.isDirectory() && !['watermarked', 'Rachakonda'].includes(entry.name))
    .forEach(entry => console.log(`  - ${entry.name}`));
  process.exit(1);
}

// Ensure hero directory exists
const heroDir = path.join(categoryFolder, 'hero');
if (!fs.existsSync(heroDir)) {
  fs.mkdirSync(heroDir, { recursive: true });
  console.log(`✓ Created directory: ${heroDir}`);
}

async function optimizeImage(inputPath, outputPath, config) {
  try {
    await sharp(inputPath)
      .rotate() // Auto-rotate based on EXIF
      .resize(config.width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .toFormat(config.format, { quality: config.quality })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`✗ Failed to optimize ${path.basename(inputPath)}:`, error.message);
    return false;
  }
}

async function generateHeroImage() {
  console.log('='.repeat(70));
  console.log('HERO IMAGE GENERATOR');
  console.log('='.repeat(70));
  console.log(`\nCategory: ${categoryName}`);
  console.log(`Source folder: ${categoryFolder}\n`);

  let heroInputPath;
  let heroFileName;

  if (imageFileName) {
    // Use specified image file
    heroInputPath = path.join(categoryFolder, imageFileName);
    if (!fs.existsSync(heroInputPath)) {
      console.error(`❌ Error: Image file not found: ${heroInputPath}`);
      console.log('\nAvailable images in this category:');
      const files = fs.readdirSync(categoryFolder);
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && 
               fs.statSync(path.join(categoryFolder, file)).isFile();
      });
      imageFiles.forEach(file => console.log(`  - ${file}`));
      process.exit(1);
    }
    heroFileName = imageFileName;
  } else {
    // Auto-detect hero image
    const files = fs.readdirSync(categoryFolder);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && 
             fs.statSync(path.join(categoryFolder, file)).isFile();
    });

    // Try to find hero image with category name prefix
    const heroPattern = new RegExp(`^${categoryName}_hero\\.`, 'i');
    let heroFile = imageFiles.find(file => heroPattern.test(file));
    
    // Fallback: look for common hero file names
    if (!heroFile) {
      const commonHeroNames = ['hero.jpg', 'hero.jpeg', 'hero.png', 'HERO.jpg', 'HERO.jpeg'];
      heroFile = imageFiles.find(file => commonHeroNames.includes(file.toLowerCase()));
    }
    
    // Final fallback: look for any file with "hero" in name
    if (!heroFile) {
      heroFile = imageFiles.find(file => /hero/i.test(file));
    }

    if (!heroFile) {
      console.error(`❌ Error: No hero image found in ${categoryName}`);
      console.log('\nAvailable images:');
      imageFiles.slice(0, 10).forEach(file => console.log(`  - ${file}`));
      if (imageFiles.length > 10) {
        console.log(`  ... and ${imageFiles.length - 10} more`);
      }
      console.log('\n💡 Tip: Specify an image file as the second argument:');
      console.log(`   node scripts/generate-hero-image.js ${categoryName} ${imageFiles[0]}`);
      process.exit(1);
    }

    heroInputPath = path.join(categoryFolder, heroFile);
    heroFileName = heroFile;
  }

  console.log(`📸 Using image: ${heroFileName}`);

  // Generate hero image with source filename to avoid overwriting
  const baseName = path.parse(heroFileName).name; // Get filename without extension
  const heroOutputPath = path.join(heroDir, `${baseName}_hero.jpeg`);
  console.log(`\n🎯 Generating hero image...`);
  console.log(`   Input:  ${heroInputPath}`);
  console.log(`   Output: ${heroOutputPath}`);
  
  // Check if file already exists
  if (fs.existsSync(heroOutputPath)) {
    console.log(`   ⚠️  Warning: File already exists, it will be replaced`);
  }
  
  const success = await optimizeImage(heroInputPath, heroOutputPath, heroConfig);

  if (success) {
    // Get file sizes
    const inputStats = fs.statSync(heroInputPath);
    const outputStats = fs.statSync(heroOutputPath);
    const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);
    const outputSizeMB = (outputStats.size / 1024 / 1024).toFixed(2);
    
    console.log(`\n✅ Success!`);
    console.log(`   Original size: ${inputSizeMB} MB`);
    console.log(`   Optimized size: ${outputSizeMB} MB`);
    console.log(`   Saved: ${((1 - outputStats.size / inputStats.size) * 100).toFixed(1)}%`);
    console.log(`\n📁 Hero image saved to: ${heroOutputPath}`);
    console.log(`\n💡 Note: The hero image is saved with the source filename to preserve existing hero images.`);
    console.log(`   To use this as the main hero, rename it to 'hero.jpeg' if desired.`);
  } else {
    console.error(`\n❌ Failed to generate hero image`);
    process.exit(1);
  }
}

// Run the script
generateHeroImage().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

