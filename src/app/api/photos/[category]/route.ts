import { NextResponse, NextRequest } from 'next/server';

// Define the Photo type
interface Photo {
  id: string;
  src: string;
  fullscreenSrc: string;
  originalSrc: string;
  alt: string;
  description: string;
  downloadUrl: string;
}

// Map URL-friendly IDs to directory names (updated to match new folder structure)
const categoryDirMap: { [key: string]: string } = {
  'air-show': 'Aviation',
  'b-and-w': 'Black',
  'bidar': 'Bidar',
  'landscapes': 'Landscapes',
  'featured': 'Featured',
  'culture': 'Culture',
  'hampi': 'Hampi',
  'heritage': 'Heritage',
  'hyderabad': 'Hyderabad',
  'kanhari-caves': 'KanhariCaves',
  'kolkata-streets': 'Kolkata',
  'ladakh': 'Ladakh',
  'london': 'London',
  'macro': 'Macro',
  'rajasthan': 'Rajasthan',
  'rock-forms': 'RockFormations',
  'thai': 'Thailand',
  'tombs': 'Tombs',
  'warangal': 'Warangal',
  'wildlife': 'Wildlife',
  'portraits': 'Portraits'
};

// S3 bucket base URL (no categories/ prefix - direct folder structure)
const s3BaseUrl = "https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com";

