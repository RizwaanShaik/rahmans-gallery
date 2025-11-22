'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const s3BaseUrl = "https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com";

const heritageHistoryCategories = [
  {
    id: 'heritage',
    title: 'Heritage',
    image: `${s3BaseUrl}/Heritage/hero/hero.jpeg`,
    description: 'Historical monuments and cultural landmarks preserving our rich history',
  },
  {
    id: 'tombs',
    title: 'Tombs',
    image: `${s3BaseUrl}/Tombs/hero/hero.jpeg`,
    description: 'Architectural marvels commemorating historical figures',
  },
  {
    id: 'culture',
    title: 'Culture',
    image: `${s3BaseUrl}/Culture/hero/hero.jpeg`,
    description: 'Vibrant celebrations and cultural events capturing human expressions',
  },
];

export default function HeritageHistoryPage() {
  const router = useRouter();
  const [isReadyToShow, setIsReadyToShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsReadyToShow(true);
  }, []);

  const handleBack = () => {
    router.push('/gallery');
  };

  const filteredCategories = heritageHistoryCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isReadyToShow ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header with back button */}
        <div className="mb-6 md:mb-10">
          <button
            onClick={handleBack}
            className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Gallery
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center text-gray-900 dark:text-white">
              Heritage & History
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4 md:mb-8 text-base md:text-xl">
              Explore historical monuments, tombs, and cultural heritage
            </p>
          </motion.div>
        </div>

        {/* Search bar */}
        <div className="mb-8 md:mb-12">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search heritage & history..."
              className="w-full px-4 py-3 md:py-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link 
                  href={`/gallery/${category.id}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end block"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={index < 4}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                  </div>
                  
                  <div className="relative p-3 md:p-4">
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                      {category.title}
                    </h3>
                    <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No collections found. Try a different search term.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Collection counter */}
        {filteredCategories.length > 0 && (
          <div className="mt-6 md:mt-8 text-center text-sm md:text-base text-gray-600 dark:text-gray-400">
            Showing {filteredCategories.length} of {heritageHistoryCategories.length} collections
          </div>
        )}
      </div>
    </motion.div>
  );
}

