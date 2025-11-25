const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration for different image sizes
const configs = {
  fullscreen: {
    width: 1600,
    quality: 85,
    format: 'jpeg'
  },
  thumbnail: {
    width: 400,
    quality: 80,
    format: 'jpeg'
  },
  hero: {
    width: 1920,
    quality: 85,
    format: 'jpeg'
  }
};

// Note: This script processes all folders in the source directory
// It doesn't need a mapping since it works directly with folder names

// Get all category folders from the original directory
const sourceDir = path.join('/Users/rizwaan.shaik/Documents/original');
const outputBaseDir = path.join('/Users/rizwaan.shaik/Documents/original');

// System folders to skip
const SYSTEM_FOLDERS = ['watermarked', 'Rachakonda'];

async function ensureDirectories(categoryFolder) {
  const dirs = [
    path.join(categoryFolder, 'thumbnails'),
    path.join(categoryFolder, 'fullscreen'),
    path.join(categoryFolder, 'hero')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  }
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

function getBaseName(filename) {
  // Remove extension
  return path.parse(filename).name;
}

async function processCategory(categoryFolder) {
  const categoryName = path.basename(categoryFolder);
  
  if (SYSTEM_FOLDERS.includes(categoryName)) {
    console.log(`\n⏭ Skipping system folder: ${categoryName}`);
    return;
  }

  console.log(`\n📁 Processing category: ${categoryName}`);
  
  await ensureDirectories(categoryFolder);

  const files = fs.readdirSync(categoryFolder);
  
  // Filter image files
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && fs.statSync(path.join(categoryFolder, file)).isFile();
  });

  if (imageFiles.length === 0) {
    console.log(`  ℹ No images found in ${categoryName}`);
    return;
  }

  // Find hero image (files starting with category name + "_hero")
  const heroPattern = new RegExp(`^${categoryName}_hero\\.`, 'i');
  let heroFile = imageFiles.find(file => heroPattern.test(file));
  
  // Fallback: look for common hero file names
  if (!heroFile) {
    // Try common hero file patterns
    const commonHeroNames = ['hero.jpg', 'hero.jpeg', 'hero.png', 'HERO.jpg', 'HERO.jpeg'];
    heroFile = imageFiles.find(file => commonHeroNames.includes(file.toLowerCase()));
  }
  
  // Final fallback: look for any file with "hero" in name
  if (!heroFile) {
    heroFile = imageFiles.find(file => /hero/i.test(file));
  }

  // Process hero image
  if (heroFile) {
    const heroInputPath = path.join(categoryFolder, heroFile);
    const heroBaseName = getBaseName(heroFile);
    
    // Create hero image in hero folder
    const heroOutputPath = path.join(categoryFolder, 'hero', 'hero.jpeg');
    console.log(`  🎯 Processing hero image: ${heroFile}`);
    await optimizeImage(heroInputPath, heroOutputPath, configs.hero);
    
    // Also create fullscreen and thumbnail versions of hero
    const heroFullscreenPath = path.join(categoryFolder, 'fullscreen', 'hero.jpeg');
    await optimizeImage(heroInputPath, heroFullscreenPath, configs.fullscreen);
    
    const heroThumbnailPath = path.join(categoryFolder, 'thumbnails', 'hero.jpeg');
    await optimizeImage(heroInputPath, heroThumbnailPath, configs.thumbnail);
    
    console.log(`  ✓ Created hero images for ${categoryName}`);
  } else {
    console.log(`  ⚠ No hero image found for ${categoryName}`);
  }

  // Process regular images (excluding hero)
  const regularImages = imageFiles.filter(file => {
    // Exclude hero files
    if (heroFile && file === heroFile) return false;
    const baseName = getBaseName(file);
    return !baseName.toLowerCase().includes('hero');
  });

  console.log(`  📸 Processing ${regularImages.length} regular images...`);
  
  let processed = 0;
  let failed = 0;

  for (const file of regularImages) {
    const inputPath = path.join(categoryFolder, file);
    const baseName = getBaseName(file);
    
    // Create thumbnail and fullscreen versions
    const thumbnailPath = path.join(categoryFolder, 'thumbnails', `${baseName}.jpeg`);
    const fullscreenPath = path.join(categoryFolder, 'fullscreen', `${baseName}.jpeg`);

    const thumbSuccess = await optimizeImage(inputPath, thumbnailPath, configs.thumbnail);
    const fullSuccess = await optimizeImage(inputPath, fullscreenPath, configs.fullscreen);

    if (thumbSuccess && fullSuccess) {
      processed++;
      if (processed % 10 === 0) {
        console.log(`    ✓ Processed ${processed}/${regularImages.length} images...`);
      }
    } else {
      failed++;
    }
  }

  console.log(`  ✓ Completed: ${processed} images processed, ${failed} failed`);
  
  return { processed, failed };
}

async function processAllCategories() {
  console.log('='.repeat(70));
  console.log('IMAGE OPTIMIZATION SCRIPT');
  console.log('='.repeat(70));
  console.log(`\nSource directory: ${sourceDir}`);
  console.log(`Output directory: ${outputBaseDir}\n`);

  if (!fs.existsSync(sourceDir)) {
    console.error(`✗ Source directory does not exist: ${sourceDir}`);
    process.exit(1);
  }

  // Check if a specific category was requested
  const requestedCategory = process.argv[2];
  let categoryFolders = [];

  if (requestedCategory) {
    // Process only the requested category
    const categoryFolder = path.join(sourceDir, requestedCategory);
    if (!fs.existsSync(categoryFolder)) {
      console.error(`✗ Category folder does not exist: ${categoryFolder}`);
      process.exit(1);
    }
    categoryFolders = [categoryFolder];
    console.log(`Processing single category: ${requestedCategory}\n`);
  } else {
    // Get all category folders
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    categoryFolders = entries
      .filter(entry => entry.isDirectory())
      .map(entry => path.join(sourceDir, entry.name))
      .filter(folder => !SYSTEM_FOLDERS.includes(path.basename(folder)));
    console.log(`Found ${categoryFolders.length} category folders\n`);
  }

  const summary = {
    categories: 0,
    images: 0,
    failed: 0
  };

  for (const categoryFolder of categoryFolders.sort()) {
    const result = await processCategory(categoryFolder);
    if (result) {
      summary.categories++;
      summary.images += result.processed;
      summary.failed += result.failed;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`✓ Processed ${summary.categories} categories`);
  console.log(`✓ Optimized ${summary.images} images`);
  if (summary.failed > 0) {
    console.log(`✗ Failed: ${summary.failed} images`);
  }
  console.log('\nImage optimization complete!');
  console.log('='.repeat(70));
}

// Run the script
processAllCategories().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