// Structure to hold filenames for each category (updated to match new naming: Category_001, Category_002, etc.)
// Note: Base names without extension - extensions are added in createPhotoObject
const categoryPhotosData: { [key: string]: string[] } = {
  'air-show': ['Aviation_001', 'Aviation_002', 'Aviation_003', 'Aviation_004', 'Aviation_005', 'Aviation_006', 'Aviation_007', 'Aviation_008', 'Aviation_009', 'Aviation_010', 'Aviation_011', 'Aviation_012', 'Aviation_013', 'hero'],
  'warangal': ['Warangal_001', 'Warangal_002', 'Warangal_003', 'Warangal_004', 'Warangal_005', 'Warangal_006', 'Warangal_007', 'Warangal_008', 'Warangal_009', 'Warangal_010', 'hero'],
  'b-and-w': ['Black_001', 'Black_002', 'Black_003', 'Black_004', 'Black_005', 'Black_006', 'Black_007', 'Black_008', 'Black_009', 'Black_010', 'Black_011', 'Black_012', 'hero'],
  'bidar': ['Bidar_001', 'Bidar_002', 'Bidar_003', 'Bidar_004', 'Bidar_005', 'Bidar_006', 'Bidar_007', 'hero'],
  'landscapes': ['Landscapes_001', 'Landscapes_002', 'Landscapes_003', 'Landscapes_004', 'Landscapes_005', 'Landscapes_006', 'Landscapes_007', 'Landscapes_008', 'Landscapes_009', 'Landscapes_010', 'Landscapes_011', 'Landscapes_012', 'Landscapes_013', 'Landscapes_014', 'Landscapes_015', 'Landscapes_016', 'Landscapes_017', 'Landscapes_018', 'Landscapes_019', 'hero'],
  'featured': ['Featured_001', 'Featured_002', 'Featured_003', 'Featured_004', 'Featured_005', 'Featured_006', 'Featured_007', 'Featured_008', 'Featured_009', 'Featured_010', 'Featured_011', 'Featured_012', 'Featured_013', 'Featured_014', 'Featured_015', 'Featured_016', 'Featured_017', 'Featured_018', 'Featured_019', 'Featured_020', 'Featured_021', 'Featured_022', 'Featured_023', 'Featured_024', 'Featured_025', 'hero'],
  'culture': ['Culture_001', 'Culture_002', 'Culture_003', 'Culture_004', 'Culture_005', 'Culture_006', 'Culture_007', 'Culture_008', 'Culture_009', 'Culture_010', 'Culture_011', 'Culture_012', 'Culture_013', 'Culture_014', 'Culture_015', 'Culture_016', 'Culture_017', 'Culture_018', 'Culture_019', 'hero'],
  'hampi': ['Hampi_001', 'Hampi_002', 'Hampi_003', 'Hampi_004', 'Hampi_005', 'Hampi_006', 'Hampi_007', 'Hampi_008', 'Hampi_009', 'Hampi_010', 'hero'],
  'heritage': ['Heritage_001', 'Heritage_002', 'Heritage_003', 'Heritage_004', 'Heritage_005', 'Heritage_006', 'Heritage_007', 'Heritage_008', 'hero'],
  'hyderabad': ['Hyderabad_001', 'Hyderabad_002', 'Hyderabad_003', 'Hyderabad_004', 'Hyderabad_005', 'Hyderabad_006', 'Hyderabad_007', 'Hyderabad_008', 'Hyderabad_009', 'Hyderabad_010', 'Hyderabad_011', 'Hyderabad_012', 'Hyderabad_013', 'Hyderabad_014', 'Hyderabad_015', 'Hyderabad_016', 'Hyderabad_017', 'Hyderabad_018', 'Hyderabad_019', 'Hyderabad_020', 'Hyderabad_021', 'Hyderabad_022', 'Hyderabad_023', 'Hyderabad_024', 'Hyderabad_025', 'Hyderabad_026', 'Hyderabad_027', 'Hyderabad_028', 'Hyderabad_029', 'Hyderabad_030', 'Hyderabad_031', 'Hyderabad_032', 'Hyderabad_033', 'Hyderabad_hero', 'hero'],
  'kanhari-caves': ['KanhariCaves_001', 'KanhariCaves_002', 'KanhariCaves_003', 'KanhariCaves_004', 'KanhariCaves_005', 'KanhariCaves_006', 'KanhariCaves_007', 'KanhariCaves_008', 'hero'],
  'kolkata-streets': ['Kolkata_001', 'Kolkata_002', 'Kolkata_003', 'Kolkata_004', 'Kolkata_005', 'Kolkata_006', 'Kolkata_007', 'Kolkata_008', 'Kolkata_009', 'Kolkata_010', 'Kolkata_011', 'Kolkata_012', 'Kolkata_013', 'Kolkata_014', 'Kolkata_015', 'hero'],
  'ladakh': ['Ladakh_001', 'Ladakh_002', 'Ladakh_003', 'Ladakh_004', 'Ladakh_005', 'Ladakh_006', 'Ladakh_007', 'Ladakh_008', 'Ladakh_009', 'Ladakh_010', 'Ladakh_011', 'Ladakh_012', 'Ladakh_013', 'Ladakh_014', 'Ladakh_015', 'Ladakh_016', 'Ladakh_017', 'Ladakh_018', 'Ladakh_019', 'Ladakh_020', 'Ladakh_021', 'Ladakh_022', 'Ladakh_023', 'Ladakh_024', 'Ladakh_025', 'Ladakh_026', 'Ladakh_027', 'Ladakh_028', 'Ladakh_029', 'hero'],
  'london': ['London_001', 'London_002', 'London_003', 'London_004', 'London_005', 'London_006', 'London_007', 'London_008', 'London_009', 'London_010', 'London_011', 'London_012', 'London_013', 'London_014', 'London_015', 'London_016', 'London_017', 'London_018', 'London_019', 'London_020', 'London_021', 'London_022', 'London_023', 'London_024', 'London_025', 'London_026', 'London_027', 'London_028', 'London_029', 'London_030', 'London_031', 'London_032', 'London_033', 'London_034', 'London_035', 'London_036', 'London_037', 'London_038', 'London_039', 'London_040', 'London_041', 'London_042', 'London_043', 'London_044', 'hero'],
  'macro': ['Macro_001', 'Macro_002', 'Macro_003', 'Macro_004', 'Macro_005', 'Macro_006', 'Macro_007', 'Macro_008', 'Macro_009', 'Macro_010', 'Macro_011', 'Macro_012', 'Macro_013', 'Macro_014', 'Macro_015', 'Macro_016', 'Macro_017', 'Macro_018', 'Macro_019', 'hero'],
  'rajasthan': ['Rajasthan_001', 'Rajasthan_002', 'Rajasthan_003', 'Rajasthan_004', 'Rajasthan_005', 'Rajasthan_006', 'Rajasthan_007', 'Rajasthan_008', 'Rajasthan_009', 'Rajasthan_010', 'Rajasthan_011', 'Rajasthan_012', 'Rajasthan_013', 'Rajasthan_014', 'Rajasthan_015', 'Rajasthan_016', 'Rajasthan_017', 'Rajasthan_018', 'Rajasthan_019', 'Rajasthan_020', 'Rajasthan_021', 'Rajasthan_022', 'hero'],
  'rock-forms': ['RockFormations_002', 'RockFormations_004', 'RockFormations_006', 'RockFormations_007', 'RockFormations_008', 'RockFormations_009', 'RockFormations_010', 'RockFormations_011', 'RockFormations_012', 'RockFormations_013', 'RockFormations_014', 'RockFormations_015', 'RockFormations_016', 'RockFormations_017', 'RockFormations_018', 'RockFormations_019', 'RockFormations_020', 'hero'],
  'thai': ['Thailand_001', 'Thailand_002', 'Thailand_003', 'Thailand_004', 'Thailand_005', 'Thailand_006', 'Thailand_007', 'Thailand_008', 'Thailand_009', 'Thailand_010', 'Thailand_011', 'Thailand_012', 'Thailand_013', 'Thailand_014', 'Thailand_015', 'Thailand_016', 'Thailand_017', 'Thailand_018', 'Thailand_019', 'Thailand_020', 'Thailand_021', 'Thailand_022', 'Thailand_023', 'Thailand_024', 'Thailand_025', 'Thailand_026', 'Thailand_027', 'Thailand_028', 'Thailand_029', 'Thailand_030', 'Thailand_031', 'Thailand_032', 'Thailand_033', 'Thailand_034', 'Thailand_035', 'hero'],
  'tombs': ['Tombs_001', 'Tombs_002', 'Tombs_003', 'Tombs_004', 'Tombs_005', 'Tombs_006', 'Tombs_007', 'Tombs_008', 'Tombs_009', 'Tombs_010', 'Tombs_011', 'Tombs_012', 'Tombs_013', 'Tombs_014', 'Tombs_015', 'Tombs_016', 'Tombs_017', 'Tombs_018', 'Tombs_019', 'Tombs_020', 'Tombs_021', 'Tombs_022', 'Tombs_023', 'Tombs_024', 'Tombs_025', 'Tombs_026', 'Tombs_027', 'Tombs_028', 'Tombs_029', 'Tombs_030', 'Tombs_031', 'hero'],
  'wildlife': ['Wildlife_001', 'Wildlife_002', 'Wildlife_003', 'Wildlife_004', 'Wildlife_005', 'Wildlife_006', 'Wildlife_007', 'Wildlife_008', 'Wildlife_009', 'Wildlife_010', 'Wildlife_011', 'Wildlife_012', 'Wildlife_013', 'Wildlife_014', 'Wildlife_015', 'Wildlife_016', 'Wildlife_017', 'Wildlife_018', 'Wildlife_019', 'Wildlife_020', 'Wildlife_021', 'Wildlife_022', 'Wildlife_023', 'Wildlife_024', 'Wildlife_025', 'Wildlife_026', 'Wildlife_027', 'Wildlife_028', 'Wildlife_029', 'Wildlife_030', 'Wildlife_031', 'Wildlife_032', 'Wildlife_033', 'hero'],
  'portraits': ['Portraits_001', 'Portraits_003', 'Portraits_004', 'Portraits_005', 'Portraits_006', 'Portraits_007', 'Portraits_008', 'Portraits_009', 'Portraits_010', 'Portraits_011', 'Portraits_012', 'Portraits_013', 'Portraits_014', 'hero']
};

