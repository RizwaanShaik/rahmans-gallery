import React, { useState } from 'react';
import Image from 'next/image';

interface PhotoCardProps {
  src: string;
  alt: string;
  description?: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ src, alt, description }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const detailedAlt = description || alt;

  return (
    <div 
      className="group relative w-full cursor-pointer rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus-within:scale-[1.02]"
      role="img"
      aria-label={detailedAlt}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
    >
      <div className="relative w-full pt-[75%]">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
        )}
        
        {/* Main Image */}
        <Image
          src={src}
          alt={detailedAlt}
          fill
          sizes="(max-width: 640px) 100vw, 
                 (max-width: 768px) 50vw,
                 (max-width: 1024px) 33vw,
                 25vw"
          className={`absolute inset-0 w-full h-full rounded-lg object-contain transition-all duration-500 ${
            isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          loading="lazy"
          quality={85}
          onLoad={() => setIsLoading(false)}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLUEwLi0tLTAtQFBCPjU3Tj41QF1kXVFfZGVsdWR3YnVuZWVn/2wBDARVFx4eIB4gHR4gICBnQEBAZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />

        {/* Hover Overlay */}
        <div 
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Focus Ring */}
        <div
          className={`absolute inset-0 ring-2 ring-offset-2 ring-blue-500 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} 
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default PhotoCard;
