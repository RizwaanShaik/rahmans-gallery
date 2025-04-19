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

// Map URL-friendly IDs to directory names
const categoryDirMap: { [key: string]: string } = {
  'architecture': 'architecture',
  'air-show': 'airshow',
  'b-and-w': 'bandw',
  'bidar': 'bidar',
  'clouds': 'clouds',
  'featured': 'featured',
  'festivals': 'festivals',
  'hampi': 'hampi',
  'heritage': 'heritage',
  'hyderabad': 'hyderabad',
  'kanhari-caves': 'kanharicaves',
  'kolkata-streets': 'kolkatastreets2001',
  'landscapes': 'landscapes',
  'ladakh': 'ladakh',
  'lanka': 'lanka',
  'lockdown': 'lockdown',
  'london': 'london',
  'macro': 'macro',
  'rachakonda': 'rachakonda',
  'rajasthan': 'rajasthan',
  'rock-forms': 'rockforms',
  'tadoba': 'tadoba',
  'thai': 'thai',
  'tombs': 'tombs',
  'warangal': 'warangal',
  'wildlife': 'wildlife'
};

// S3 bucket base URL
const s3BaseUrl = "https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com";

// Structure to hold filenames for each category (replace switch logic)
const categoryPhotosData: { [key: string]: string[] } = {
  'air-show': ['003', '007', 'DSC_0334copy', 'DSC_0346copy', 'DSC_0367copy', 'DSC_0591copy', 'DSC_0779copy', 'DSC_0784copy', 'DSC_0808copy', 'DSC_0891copy', 'fullcircle', 'hero', 'missionpossible', 'skyisthelimit'],
  'warangal': ['003', '005', '006', '007', '008', '009', '010', '011', '012', '013', 'hero'],
  'b-and-w': ['Proposaldiscussion', 'beautyindome', 'bridgingthehistory', 'gloryofhistory-', 'hero', 'leadingtheshadow-Copy', 'mysticcloudsCopy', 'peopleandmonument', 'protectingmonument', 'symmentry'],
  'bidar': ['002', '003', '004', '005', '006-1', '007', '008', 'hero'],
  'clouds': ['001', 'SKR_0922', 'SKR_0925', 'SKR_0942', 'SKR_0952', 'SKR_1126', 'SKR_1262', 'SKR_1431', 'SKR_1500', 'hero'],
  'featured': ['east meets west', 'end of the day fishing', 'everyday new sunrise', 'farm sweet farm', 'farmer', 'feeding the nation', 'flying into the light', 'following shadows', 'for a last catch', 'forgotten fort', 'fountain of glory', 'freedom', 'glory of history', 'godslight', 'happiness of a full meal', 'happy mother and child', 'heritage vs modern', 'hero', 'hidden landscape', 'history standing tall', 'history standing tall 1', 'history though the arch', 'innocent', 'into the divinity', 'into the future', 'into the raising sun', 'lady luck', 'last costomer', 'last fight', 'last minute discussion', 'leading into the history', 'leaf in pebbles', 'leave us alone', 'limited sunshine', 'live start fresh again', 'lone fighter', 'lone passenger', 'lonely bird', 'lonely boat', 'looking for livelihood', 'loosing nature', 'love birds', 'maharaja entrance', 'mansbestfriend', 'matching with trends', 'modern circle', 'monk in kalachakra', 'monkey family', 'mothers anxiety', 'mountain river', 'mystic clouds', 'mystique ladakh', 'mystique rocks', 'nature at its best', 'nature at its best 1', 'nature at its best 2', 'nature through rocky window', 'natures window', 'old habits die hard', 'oldage freinds', 'one for you', 'passing clouds', 'passing clouds 2', 'passing clouds 2 - Copy', 'past glory', 'past glory 2', 'pattern houses', 'people and monument 2', 'pillar of power', 'pooja item seller', 'prayers for rain', 'prayers for rains', 'proposal discussion', 'protected history', 'proud mother', 'purity in the river', 'rays of hope', 'resting', 'resting boats', 'rich mans lexury', 'rivers of babylon', 'rivers of mountain', 'rocky form', 'row houses', 'rush hour', 'saint and the follower', 'selfie lovers', 'shadows of history', 'shanthi in the mountains', 'sharing food', 'shyness', 'sky is the limit', 'social distancing', 'still beautiful', 'surrendered to devine', 'surrendered to god', 'swatch bharath', 'symmentric arches', 'tasty colors', 'temple light and shadows', 'temple peak', 'tibal', 'traveller', 'travellors', 'trough the arch', 'twilight beauty', 'urban dhobhi ghat', 'urban landscape', 'urban relaxation', 'view from the top', 'village beauty', 'women at work', 'women freedom'],
  'festivals': ['001', '005(1of1)', '006(1of1)', '007(1of1)', '008(1of1)', 'DSC_0018', 'DSC_0019', 'DSC_0020(2)', 'DSC_0045', 'DSC_0131', 'DSC_0132', 'DSC_0138', 'DSC_0206', 'DSC_0231', 'DSC_0239', 'DSC_0269', 'DSC_0483', 'DSC_0510', 'DSC_0513', 'DSC_0570', 'DSC_0837', 'DSC_0867', 'DSC_0889', 'DSC_0937', 'hero'],
  'hampi': ['001', '002', '003', '004', '005', '007', '008', '009', '010', '011', 'hero'],
  'heritage': ['001(1of1)', '003(1of1)', '2020(1of1)', '2525(1of1)', 'DSC_0045', 'DSC_0289', 'DSC_0475', 'abidschurch', 'airportmasque', 'assembly', 'charminar', 'charminar2', 'charminarlong', 'chowmohallapalace', 'golconda', 'hero', 'kachiguda', 'koticollege', 'koticollege2', 'koticollege3', 'mmmarket', 'meccamasque', 'mehboobmansion', 'musheerabadmasque', 'paigahtombs', 'puranihaveli', 'puraniidgah', 'puttishouse', 'tumbs', 'yousufhose'],
  'hyderabad': ['DSC_0012', 'SKR_1622', 'SKR_2274', 'SKR_2338', 'SKR_2409', 'SKR_2495', 'SKR_2545', 'SKR_2883-1', 'SKR_2992', 'SKR_3321', 'hero'],
  'kanhari-caves': ['DSC_0657', 'DSC_0699', 'DSC_0716', 'DSC_0721', 'DSC_0734', 'DSC_0775', 'DSC_0879', 'DSC_0904', 'hero'],
  'kolkata-streets': ['001', '24150021', '24150022', '24150023', '24150024', '24150025', '24150028', '24150034', '24150036', '24150041', '24150042', '24150043', '24150045', 'hero'],
  'ladakh': ['DSC_0007copy', 'DSC_0011copy', 'DSC_0023copy', 'DSC_0031copy', 'DSC_0039copy', 'DSC_0050copy', 'DSC_0056copy', 'DSC_0057copy', 'DSC_0067copy', 'DSC_0189copy', 'DSC_0218copy', 'DSC_0286copy', 'DSC_0320copy', 'DSC_0325copy', 'DSC_0546copy', 'DSC_0675copy', 'DSC_0728copy', 'DSC_0973copy', 'abstract', 'blossom', 'discipline', 'hero', 'purity', 'waytogo', 'windowworld'],
  'landscapes': ['001', 'DSC_0064(2)', 'DSC_0174', 'IMG_1077', 'hero'],
  'lanka': ['DSC_0132', 'DSC_0137', 'DSC_0217', 'DSC_0376', 'DSC_0441', 'DSC_0465', 'DSC_0507', 'DSC_0767', 'DSC_0826', 'hero'],
  'lockdown': ['DSC_0150', 'hero'],
  'london': ['DSC_0002', 'DSC_0003', 'DSC_0004', 'DSC_0007', 'DSC_0007_2', 'DSC_0022', 'DSC_0030', 'DSC_0031', 'DSC_0033', 'DSC_0051', 'DSC_0068', 'DSC_0069', 'DSC_0072', 'DSC_0087', 'DSC_0091', 'DSC_0099', 'DSC_0110_2', 'DSC_0112', 'DSC_0113', 'DSC_0123', 'DSC_0133', 'DSC_0138', 'DSC_0141', 'DSC_0149', 'DSC_0159_2', 'DSC_0178', 'DSC_0189', 'DSC_0197', 'DSC_0199', 'DSC_0203', 'DSC_0225', 'DSC_0240', 'DSC_0246', 'DSC_0259', 'DSC_0266', 'DSC_0276', 'DSC_0285', 'DSC_0308', 'DSC_0342', 'DSC_0345', 'DSC_0370', 'DSC_0391', 'DSC_0444', 'hero'],
  'macro': ['01(1of1)', '119(1of1)', 'AAAA(1of1)', 'AJAY8601', 'DSC_0167', 'DSC_0413copy', 'DSC_0432(2)copy', 'DSC_0868copy', 'DSC_1463acopy', 'DSC_1631', 'DSC_1690', '_H6A9162', '_H6A9381', '_MG_5440000', '_MG_5530', 'hero'],
  'rachakonda': ['003', '008', '009', 'hero'],
  'rajasthan': ['01_8', '03', '03_2', '03_4', '05', '05_6', '07', '08_5', '11_4', '14_4', '16_5', '18_4', '27_2', '46', 'DSC_0076', 'DSC_0132', 'DSC_0158', 'DSC_0184', 'DSC_0501', 'hero'],
  'rock-forms': ['03', '04', '06', '08', '09', '10', '12', '17', '20', '22', '24', '25', 'hero'],
  'tadoba': ['011', '012', '017', '024', 'hero'],
  'thai': ['001', 'DSC_0006', 'DSC_0020', 'DSC_0024', 'DSC_0027', 'DSC_0029', 'DSC_0030', 'DSC_0075', 'DSC_0075(2)', 'DSC_0086', 'DSC_0116', 'DSC_0116(2)', 'DSC_0170', 'DSC_0328', 'DSC_0366', 'DSC_0449', 'DSC_0467', 'DSC_0481', 'DSC_0515', 'DSC_0539', 'DSC_0547', 'DSC_0561', 'DSC_0567', 'DSC_0718', 'DSC_0744', 'DSC_0836', 'DSC_0845', 'hero'],
  'tombs': ['DSC_0432', 'DSC_0466', 'hero', 'x00', 'x01', 'x010', 'x011', 'x012', 'x013', 'x014', 'x015', 'x016', 'x017', 'x018', 'x02', 'x021', 'x022', 'x023', 'x024', 'x025', 'x026', 'x027', 'x028', 'x029', 'x03', 'x031', 'x04', 'x05', 'x06', 'x07', 'x09', 'x100'],
  'wildlife': ['005', 'DSC_0011', 'DSC_0025', 'DSC_0036', 'DSC_0083', 'DSC_0086', 'DSC_0087', 'DSC_0096', 'DSC_0155', 'DSC_0160', 'DSC_0189', 'DSC_0212', 'DSC_0228', 'DSC_0259', 'DSC_0457', 'DSC_0539', 'DSC_0541', 'DSC_0995', 'Elephants', 'Fishes', 'Fox', 'RedPanda', 'hero', 'picture']
};