// Function to create a photo object with S3 URLs (same as before)
const createPhotoObject = (baseName: string, categoryId: string, dirName: string): Photo => {
  const categoryPath = dirName;
  const uniqueId = `${categoryId}-${baseName}-${Math.random().toString(36).substring(2, 9)}`;
  const cleanedBaseName = baseName.replace(/[ '\"](?!\([^)]*\))/g, "");

  // New S3 structure: Aviation/thumbnails/, Aviation/fullscreen/, Aviation/{original_images}
  // Note: original images are directly in category folder
  const thumbnailUrl = `${s3BaseUrl}/${categoryPath.replace(/[ '\"](?!\([^)]*\))/g, "")}/thumbnails/${cleanedBaseName}.jpeg`;

  return {
    id: uniqueId,
    src: thumbnailUrl,
    fullscreenSrc: `${s3BaseUrl}/${categoryPath.replace(/[ '\"](?!\([^)]*\))/g, "")}/fullscreen/${cleanedBaseName}.jpeg`,
    originalSrc: `${s3BaseUrl}/${categoryPath.replace(/[ '\"](?!\([^)]*\))/g, "")}/${cleanedBaseName}.jpg`,
    alt: baseName.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
    description: baseName.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
    downloadUrl: `${s3BaseUrl}/${categoryPath.replace(/[ '\"](?!\([^)]*\))/g, "")}/${cleanedBaseName}.jpg`
  };
};

export async function GET(request: NextRequest) {
  // Extract category from the URL path
  const pathname = request.nextUrl.pathname;
  const categoryId = pathname.split('/').pop() || '';
  
  const folderName = categoryDirMap[categoryId];

  if (!folderName) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 404 });
  }

  const photoNames = categoryPhotosData[categoryId];
  if (!photoNames) {
    return NextResponse.json({ error: 'No photos found' }, { status: 404 });
  }

  const photos: Photo[] = photoNames.map(name => createPhotoObject(name, categoryId, folderName));

  console.log(`[API Route] Successfully fetched ${photos.length} photos for category: ${categoryId}`);
  return NextResponse.json(photos);
} 