"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import FullscreenModal from '@/components/FullscreenModal';
import { motion } from 'framer-motion';
import type Masonry from 'masonry-layout';

interface Photo {
  id: string;
  src: string;
  fullscreenSrc: string;
  originalSrc: string;
  alt: string;
  description: string;
  downloadUrl: string;
}

// Type guard for Masonry instance
function isMasonryInstance(obj: Masonry | null): obj is Masonry {
  return obj !== null;
}

const MASONRY_ITEM_SELECTOR = 'grid-item';

export default function CategoryGallery() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.category as string || 'wildlife';
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const allPhotosRef = useRef<Photo[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<Masonry | null>(null);
  const masonryLibRef = useRef<typeof Masonry | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imagesLoadedLibRef = useRef<any>(null);
  const observerTarget = useRef(null);
  const loadedCountRef = useRef<number>(0);

  const ITEMS_PER_LOAD = 20;

  useEffect(() => {
    const loadLibs = async () => {
      try {
        const MasonryLib = (await import('masonry-layout')).default;
        const imagesLoadedLib = (await import('imagesloaded')).default;

        masonryLibRef.current = MasonryLib;
        imagesLoadedLibRef.current = imagesLoadedLib;
        setLibsLoaded(true);
      } catch (error) {
        console.error("Failed to load masonry/imagesloaded:", error);
      }
    };
    loadLibs();
  }, []);

  const initializeMasonry = useCallback(() => {
    if (libsLoaded && gridRef.current && !masonryRef.current && masonryLibRef.current && imagesLoadedLibRef.current) {
      const MasonryLib = masonryLibRef.current;
      const imagesLoadedLib = imagesLoadedLibRef.current;

      const msnry = new MasonryLib(gridRef.current, {
        itemSelector: `.${MASONRY_ITEM_SELECTOR}`,
        columnWidth: '.grid-sizer',
        gutter: 0,
        percentPosition: true,
        transitionDuration: 0
      });
      masonryRef.current = msnry;

      imagesLoadedLib(gridRef.current).on('always', () => {
        // Delay initial layout slightly
        requestAnimationFrame(() => {
          const masonry = masonryRef.current;
          if (masonry) {
            masonry.layout!();
          }
        });
      });
    }
  }, [libsLoaded]);

  useEffect(() => {
    setCategoryNotFound(false);
    setLoadingInitial(true);
    setLoadingMore(false);
    setDisplayedPhotos([]);
    setHasMore(true);
    allPhotosRef.current = [];
    window.scrollTo(0, 0);

    if (masonryRef.current) {
      const masonry = masonryRef.current;
      if (isMasonryInstance(masonry)) {
        masonry.destroy!();
      }
      masonryRef.current = null;
    }

    const fetchPhotos = async () => {
      try {
        const response = await fetch(`/api/photos/${categoryId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setCategoryNotFound(true);
          } else {
            console.error('Failed to fetch photos:', response.statusText);
            setCategoryNotFound(true);
          }
          setLoadingInitial(false);
          setHasMore(false);
          return;
        }

        const photosData: Photo[] = await response.json();

        if (photosData.length === 0) {
          setCategoryNotFound(true);
          setLoadingInitial(false);
          setHasMore(false);
          return;
        }

        allPhotosRef.current = photosData;
        const initialPhotos = allPhotosRef.current.slice(0, ITEMS_PER_LOAD);
        setDisplayedPhotos(initialPhotos);
        setHasMore(ITEMS_PER_LOAD < allPhotosRef.current.length);
        loadedCountRef.current = initialPhotos.length;

      } catch (error) {
        console.error('Error fetching photos:', error);
        setCategoryNotFound(true);
        setHasMore(false);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchPhotos();

    return () => {
      if (masonryRef.current) {
        const masonry = masonryRef.current;
        if (isMasonryInstance(masonry)) {
          masonry.destroy!();
        }
        masonryRef.current = null;
      }
    };
  }, [categoryId, ITEMS_PER_LOAD]);

  useEffect(() => {
    if (libsLoaded && !loadingInitial && gridRef.current) {
      const gridElement = gridRef.current;
      const imagesLoadedLib = imagesLoadedLibRef.current;

      if (!masonryRef.current) {
         console.log("[Layout Effect] Masonry not initialized. Calling initializeMasonry().");
         initializeMasonry();
      } else {
        if (imagesLoadedLib && gridElement && displayedPhotos.length > 0) {
          console.log("[Layout Effect] Masonry exists. Re-running imagesLoaded for grid update...");
          imagesLoadedLib(gridElement).on('always', () => {
            console.log("[Layout Effect] imagesLoaded 'always' callback fired.");
            if (masonryRef.current) {
              requestAnimationFrame(() => {
                const masonry = masonryRef.current;
                if (isMasonryInstance(masonry)) {
                  console.log("[Layout Effect] Calling masonry.layout() inside requestAnimationFrame.");
                  masonry.layout!();
                }
              });
            }
          });
        }
      }
    }
  }, [loadingInitial, displayedPhotos, initializeMasonry, libsLoaded]);

  const openModal = useCallback((index: number) => {
    if (index >= 0 && index < allPhotosRef.current.length) {
        setCurrentIndex(index);
        setCurrentImage(allPhotosRef.current[index]?.fullscreenSrc || '');
        setModalOpen(true);
    }
  }, []);

  const loadMorePhotos = useCallback(() => {
    if (loadingMore || !hasMore || loadingInitial || !libsLoaded || !gridRef.current || !masonryRef.current || !imagesLoadedLibRef.current || !masonryLibRef.current) return;

    const imagesLoadedLib = imagesLoadedLibRef.current;
    const masonry = masonryRef.current;
    const gridElement = gridRef.current;

    setLoadingMore(true);

    const currentLength = loadedCountRef.current;
    const nextPhotos = allPhotosRef.current.slice(currentLength, currentLength + ITEMS_PER_LOAD);

    if (nextPhotos.length === 0) {
      setLoadingMore(false);
      setHasMore(false);
      return;
    }

    const tempContainer = document.createElement('div');
    const newElements: HTMLElement[] = [];

    nextPhotos.forEach(photo => {
        const photoDiv = document.createElement('div');
        photoDiv.className = `${MASONRY_ITEM_SELECTOR} w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 mb-4 box-border p-2`;
        photoDiv.style.opacity = '0';
        photoDiv.style.transition = 'opacity 0.5s ease-in-out';
        photoDiv.innerHTML = `
            <img src="${photo.src}" alt="${photo.alt}" class="block w-full h-auto rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105" />
        `;
        photoDiv.querySelector('img')?.addEventListener('click', () => {
             const globalIndex = allPhotosRef.current.findIndex(p => p.id === photo.id);
             if (globalIndex !== -1) {
                 openModal(globalIndex);
             }
        });
        tempContainer.appendChild(photoDiv);
        newElements.push(photoDiv);
    });

    newElements.forEach(el => gridElement?.appendChild(el));

    if (imagesLoadedLib && isMasonryInstance(masonry)) {
      imagesLoadedLib(newElements).on('always', () => {
        masonry.appended!(newElements);
        newElements.forEach(el => { el.style.opacity = '1'; });
        
        requestAnimationFrame(() => {
          const currentMasonry = masonryRef.current;
          if (isMasonryInstance(currentMasonry)) {
            currentMasonry.layout!();
          }
        });
        
        loadedCountRef.current += nextPhotos.length;
        setHasMore(loadedCountRef.current < allPhotosRef.current.length);
        setLoadingMore(false);
      });
    } else {
      // Fallback if imagesLoaded is not available
      if (isMasonryInstance(masonry)) {
        masonry.appended!(newElements);
      }
      newElements.forEach(el => { el.style.opacity = '1'; });
      
      requestAnimationFrame(() => {
        const currentMasonry = masonryRef.current;
        if (isMasonryInstance(currentMasonry)) {
          currentMasonry.layout!();
        }
      });
      
      loadedCountRef.current += nextPhotos.length;
      setHasMore(loadedCountRef.current < allPhotosRef.current.length);
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, loadingInitial, libsLoaded, ITEMS_PER_LOAD, openModal]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loadingInitial) {
          loadMorePhotos();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMorePhotos, hasMore, loadingMore, loadingInitial]);

  useEffect(() => {
    setCurrentImage('');
    setCurrentIndex(0);
    setModalOpen(false);
  }, [categoryId]);

  const handleBack = () => {
    router.back();
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex(prevIndex => {
      const newIndex = Math.min(prevIndex + 1, allPhotosRef.current.length - 1);
      setCurrentImage(allPhotosRef.current[newIndex]?.fullscreenSrc || '');
      return newIndex;
    });
  }, []);

  const prevImage = useCallback(() => {
    setCurrentIndex(prevIndex => {
      const newIndex = Math.max(prevIndex - 1, 0);
      setCurrentImage(allPhotosRef.current[newIndex]?.fullscreenSrc || '');
      return newIndex;
    });
  }, []);

  const formatCategoryName = useCallback((name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  const getHeroImage = () => {
    if (categoryNotFound || allPhotosRef.current.length === 0) {
      return null;
    }
    const heroFromPhotos = allPhotosRef.current.find(photo => photo.id.includes('hero'));
    if (heroFromPhotos) return heroFromPhotos.fullscreenSrc;
    return allPhotosRef.current[0]?.fullscreenSrc;
  };

  const heroImage = getHeroImage();

  if (categoryNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Sorry, we couldn&apos;t find the photo category &quot;{formatCategoryName(categoryId)}&quot;.</p>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
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
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 p-3 rounded-full transition-all duration-300 shadow-lg"
            aria-label="Back to gallery"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
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
                {allPhotosRef.current.length > 0
                  ? `${allPhotosRef.current.length} photo${allPhotosRef.current.length !== 1 ? 's' : ''}`
                  : `0 photos`
                }
              </span>
            </div>
          </motion.div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {loadingInitial && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: ITEMS_PER_LOAD }).map((_, index) => (
              <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse h-[250px]"></div>
            ))}
          </div>
        )}

        {!loadingInitial && displayedPhotos.length > 0 && (
          <div ref={gridRef} className="masonry-grid -m-2">
            <div className="grid-sizer w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"></div>
            {displayedPhotos.map((photo, index) => (
               <div key={photo.id} className={`${MASONRY_ITEM_SELECTOR} w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 mb-4 box-border p-2`}>
                   <img
                     src={photo.src}
                     alt={photo.alt}
                     className="block w-full h-auto rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
                     onClick={() => openModal(index)}
                   />
               </div>
            ))}
          </div>
        )}

        {loadingMore && (
          <div className="flex justify-center items-center my-8">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-700 dark:text-gray-300">Loading more photos...</span>
          </div>
        )}

        <div ref={observerTarget} style={{ height: '1px', marginTop: '1px' }}></div>

        {!hasMore && !loadingInitial && !loadingMore && !categoryNotFound && displayedPhotos.length > 0 && (
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
              <p className="text-gray-600 dark:text-gray-400 mb-4">That&apos;s every photo in the &quot;{formatCategoryName(categoryId)}&quot; collection.</p>
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

      {!categoryNotFound && allPhotosRef.current.length > 0 && (
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
            if (nextIndex >= 0 && nextIndex < allPhotosRef.current.length) {
              return allPhotosRef.current[nextIndex]?.fullscreenSrc || null;
            }
            return null;
          }}
        />
      )}
    </div>
  );
}