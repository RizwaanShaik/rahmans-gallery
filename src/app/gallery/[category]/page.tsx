"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import FullscreenModal from '@/components/FullscreenModal';
import SocialShare from '@/components/SocialShare';
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
  const [imagesReadyToShow, setImagesReadyToShow] = useState(false);
  const allPhotosRef = useRef<Photo[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<Masonry | null>(null);
  const masonryLibRef = useRef<typeof Masonry | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imagesLoadedLibRef = useRef<any>(null);
  const observerTarget = useRef(null);
  const loadedCountRef = useRef<number>(0);
  const imagesLoadedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

      const createMasonryInstance = () => {
        if (!gridRef.current || masonryRef.current || !MasonryLib) return;

      const msnry = new MasonryLib(gridRef.current, {
        itemSelector: `.${MASONRY_ITEM_SELECTOR}`,
        columnWidth: '.grid-sizer',
        gutter: 0,
        percentPosition: true,
        transitionDuration: 0
      });
      masonryRef.current = msnry;

        // Initial layout after masonry is created
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (masonryRef.current) {
              masonryRef.current.layout!();
              // Small delay before showing images for smooth transition
              setTimeout(() => {
                setImagesReadyToShow(true);
              }, 100);
            }
          });
        });
      };

      // Wait for ALL images to be loaded with dimensions before initializing masonry
      const instance = imagesLoadedLib(gridRef.current);
      
      instance.on('always', () => {
        // Verify all images have dimensions before proceeding
        const images = gridRef.current?.querySelectorAll('img') || [];
        let allHaveDimensions = true;
        
        images.forEach((img: HTMLImageElement) => {
          if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
            allHaveDimensions = false;
          }
        });

        if (!allHaveDimensions && images.length > 0) {
          // Some images still loading, wait a bit more and check again
          setTimeout(() => {
            if (!gridRef.current || masonryRef.current) return;
            const retryInstance = imagesLoadedLib(gridRef.current);
            retryInstance.on('always', () => {
              setTimeout(() => {
                createMasonryInstance();
              }, 50);
        });
          }, 150);
          return;
        }

        // All images loaded, initialize masonry
        setTimeout(() => {
          createMasonryInstance();
        }, 50);
      });
    }
  }, [libsLoaded]);

  useEffect(() => {
    setCategoryNotFound(false);
    setLoadingInitial(true);
    setLoadingMore(false);
    setDisplayedPhotos([]);
    setHasMore(true);
    setImagesReadyToShow(false);
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
      if (imagesLoadedTimeoutRef.current) {
        clearTimeout(imagesLoadedTimeoutRef.current);
      }
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
    if (libsLoaded && !loadingInitial && displayedPhotos.length > 0 && gridRef.current) {
      if (!masonryRef.current) {
        // Initialize masonry only after images are loaded
         initializeMasonry();
      } else {
        // Recalculate layout when displayedPhotos changes - wait for images to load
        if (imagesLoadedLibRef.current && gridRef.current) {
          imagesLoadedLibRef.current(gridRef.current).on('always', () => {
            // Wait a bit for images to have dimensions
            setTimeout(() => {
            if (masonryRef.current) {
                requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const masonry = masonryRef.current;
                if (isMasonryInstance(masonry)) {
                  masonry.layout!();
                      // After layout recalculation, ensure images are visible
                      if (!imagesReadyToShow) {
                        setImagesReadyToShow(true);
                      }
                }
                  });
              });
            }
            }, 50);
          });
        }
      }
    }
  }, [loadingInitial, displayedPhotos, initializeMasonry, libsLoaded, imagesReadyToShow]);

  // Handle window resize to recalculate masonry layout
  useEffect(() => {
    const handleResize = () => {
      if (masonryRef.current && isMasonryInstance(masonryRef.current)) {
        requestAnimationFrame(() => {
          masonryRef.current?.layout!();
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    nextPhotos.forEach((photo, idx) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = `${MASONRY_ITEM_SELECTOR} w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 mb-4 box-border p-2`;
        photoDiv.style.opacity = '0';
        photoDiv.style.transition = `opacity 0.6s ease-out ${idx * 0.03}s`;
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
        
        // Wait for masonry layout before fading in
        requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const currentMasonry = masonryRef.current;
          if (isMasonryInstance(currentMasonry)) {
            currentMasonry.layout!();
              // Fade in images after layout is calculated
              setTimeout(() => {
                newElements.forEach(el => { 
                  el.style.opacity = '1'; 
                });
              }, 50);
            }
          });
        });
        
        loadedCountRef.current += nextPhotos.length;
        setHasMore(loadedCountRef.current < allPhotosRef.current.length);
        setLoadingMore(false);
      });
    } else {
      // Fallback if imagesLoaded is not available (simplified)
      if (isMasonryInstance(masonry)) {
        masonry.appended!(newElements);
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isMasonryInstance(masonry)) {
            masonry.layout!();
            setTimeout(() => {
              newElements.forEach(el => { el.style.opacity = '1'; });
            }, 50);
          }
        });
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

  // Get breadcrumb path based on category
  const getBreadcrumbs = () => {
    const crumbs = [
      { label: 'Home', href: '/' },
      { label: 'Gallery', href: '/gallery' }
    ];

    // Determine parent category
    const placesCategories = ['bidar', 'warangal', 'kanhari-caves', 'hampi', 'kolkata-streets', 'ladakh', 'london', 'rajasthan', 'thai', 'hyderabad'];
    const heritageCategories = ['heritage', 'tombs', 'culture'];
    const natureCategories = ['wildlife', 'landscapes', 'rock-forms'];
    const styleCategories = ['macro', 'b-and-w', 'air-show', 'portraits'];

    if (placesCategories.includes(categoryId)) {
      crumbs.push({ label: 'Places', href: '/gallery/places' });
    } else if (heritageCategories.includes(categoryId)) {
      crumbs.push({ label: 'Heritage & History', href: '/gallery/heritage-history' });
    } else if (natureCategories.includes(categoryId)) {
      crumbs.push({ label: 'Nature & Wildlife', href: '/gallery/nature-wildlife' });
    } else if (styleCategories.includes(categoryId)) {
      crumbs.push({ label: 'Photography Styles', href: '/gallery/photography-styles' });
    }

    crumbs.push({ label: formatCategoryName(categoryId), href: '' });
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const imageCount = allPhotosRef.current.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 py-4 md:py-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center flex-shrink-0">
              {index > 0 && (
                <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mx-1 md:mx-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors min-h-[44px] flex items-center px-1"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium min-h-[44px] flex items-center px-1">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

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
            className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 p-3 md:p-4 rounded-full transition-all duration-300 shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
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
                {imageCount > 0
                  ? `${imageCount} ${imageCount === 1 ? 'image' : 'images'}`
                  : `0 images`
                }
              </span>
            </div>
          </motion.div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {loadingInitial && (
          <div className="masonry-grid -m-2">
            <div className="grid-sizer w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"></div>
            {Array.from({ length: ITEMS_PER_LOAD }).map((_, index) => {
              // Vary heights to match masonry layout
              const heights = [200, 250, 300, 280, 220, 260, 240, 270];
              const height = heights[index % heights.length];
              return (
                <div 
                  key={index} 
                  className="grid-item w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 mb-4 box-border p-2"
                >
                  <div 
                    className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-full"
                    style={{ height: `${height}px` }}
                  ></div>
                </div>
              );
            })}
          </div>
        )}

        {!loadingInitial && displayedPhotos.length > 0 && (
          <div ref={gridRef} className="masonry-grid -m-2">
            <div className="grid-sizer w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"></div>
            {displayedPhotos.map((photo, index) => (
               <motion.div 
                 key={photo.id} 
                 className={`${MASONRY_ITEM_SELECTOR} w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 mb-4 box-border p-2`}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: imagesReadyToShow ? 1 : 0 }}
                 transition={{ 
                   duration: 0.6, 
                   delay: index * 0.03,
                   ease: "easeOut"
                 }}
                 style={{ 
                   opacity: imagesReadyToShow ? 1 : 0,
                   pointerEvents: imagesReadyToShow ? 'auto' : 'none'
                 }}
               >
                   <div className="relative w-full rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform duration-300 hover:scale-105 touch-manipulation" onClick={() => openModal(index)} style={{ touchAction: 'manipulation' }}>
                     <Image
                       src={photo.src}
                       alt={photo.alt}
                       width={400}
                       height={600}
                       sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                       className="w-full h-auto object-cover rounded-lg"
                       priority={index < 20}
                       loading={index < 20 ? "eager" : "lazy"}
                       onLoad={(e) => {
                         // Ensure image has natural dimensions before triggering layout
                         const img = e.currentTarget;
                         if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                           // Debounce to avoid excessive calls
                           if (imagesLoadedTimeoutRef.current) {
                             clearTimeout(imagesLoadedTimeoutRef.current);
                           }
                           imagesLoadedTimeoutRef.current = setTimeout(() => {
                             if (masonryRef.current && isMasonryInstance(masonryRef.current) && imagesLoadedLibRef.current && gridRef.current) {
                               // Use imagesLoaded to check all images, then recalculate
                               imagesLoadedLibRef.current(gridRef.current).on('always', () => {
                                 requestAnimationFrame(() => {
                                   if (masonryRef.current && isMasonryInstance(masonryRef.current)) {
                                     masonryRef.current.layout!();
                                   }
                                 });
                               });
                             }
                           }, 100);
                         }
                       }}
                     />
                   </div>
               </motion.div>
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
          imageTitle={allPhotosRef.current[currentIndex]?.alt || `Photo ${currentIndex + 1}`}
          categoryName={formatCategoryName(categoryId)}
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