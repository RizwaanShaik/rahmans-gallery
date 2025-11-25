/**
 * Script to sync local images to S3 bucket with new folder structure
 * 
 * Structure:
 * categories/
 *   {category}/
 *     original/
 *       {Category}_001.jpg
 *       {Category}_002.jpg
 *       {Category}_hero.jpeg
 *     thumbnails/
 *       {Category}_001.jpeg
 *       {Category}_002.jpeg
 *       hero.jpeg
 *     fullscreen/
 *       {Category}_001.jpeg
 *       {Category}_002.jpeg
 *       hero.jpeg
 *     hero/
 *       hero.jpeg
 */

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Configure AWS
const s3 = new AWS.S3({
  region: 'ap-south-1',
  // Credentials should be in environment variables or ~/.aws/credentials
});

const BUCKET_NAME = 'rahmansgallerybucket';
const LOCAL_BASE_DIR = '/Users/rizwaan.shaik/Documents/original';
const S3_BASE_PREFIX = 'categories';

// System folders to skip
const SYSTEM_FOLDERS = ['watermarked', 'Rachakonda'];

// Map local folder names to S3 folder names (for consistency)
const FOLDER_NAME_MAP = {
  'Aviation': 'Aviation',
  'Black': 'Black',
  'bidar': 'bidar',
  'Featured': 'Featured',
  'Culture': 'Culture',
  'Hampi': 'Hampi',
  'Heritage': 'Heritage',
  'Hyderabad': 'Hyderabad',
  'KanhariCaves': 'KanhariCaves',
  'Kolkata': 'Kolkata',
  'Ladakh': 'Ladakh',
  'Landscapes': 'Landscapes',
  'London': 'London',
  'Macro': 'Macro',
  'Rajasthan': 'Rajasthan',
  'RockFormations': 'RockFormations',
  'Thailand': 'Thailand',
  'Tombs': 'Tombs',
  'Warangal': 'Warangal',
  'Wildlife': 'Wildlife',
  'Portraits': 'Portraits'
};

async function uploadFile(localPath, s3Key) {
  const fileContent = fs.readFileSync(localPath);
  const contentType = mime.lookup(localPath) || 'image/jpeg';
  
  const params = {
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileContent,
    ContentType: contentType,
    ACL: 'public-read' // Make images publicly accessible
  };

  try {
    await s3.putObject(params).promise();
    return true;
  } catch (error) {
    console.error(`✗ Failed to upload ${s3Key}:`, error.message);
    return false;
  }
}

