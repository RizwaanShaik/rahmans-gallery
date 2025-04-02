import React from 'react';
import Image from 'next/image';

interface PhotoCardProps {
  src: string;
  alt: string;
  description?: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ src, alt, description }) => {
  const detailedAlt = description || alt;

  return (
    <div 
      className="photo-card w-full h-auto cursor-pointer transition-transform duration-300 hover:scale-105"
      role="img"
      aria-label={detailedAlt}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={src}
          alt={detailedAlt}
          fill
          sizes="(max-width: 640px) 100vw, 
                 (max-width: 768px) 50vw,
                 33vw"
          className="rounded-lg object-cover"
          loading="lazy"
          quality={75}
        />
      </div>
    </div>
  );
};

export default PhotoCard;
