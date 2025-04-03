"use client"; // Mark this component as a client-side component

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PhotoCard from '@/components/PhotoCard';
import FullscreenModal from '@/components/FullscreenModal';

// Define the Photo type
interface Photo {
  id: string;
  src: string;
  fullscreenSrc: string;
  originalSrc: string;
  alt: string;
  description?: string;
}

// Import directly based on the category
const getPhotosByCategory = (categoryId: string): Photo[] => {
  // In a real application, we would filter photos based on categoryId
  console.log(`Loading photos for category: ${categoryId}`);
  
  // Return different photos based on category
  switch (categoryId) {
    case 'wildlife':
      return [
        {
          id: 'wildlife-1',
          src: '/images/wildlife/thumbnails/RedPanda.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/RedPanda.jpeg',
          originalSrc: '/images/original/wildlife/RedPanda.JPG',
          alt: 'Red Panda',
          description: 'A beautiful red panda captured in its natural habitat, showcasing its vibrant fur and expressive face.'
        },
        {
          id: 'wildlife-2',
          src: '/images/wildlife/thumbnails/DSC_0011.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0011.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0011.JPG',
          alt: 'Wildlife Photo 3',
        },
        {
          id: 'wildlife-3',
          src: '/images/wildlife/thumbnails/DSC_0025.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0025.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0025.JPG',
          alt: 'Wildlife Photo 4',
        },
        {
          id: 'wildlife-4',
          src: '/images/wildlife/thumbnails/DSC_0036.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0036.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0036.JPG',
          alt: 'Wildlife Photo 5',
        },
        {
          id: 'wildlife-5',
          src: '/images/wildlife/thumbnails/DSC_0083.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0083.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0083.JPG',
          alt: 'Wildlife Photo 6',
        },
        {
          id: 'wildlife-6',
          src: '/images/wildlife/thumbnails/DSC_0086.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0086.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0086.JPG',
          alt: 'Wildlife Photo 7',
        },
        {
          id: 'wildlife-7',
          src: '/images/wildlife/thumbnails/DSC_0087.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0087.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0087.JPG',
          alt: 'Wildlife Photo 8',
        },
        {
          id: 'wildlife-8',
          src: '/images/wildlife/thumbnails/DSC_0160.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0160.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0160.JPG',
          alt: 'Wildlife Photo 9',
        },
        {
          id: 'wildlife-9',
          src: '/images/wildlife/thumbnails/DSC_0189.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0189.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0189.JPG',
          alt: 'Wildlife Photo 10',
        },
        {
          id: 'wildlife-10',
          src: '/images/wildlife/thumbnails/DSC_0212.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0212.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0212.JPG',
          alt: 'Wildlife Photo 11',
        },
        {
          id: 'wildlife-11',
          src: '/images/wildlife/thumbnails/DSC_0228.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0228.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0228.JPG',
          alt: 'Wildlife Photo 12',
        },
        {
          id: 'wildlife-12',
          src: '/images/wildlife/thumbnails/DSC_0259.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0259.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0259.JPG',
          alt: 'Wildlife Photo 13',
        },
        {
          id: 'wildlife-13',
          src: '/images/wildlife/thumbnails/DSC_0457.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0457.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0457.JPG',
          alt: 'Wildlife Photo 14',
        },
        {
          id: 'wildlife-14',
          src: '/images/wildlife/thumbnails/DSC_0539.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0539.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0539.JPG',
          alt: 'Wildlife Photo 15',
        },
        {
          id: 'wildlife-15',
          src: '/images/wildlife/thumbnails/DSC_0995.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/DSC_0995.jpeg',
          originalSrc: '/images/original/wildlife/DSC_0995.JPG',
          alt: 'Wildlife Photo 16',
        },
        {
          id: 'wildlife-16',
          src: '/images/wildlife/thumbnails/Elephants.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/Elephants.jpeg',
          originalSrc: '/images/original/wildlife/Elephants.JPG',
          alt: 'Elephants',
        },
        {
          id: 'wildlife-17',
          src: '/images/wildlife/thumbnails/Fishes.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/Fishes.jpeg',
          originalSrc: '/images/original/wildlife/Fishes.JPG',
          alt: 'Fishes',
        },
        {
          id: 'wildlife-18',
          src: '/images/wildlife/thumbnails/Fox.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/Fox.jpeg',
          originalSrc: '/images/original/wildlife/Fox.JPG',
          alt: 'Fox',
        },
        {
          id: 'wildlife-19',
          src: '/images/wildlife/thumbnails/picture.jpeg',
          fullscreenSrc: '/images/wildlife/fullscreen/picture.jpeg',
          originalSrc: '/images/original/wildlife/picture.JPG',
          alt: 'Wildlife Picture',
        },
      ];
    case 'portrait':
      return [
        {
          id: 'portrait-1',
          src: '/images/portrait/thumbnails/portrait1.jpeg',
          fullscreenSrc: '/images/portrait/fullscreen/portrait1.jpeg',
          originalSrc: '/images/original/portrait/portrait1.JPG',
          alt: 'Portrait 1',
        },
        {
          id: 'portrait-2',
          src: '/images/portrait/thumbnails/portrait2.jpeg',
          fullscreenSrc: '/images/portrait/fullscreen/portrait2.jpeg',
          originalSrc: '/images/original/portrait/portrait2.JPG',
          alt: 'Portrait 2',
        },
      ];
    case 'architecture':
      return [
        {
          id: 'architecture-1',
          src: '/images/architecture/thumbnails/hero.jpeg',
          fullscreenSrc: '/images/architecture/fullscreen/hero.jpeg',
          originalSrc: '/images/original/architecture/hero.JPG',
          alt: 'Architecture Hero',
        },
      ];
    case 'abstract':
      return [
        {
          id: 'abstract-1',
          src: '/images/abstract/thumbnails/abstract1.jpeg',
          fullscreenSrc: '/images/abstract/fullscreen/abstract1.jpeg',
          originalSrc: '/images/original/abstract/abstract1.JPG',
          alt: 'Abstract 1',
        },
        {
          id: 'abstract-2',
          src: '/images/abstract/thumbnails/abstract2.jpeg',
          fullscreenSrc: '/images/abstract/fullscreen/abstract2.jpeg',
          originalSrc: '/images/original/abstract/abstract2.JPG',
          alt: 'Abstract 2',
        },
      ];
    default:
      return [];
  }
};

