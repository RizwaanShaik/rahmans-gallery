import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface FullscreenModalProps {
  isOpen: boolean;
  currentImage: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  totalImages: number;
  currentIndex: number;
}

export default function FullscreenModal({
  isOpen,
  currentImage,
  onClose,
  onNext,
  onPrev,
  totalImages,
  currentIndex,
}: FullscreenModalProps) {
  const [fade, setFade] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleNext = useCallback(() => {
    if (currentIndex < totalImages - 1) {
      setFade(true);
      setIsLoading(true);
      setTimeout(() => {
        onNext();
        setFade(false);
      }, 300);
    }
  }, [onNext, currentIndex, totalImages]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setFade(true);
      setIsLoading(true);
      setTimeout(() => {
        onPrev();
        setFade(false);
      }, 300);
    }
  }, [onPrev, currentIndex]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      onClose();
    };

    if (isOpen) {
      window.history.pushState({ modal: true }, '');
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors bg-black/60 rounded-full p-2 backdrop-blur-sm"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Swipe indicator for mobile - only shows on smaller screens */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 md:hidden bg-black/40 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
        Swipe to navigate
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
        
        <Image
          src={currentImage}
          alt="Fullscreen view"
          width={1600}
          height={900}
          className={`max-w-full max-h-[calc(100vh-100px)] object-contain transition-opacity duration-300 ${
            fade ? 'opacity-0' : 'opacity-100'
          }`}
          priority
          quality={85}
          onLoadingComplete={() => setIsLoading(false)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1600px"
        />
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-8 left-0 right-0 z-50 flex items-center justify-center gap-4 px-4">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-4 backdrop-blur-sm bg-black/60 px-6 py-3 rounded-full">
          <button
            onClick={handlePrev}
            className="text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Previous image"
            disabled={currentIndex === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="text-white px-4 text-sm font-medium">
            {currentIndex + 1} / {totalImages}
          </div>

          <button
            onClick={handleNext}
            className="text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Next image"
            disabled={currentIndex === totalImages - 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}