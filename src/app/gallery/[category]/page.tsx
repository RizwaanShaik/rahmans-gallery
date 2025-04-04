"use client"; // Mark this component as a client-side component

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import PhotoCard from '@/components/PhotoCard';
import FullscreenModal from '@/components/FullscreenModal';

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
  // Removed potentially incorrect mappings below
};

// Common image extensions to check
const extensions = ['jpeg', 'jpg', 'JPG', 'JPEG'];

// Helper function to check if a file exists with any of the extensions
const fileExistsWithExtension = (basePath: string): string | null => {
  for (const ext of extensions) {
    const filePath = `${basePath}.${ext}`;
    // In browser context, we can't check file existence directly
    // So we'll try to load the image and let the browser handle missing files
    return filePath;
  }
  return null;
};

// Get photos for a category
const getPhotosByCategory = (categoryId: string): Photo[] => {
  console.log(`Loading photos for category: ${categoryId}`);
  
  const dirName = categoryDirMap[categoryId] || categoryId;
  const photos: Photo[] = [];

  // Function to create a photo object
  const createPhotoObject = (baseName: string): Photo => {
    const categoryPath = dirName.toLowerCase();
    return {
      id: `${categoryId}-${baseName}`,
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
        'glory of history', 'god\'s light', 'happiness of a full meal', 'happy mother and child', 'heritage vs modern', 'hero',
        'hidden landscape', 'history standing tall', 'history standing tall 1', 'history though the arch', 'innocent', 'into the divinity',
        'into the future', 'into the raising sun', 'lady luck', 'last costomer', 'last fight', 'last minute discussion',
        'leading into the history', 'leaf in pebbles', 'leave us alone', 'limited sunshine', 'live start fresh again', 'lone fighter',
        'lone passenger', 'lonely bird', 'lonely boat', 'looking for livelihood', 'loosing nature', 'love birds',
        'love birds', 'maharaja entrance', 'man\'s best friend', 'matching with trends', 'modern circle', 'monk in kalachakra',
        'monkey family', 'mother\'s anxiety', 'mountain river', 'mystic clouds', 'mystique ladakh', 'mystique rocks',
        'nature at its best', 'nature at its best 1', 'nature at its best 2', 'nature through rocky window', 'nature\'s window', 'old habits die hard',
        'oldage freinds', 'one for you', 'passing clouds', 'passing clouds 2', 'passing clouds 2 - Copy', 'past glory',
        'past glory 2', 'pattern houses', 'people and monument 2', 'pillar of power', 'pooja item seller', 'prayers for rain',
        'prayers for rains', 'proposal discussion', 'protected history', 'proud mother', 'purity in the river', 'rays of hope',
        'resting', 'resting boats', 'rich man\'s lexury', 'rivers of babylon', 'rivers of mountain', 'rocky form',
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
        'paigah tombs', 'purani haveli', 'purani idgah', 'putti\'s house', 'tumbs', 'yousuf hose'
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

    // For any other category, include at least the hero image
    default:
      photos.push(createPhotoObject('hero'));
      break;
  }

  return photos;
};

export default function CategoryGallery() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.category as string || 'wildlife';
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastPhotoRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const allPhotos = getPhotosByCategory(categoryId);

  const ITEMS_PER_PAGE = 50; // Increased to load all images at once
  
  const loadMorePhotos = useCallback(() => {
    if (loading) return; // Prevent multiple simultaneous loads
    setLoading(true);
    
    // Use setTimeout to prevent UI blocking on mobile
    setTimeout(() => {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = page * ITEMS_PER_PAGE;
      const newPhotos = allPhotos.slice(start, end);
      
      if (newPhotos.length > 0) {
        // Check for duplicates before adding new photos
        setDisplayedPhotos(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPhotos = newPhotos.filter(photo => !existingIds.has(photo.id));
          return [...prev, ...uniqueNewPhotos];
        });
        setPage(prev => prev + 1);
        setHasMore(end < allPhotos.length);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    }, 100);
  }, [page, allPhotos, loading]);

  useEffect(() => {
    if (lastPhotoRef.current && hasMore) {
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !loading) {
          loadMorePhotos();
        }
      });
      
      observer.current.observe(lastPhotoRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMorePhotos]);

  // Add a scroll event listener as a fallback for mobile
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Debounce scroll events
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
          hasMore &&
          !loading
        ) {
          loadMorePhotos();
        }
      }, 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadMorePhotos]);

  // Reset everything when category changes
  useEffect(() => {
    setDisplayedPhotos([]); // Clear displayed photos
    setPage(1);            // Reset page to 1
    setHasMore(true);      // Reset hasMore flag
    setLoading(false);     // Reset loading state
    setCurrentIndex(0);    // Reset current index
    setCurrentImage('');   // Reset current image
    setModalOpen(false);   // Close modal if open
  }, [categoryId]);

  // Load initial photos when category changes or on first load
  useEffect(() => {
    if (page === 1) {
      loadMorePhotos();
    }
  }, [page, loadMorePhotos]);

  const handleBack = () => {
    router.push('/gallery');
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setCurrentImage(displayedPhotos[index].fullscreenSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
    if (currentIndex < displayedPhotos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentImage(displayedPhotos[currentIndex + 1].fullscreenSrc);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentImage(displayedPhotos[currentIndex - 1].fullscreenSrc);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      {/* Mobile-optimized header for smaller screens */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="bg-white dark:bg-gray-800 rounded-full shadow p-2 mr-3 flex-shrink-0 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Back to Gallery"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-2xl font-bold truncate text-gray-900 dark:text-white">
            {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Photography
          </h1>
        </div>
      </div>

      {/* Desktop header for larger screens */}
      <div className="hidden sm:flex items-center justify-center mb-8 relative">
        <button
          onClick={handleBack}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center transition-colors absolute left-0"
          aria-label="Back to Gallery"
        >
          <span className="mr-2">&#8592;</span>
          <span className="font-medium">Back to Gallery</span>
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Photography
        </h1>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedPhotos.map((photo, index) => (
          <div
            key={`${photo.id}-${index}`} // Use index to ensure unique key
            ref={index === displayedPhotos.length - 1 ? lastPhotoRef : null}
            onClick={() => openModal(index)}
            className="transform transition-transform duration-300 hover:scale-102 focus:scale-102"
          >
            <PhotoCard
              src={photo.src}
              alt={photo.alt}
              description={photo.description}
            />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-gray-800 dark:border-t-gray-300 rounded-full animate-spin"></div>
        </div>
      )}

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
