"use client"; // Mark this component as a client-side component

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PhotoCard from '@/components/PhotoCard';
import FullscreenModal from '@/components/FullscreenModal';

// Import directly based on the category
const getPhotosByCategory = (categoryId: string) => {
  // In a real application, we would filter photos based on categoryId
  console.log(`Loading photos for category: ${categoryId}`);
  
  // Return different photos based on category
  switch (categoryId) {
    case 'wildlife':
      return [
        {
          id: '1',
          src: '/images/wildlife/RedPanda.JPG',
          alt: 'Photo 1',
        },
        {
          id: '3',
          src: '/images/wildlife/DSC_0011.JPG',
          alt: 'Photo 3',
        },
        {
          id: '4',
          src: '/images/wildlife/DSC_0025.JPG',
          alt: 'Photo 4',
        },
        {
          id: '5',
          src: '/images/wildlife/DSC_0036.JPG',
          alt: 'Photo 5',
        },
        {
          id: '6',
          src: '/images/wildlife/DSC_0083.JPG',
          alt: 'Photo 6',
        },
        {
          id: '7',
          src: '/images/wildlife/DSC_0086.JPG',
          alt: 'Photo 7',
        },
        {
          id: '8',
          src: '/images/wildlife/DSC_0087.JPG',
          alt: 'Photo 8',
        },
        {
          id: '9',
          src: '/images/wildlife/DSC_0160.JPG',
          alt: 'Photo 9',
        },
        {
          id: '10',
          src: '/images/wildlife/DSC_0189.JPG',
          alt: 'Photo 10',
        },
        {
          id: '11',
          src: '/images/wildlife/DSC_0212.JPG',
          alt: 'Photo 11',
        },
        {
          id: '12',
          src: '/images/wildlife/DSC_0228.JPG',
          alt: 'Photo 12',
        },
        {
          id: '13',
          src: '/images/wildlife/DSC_0259.JPG',
          alt: 'Photo 13',
        },
        {
          id: '14',
          src: '/images/wildlife/DSC_0457.JPG',
          alt: 'Photo 14',
        },
        {
          id: '15',
          src: '/images/wildlife/DSC_0539.JPG',
          alt: 'Photo 15',
        },
        {
          id: '16',
          src: '/images/wildlife/DSC_0995.JPG',
          alt: 'Photo 16',
        },
        {
          id: '17',
          src: '/images/wildlife/Elephants.JPG',
          alt: 'Photo 17',
        },
        {
          id: '18',
          src: '/images/wildlife/Fishes.JPG',
          alt: 'Photo 18',
        },
        {
          id: '19',
          src: '/images/wildlife/Fox.JPG',
          alt: 'Photo 19',
        },
        {
          id: '20',
          src: '/images/wildlife/picture.jpg',
          alt: 'Photo 20',
        },
      ];
    case 'portrait':
      return [
        {
          id: '1',
          src: '/images/portrait/portrait1.jpg',
          alt: 'Portrait 1',
        },
        {
          id: '2',
          src: '/images/portrait/portrait2.jpg',
          alt: 'Portrait 2',
        },
        // Add more portrait photos here
      ];
    case 'architecture':
      return [
        {
          id: '1',
          src: '/images/architecture/arch1.jpg',
          alt: 'Architecture 1',
        },
        {
          id: '2',
          src: '/images/architecture/arch2.jpg',
          alt: 'Architecture 2',
        },
        // Add more architecture photos here
      ];
    case 'abstract':
      return [
        {
          id: '1',
          src: '/images/abstract/abstract1.jpg',
          alt: 'Abstract 1',
        },
        {
          id: '2',
          src: '/images/abstract/abstract2.jpg',
          alt: 'Abstract 2',
        },
        // Add more abstract photos here
      ];
    default:
      return [];
  }
};

export default function CategoryGallery() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.category as string || 'wildlife';
  
  // Map category ID to display title
  const categoryTitles: {[key: string]: string} = {
    'wildlife': 'Wildlife',
    'portrait': 'Portrait',
    'architecture': 'Architecture',
    'abstract': 'Abstract'
  };
  
  const categoryTitle = categoryTitles[categoryId] || 'Photography';
  const photos = getPhotosByCategory(categoryId);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Prevent unintended navigation when component mounts or URL params change
  useEffect(() => {
    // This is just to ensure the component doesn't trigger navigation on initial render
    // or when params change
  }, [params]);

  const openModal = (index: number) => {
    setCurrentImage(photos[index].src);
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentImage(photos[currentIndex + 1].src);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentImage(photos[currentIndex - 1].src);
    }
  };

  const handleBack = () => {
    router.push('/gallery');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile-optimized header for smaller screens */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="bg-white rounded-full shadow p-2 mr-3 flex-shrink-0 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Back to Gallery"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-2xl font-bold truncate">{categoryTitle} Photography</h1>
        </div>
      </div>

      {/* Desktop header for larger screens */}
      <div className="hidden sm:flex items-center justify-center mb-8 relative">
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900 flex items-center transition-colors absolute left-0"
          aria-label="Back to Gallery"
        >
          <span className="mr-2">&#8592;</span>
          <span>Back to Gallery</span>
        </button>

        <h1 className="text-3xl font-bold text-center">{categoryTitle} Photography</h1>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <div key={photo.id} onClick={() => openModal(index)}>
            <PhotoCard
              src={photo.src}
              alt={photo.alt}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <FullscreenModal
        isOpen={isModalOpen}
        currentImage={currentImage}
        onClose={closeModal}
        onNext={nextImage}
        onPrev={prevImage}
        totalImages={photos.length}
        currentIndex={currentIndex}
      />
    </div>
  );
}