async function uploadCategory(categoryFolder, dryRun = true) {
  const categoryName = path.basename(categoryFolder);
  
  if (SYSTEM_FOLDERS.includes(categoryName)) {
    console.log(`⏭ Skipping system folder: ${categoryName}`);
    return { uploaded: 0, skipped: 0, failed: 0 };
  }

  const s3CategoryName = FOLDER_NAME_MAP[categoryName] || categoryName;
  console.log(`\n📁 Processing category: ${categoryName} → ${s3CategoryName}`);

  const stats = { uploaded: 0, skipped: 0, failed: 0 };

  // Upload original images
  const originalFiles = fs.readdirSync(categoryFolder)
    .filter(file => {
      const filePath = path.join(categoryFolder, file);
      if (!fs.statSync(filePath).isFile()) return false;
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && 
             !file.toLowerCase().includes('hero') &&
             !fs.existsSync(path.join(categoryFolder, 'thumbnails', path.parse(file).name + '.jpeg'));
    });

  console.log(`  📸 Found ${originalFiles.length} original images`);

  for (const file of originalFiles) {
    const localPath = path.join(categoryFolder, file);
    const s3Key = `${S3_BASE_PREFIX}/${s3CategoryName}/original/${file}`;
    
    if (dryRun) {
      console.log(`    📋 Would upload: ${file} → ${s3Key}`);
      stats.skipped++;
    } else {
      const success = await uploadFile(localPath, s3Key);
      if (success) {
        console.log(`    ✓ Uploaded: ${file}`);
        stats.uploaded++;
      } else {
        stats.failed++;
      }
    }
  }

  // Upload hero image (original)
  const heroFiles = fs.readdirSync(categoryFolder)
    .filter(file => {
      const baseName = path.parse(file).name.toLowerCase();
      return baseName.includes('hero') && 
             ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase());
    });

  if (heroFiles.length > 0) {
    const heroFile = heroFiles[0]; // Use first hero file found
    const localPath = path.join(categoryFolder, heroFile);
    const s3Key = `${S3_BASE_PREFIX}/${s3CategoryName}/original/${heroFile}`;
    
    if (dryRun) {
      console.log(`    📋 Would upload hero: ${heroFile} → ${s3Key}`);
      stats.skipped++;
    } else {
      const success = await uploadFile(localPath, s3Key);
      if (success) {
        console.log(`    ✓ Uploaded hero: ${heroFile}`);
        stats.uploaded++;
      } else {
        stats.failed++;
      }
    }
  }

  // Upload thumbnails
  const thumbnailsDir = path.join(categoryFolder, 'thumbnails');
  if (fs.existsSync(thumbnailsDir)) {
    const thumbnailFiles = fs.readdirSync(thumbnailsDir)
      .filter(file => fs.statSync(path.join(thumbnailsDir, file)).isFile());
    
    console.log(`  🖼️  Found ${thumbnailFiles.length} thumbnails`);
    
    for (const file of thumbnailFiles) {
      const localPath = path.join(thumbnailsDir, file);
      const s3Key = `${S3_BASE_PREFIX}/${s3CategoryName}/thumbnails/${file}`;
      
      if (dryRun) {
        console.log(`    📋 Would upload thumbnail: ${file} → ${s3Key}`);
        stats.skipped++;
      } else {
        const success = await uploadFile(localPath, s3Key);
        if (success) {
          stats.uploaded++;
        } else {
          stats.failed++;
        }
      }
    }
  }

  // Upload fullscreen images
  const fullscreenDir = path.join(categoryFolder, 'fullscreen');
  if (fs.existsSync(fullscreenDir)) {
    const fullscreenFiles = fs.readdirSync(fullscreenDir)
      .filter(file => fs.statSync(path.join(fullscreenDir, file)).isFile());
    
    console.log(`  🖼️  Found ${fullscreenFiles.length} fullscreen images`);
    
    for (const file of fullscreenFiles) {
      const localPath = path.join(fullscreenDir, file);
      const s3Key = `${S3_BASE_PREFIX}/${s3CategoryName}/fullscreen/${file}`;
      
      if (dryRun) {
        console.log(`    📋 Would upload fullscreen: ${file} → ${s3Key}`);
        stats.skipped++;
      } else {
        const success = await uploadFile(localPath, s3Key);
        if (success) {
          stats.uploaded++;
        } else {
          stats.failed++;
        }
      }
    }
  }

  // Upload hero images
  const heroDir = path.join(categoryFolder, 'hero');
  if (fs.existsSync(heroDir)) {
    const heroFiles = fs.readdirSync(heroDir)
      .filter(file => fs.statSync(path.join(heroDir, file)).isFile());
    
    console.log(`  🎯 Found ${heroFiles.length} hero images`);
    
    for (const file of heroFiles) {
      const localPath = path.join(heroDir, file);
      const s3Key = `${S3_BASE_PREFIX}/${s3CategoryName}/hero/${file}`;
      
      if (dryRun) {
        console.log(`    📋 Would upload hero: ${file} → ${s3Key}`);
        stats.skipped++;
      } else {
        const success = await uploadFile(localPath, s3Key);
        if (success) {
          stats.uploaded++;
        } else {
          stats.failed++;
        }
      }
    }
  }

  return stats;
}

async function syncAllCategories(dryRun = true) {
  console.log('='.repeat(70));
  console.log('S3 SYNC SCRIPT');
  console.log('='.repeat(70));
  console.log(`\nBucket: ${BUCKET_NAME}`);
  console.log(`Local directory: ${LOCAL_BASE_DIR}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN (preview only)' : 'UPLOAD (will upload files)'}\n`);

  if (!fs.existsSync(LOCAL_BASE_DIR)) {
    console.error(`✗ Local directory does not exist: ${LOCAL_BASE_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(LOCAL_BASE_DIR, { withFileTypes: true });
  const categoryFolders = entries
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(LOCAL_BASE_DIR, entry.name))
    .filter(folder => !SYSTEM_FOLDERS.includes(path.basename(folder)));

  console.log(`Found ${categoryFolders.length} category folders\n`);

  const totalStats = { uploaded: 0, skipped: 0, failed: 0 };

  for (const categoryFolder of categoryFolders.sort()) {
    const stats = await uploadCategory(categoryFolder, dryRun);
    totalStats.uploaded += stats.uploaded;
    totalStats.skipped += stats.skipped;
    totalStats.failed += stats.failed;
  }

  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  if (dryRun) {
    console.log(`📋 Would upload ${totalStats.skipped} files`);
    console.log('\nTo actually upload, run:');
    console.log('  node scripts/sync-to-s3.js --apply');
  } else {
    console.log(`✓ Uploaded: ${totalStats.uploaded} files`);
    console.log(`✗ Failed: ${totalStats.failed} files`);
  }
  console.log('='.repeat(70));
}

// Check for --apply flag
const dryRun = !process.argv.includes('--apply');

syncAllCategories(dryRun).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

