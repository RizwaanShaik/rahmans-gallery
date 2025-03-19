import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (isOpen) {
      setFade(true);
      const timer = setTimeout(() => setFade(false), 300); // Duration of the fade effect
      return () => clearTimeout(timer);
    }
  }, [currentImage, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      {/* Navigation Arrows */}
      <button 
        onClick={onPrev} 
        disabled={currentIndex === 0} 
        className="absolute left-10 top-1/2 transform -translate-y-1/2 text-white text-5xl transition-opacity duration-300 ease-in-out opacity-75 hover:opacity-100"
      >
        &#9664; {/* Left Arrow */}
      </button>
      <button 
        onClick={onNext} 
        disabled={currentIndex === totalImages - 1} 
        className="absolute right-10 top-1/2 transform -translate-y-1/2 text-white text-5xl transition-opacity duration-300 ease-in-out opacity-75 hover:opacity-100"
      >
        &#9654; {/* Right Arrow */}
      </button>

      {/* Close Button with X */}
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl">
        &times; {/* X Character */}
      </button>

      {/* Image */}
      <div className="relative flex items-center justify-center">
        <img
          src={currentImage}
          alt={`Fullscreen view`}
          className={`max-w-[80vw] max-h-[80vh] rounded-lg shadow-lg transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>
    </div>
  );
};

export default FullscreenModal;