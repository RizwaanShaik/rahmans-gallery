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
const sections = ['about', 'architecture', 'wildlife'];

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
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    console.log(`\nProcessing ${section} section: ${imageFiles.length} images found`);

    for (const file of imageFiles) {
      const inputPath = path.join(sectionSourceDir, file);
      const baseName = path.parse(file).name;

      // Process for each configuration
      for (const [type, config] of Object.entries(configs)) {
        const outputPath = path.join(
          outputDir,
          section,
          type === 'fullscreen' ? 'fullscreen' : 
          type === 'thumbnail' ? 'thumbnails' : 'hero',
          `${baseName}.${config.format}`
        );

        await optimizeImage(inputPath, outputPath, config);
      }
    }
  }

  console.log('\nImage optimization complete!');
}

processImages().catch(console.error); 