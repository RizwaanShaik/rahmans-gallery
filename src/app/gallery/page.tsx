'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'featured',
    title: 'Featured',
    image: '/images/Featured/hero/hero.jpeg',
    description: 'A curated selection of my finest photography work',
  },
  {
    id: 'wildlife',
    title: 'Wildlife',
    image: '/images/wildlife/hero/hero.jpeg',
    description: 'Capturing the beauty and behavior of animals in their natural habitat',
  },
  {
    id: 'heritage',
    title: 'Heritage',
    image: '/images/heritage/hero/hero.jpeg',
    description: 'Historical monuments and cultural landmarks preserving our rich history',
  },
  {
    id: 'ladakh',
    title: 'Ladakh',
    image: '/images/Ladakh/hero/hero.jpeg',
    description: 'The breathtaking landscapes and culture of the Himalayan region',
  },
  {
    id: 'london',
    title: 'London',
    image: '/images/london/hero/hero.jpeg',
    description: 'Street scenes and architectural wonders from the UK capital',
  },
  {
    id: 'macro',
    title: 'Macro',
    image: '/images/Macro/hero/hero.jpeg',
    description: 'The hidden details of our world revealed through close-up photography',
  },
  {
    id: 'air-show',
    title: 'Air Show',
    image: '/images/airshow/hero/hero.jpeg',
    description: 'Dramatic captures of aerial performances and magnificent aircraft',
  },
  {
    id: 'b-and-w',
    title: 'Black & White',
    image: '/images/bandw/hero/hero.jpeg',
    description: 'Monochrome photography highlighting contrast, texture, and form',
  },
  {
    id: 'bidar',
    title: 'Bidar',
    image: '/images/bidar/hero/hero.jpeg',
    description: 'Ancient city in Karnataka with rich historical and architectural significance',
  },
  {
    id: 'clouds',
    title: 'Clouds',
    image: '/images/Clouds/hero/hero.jpeg',
    description: 'The ever-changing canvas of the sky and its dramatic formations',
  },
  {
    id: 'festivals',
    title: 'Festivals',
    image: '/images/Festivals/hero/hero.jpeg',
    description: 'Vibrant celebrations and cultural events capturing human expressions',
  },
  {
    id: 'hampi',
    title: 'Hampi',
    image: '/images/Hampi/hero/hero.jpeg',
    description: 'The ancient ruins and boulder-strewn landscape of this UNESCO site',
  },
  {
    id: 'hyderabad',
    title: 'Hyderabad',
    image: '/images/Hyderabad/hero/hero.jpeg',
    description: 'The city of pearls, with its unique blend of history and modernity',
  },
  {
    id: 'kanhari-caves',
    title: 'Kanhari Caves',
    image: '/images/kanharicaves/hero/hero.jpeg',
    description: 'Ancient Buddhist rock-cut monuments dating back to the 1st century',
  },
  {
    id: 'kolkata-streets',
    title: 'Kolkata Streets',
    image: '/images/kolkatastreets2001/hero/hero.jpeg',
    description: 'The soul and character of Kolkata captured through street photography',
  },
  {
    id: 'landscapes',
    title: 'Landscapes',
    image: '/images/landscapes/hero/hero.jpeg',
    description: 'Stunning natural vistas showcasing the beauty of our planet',
  },
  {
    id: 'lanka',
    title: 'Lanka',
    image: '/images/lanka/hero/hero.jpeg',
    description: 'The tropical beauty and cultural richness of Sri Lanka',
  },
  {
    id: 'lockdown',
    title: 'Lockdown',
    image: '/images/lockdown/hero/hero.jpeg',
    description: 'Perspectives and moments captured during periods of isolation',
  },
  {
    id: 'rachakonda',
    title: 'Rachakonda',
    image: '/images/Rachakonda/hero/hero.jpeg',
    description: 'The historic fort and its surrounding landscapes near Hyderabad',
  },
  {
    id: 'rajasthan',
    title: 'Rajasthan',
    image: '/images/rajasthan/hero/hero.jpeg',
    description: 'The colors, architecture, and desert landscapes of royal Rajasthan',
  },
  {
    id: 'rock-forms',
    title: 'Rock Forms',
    image: '/images/rockforms/hero/hero.jpeg',
    description: 'Natural sculptures shaped by time, weather, and geological forces',
  },
  {
    id: 'tadoba',
    title: 'Tadoba',
    image: '/images/tadoba/hero/hero.jpeg',
    description: 'Wildlife and landscapes from Maharashtra\'s largest national park',
  },
  {
    id: 'thai',
    title: 'Thailand',
    image: '/images/thai/hero/hero.jpeg',
    description: 'The temples, beaches, and vibrant street life of Thailand',
  },
  {
    id: 'tombs',
    title: 'Tombs',
    image: '/images/tombs/hero/hero.jpeg',
    description: 'Architectural marvels commemorating historical figures',
  },
  {
    id: 'warangal',
    title: 'Warangal',
    image: '/images/warangal/hero/hero.jpeg',
    description: 'Historical sites and monuments of the Kakatiya dynasty',
  }
];

