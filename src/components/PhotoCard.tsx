import React from 'react';
import Image from 'next/image';

interface PhotoCardProps {
  src: string;
  alt: string; 
}

const PhotoCard: React.FC<PhotoCardProps> = ({ src, alt }) => {
  return (
    <div className="photo-card">
      <Image
        src={src}
        alt={alt}
        layout="responsive" // Use responsive layout
        width={500} // Set a width
        height={300} // Set a height
        className="rounded-lg" // Add any additional classes
      />
    </div>
  );
};

export default PhotoCard;
