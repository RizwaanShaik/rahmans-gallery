"use client"; // Mark this component as a client-side component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import PhotoCard from '@/components/PhotoCard';
import FullscreenModal from '@/components/FullscreenModal';

const mockPhotos = [
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

export default function WildlifeGallery() {
  const router = useRouter(); // Initialize the router
  const categoryTitle = 'Wildlife';
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentImage(mockPhotos[index].src);
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
    if (currentIndex < mockPhotos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentImage(mockPhotos[currentIndex + 1].src);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentImage(mockPhotos[currentIndex - 1].src);
    }
  };

  const handleBack = () => {
    router.push('/gallery'); // Navigate back to the gallery home page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title and Back Button Container */}
      <div className="flex items-center justify-center mb-8 relative">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900 flex items-center transition-colors absolute left-0"
        >
          <span className="mr-2">&#8592;</span> {/* Left arrow icon */}
          Back to Gallery
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center">{categoryTitle} Photography</h1>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPhotos.map((photo, index) => (
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
        totalImages={mockPhotos.length}
        currentIndex={currentIndex}
      />
    </div>
  );
}