// Function to create a photo object with S3 URLs (same as before)
const createPhotoObject = (baseName: string, categoryId: string, dirName: string): Photo => {
  const categoryPath = dirName;
  const uniqueId = `${categoryId}-${baseName}-${Math.random().toString(36).substring(2, 9)}`;
  const cleanedBaseName = baseName.replace(/[ '\"](?!\([^)]*\))/g, "");

  const thumbnailUrl = `${s3BaseUrl}/categories/${categoryPath.replace(/[ '\"](?!\([^)]*\))/g, "")}/thumbnails/${cleanedBaseName}.jpeg`;

  return {
    id: uniqueId,
    src: thumbnailUrl,
    fullscreenSrc: `${s3BaseUrl}/categories/${categoryPath.replace(/[ '\"](?!\([^)]*\))/g, "")}/fullscreen/${cleanedBaseName}.jpeg`,
    originalSrc: `${s3BaseUrl}/categories/original/${categoryPath.replace(/[ '\"](?!\([^)]*\))/g, "")}/${cleanedBaseName}.jpeg`,
    alt: baseName.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
    description: baseName.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
    downloadUrl: `${s3BaseUrl}/categories/original/${categoryPath.replace(/[ '\"](?!\([^)]*\))/g, "")}/${cleanedBaseName}.jpeg`
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