const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

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

// Define sections
const sections = [
  'architecture',
  'airshow',
  'bandw',
  'bidar',
  'Clouds',
  'Featured',
  'Festivals',
  'Hampi',
  'heritage',
  'Hyderabad',
  'kanharicaves',
  'kolkatastreets2001',
  'landscapes',
  'Ladakh',
  'lanka',
  'lockdown',
  'london',
  'Macro',
  'Rachakonda',
  'rajasthan',
  'rock forms',
  'tadoba',
  'thai',
  'tombs',
  'warangal',
  'wildlife'
];

const sourceDir = path.join(process.cwd(), 'public', 'images', 'original');
const outputDir = path.join(process.cwd(), 'public', 'images');

async function ensureDirectories() {
  const dirs = [
    sourceDir,
    ...sections.map(section => path.join(outputDir, section)),
    ...sections.map(section => path.join(outputDir, section, 'fullscreen')),
    ...sections.map(section => path.join(outputDir, section, 'thumbnails')),
    ...sections.map(section => path.join(outputDir, section, 'hero'))
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
      .rotate()
      .resize(config.width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .toFormat(config.format, { quality: config.quality })
      .toFile(outputPath);
    
    console.log(`✓ Optimized: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`✗ Failed to optimize ${path.basename(inputPath)}:`, error);
  }
}

async function processImages() {
  await ensureDirectories();
  
  // Create a log of S3-compatible filenames for reference
  let s3FilenamesLog = "S3 Filenames Reference:\n";

  // Process each section
  for (const section of sections) {
    const sectionSourceDir = path.join(sourceDir, section);
    
    // Skip if section directory doesn't exist
    if (!fs.existsSync(sectionSourceDir)) {
      console.log(`No images found for section: ${section}`);
      continue;
    }

    const files = fs.readdirSync(sectionSourceDir);
    
    // Look for a dedicated hero image first
    const sectionLower = section.toLowerCase();
    const heroImageNames = ['hero.jpg', 'hero.jpeg', 'hero.png', 'HERO.jpg', 'HERO.jpeg', 'HERO.png'];
    let heroFile = null;
    
    // Check if any of the hero image names exist
    for (const heroName of heroImageNames) {
      if (files.includes(heroName)) {
        heroFile = heroName;
        console.log(`Found dedicated hero image for ${section}: ${heroName}`);
        break;
      }
    }
    
    // If no dedicated hero image, look for any image with "hero" in the filename
    if (!heroFile) {
      heroFile = files.find(file => {
        const lowerFile = file.toLowerCase();
        return /\.(jpg|jpeg|png|webp)$/i.test(lowerFile) && lowerFile.includes('hero');
      });
      
      if (heroFile) {
        console.log(`Found hero-related image for ${section}: ${heroFile}`);
      }
    }

    // Filter for regular processing - all images with supported extensions
    const imageFiles = files.filter(file => {
      const lowerFile = file.toLowerCase();
      return /\.(jpg|jpeg|png|webp)$/i.test(lowerFile);
    });

    console.log(`\nProcessing ${section} section: ${imageFiles.length} images found`);
    
    // For S3 compatibility, track the mapping of original filenames to S3-compatible ones
    const filenameMapping = new Map();
    
    // Process hero image - either dedicated hero or first image
    if (heroFile || imageFiles.length > 0) {
      // If we didn't find a dedicated hero image, use the first image
      const sourceHeroFile = heroFile || imageFiles[0];
      const heroInputPath = path.join(sectionSourceDir, sourceHeroFile);
      
      // Create hero image in hero folder
      const heroOutputPath = path.join(
        outputDir,
        sectionLower,
        'hero',
        'hero.jpeg'
      );
      await optimizeImage(heroInputPath, heroOutputPath, configs.hero);
      
      // Also create a copy of the hero image in the fullscreen folder
      const heroFullscreenPath = path.join(
        outputDir,
        sectionLower,
        'fullscreen',
        'hero.jpeg'
      );
      await optimizeImage(heroInputPath, heroFullscreenPath, configs.fullscreen);
      
      // And create a thumbnail version of the hero for consistency
      const heroThumbnailPath = path.join(
        outputDir,
        sectionLower,
        'thumbnails',
        'hero.jpeg'
      );
      await optimizeImage(heroInputPath, heroThumbnailPath, configs.thumbnail);
      
      console.log(`✓ Created hero images for ${section} in all folders using ${sourceHeroFile}`);
      
      // Add hero image to the S3 filename mapping
      filenameMapping.set('hero', {
        original: sourceHeroFile,
        s3Compatible: 'hero'
      });
    }

    // Process thumbnails and fullscreen versions for all images
    for (const file of imageFiles) {
      const inputPath = path.join(sectionSourceDir, file);
      let baseName = path.parse(file).name;
      const sectionLower = section.toLowerCase(); // Ensure consistent case in output
      
      // Create S3-compatible filename (replace spaces with +, avoid special chars)
      let s3BaseName = baseName;
      
      // Process only thumbnail and fullscreen versions
      const outputPaths = {
        thumbnail: path.join(outputDir, sectionLower, 'thumbnails', `${baseName}.jpeg`),
        fullscreen: path.join(outputDir, sectionLower, 'fullscreen', `${baseName}.jpeg`)
      };

      await optimizeImage(inputPath, outputPaths.thumbnail, configs.thumbnail);
      await optimizeImage(inputPath, outputPaths.fullscreen, configs.fullscreen);
      
      // Record the mapping for S3 reference
      filenameMapping.set(baseName, {
        original: file,
        s3Compatible: baseName,
        s3Url: `https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com/categories/${sectionLower}/thumbnails/${encodeURIComponent(baseName)}.jpeg?t=${Date.now()}`
      });
    }
    
    // Log the S3 filename mappings for this section
    s3FilenamesLog += `\n${section} (${sectionLower}):\n`;
    filenameMapping.forEach((value, key) => {
      s3FilenamesLog += `  Original: ${value.original} => S3 URL: ${value.s3Url || 'N/A'}\n`;
    });
  }
  
  // Write the S3 filename mapping to a reference file
  fs.writeFileSync(path.join(process.cwd(), 's3-filenames-reference.txt'), s3FilenamesLog);
  console.log('\nS3 filename reference created at: s3-filenames-reference.txt');

  console.log('\nImage optimization complete!');
}

processImages().catch(console.error); 