export default function CategoryGallery() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.category as string || 'wildlife';
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const allPhotos = getPhotosByCategory(categoryId);

  const ITEMS_PER_PAGE = 50; // Increased to load all images at once
  
  const loadMorePhotos = useCallback(() => {
    if (loading) return; // Prevent multiple simultaneous loads
    setLoading(true);
    
    // Use setTimeout to prevent UI blocking on mobile
    setTimeout(() => {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const newPhotos = allPhotos.slice(start, end);
      
      if (newPhotos.length > 0) {
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
    }, 100); // Small delay to prevent UI blocking
  }, [page, allPhotos, loading]);

  const lastPhotoRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePhotos();
      }
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMorePhotos]);

  // Add a scroll event listener as a fallback for mobile
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Debounce scroll events
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1500) {
          if (!loading && hasMore) {
            loadMorePhotos();
          }
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [loading, hasMore, loadMorePhotos]);

  // Reset everything when category changes
  useEffect(() => {
    setDisplayedPhotos([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
  }, [categoryId]);

  // Load initial photos when category changes or on first load
  useEffect(() => {
    if (page === 1) {
      loadMorePhotos();
    }
  }, [page, loadMorePhotos]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentImage(displayedPhotos[index].fullscreenSrc);
    setCurrentIndex(index);
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

  const handleBack = () => {
    router.push('/gallery');
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
            key={photo.id} 
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
