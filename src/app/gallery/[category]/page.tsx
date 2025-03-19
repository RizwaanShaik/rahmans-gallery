import React, { useState } from 'react';
import PhotoCard from '@/components/PhotoCard'
import FullscreenModal from '@/components/FullscreenModal'


const mockPhotos = [
  {
    id: '1',
    src: '/images/wildlife/RedPanda.JPG',
    alt: 'Sample photo 1',
    title: 'Morning Light',
    description: 'Captured during sunrise'
  },
  {
    id: '2',
    src: '/images/random.jpg',
    alt: 'Sample photo 2',
    title: 'Urban Landscape',
    description: 'City view at dusk'
  },
  {
    id: '3',
    src: '/images/wildlife/DSC_0011.JPG',
    alt: 'Sample photo 3',
    title: 'DSC 0011',
    description: 'Wildlife photo 1'
  },
  {
    id: '4',
    src: '/images/wildlife/DSC_0025.JPG',
    alt: 'Sample photo 4',
    title: 'DSC 0025',
    description: 'Wildlife photo 2'
  },
  {
    id: '5',
    src: '/images/wildlife/DSC_0036.JPG',
    alt: 'Sample photo 5',
    title: 'DSC 0036',
    description: 'Wildlife photo 3'
  },
  {
    id: '6',
    src: '/images/wildlife/DSC_0083.JPG',
    alt: 'Sample photo 6',
    title: 'DSC 0083',
    description: 'Wildlife photo 4'
  },
  {
    id: '7',
    src: '/images/wildlife/DSC_0086.JPG',
    alt: 'Sample photo 7',
    title: 'DSC 0086',
    description: 'Wildlife photo 5'
  },
  {
    id: '8',
    src: '/images/wildlife/DSC_0087.JPG',
    alt: 'Sample photo 8',
    title: 'DSC 0087',
    description: 'Wildlife photo 6'
  },
  {
    id: '9',
    src: '/images/wildlife/DSC_0160.JPG',
    alt: 'Sample photo 9',
    title: 'DSC 0160',
    description: 'Wildlife photo 7'
  },
  {
    id: '10',
    src: '/images/wildlife/DSC_0189.JPG',
    alt: 'Sample photo 10',
    title: 'DSC 0189',
    description: 'Wildlife photo 8'
  },
  {
    id: '11',
    src: '/images/wildlife/DSC_0212.JPG',
    alt: 'Sample photo 11',
    title: 'DSC 0212',
    description: 'Wildlife photo 9'
  },
  {
    id: '12',
    src: '/images/wildlife/DSC_0228.JPG',
    alt: 'Sample photo 12',
    title: 'DSC 0228',
    description: 'Wildlife photo 10'
  },
  {
    id: '13',
    src: '/images/wildlife/DSC_0259.JPG',
    alt: 'Sample photo 13',
    title: 'DSC 0259',
    description: 'Wildlife photo 11'
  },
  {
    id: '14',
    src: '/images/wildlife/DSC_0457.JPG',
    alt: 'Sample photo 14',
    title: 'DSC 0457',
    description: 'Wildlife photo 12'
  },
  {
    id: '15',
    src: '/images/wildlife/DSC_0539.JPG',
    alt: 'Sample photo 15',
    title: 'DSC 0539',
    description: 'Wildlife photo 13'
  },
  {
    id: '16',
    src: '/images/wildlife/DSC_0995.JPG',
    alt: 'Sample photo 16',
    title: 'DSC 0995',
    description: 'Wildlife photo 14'
  },
  {
    id: '17',
    src: '/images/wildlife/Elephants.JPG',
    alt: 'Sample photo 17',
    title: 'Elephants',
    description: 'Wildlife photo 15'
  },
  {
    id: '18',
    src: '/images/wildlife/Fishes.JPG',
    alt: 'Sample photo 18',
    title: 'Fishes',
    description: 'Wildlife photo 16'
  },
  {
    id: '19',
    src: '/images/wildlife/Fox.JPG',
    alt: 'Sample photo 19',
    title: 'Fox',
    description: 'Wildlife photo 17'
  },
  {
    id: '20',
    src: '/images/wildlife/picture.jpg',
    alt: 'Sample photo 20',
    title: 'Picture',
    description: 'Wildlife photo 18'
  },
  {
    id: '21',
    src: '/images/wildlife/RedPanda.JPG',
    alt: 'Sample photo 21',
    title: 'Red Panda',
    description: 'Wildlife photo 19'
  },
]

export default function WildlifeGallery() {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{categoryTitle} Photography</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPhotos.map((photo, index) => (
          <div key={photo.id} onClick={() => openModal(index)}>
            <PhotoCard
              src={photo.src}
              alt={photo.alt}
              title={photo.title}
              description={photo.description}
            />
          </div>
        ))}
      </div>

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