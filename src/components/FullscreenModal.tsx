import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { downloadS3Image, formatS3ImageUrl } from '../utils/imageUtils';
import { motion } from 'framer-motion';

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
  const [, setIsLoading] = useState(true);
  const [displayedImage, setDisplayedImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [nextImageLoading, setNextImageLoading] = useState(false);

  // Initialize displayed image
  useEffect(() => {
    if (currentImage) {
      setDisplayedImage(currentImage);
    }
  }, [currentImage]);

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
      setNextImageLoading(true);
      // Keep the previous image visible until the new one loads
      // setDisplayedImage will happen in the onLoad event
    }
  }, [currentImage]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalImages - 1) {
      setNextImageLoading(true);
      onNext();
    }
  }, [currentIndex, totalImages, onNext]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setNextImageLoading(true);
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

  // Handle download button click - Optimized with HEAD requests
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!originalImage) return;

    console.log("Starting optimized download process for base URL:", originalImage);

    const baseUrl = originalImage.split('?')[0];
    const filenameWithExt = baseUrl.substring(baseUrl.lastIndexOf('/') + 1);
    const filename = filenameWithExt.substring(0, filenameWithExt.lastIndexOf('.'));
    const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
    const decodedFilename = decodeURIComponent(filename);
    const cleanFilename = decodedFilename.replace(/[ '\"](?!\([^)]*\))/g, "");

    const possibleExtensions = ['.JPG', '.jpg', '.JPEG', '.jpeg'];

    console.log(`Base path: ${basePath}, Clean filename: ${cleanFilename}`);

    let foundUrl = false;
    for (const ext of possibleExtensions) {
      const fullPath = `${basePath}${cleanFilename}${ext}`;
      // Check URL without timestamp first (assuming S3 allows HEAD on base object)
      const urlToCheck = formatS3ImageUrl(fullPath, false); 
      const downloadFilename = `${decodedFilename}${ext}`;

      console.log(`Checking HEAD for: ${urlToCheck}`);
      try {
        const response = await fetch(urlToCheck, { method: 'HEAD' });
        
        if (response.ok) {
          console.log(`HEAD request successful for ${urlToCheck}. Proceeding with download.`);
          // If HEAD is ok, attempt download with the same URL
          const success = await downloadS3Image(urlToCheck, downloadFilename);
          if (success) {
            console.log("Download initiated successfully!");
            foundUrl = true;
            return; // Exit loop and function on successful download initiation
          } else {
            console.warn(`Download function failed for confirmed URL: ${urlToCheck}`);
            // Optional: Could try the next extension even if download func fails, but less likely needed
          }
        } else {
          console.log(`HEAD request failed for ${urlToCheck} with status: ${response.status}`);
        }
      } catch (headError) {
        console.error(`Error during HEAD request for ${urlToCheck}:`, headError);
        // Continue to next extension if HEAD request itself fails network-wise
      }
    }

    // Fallback if no URL was confirmed via HEAD or download failed
    if (!foundUrl) {
      console.log("All HEAD checks/download attempts failed. Opening the initially provided URL in a new tab as a last resort.");
      // Clean the original URL for the fallback, similar to before
      const cleanOriginalUrl = originalImage.split('?')[0];
      const cleanPath = cleanOriginalUrl.substring(0, cleanOriginalUrl.lastIndexOf('/') + 1);
      const cleanFilenameWithExt = cleanOriginalUrl.substring(cleanOriginalUrl.lastIndexOf('/') + 1);
      const cleanExtension = cleanFilenameWithExt.substring(cleanFilenameWithExt.lastIndexOf('.'));
      const cleanFilenameOnly = cleanFilenameWithExt.substring(0, cleanFilenameWithExt.lastIndexOf('.'));
      const finalCleanUrl = `${cleanPath}${cleanFilenameOnly.replace(/[ '\"](?!\([^)]*\))/g, "")}${cleanExtension}`;
      // Open the *formatted* cleaned URL (with timestamp) as the final fallback
      window.open(formatS3ImageUrl(finalCleanUrl, true), '_blank');
    }
  };

  return (
    <motion.div
      ref={modalRef}
      className={`fixed inset-0 ${highContrast ? 'bg-white' : 'bg-black bg-opacity-95'} z-50 flex flex-col items-center justify-center`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      tabIndex={-1}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Top Controls Bar */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-50 bg-gradient-to-b from-black/60 via-black/30 to-transparent">
        {/* Left side: Download button */}
        <div className="flex items-center gap-4">
          {originalImage ? (
            <button
              onClick={handleDownload}
              className={`${
                highContrast 
                  ? 'bg-white text-black border-2 border-black' 
                  : 'bg-white/10 text-white hover:bg-white/20 active:bg-white/30'
              } min-w-[48px] min-h-[48px] px-4 py-3 rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm focus:ring-2 focus:ring-white focus:outline-none text-sm sm:text-base touch-manipulation active:scale-95`}
              aria-label="Download original quality image"
              title="Download original quality image"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
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
              <span className="hidden sm:inline">Download Original</span>
            </button>
          ) : (
             <div className="px-3 py-2 opacity-50">
               <span className="hidden sm:inline">No Original Available</span>
             </div>
          )}
        </div>

        {/* Right side: Close button */}
        <button
          onClick={onClose}
          className={`${
            highContrast 
              ? 'bg-white text-black border-2 border-black' 
              : 'bg-black/40 text-white hover:bg-black/60 active:bg-black/80'
          } min-w-[48px] min-h-[48px] p-3 rounded-lg transition-all backdrop-blur-sm touch-manipulation active:scale-95 flex items-center justify-center`}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Image Container */}
      <div ref={imageRef} className="relative w-full h-full flex items-center justify-center p-4">
        {/* Loading Spinner */}
        {nextImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className={`w-16 h-16 border-4 ${
              highContrast 
                ? 'border-black/20 border-t-black' 
                : 'border-white/20 border-t-white'
            } rounded-full animate-spin`}></div>
          </div>
        )}
        
        <div className="relative">
          {displayedImage && (
            <Image
              src={currentImage}
              alt="Fullscreen view"
              width={1920}
              height={1080}
              className="max-w-full max-h-[calc(100vh-160px)] object-contain transition-opacity duration-300"
              priority
              quality={100}
              onLoad={() => {
                setNextImageLoading(false);
                setIsLoading(false);
                setDisplayedImage(currentImage);
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
                ? 'text-black hover:text-gray-700 active:text-gray-900' 
                : 'text-white hover:text-gray-300 active:text-gray-200'
            } transition-all min-w-[56px] min-h-[56px] p-4 disabled:opacity-50 hover:bg-black/20 active:bg-black/30 rounded-full touch-manipulation active:scale-95 flex items-center justify-center`}
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
                ? 'text-black hover:text-gray-700 active:text-gray-900' 
                : 'text-white hover:text-gray-300 active:text-gray-200'
            } transition-all min-w-[56px] min-h-[56px] p-4 disabled:opacity-50 hover:bg-black/20 active:bg-black/30 rounded-full touch-manipulation active:scale-95 flex items-center justify-center`}
            aria-label="Next image"
            disabled={currentIndex === totalImages - 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
