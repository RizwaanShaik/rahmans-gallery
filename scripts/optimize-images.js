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
  'air show',
  'b & w',
  'bidar',
  'Clouds',
  'Featured',
  'Festivals',
  'Hampi',
  'heritage',
  'Hyderabad',
  'kanhari caves',
  'kolkata streets 2001',
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
  'tumbs',
  'warangaL',
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

  // Process each section
  for (const section of sections) {
    const sectionSourceDir = path.join(sourceDir, section);
    
    // Skip if section directory doesn't exist
    if (!fs.existsSync(sectionSourceDir)) {
      console.log(`No images found for section: ${section}`);
      continue;
    }

    const files = fs.readdirSync(sectionSourceDir);
    // Filter out hero images and handle case-insensitive extensions
    const imageFiles = files.filter(file => {
      const lowerFile = file.toLowerCase();
      return (
        /\.(jpg|jpeg|png|webp)$/i.test(lowerFile) && 
        !lowerFile.includes('hero')
      );
    });

    console.log(`\nProcessing ${section} section: ${imageFiles.length} images found`);

    // Process hero image only for the first image
    if (imageFiles.length > 0) {
      const heroFile = imageFiles[0];
      const heroInputPath = path.join(sectionSourceDir, heroFile);
      const heroOutputPath = path.join(
        outputDir,
        section.toLowerCase(), // Ensure consistent case in output
        'hero',
        'hero.jpeg'
      );
      await optimizeImage(heroInputPath, heroOutputPath, configs.hero);
    }

    // Process thumbnails and fullscreen versions for all images
    for (const file of imageFiles) {
      const inputPath = path.join(sectionSourceDir, file);
      const baseName = path.parse(file).name;
      const sectionLower = section.toLowerCase(); // Ensure consistent case in output

      // Process only thumbnail and fullscreen versions
      const outputPaths = {
        thumbnail: path.join(outputDir, sectionLower, 'thumbnails', `${baseName}.jpeg`),
        fullscreen: path.join(outputDir, sectionLower, 'fullscreen', `${baseName}.jpeg`)
      };

      await optimizeImage(inputPath, outputPaths.thumbnail, configs.thumbnail);
      await optimizeImage(inputPath, outputPaths.fullscreen, configs.fullscreen);
    }
  }

  console.log('\nImage optimization complete!');
}

processImages().catch(console.error); 