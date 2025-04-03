import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface FullscreenModalProps {
  isOpen: boolean;
  currentImage: string;
  originalImage?: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  totalImages: number;
  currentIndex: number;
  highContrast?: boolean;
  getNextImageSrc?: (currentIndex: number) => string | null;
}

export default function FullscreenModal({
  isOpen,
  currentImage,
  originalImage,
  onClose,
  onNext,
  onPrev,
  totalImages,
  currentIndex,
  highContrast = false,
  getNextImageSrc,
}: FullscreenModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayedImage, setDisplayedImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Initialize displayed image
  useEffect(() => {
    if (currentImage) {
      setDisplayedImage(currentImage);
    }
  }, []);

  // Preload next image when available
  useEffect(() => {
    if (currentIndex < totalImages - 1 && getNextImageSrc) {
      const nextImageSrc = getNextImageSrc(currentIndex);
      if (nextImageSrc) {
        const preloadImage = new window.Image();
        preloadImage.src = nextImageSrc;
      }
    }
  }, [currentIndex, totalImages, getNextImageSrc]);

  // Update displayed image when current image changes
  useEffect(() => {
    if (currentImage) {
      setIsLoading(true);
      setDisplayedImage(currentImage);
    }
  }, [currentImage]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalImages - 1) {
      setIsLoading(true);
      onNext();
    }
  }, [currentIndex, totalImages, onNext]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsLoading(true);
      onPrev();
    }
  }, [currentIndex, onPrev]);

  // Handle keyboard events with focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
        case 'Tab':
          // Trap focus within modal
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) || [];
          const firstFocusable = focusableElements[0] as HTMLElement;
          const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              lastFocusable.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              firstFocusable.focus();
              e.preventDefault();
            }
          }
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

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const previousActiveElement = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      return () => {
        previousActiveElement?.focus();
      };
    }
  }, [isOpen]);

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

  if (!isOpen || !displayedImage) return null;

  // Function to get the original image URL
  const getOriginalImageUrl = () => {
    return originalImage ? originalImage.replace('/fullscreen/', '/original/') : null;
  };

  return (
    <div 
      ref={modalRef}
      className={`fixed inset-0 ${highContrast ? 'bg-white' : 'bg-black bg-opacity-95'} z-50 flex flex-col items-center justify-center`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      tabIndex={-1}
    >
      {/* Top Controls Bar */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-50">
        <a
          href={getOriginalImageUrl() || ''}
          download
          onClick={(e) => e.stopPropagation()}
          className={`${
            highContrast 
              ? 'bg-white text-black border-2 border-black' 
              : 'bg-black/60 text-white'
          } px-6 py-3 rounded-full hover:bg-opacity-80 transition-colors flex items-center gap-2 backdrop-blur-sm`}
          aria-label="Download original image"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
            />
          </svg>
          <span className="whitespace-nowrap">Download Original</span>
        </a>
        <button
          onClick={onClose}
          className={`${
            highContrast 
              ? 'bg-white text-black border-2 border-black' 
              : 'bg-black/60 text-white'
          } p-2 rounded-full hover:bg-opacity-80 transition-colors backdrop-blur-sm`}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Image Container */}
      <div ref={imageRef} className="relative w-full h-full flex items-center justify-center p-4">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-12 h-12 border-4 ${
              highContrast 
                ? 'border-black/20 border-t-black' 
                : 'border-white/20 border-t-white'
            } rounded-full animate-spin`}></div>
          </div>
        )}
        
        <div className="relative">
          {displayedImage && (
            <Image
              src={displayedImage}
              alt="Fullscreen view"
              width={1920}
              height={1080}
              className={`max-w-full max-h-[calc(100vh-100px)] object-contain transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              priority
              quality={100}
              onLoad={() => {
                setIsLoading(false);
              }}
              sizes="100vw"
            />
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center gap-4 px-4">
        {/* Navigation Controls */}
        <div className={`flex items-center gap-4 ${
          highContrast 
            ? 'bg-white border-2 border-black' 
            : 'backdrop-blur-sm bg-black/60'
        } px-8 py-4 rounded-full w-full sm:w-auto justify-between sm:justify-center`}>
          <button
            onClick={handlePrev}
            className={`${
              highContrast 
                ? 'text-black hover:text-gray-700' 
                : 'text-white hover:text-gray-300'
            } transition-colors p-4 disabled:opacity-50 hover:bg-black/20 rounded-full`}
            aria-label="Previous image"
            disabled={currentIndex === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className={`px-6 text-base font-medium ${highContrast ? 'text-black' : 'text-white'} flex items-center whitespace-nowrap`}>
            <span>{currentIndex + 1}</span>
            <span className="mx-2">/</span>
            <span>{totalImages}</span>
          </div>

          <button
            onClick={handleNext}
            className={`${
              highContrast 
                ? 'text-black hover:text-gray-700' 
                : 'text-white hover:text-gray-300'
            } transition-colors p-4 disabled:opacity-50 hover:bg-black/20 rounded-full`}
            aria-label="Next image"
            disabled={currentIndex === totalImages - 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}