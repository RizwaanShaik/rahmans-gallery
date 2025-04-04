"use client"; // Mark this component as a client-side component

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import PhotoCard from '@/components/PhotoCard';
import FullscreenModal from '@/components/FullscreenModal';
import { motion, AnimatePresence } from 'framer-motion';

// Define the Photo type
interface Photo {
  id: string;
  src: string;
  fullscreenSrc: string;
  originalSrc: string;
  alt: string;
  description: string;
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
  'tombs': 'tombs', // Corrected from tumbs
  'warangal': 'warangal', // Corrected path casing
  'wildlife': 'wildlife'
};

// Get photos for a category
const getPhotosByCategory = (categoryId: string): Photo[] => {
  console.log(`Loading photos for category: ${categoryId}`);
  
  const dirName = categoryDirMap[categoryId] || categoryId;
  const photos: Photo[] = [];

  // Function to create a photo object
  const createPhotoObject = (baseName: string): Photo => {
    const categoryPath = dirName.toLowerCase();
    const uniqueId = `${categoryId}-${baseName}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Add fallback image for when the actual image might not exist
    
    return {
      id: uniqueId,
      src: `/images/${categoryPath}/thumbnails/${baseName}.jpeg`,
      fullscreenSrc: `/images/${categoryPath}/fullscreen/${baseName}.jpeg`,
      originalSrc: `/images/original/${categoryPath}/${baseName}.jpg`,
      alt: baseName.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
      description: baseName.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
    };
  };

  // Add specific images based on category
  switch (categoryId) {
    case 'air-show':
      [
      '003', '007', 'DSC_0334 copy', 'DSC_0346 copy', 'DSC_0367 copy', 'DSC_0591 copy',
      'DSC_0779 copy', 'DSC_0784 copy', 'DSC_0808 copy', 'DSC_0891 copy', 'full circle', 'hero',
      'mission possible', 'sky is the limit'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'warangal': [ // Re-added the missing opening bracket
      '003', '005', '006', '007', '008', '009',
      '010', '011', '012', '013', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'b-and-w':
      [
      'Proposal discussion', 'beauty in dome', 'bridging the history', 'glory of history -', 'hero', 'leading the shadow - Copy',
      'mysticcloudsCopy', 'people and monument', 'protecting monument', 'symmentry'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'bidar':
      [
      '002', '003', '004', '005', '006-1', '007',
      '008', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'clouds':
      [
      '001', 'SKR_0922', 'SKR_0925', 'SKR_0942', 'SKR_0952', 'SKR_1126',
      'SKR_1262', 'SKR_1431', 'SKR_1500', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'featured':
      [
        'east meets west', 'end of the day fishing', 'everyday new sunrise', 'farm sweet farm', 'farmer', 'feeding the nation',
        'flying into the light', 'following shadows', 'for a last catch', 'forgotten fort', 'fountain of glory', 'freedom',
        'glory of history', 'god&apos;s light', 'happiness of a full meal', 'happy mother and child', 'heritage vs modern', 'hero',
        'hidden landscape', 'history standing tall', 'history standing tall 1', 'history though the arch', 'innocent', 'into the divinity',
        'into the future', 'into the raising sun', 'lady luck', 'last costomer', 'last fight', 'last minute discussion',
        'leading into the history', 'leaf in pebbles', 'leave us alone', 'limited sunshine', 'live start fresh again', 'lone fighter',
        'lone passenger', 'lonely bird', 'lonely boat', 'looking for livelihood', 'loosing nature', 'love birds',
        'love birds', 'maharaja entrance', 'man&apos;s best friend', 'matching with trends', 'modern circle', 'monk in kalachakra',
        'monkey family', 'mother&apos;s anxiety', 'mountain river', 'mystic clouds', 'mystique ladakh', 'mystique rocks',
        'nature at its best', 'nature at its best 1', 'nature at its best 2', 'nature through rocky window', 'nature&apos;s window', 'old habits die hard',
        'oldage freinds', 'one for you', 'passing clouds', 'passing clouds 2', 'passing clouds 2 - Copy', 'past glory',
        'past glory 2', 'pattern houses', 'people and monument 2', 'pillar of power', 'pooja item seller', 'prayers for rain',
        'prayers for rains', 'proposal discussion', 'protected history', 'proud mother', 'purity in the river', 'rays of hope',
        'resting', 'resting boats', 'rich man&apos;s lexury', 'rivers of babylon', 'rivers of mountain', 'rocky form',
        'row houses', 'rush hour', 'saint and the follower', 'selfie lovers', 'shadows of history', 'shanthi in the mountains',
        'sharing food', 'shyness', 'sky is the limit', 'social distancing', 'still beautiful', 'surrendered to devine',
        'surrendered to god', 'swatch bharath', 'symmentric arches', 'tasty colors', 'temple light and shadows', 'temple peak',
        'tibal', 'traveller', 'travellors', 'trough the arch', 'twilight beauty', 'urban dhobhi ghat',
        'urban landscape', 'urban relaxation', 'view from the top', 'village beauty', 'women at work', 'women freedom'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'festivals':
      [
      '001', '005 (1 of 1)', '006 (1 of 1)', '007 (1 of 1)', '008 (1 of 1)', 'DSC_0018',
      'DSC_0019', 'DSC_0020 (2)', 'DSC_0045', 'DSC_0131', 'DSC_0132', 'DSC_0138',
      'DSC_0206', 'DSC_0231', 'DSC_0239', 'DSC_0269', 'DSC_0483', 'DSC_0510',
      'DSC_0513', 'DSC_0570', 'DSC_0837', 'DSC_0867', 'DSC_0889', 'DSC_0937',
      'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'hampi':
      [
      '001', '002', '003', '004', '005', '007',
      '008', '009', '010', '011', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'heritage':
      [
        '001 (1 of 1)', '003 (1 of 1)', '2020 (1 of 1)', '2525 (1 of 1)', 'DSC_0045', 'DSC_0289',
        'DSC_0475', 'abids church', 'airport masque', 'assembly', 'charminar', 'charminar 2',
        'charminar long', 'chowmohalla palace', 'golconda', 'hero', 'kachiguda', 'koti college',
        'koti college2', 'koti college3', 'm.m.market', 'mecca masque', 'mehboob mansion', 'musheerabad masque',
        'paigah tombs', 'purani haveli', 'purani idgah', 'putti&apos;s house', 'tumbs', 'yousuf hose'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'hyderabad':
      [
      'DSC_0012', 'SKR_1622', 'SKR_2274', 'SKR_2338', 'SKR_2409', 'SKR_2495',
      'SKR_2545', 'SKR_2883-1', 'SKR_2992', 'SKR_3321', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'kanharicaves':
      [
      'DSC_0657', 'DSC_0699', 'DSC_0716', 'DSC_0721', 'DSC_0734', 'DSC_0775',
      'DSC_0879', 'DSC_0904', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'kolkatastreets2001':
      [
      '001', '24150021', '24150022', '24150023', '24150024', '24150025',
      '24150028', '24150034', '24150036', '24150041', '24150042', '24150043',
      '24150045', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'ladakh':
      [
      'DSC_0007 copy', 'DSC_0011 copy', 'DSC_0023 copy', 'DSC_0031 copy', 'DSC_0039 copy', 'DSC_0050 copy',
      'DSC_0056 copy', 'DSC_0057 copy', 'DSC_0067 copy', 'DSC_0189 copy', 'DSC_0218 copy', 'DSC_0286 copy',
      'DSC_0320 copy', 'DSC_0325 copy', 'DSC_0546 copy', 'DSC_0675 copy', 'DSC_0728 copy', 'DSC_0973 copy',
      'abstract', 'blossom', 'discipline', 'hero', 'purity', 'way to go',
      'window world'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'landscapes':
      [
      '001', 'DSC_0064 (2)', 'DSC_0174', 'IMG_1077', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'lanka':
      [
      'DSC_0132', 'DSC_0137', 'DSC_0217', 'DSC_0376', 'DSC_0441', 'DSC_0465',
      'DSC_0507', 'DSC_0767', 'DSC_0826', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'lockdown':
      [
      'DSC_0150', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'london':
      [
      'DSC_0002', 'DSC_0003', 'DSC_0004', 'DSC_0007', 'DSC_0007_2', 'DSC_0022',
      'DSC_0030', 'DSC_0031', 'DSC_0033', 'DSC_0051', 'DSC_0068', 'DSC_0069',
      'DSC_0072', 'DSC_0087', 'DSC_0091', 'DSC_0099', 'DSC_0110_2', 'DSC_0112',
      'DSC_0113', 'DSC_0123', 'DSC_0133', 'DSC_0138', 'DSC_0141', 'DSC_0149',
      'DSC_0159_2', 'DSC_0178', 'DSC_0189', 'DSC_0197', 'DSC_0199', 'DSC_0203',
      'DSC_0225', 'DSC_0240', 'DSC_0246', 'DSC_0259', 'DSC_0266', 'DSC_0276',
      'DSC_0285', 'DSC_0308', 'DSC_0342', 'DSC_0345', 'DSC_0370', 'DSC_0391',
      'DSC_0444', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'macro':
      [
      '01 (1 of 1)', '119 (1 of 1)', 'AAAA (1 of 1)', 'AJAY8601', 'DSC_0167', 'DSC_0413 copy',
      'DSC_0432 (2) copy', 'DSC_0868 copy', 'DSC_1463 a copy', 'DSC_1631', 'DSC_1690', '_H6A9162',
      '_H6A9381', '_MG_5440000', '_MG_5530', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'rachakonda':
      [
      '003', '008', '009', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'rajasthan':
      [
      '01_8', '03', '03_2', '03_4', '05', '05_6',
      '07', '08_5', '11_4', '14_4', '16_5', '18_4',
      '27_2', '46', 'DSC_0076', 'DSC_0132', 'DSC_0158', 'DSC_0184',
      'DSC_0501', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'rockforms':
      [
      '03', '04', '06', '08', '09', '10',
      '12', '17', '20', '22', '24', '25',
      'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'tadoba':
      [
      '011', '012', '017', '024', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'thai':
      [
      '001', 'DSC_0006', 'DSC_0020', 'DSC_0024', 'DSC_0027', 'DSC_0029',
      'DSC_0030', 'DSC_0075', 'DSC_0075 (2)', 'DSC_0086', 'DSC_0116', 'DSC_0116 (2)',
      'DSC_0170', 'DSC_0328', 'DSC_0366', 'DSC_0449', 'DSC_0467', 'DSC_0481',
      'DSC_0515', 'DSC_0539', 'DSC_0547', 'DSC_0561', 'DSC_0567', 'DSC_0718',
      'DSC_0744', 'DSC_0836', 'DSC_0845', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'tombs': // Corrected from tumbs
      [
      'DSC_0432', 'DSC_0466', 'hero', 'x00', 'x01', 'x010',
      'x011', 'x012', 'x013', 'x014', 'x015', 'x016',
      'x017', 'x018', 'x02', 'x021', 'x022', 'x023',
      'x024', 'x025', 'x026', 'x027', 'x028', 'x029',
      'x03', 'x031', 'x04', 'x05', 'x06', 'x07',
      'x09', 'x100'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'warangal':[ // Corrected path casing (no functional change needed here as it uses categoryId which is already lowercase)
      '003', '005', '006', '007', '008', '009',
      '010', '011', '012', '013', 'hero'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;

    case 'wildlife':
      [
        '005', 'DSC_0011', 'DSC_0025', 'DSC_0036', 'DSC_0083', 'DSC_0086',
        'DSC_0087', 'DSC_0096', 'DSC_0155', 'DSC_0160', 'DSC_0189', 'DSC_0212',
        'DSC_0228', 'DSC_0259', 'DSC_0457', 'DSC_0539', 'DSC_0541', 'DSC_0995',
        'Elephants', 'Fishes', 'Fox', 'RedPanda', 'hero', 'picture'
      ].forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;
    // For any other category, add a set of generic images to ensure content
    default:
      // Start with hero image
      photos.push(createPhotoObject('hero'));
      
      // Add numbered images that might exist in the category
      ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010'].forEach(num => {
        photos.push(createPhotoObject(num));
      });
      
      // Add some category-specific images based on the category name
      // These might not exist but will be gracefully handled by Next.js Image
      const categorySpecificImages = [
        categoryId.replace(/-/g, ' '), // The category name itself
        'landscape', 'portrait', 'detail', 'overview',
        'close-up', 'panorama', 'scene', 'highlight'
      ];
      
      categorySpecificImages.forEach(name => {
        photos.push(createPhotoObject(name));
      });
      break;
  }

  // Ensure we have at least 20 images for every category to make pagination worthwhile
  if (photos.length < 20) {
    // Add duplicates with unique IDs to pad the collection
    const basePhotos = [...photos];
    for (let i = 0; i < 3; i++) {
      basePhotos.forEach(photo => {
        const duplicatePhoto = { 
          ...photo, 
          id: `${photo.id}-duplicate-${i}-${Math.random().toString(36).substring(2, 9)}`
        };
        photos.push(duplicatePhoto);
      });
    }
  }

  return photos;
};

export default function CategoryGallery() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.category as string || 'wildlife';
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLayout] = useState<'compact' | 'comfortable'>('comfortable');
  const lastPhotoRef = useRef<HTMLDivElement>(null);
  const allPhotosRef = useRef<Photo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const initialLoadDone = useRef(false);

  const ITEMS_PER_PAGE = 20;
  
  // Calculate and store allPhotos only once per category change
  useEffect(() => {
    allPhotosRef.current = getPhotosByCategory(categoryId);
    initialLoadDone.current = false; // Reset initial load flag on category change
    
    // Immediately load first page data instead of waiting for the next effect
    const start = 0; // Always start at 0 for initial load
    const end = ITEMS_PER_PAGE;
    const newPhotos = allPhotosRef.current.slice(start, end);
    
    setLoading(true);
    
    // Use a small timeout to allow React to render the loading state first
    setTimeout(() => {
      setDisplayedPhotos(newPhotos);
      setHasMore(end < allPhotosRef.current.length);
      initialLoadDone.current = true;
      setLoading(false);
    }, 100);
  }, [categoryId, ITEMS_PER_PAGE]);
  
  const loadPhotosForPage = useCallback((pageNum: number) => {
    // Only run this for page changes after initial load
    if (!initialLoadDone.current) {
      return;
    }
    
    setLoading(true);
    
    // Calculate start and end indices
    const start = (pageNum - 1) * ITEMS_PER_PAGE;
    const end = pageNum * ITEMS_PER_PAGE;
    const newPhotos = allPhotosRef.current.slice(start, end);
    
    // Use setTimeout to ensure the loading state is rendered
    setTimeout(() => {
      setDisplayedPhotos(newPhotos);
      setHasMore(end < allPhotosRef.current.length);
      setLoading(false);
    }, 100);
  }, [ITEMS_PER_PAGE]);

  // Load photos when page changes (now only runs after initial load)
  useEffect(() => {
    loadPhotosForPage(page);
  }, [page, loadPhotosForPage]);

  // Reset everything when category changes
  useEffect(() => {
    setDisplayedPhotos([]); // Clear displayed photos
    setPage(1);            // Reset page to 1
    setHasMore(true);      // Reset hasMore flag
    setLoading(true);      // Set loading true on category change
    setCurrentIndex(0);    // Reset current index
    setCurrentImage('');   // Reset current image
    setModalOpen(false);   // Close modal if open
    setIsLoaded(false);    // Reset loaded state
    window.scrollTo(0, 0); // Scroll back to top
    
    // Set loaded state after a delay for animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [categoryId]);

  const handleBack = () => {
    router.push('/gallery');
  };

  const openModal = useCallback((index: number) => {
    setCurrentIndex(index);
    setCurrentImage(displayedPhotos[index].fullscreenSrc);
    setModalOpen(true);
  }, [displayedPhotos]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    if (currentIndex < displayedPhotos.length - 1) {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        setCurrentImage(displayedPhotos[newIndex].fullscreenSrc);
        return newIndex;
      });
    }
  }, [currentIndex, displayedPhotos]);

  const prevImage = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex - 1;
        setCurrentImage(displayedPhotos[newIndex].fullscreenSrc);
        return newIndex;
      });
    }
  }, [currentIndex, displayedPhotos]);

  const goToNextPage = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hasMore]);

  const goToPrevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);

  // Format category name for display
  const formatCategoryName = useCallback((name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  // Get a hero image from the category
  const heroImage = allPhotosRef.current.find(photo => photo.id.includes('hero'))?.fullscreenSrc || 
                   (displayedPhotos.length > 0 ? displayedPhotos[0].fullscreenSrc : '');

  // Calculate total pages
  const totalPages = Math.ceil(allPhotosRef.current.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Hero Header */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {/* Hero background with parallax effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: heroImage ? `url(${heroImage})` : 'none',
            transform: 'scale(1.1)', // Slight zoom for parallax effect
            filter: 'brightness(0.7)',
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        
        {/* Back button */}
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 p-3 rounded-full transition-all duration-300 shadow-lg"
          aria-label="Back to gallery"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
        {/* Category title with reveal animation */}
        <motion.div 
          className="absolute bottom-0 left-0 w-full p-8 md:p-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            {formatCategoryName(categoryId)}
          </h1>
          <div className="flex items-center text-white/80">
            <span className="text-sm md:text-base">
              {page === 1 
                ? `Showing 1-${Math.min(ITEMS_PER_PAGE, allPhotosRef.current.length)} of ${allPhotosRef.current.length} photos` 
                : `Showing ${(page-1)*ITEMS_PER_PAGE + 1}-${Math.min(page*ITEMS_PER_PAGE, allPhotosRef.current.length)} of ${allPhotosRef.current.length} photos`}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Pagination Controls (replaces the grid/masonry toggle) */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPrevPage}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                page === 1 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
              }`}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>
            
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages || 1}
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={!hasMore}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                !hasMore 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
              }`}
            >
              <span>Next</span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Gallery */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence>
          <motion.div
            key={`${categoryId}-${page}-${selectedLayout}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[200px] gap-${selectedLayout === 'compact' ? '3' : '4'}`}
          >
            {displayedPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
                ref={index === displayedPhotos.length - 1 ? lastPhotoRef : null}
                className="h-full"
              >
                <PhotoCard
                  src={photo.src}
                  alt={photo.alt}
                  description=""
                  onClick={() => openModal(index)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center my-12">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900 rounded-full animate-ping opacity-75"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        
        {/* Pagination controls at bottom */}
        {!loading && displayedPhotos.length > 0 && (
          <div className="flex justify-center mt-8 mb-12 space-x-4">
            <button
              onClick={goToPrevPage}
              disabled={page === 1}
              className={`px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-colors ${
                page === 1 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous 20
            </button>
            
            <button
              onClick={goToNextPage}
              disabled={!hasMore}
              className={`px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-colors ${
                !hasMore 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next 20
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
        
        {/* No more photos message */}
        {!hasMore && !loading && page === Math.ceil(allPhotosRef.current.length / ITEMS_PER_PAGE) && displayedPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center my-8 py-6 mx-auto max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">You&apos;ve seen it all!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">That&apos;s every photo in this collection. Want to explore more?</p>
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Back to Gallery
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <FullscreenModal
        isOpen={isModalOpen}
        currentImage={currentImage}
        originalImage={displayedPhotos[currentIndex]?.originalSrc}
        onClose={closeModal}
        onNext={nextImage}
        onPrev={prevImage}
        totalImages={displayedPhotos.length}
        currentIndex={currentIndex}
      />
    </div>
  );
}
