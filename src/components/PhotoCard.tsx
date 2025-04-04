import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PhotoCardProps {
  src: string;
  alt: string;
  description?: string;
  onClick?: () => void;
}

const PhotoCard: React.FC<PhotoCardProps> = memo(({ 
  src, 
  alt, 
  description, 
  onClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isPortrait = imageAspectRatio ? imageAspectRatio < 0.8 : false;
  
  // Load image and calculate aspect ratio
  useEffect(() => {
    // Clean up previous image if any
    if (imgRef.current) {
      imgRef.current.onload = null;
    }
    
    const img = new window.Image();
    imgRef.current = img;
    
    img.onload = () => {
      if (mounted.current) {
        setImageAspectRatio(img.width / img.height);
        setIsLoading(false);
      }
    };
    
    img.src = src;
    
    const mounted = { current: true };
    return () => {
      mounted.current = false;
      if (imgRef.current) {
        imgRef.current.onload = null;
      }
    };
  }, [src]);

  // Handle mouse move for the 3D effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  }, []);
  
  // Handle touch events for mobile
  const handleTouchStart = useCallback(() => {
    setIsTouched(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => setIsTouched(false), 100);
  }, []);
  
  // Reset states when mouse leaves
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePosition({ x: 0.5, y: 0.5 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Calculate the tilt transform based on mouse position
  const getTiltTransform = useCallback(() => {
    if (!isHovered && !isTouched) return '';
    
    const tiltX = (mousePosition.y - 0.5) * 8; // -4 to 4 degrees
    const tiltY = (mousePosition.x - 0.5) * -8; // -4 to 4 degrees
    
    return `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  }, [isHovered, isTouched, mousePosition.x, mousePosition.y]);

  const handleInteraction = useCallback(() => {
    if (onClick) onClick();
  }, [onClick]);

  return (
    <motion.div 
      ref={cardRef}
      className={`relative w-full h-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 transition-all duration-300 
        ${isPortrait ? 'row-span-2' : ''} 
        ${(isHovered || isTouched) ? 'z-10' : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleInteraction}
      style={{
        transform: getTiltTransform(),
        transformStyle: 'preserve-3d',
      }}
      role="button"
      aria-label={description || alt}
      tabIndex={0}
    >
      <div className="relative overflow-hidden h-full">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
        )}
        
        {/* Main Image with parallax effect */}
        <div 
          className="relative w-full h-full overflow-hidden"
          style={{ 
            transform: (isHovered || isTouched) ? 'scale(1.05)' : 'scale(1)', 
            transition: 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)' 
          }}
        >
          <Image
            src={src}
            alt={description || alt}
            fill
            sizes="(max-width: 640px) 100vw, 
                   (max-width: 768px) 50vw,
                   (max-width: 1024px) 33vw,
                   25vw"
            className={`object-cover transition-all duration-500 ${
              isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
            priority={false}
            quality={85}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Animated Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
          style={{ 
            opacity: (isHovered || isTouched) ? 0.7 : 0,
            transition: 'opacity 0.3s ease-out',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(10px)'
          }}
        />
        
        {/* Interactive shine effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{ 
            opacity: (isHovered || isTouched) ? 0.3 : 0,
            backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
            backgroundSize: '200% 200%',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(20px)'
          }}
        />
        
        {/* Corner indicators */}
        <div 
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center pointer-events-none"
          style={{ 
            opacity: (isHovered || isTouched) ? 1 : 0,
            transform: `translateZ(30px) scale(${(isHovered || isTouched) ? 1 : 0.8})`,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          <svg className="w-5 h-5 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
});

PhotoCard.displayName = 'PhotoCard';

export default PhotoCard;