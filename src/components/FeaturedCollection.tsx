import React, { useState } from 'react';
import Image from 'next/image';

interface FeaturedWork {
  id: string;
  title: string;
  description: string;
  year: number;
  src: string;
}

const featuredWorks: FeaturedWork[] = [
  {
    id: '1',
    title: 'Bengal Tiger at Dawn',
    description: 'A majestic Bengal tiger captured in the early morning light at Sundarbans.',
    year: 1995,
    src: '/images/wildlife/featured/tiger.jpg'
  },
  {
    id: '2',
    title: 'Ancient Architecture',
    description: 'The timeless beauty of historic architecture captured in perfect light.',
    year: 1998,
    src: '/images/architecture/featured/architecture1.jpg'
  },
  {
    id: '3',
    title: 'Urban Landscape',
    description: 'A stunning view of the city skyline during golden hour.',
    year: 2000,
    src: '/images/architecture/featured/architecture2.jpg'
  }
];

export default function FeaturedCollection() {
  const [selectedWork, setSelectedWork] = useState<FeaturedWork | null>(null);

  return (
    <div className="container mx-auto px-4 mt-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Featured Works
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A curated selection of iconic photographs that showcase Professor Rahman&apos;s artistic vision
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {featuredWorks.map((work) => (
          <div
            key={work.id}
            className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
            onClick={() => setSelectedWork(work)}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={work.src}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-lg font-bold mb-2">
                {work.title}
              </h3>
              <p className="text-sm text-gray-200">
                {work.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for selected work */}
      {selectedWork && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9]">
              <Image
                src={selectedWork.src}
                alt={selectedWork.title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedWork.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {selectedWork.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {selectedWork.year}
                </span>
                <button
                  onClick={() => setSelectedWork(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 