// Group categories by theme for filter functionality
const themes = [
  { id: 'all', name: 'All Categories' },
  { id: 'places', name: 'Places', categories: ['ladakh', 'london', 'bidar', 'hampi', 'hyderabad', 'kanhari-caves', 'kolkata-streets', 'lanka', 'rachakonda', 'rajasthan', 'tadoba', 'thai', 'warangal'] },
  { id: 'subjects', name: 'Subjects', categories: ['wildlife', 'heritage', 'festivals', 'landscapes', 'clouds', 'rock-forms', 'tombs'] },
  { id: 'styles', name: 'Styles', categories: ['b-and-w', 'macro', 'air-show', 'lockdown'] },
  { id: 'featured', name: 'Featured', categories: ['featured'] },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter categories based on active filter and search query
  useEffect(() => {
    setIsLoading(true);
    
    let result = categories;
    
    // Apply theme filter
    if (activeFilter !== 'all') {
      const selectedTheme = themes.find(theme => theme.id === activeFilter);
      if (selectedTheme && selectedTheme.categories) {
        result = categories.filter(category => selectedTheme.categories.includes(category.id));
      }
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        category => 
          category.title.toLowerCase().includes(query) || 
          (category.description && category.description.toLowerCase().includes(query))
      );
    }
    
    // Simulate loading state for smoother transitions
    setTimeout(() => {
      setFilteredCategories(result);
      setIsLoading(false);
    }, 300);
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center text-gray-900 dark:text-white">
            Photography Gallery
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4 md:mb-8 text-base md:text-xl">
            Explore the world through my lens — moments frozen in time
          </p>
        </motion.div>
        
        {/* Mobile search and filter toggle */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search collections..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg 
                className="absolute right-3 top-3 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-3 rounded-lg bg-blue-600 text-white"
              aria-label="Toggle filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
          
          {/* Mobile filter menu */}
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Filter by category</h3>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setActiveFilter(theme.id);
                      setIsFilterOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeFilter === theme.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Desktop search and filter controls */}
        <div className="hidden md:flex mb-10 flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search collections..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setActiveFilter(theme.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === theme.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Active filter indicator for mobile */}
        {activeFilter !== 'all' && (
          <div className="md:hidden mb-4 flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Filtered by: </span>
            <span className="ml-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center">
              {themes.find(t => t.id === activeFilter)?.name}
              <button 
                onClick={() => setActiveFilter('all')}
                className="ml-1 text-blue-600 dark:text-blue-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
        )}
        
        {/* Gallery grid with animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            // Skeleton loader while filtering
            Array.from({ length: 8 }).map((_, index) => (
              <div 
                key={`skeleton-${index}`}
                className="aspect-[4/3] rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))
          ) : filteredCategories.length > 0 ? (
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
                      priority={index < 8} // Prioritize more images for mobile
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                  </div>
                  
                  <div className="relative p-3 md:p-4 transform transition-transform duration-300 group-hover:translate-y-0">
                    <h2 className="text-4xl md:text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                      {category.title}
                    </h2>

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
              <p className="text-gray-600 dark:text-gray-400 text-lg">No collections found. Try a different search term or filter.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveFilter('all');}}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
        
        {/* Collection counter */}
        {!isLoading && filteredCategories.length > 0 && (
          <div className="mt-6 md:mt-8 text-center text-sm md:text-base text-gray-600 dark:text-gray-400">
            Showing {filteredCategories.length} of {categories.length} collections
          </div>
        )}
        
        {/* Mobile "back to top" button */}
        <div className="md:hidden fixed bottom-6 right-6">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 rounded-full bg-blue-600 text-white shadow-lg"
            aria-label="Back to top"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}