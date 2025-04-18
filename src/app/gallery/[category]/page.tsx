"use client"; // Mark this component as a client-side component

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import PhotoCard from '@/components/PhotoCard';
import FullscreenModal from '@/components/FullscreenModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Masonry } from 'masonic'; // Import from masonic

// Define the Photo type (can be shared or moved to a types file)
interface Photo {
  id: string;
  src: string;
  fullscreenSrc: string;
  originalSrc: string;
  alt: string;
  description: string;
  downloadUrl: string;
}

// Removed categoryDirMap
// Removed s3BaseUrl (will be handled by API)
// Removed getPhotosByCategory function

export default function CategoryGallery() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.category as string || 'wildlife';
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); 
  const [hasMore, setHasMore] = useState(true);
  const [categoryNotFound, setCategoryNotFound] = useState(false); 
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLayout] = useState<'compact' | 'comfortable'>('comfortable');
  const lastPhotoRef = useRef<HTMLDivElement>(null);
  const allPhotosRef = useRef<Photo[]>([]); // Store all fetched photos
  const [isLoaded, setIsLoaded] = useState(false);
  const initialLoadDone = useRef(false);

  const ITEMS_PER_PAGE = 20;
  
  // Fetch all photos for the category via API route
  useEffect(() => {
    setCategoryNotFound(false);
    setLoading(true);
    setDisplayedPhotos([]); // Clear photos immediately
    setPage(1); // Reset page
    setHasMore(true);
    allPhotosRef.current = []; // Clear previous category photos
    initialLoadDone.current = false;
    window.scrollTo(0, 0); // Scroll to top

    const fetchPhotos = async () => {
      try {
        const response = await fetch(`/api/photos/${categoryId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setCategoryNotFound(true);
          } else {
            // Handle other fetch errors if needed
            console.error('Failed to fetch photos:', response.statusText);
            setCategoryNotFound(true); // Treat other errors as not found for now
          }
          setLoading(false);
          setHasMore(false);
          return;
        }

        const photosData: Photo[] = await response.json();
        
        if (photosData.length === 0) {
           setCategoryNotFound(true); // Handle case where API returns empty array unexpectedly
           setLoading(false);
           setHasMore(false);
           return;
        }

        allPhotosRef.current = photosData;
        
        // Load first page
        const start = 0; 
        const end = ITEMS_PER_PAGE;
        const newPhotos = allPhotosRef.current.slice(start, end);
        
        setDisplayedPhotos(newPhotos);
        setHasMore(end < allPhotosRef.current.length);
        initialLoadDone.current = true;
        
      } catch (error) {
        console.error('Error fetching photos:', error);
        setCategoryNotFound(true); // Network error, etc.
        setHasMore(false);
      } finally {
        setLoading(false); 
        // Set loaded state after a delay for animation
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100); // Shorter delay might be okay now
        return () => clearTimeout(timer);
      }
    };

    fetchPhotos();

  }, [categoryId, ITEMS_PER_PAGE]); // Dependency array remains the same
  
  // Load photos for the current page (triggered by page state change)
  const loadPhotosForPage = useCallback((pageNum: number) => {
    if (!initialLoadDone.current || allPhotosRef.current.length === 0) {
      return; // Don't load if initial fetch failed or hasn't happened
    }
    
    setLoading(true);
    
    const start = (pageNum - 1) * ITEMS_PER_PAGE;
    const end = pageNum * ITEMS_PER_PAGE;
    const newPhotos = allPhotosRef.current.slice(start, end);
    
    // Use setTimeout to allow loading state to render
    setTimeout(() => {
      setDisplayedPhotos(newPhotos);
      // Re-check hasMore based on the full list
      setHasMore(end < allPhotosRef.current.length);
      setLoading(false);
    }, 100); 
  }, [ITEMS_PER_PAGE]);

  // useEffect to load photos when page changes - NO CHANGE NEEDED HERE
  useEffect(() => {
    loadPhotosForPage(page);
  }, [page, loadPhotosForPage]);

  // useEffect to reset on category change - MOST LOGIC MOVED TO FETCH useEffect
  useEffect(() => {
    // Reset modal/UI state not directly tied to fetched data
    setCurrentImage('');
    setCurrentIndex(0);
    setModalOpen(false);
    setIsLoaded(false); // Reset animation flag
  }, [categoryId]);

  const handleBack = () => {
    router.push('/gallery');
  };

  const openModal = useCallback((index: number) => {
    // Calculate global index by adding the current page offset
    const globalIndex = (page - 1) * ITEMS_PER_PAGE + index;
    setCurrentIndex(globalIndex);
    setCurrentImage(displayedPhotos[index].fullscreenSrc);
    setModalOpen(true);
  }, [displayedPhotos, page, ITEMS_PER_PAGE]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    if (currentIndex < allPhotosRef.current.length - 1) {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        // Calculate page and index within page
        const pageForImage = Math.floor(newIndex / ITEMS_PER_PAGE) + 1;
        const indexInPage = newIndex % ITEMS_PER_PAGE;
        
        // If we need to load a new page
        if (pageForImage !== page) {
          setPage(pageForImage);
          // The image will be loaded after page change causes displayedPhotos to update
          return newIndex;
        }
        
        // Otherwise, just update the current image
        setCurrentImage(displayedPhotos[indexInPage].fullscreenSrc);
        return newIndex;
      });
    }
  }, [currentIndex, displayedPhotos, page, ITEMS_PER_PAGE]);

  const prevImage = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex - 1;
        // Calculate page and index within page
        const pageForImage = Math.floor(newIndex / ITEMS_PER_PAGE) + 1;
        const indexInPage = newIndex % ITEMS_PER_PAGE;
        
        // If we need to load a new page
        if (pageForImage !== page) {
          setPage(pageForImage);
          // The image will be loaded after page change causes displayedPhotos to update
          return newIndex;
        }
        
        // Otherwise, just update the current image
        setCurrentImage(displayedPhotos[indexInPage].fullscreenSrc);
        return newIndex;
      });
    }
  }, [currentIndex, displayedPhotos, page, ITEMS_PER_PAGE]);

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

  // Use useEffect to update current image when page changes and we're in modal view
  useEffect(() => {
    if (isModalOpen && displayedPhotos.length > 0) {
      const indexInPage = currentIndex % ITEMS_PER_PAGE;
      // Only update if the index is valid for the current page
      if (indexInPage < displayedPhotos.length) {
        setCurrentImage(displayedPhotos[indexInPage].fullscreenSrc);
      }
    }
  }, [displayedPhotos, isModalOpen, currentIndex, ITEMS_PER_PAGE]);

  // Format category name for display
  const formatCategoryName = useCallback((name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  // Get a hero image - Modify to use allPhotosRef.current
  const getHeroImage = () => {
    if (categoryNotFound || allPhotosRef.current.length === 0) {
      return null; // No hero if category not found or empty
    }
    const heroFromPhotos = allPhotosRef.current.find(photo => photo.id.includes('hero'));
    if (heroFromPhotos) return heroFromPhotos.fullscreenSrc;
    
    // If no hero image specifically, use the first image from the fetched list
    return allPhotosRef.current[0].fullscreenSrc;
  };
  
  const heroImage = getHeroImage();

  // Calculate total pages - Use allPhotosRef.current
  const totalPages = Math.ceil(allPhotosRef.current.length / ITEMS_PER_PAGE);

  // Render function for each item in Masonic grid
  const MasonryCard = ({ data, index }: { data: Photo, index: number }) => (
    <motion.div
      key={data.id} // Use photo id as key
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
      className="h-full" // Ensure motion div takes full height
    >
      <PhotoCard
        src={data.src}
        alt={data.alt}
        description=""
        onClick={() => openModal(index)} // Pass the index within the *current page* display
      />
    </motion.div>
  );

  // Conditional Render for Not Found
  if (categoryNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Sorry, we couldn&apos;t find the photo category &quot;{formatCategoryName(categoryId)}&quot;.</p>
          <button
            onClick={handleBack} // Reuse existing back handler
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center justify-center"
          >
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
             </svg>
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Hero Header */}
      {heroImage && (
         <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
           <div 
             className="absolute inset-0 bg-cover bg-center"
             style={{
               backgroundImage: `url(${heroImage})`,
               transform: 'scale(1.1)', 
               filter: 'brightness(0.7)',
             }}
           />
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
           {/* Category title */}
           <motion.div 
            className="absolute bottom-0 left-0 w-full p-8 md:p-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
           >
             <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
               {formatCategoryName(categoryId)}
             </h1>
             {/* Updated photo count display logic */}
             <div className="flex items-center text-white/80">
               <span className="text-sm md:text-base">
                 {allPhotosRef.current.length > 0 ? (
                   page === 1 
                     ? `Showing 1-${Math.min(ITEMS_PER_PAGE, allPhotosRef.current.length)} of ${allPhotosRef.current.length} photos` 
                     : `Showing ${(page-1)*ITEMS_PER_PAGE + 1}-${Math.min(page*ITEMS_PER_PAGE, allPhotosRef.current.length)} of ${allPhotosRef.current.length} photos`
                 ) : (
                   `0 photos`
                 )}
               </span>
             </div>
           </motion.div>
         </div>
      )}

      {/* Pagination Controls (Top) */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={page === 1}
              className={`w-[130px] px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                page === 1 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
              }`}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-bold">Previous</span>
            </button>
            
            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Page {page} of {totalPages || 1}
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={!hasMore}
              className={`w-[130px] px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                !hasMore 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
              }`}
            >
              <span className="font-bold">Next</span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Gallery */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading Skeleton - Adjusted for potentially varying heights */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse h-[250px]"></div> // Slightly taller skeleton
            ))}
          </div>
        )}
        {/* Photo Grid using Masonic (only render if not loading and category found) */}
        {!loading && !categoryNotFound && (
           <AnimatePresence>
              <Masonry
                key={`${categoryId}-${page}`} // Force re-render on category/page change
                items={displayedPhotos} // Pass the currently displayed photos
                columnWidth={250} // Base column width - adjust as needed
                columnGutter={16} // Gap between columns (equiv. gap-4)
                render={MasonryCard} // Use the render function defined above
                overscanBy={5} // Render items slightly outside viewport for smoother scrolling
              />
           </AnimatePresence>
        )}
        
        {/* Pagination controls at bottom */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-8 mb-12 space-x-4">
            <button
              onClick={goToPrevPage}
              disabled={page === 1}
              className={`w-[130px] px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors font-bold ${
                page === 1 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <button
              onClick={goToNextPage}
              disabled={!hasMore}
              className={`w-[130px] px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors font-bold ${
                !hasMore 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
        
        {/* No more photos message */}
        {!hasMore && !loading && !categoryNotFound && page === totalPages && displayedPhotos.length > 0 && (
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
      {!categoryNotFound && (
        <FullscreenModal
          isOpen={isModalOpen}
          currentImage={currentImage}
          originalImage={allPhotosRef.current[currentIndex]?.downloadUrl} 
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
          totalImages={allPhotosRef.current.length} 
          currentIndex={currentIndex}
          getNextImageSrc={(index) => {
            const nextIndex = index + 1;
            return allPhotosRef.current[nextIndex]?.fullscreenSrc || null;
          }}
        />
      )}
    </div>
  );
}
