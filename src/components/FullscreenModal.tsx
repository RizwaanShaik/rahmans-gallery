import React, { useEffect, useState, useRef, TouchEvent } from 'react';

interface FullscreenModalProps {
  isOpen: boolean;
  currentImage: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  totalImages: number;
  currentIndex: number;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({
  isOpen,
  currentImage,
  onClose,
  onNext,
  onPrev,
  totalImages,
  currentIndex,
}) => {
  const [fade, setFade] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        onNext();
      } else if (event.key === 'ArrowLeft') {
        onPrev();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onNext, onPrev, onClose]);

  // Fade effect
  useEffect(() => {
    if (isOpen) {
      setFade(true);
      const timer = setTimeout(() => setFade(false), 300); // Duration of the fade effect
      return () => clearTimeout(timer);
    }
  }, [currentImage, isOpen]);

  // Prevent back navigation gesture
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const handlePopState = (e: PopStateEvent) => {
        // Prevent the default action
        window.history.pushState(null, document.title, window.location.href);
        // Close the modal instead
        onClose();
      };

      // Add a history entry when opening the modal
      window.history.pushState(null, document.title, window.location.href);
      
      // Listen for popstate (back button/gesture)
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOpen, onClose]);

  // Touch swipe handlers
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX.current;
    
    // Swipe distance threshold (adjust as needed)
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe right, go to previous image
        onPrev();
      } else {
        // Swipe left, go to next image
        onNext();
      }
    }
    
    touchStartX.current = null;
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Arrows - Improved visibility on mobile */}
      <button 
        onClick={onPrev} 
        disabled={currentIndex === 0} 
        className={`absolute left-2 sm:left-10 top-1/2 transform -translate-y-1/2 text-white
                    text-4xl sm:text-5xl p-2 rounded-full bg-black/30 hover:bg-black/50
                    transition-all duration-300 ${currentIndex === 0 ? 'opacity-30' : 'opacity-75 hover:opacity-100'}`}
        aria-label="Previous image"
      >
        &#9664; {/* Left Arrow */}
      </button>
      <button 
        onClick={onNext} 
        disabled={currentIndex === totalImages - 1} 
        className={`absolute right-2 sm:right-10 top-1/2 transform -translate-y-1/2 text-white
                    text-4xl sm:text-5xl p-2 rounded-full bg-black/30 hover:bg-black/50
                    transition-all duration-300 ${currentIndex === totalImages - 1 ? 'opacity-30' : 'opacity-75 hover:opacity-100'}`}
        aria-label="Next image"
      >
        &#9654; {/* Right Arrow */}
      </button>

      {/* Close Button with X - Made more touch-friendly */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white text-3xl bg-black/30 h-10 w-10 rounded-full flex items-center justify-center"
        aria-label="Close fullscreen view"
      >
        &times; {/* X Character */}
      </button>

      {/* Image */}
      <div className="relative flex items-center justify-center">
        <img
          src={currentImage}
          alt={`Fullscreen view`}
          className={`max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {/* Image Counter */}
        <div className="absolute -bottom-8 inset-x-0 text-center text-white">
          {currentIndex + 1} / {totalImages}
        </div>
      </div>
    </div>
  );
};

export default FullscreenModal;