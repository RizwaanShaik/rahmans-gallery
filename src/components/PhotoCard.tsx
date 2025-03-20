import React from 'react';
import Image from 'next/image';

interface PhotoCardProps {
  src: string;
  alt: string; 
}

const PhotoCard: React.FC<PhotoCardProps> = ({ src, alt }) => {
  return (
    <div className="photo-card w-full h-auto cursor-pointer transition-transform duration-300 hover:scale-105">
      <div className="relative aspect-[4/3]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, 
                 (max-width: 768px) 50vw,
                 33vw"
          className="rounded-lg object-cover"
          priority={false}
        />
      </div>
    </div>
  );
};

export default PhotoCard;
