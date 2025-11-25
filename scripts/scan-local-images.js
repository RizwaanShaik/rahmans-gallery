/**
 * Script to scan local images and generate the categoryPhotosData structure
 * This will create the data structure needed for the API route
 */

const fs = require('fs');
const path = require('path');

const LOCAL_BASE_DIR = '/Users/rizwaan.shaik/Documents/original';
const SYSTEM_FOLDERS = ['watermarked', 'Rachakonda'];

// Map local folder names to URL-friendly category IDs
const FOLDER_TO_CATEGORY_ID = {
  'Aviation': 'air-show',
  'Black': 'b-and-w',
  'bidar': 'bidar',
  'Featured': 'featured',
  'Culture': 'festivals',
  'Hampi': 'hampi',
  'Heritage': 'heritage',
  'Hyderabad': 'hyderabad',
  'KanhariCaves': 'kanhari-caves',
  'Kolkata': 'kolkata-streets',
  'Ladakh': 'ladakh',
  'Landscapes': 'landscapes',
  'London': 'london',
  'Macro': 'macro',
  'Rajasthan': 'rajasthan',
  'RockFormations': 'rock-forms',
  'Thailand': 'thai',
  'Tombs': 'tombs',
  'Warangal': 'warangal',
  'Wildlife': 'wildlife',
  'Portraits': 'portraits'
};

function getImageFiles(categoryFolder) {
  const files = fs.readdirSync(categoryFolder);
  return files
    .filter(file => {
      const filePath = path.join(categoryFolder, file);
      if (!fs.statSync(filePath).isFile()) return false;
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    })
    .map(file => {
      // Get base name without extension
      const baseName = path.parse(file).name;
      return baseName;
    })
    .filter(baseName => !baseName.toLowerCase().includes('hero')); // Exclude hero from list
}

function scanCategory(categoryFolder) {
  const categoryName = path.basename(categoryFolder);
  
  if (SYSTEM_FOLDERS.includes(categoryName)) {
    return null;
  }

  const categoryId = FOLDER_TO_CATEGORY_ID[categoryName];
  if (!categoryId) {
    console.log(`⚠ Warning: No mapping for folder ${categoryName}`);
    return null;
  }

  const imageFiles = getImageFiles(categoryFolder);
  
  // Sort images naturally (001, 002, 003, etc.)
  const sortedImages = imageFiles.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
    const numB = parseInt(b.match(/\d+/)?.[0] || '0');
    return numA - numB;
  });

  // Add 'hero' to the list
  sortedImages.push('hero');

  return {
    categoryId,
    folderName: categoryName,
    images: sortedImages,
    count: sortedImages.length - 1 // Exclude hero from count
  };
}

function main() {
  console.log('='.repeat(70));
  console.log('SCANNING LOCAL IMAGES');
  console.log('='.repeat(70));
  console.log(`\nScanning: ${LOCAL_BASE_DIR}\n`);

  if (!fs.existsSync(LOCAL_BASE_DIR)) {
    console.error(`✗ Directory does not exist: ${LOCAL_BASE_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(LOCAL_BASE_DIR, { withFileTypes: true });
  const categoryFolders = entries
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(LOCAL_BASE_DIR, entry.name))
    .filter(folder => !SYSTEM_FOLDERS.includes(path.basename(folder)));

  const results = {};
  const categoryPhotosData = {};

  for (const categoryFolder of categoryFolders.sort()) {
    const result = scanCategory(categoryFolder);
    if (result) {
      results[result.categoryId] = result;
      categoryPhotosData[result.categoryId] = result.images;
      console.log(`✓ ${result.folderName} → ${result.categoryId}: ${result.count} images`);
    }
  }

  // Generate TypeScript code for categoryPhotosData
  console.log('\n' + '='.repeat(70));
  console.log('GENERATED categoryPhotosData:');
  console.log('='.repeat(70));
  console.log('\nconst categoryPhotosData: { [key: string]: string[] } = {');
  
  Object.keys(categoryPhotosData).sort().forEach(categoryId => {
    const images = categoryPhotosData[categoryId];
    const result = results[categoryId];
    console.log(`  '${categoryId}': [${images.map(img => `'${img}'`).join(', ')}], // ${result.count} images`);
  });
  
  console.log('};');

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY:');
  console.log('='.repeat(70));
  const totalImages = Object.values(results).reduce((sum, r) => sum + r.count, 0);
  console.log(`Total categories: ${Object.keys(results).length}`);
  console.log(`Total images: ${totalImages}`);
  console.log('='.repeat(70));
}

main();

