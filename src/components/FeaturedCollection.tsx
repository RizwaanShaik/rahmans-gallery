import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Update the base S3 URL
const s3BaseUrl = "https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com";

interface FeaturedWork {
  id: string;
  title: string;
  description: string;
  year: number;
  src: string;
  category: string;
}

const featuredWorks: FeaturedWork[] = [
  {
    id: '1',
    title: 'Featured Collection',
    description: 'A curated selection of the finest photographs capturing the essence of nature, architecture, and culture.',
    year: 2023,
    src: `${s3BaseUrl}/categories/featured/hero/hero.jpeg`,
    category: 'featured'
  },
  {
    id: '2',
    title: 'Ladakh',
    description: 'The breathtaking landscapes and rich cultural heritage of the Himalayan region captured through a unique lens.',
    year: 2018,
    src: `${s3BaseUrl}/categories/ladakh/hero/hero.jpeg`,
    category: 'ladakh'
  },
  {
    id: '3',
    title: 'Rajasthan',
    description: 'Vibrant colors, majestic forts, and timeless traditions of the royal state of Rajasthan.',
    year: 2019,
    src: `${s3BaseUrl}/categories/rajasthan/hero/hero.jpeg`,
    category: 'rajasthan'
  }
];

export default function FeaturedCollection() {
  return (
    <div className="container mx-auto px-4 mt-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Featured Collections
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore Professor Rahman&apos;s most celebrated photography collections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {featuredWorks.map((work) => (
          <Link
            key={work.id}
            href={`/gallery/${work.category}`}
            className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={work.src}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-blue-200 transition-colors">
                {work.title}
              </h3>
              <p className="text-sm text-gray-200">
                {work.description}
              </p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">
                  {work.year}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 