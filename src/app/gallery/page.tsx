'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Update the base S3 URL
// S3 bucket base URL (no  prefix - direct folder structure)
const s3BaseUrl = "https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com";

// All category definitions
const allCategoryDefinitions = {
  'bidar': {
    id: 'bidar',
    title: 'Bidar',
    image: `${s3BaseUrl}/Bidar/hero/hero.jpeg`,
    description: 'Ancient city in Karnataka with rich historical and architectural significance',
  },
  'warangal': {
    id: 'warangal',
    title: 'Warangal',
    image: `${s3BaseUrl}/Warangal/hero/hero.jpeg`,
    description: 'Historical sites and monuments of the Kakatiya dynasty',
  },
  'kanhari-caves': {
    id: 'kanhari-caves',
    title: 'Kanhari Caves',
    image: `${s3BaseUrl}/KanhariCaves/hero/hero.jpeg`,
    description: 'Ancient Buddhist rock-cut monuments dating back to the 1st century',
  },
  'hampi': {
    id: 'hampi',
    title: 'Hampi',
    image: `${s3BaseUrl}/Hampi/hero/Hampi_008_hero.jpeg`,
    description: 'The ancient ruins and boulder-strewn landscape of this UNESCO site',
  },
  'kolkata-streets': {
    id: 'kolkata-streets',
    title: 'Kolkata Streets',
    image: `${s3BaseUrl}/Kolkata/hero/hero.jpeg`,
    description: 'The soul and character of Kolkata captured through street photography',
  },
  'ladakh': {
    id: 'ladakh',
    title: 'Ladakh',
    image: `${s3BaseUrl}/Ladakh/hero/hero.jpeg`,
    description: 'The breathtaking landscapes and culture of the Himalayan region',
  },
  'london': {
    id: 'london',
    title: 'London',
    image: `${s3BaseUrl}/London/hero/hero.jpeg`,
    description: 'Street scenes and architectural wonders from the UK capital',
  },
  'rajasthan': {
    id: 'rajasthan',
    title: 'Rajasthan',
    image: `${s3BaseUrl}/Rajasthan/hero/hero.jpeg`,
    description: 'The colors, architecture, and desert landscapes of royal Rajasthan',
  },
  'thai': {
    id: 'thai',
    title: 'Thailand',
    image: `${s3BaseUrl}/Thailand/hero/hero.jpeg`,
    description: 'The temples, beaches, and vibrant street life of Thailand',
  },
  'hyderabad': {
    id: 'hyderabad',
    title: 'Hyderabad',
    image: `${s3BaseUrl}/Hyderabad/hero/Hyderabad_004_hero.jpeg`,
    description: 'The city of pearls, with its unique blend of history and modernity',
  },
  'heritage': {
    id: 'heritage',
    title: 'Heritage',
    image: `${s3BaseUrl}/Heritage/hero/hero.jpeg`,
    description: 'Historical monuments and cultural landmarks preserving our rich history',
  },
  'tombs': {
    id: 'tombs',
    title: 'Tombs',
    image: `${s3BaseUrl}/Tombs/hero/hero.jpeg`,
    description: 'Architectural marvels commemorating historical figures',
  },
  'rock-forms': {
    id: 'rock-forms',
    title: 'Rock Forms',
    image: `${s3BaseUrl}/RockFormations/hero/hero.jpeg`,
    description: 'Natural sculptures shaped by time, weather, and geological forces',
  },
  'wildlife': {
    id: 'wildlife',
    title: 'Wildlife',
    image: `${s3BaseUrl}/Wildlife/hero/hero.jpeg`,
    description: 'Capturing the beauty and behavior of animals in their natural habitat',
  },
  'landscapes': {
    id: 'landscapes',
    title: 'Landscapes',
    image: `${s3BaseUrl}/Landscapes/hero/hero.jpeg`,
    description: 'Natural landscapes, cloud formations, and scenic vistas',
  },
  'culture': {
    id: 'culture',
    title: 'Culture',
    image: `${s3BaseUrl}/Culture/hero/hero.jpeg`,
    description: 'Vibrant celebrations and cultural events capturing human expressions',
  },
  'macro': {
    id: 'macro',
    title: 'Macro',
    image: `${s3BaseUrl}/Macro/hero/hero.jpeg`,
    description: 'The hidden details of our world revealed through close-up photography',
  },
  'b-and-w': {
    id: 'b-and-w',
    title: 'Black & White',
    image: `${s3BaseUrl}/Black/hero/hero.jpeg`,
    description: 'Monochrome photography highlighting contrast, texture, and form',
  },
  'air-show': {
    id: 'air-show',
    title: 'Air Show',
    image: `${s3BaseUrl}/Aviation/hero/hero.jpeg`,
    description: 'Dramatic captures of aerial performances and magnificent aircraft',
  },
  'portraits': {
    id: 'portraits',
    title: 'Portraits',
    image: `${s3BaseUrl}/Portraits/hero/Portraits_013_hero.jpeg`,
    description: 'Capturing the essence and character of people through portrait photography',
  },
  'featured': {
    id: 'featured',
    title: 'Featured',
    image: `${s3BaseUrl}/Featured/hero/hero.jpeg`,
    description: 'A curated selection of my finest photography work',
  },
};

// Category sections configuration
const categorySections = [
  {
    title: "Featured",
    id: 'featured',
    categories: ['featured'],
    image: `${s3BaseUrl}/Featured/hero/hero.jpeg`,
    description: 'A curated selection of my finest photography work',
    href: '/gallery/featured'
  },
  {
    title: "Places",
    id: 'places',
    categories: ['bidar', 'warangal', 'kanhari-caves', 'hampi', 
                 'kolkata-streets', 'ladakh', 'london', 'rajasthan', 
                 'thai', 'hyderabad'],
    image: `${s3BaseUrl}/Ladakh/thumbnails/Ladakh_007.jpeg`,
    description: 'Explore photography from around the world',
    href: '/gallery/places'
  },
  {
    title: "Heritage & History",
    id: 'heritage-history',
    categories: ['heritage', 'tombs', 'culture'],
    image: `${s3BaseUrl}/Heritage/hero/hero.jpeg`,
    description: 'Historical monuments, tombs, and cultural heritage',
    href: '/gallery/heritage-history'
  },
  {
    title: "Nature & Wildlife",
    id: 'nature-wildlife',
    categories: ['wildlife', 'landscapes', 'rock-forms'],
    image: `${s3BaseUrl}/Wildlife/hero/hero.jpeg`,
    description: 'Wildlife, natural landscapes, and geological formations',
    href: '/gallery/nature-wildlife'
  },
  {
    title: "Photography Styles",
    id: 'photography-styles',
    categories: ['macro', 'b-and-w', 'air-show', 'portraits'],
    image: `${s3BaseUrl}/Macro/thumbnails/Macro_001.jpeg`,
    description: 'Macro, Black & White, aerial, and portrait photography',
    href: '/gallery/photography-styles'
  }
];

// Helper function to get categories for a section
const getCategoriesForSection = (categoryIds: string[]) => {
  return categoryIds.map(id => allCategoryDefinitions[id as keyof typeof allCategoryDefinitions]);
};

// Main navigation categories (5 main cards)
const mainCategories = categorySections.map(section => ({
  id: section.id,
  title: section.title,
  image: section.image,
  description: section.description,
  href: section.href,
  subcategories: getCategoriesForSection(section.categories)
}));

// Type for category definitions
type CategoryType = typeof allCategoryDefinitions[keyof typeof allCategoryDefinitions];

export default function Gallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isReadyToShow, setIsReadyToShow] = useState(false);

  const GALLERY_SCROLL_KEY = 'galleryScrollPos';

  // Function to save scroll position, called onClick
  const saveScrollPosition = () => {
    sessionStorage.setItem(GALLERY_SCROLL_KEY, String(window.scrollY));
    console.log(`[Link Click] Saved scroll position: ${window.scrollY}`);
  };

  // Restore scroll position on initial mount
  useEffect(() => {
    console.log("[Mount Effect] Component mounted. Attempting to restore scroll.");
    const savedPosition = sessionStorage.getItem(GALLERY_SCROLL_KEY);
    if (savedPosition) {
        const position = parseInt(savedPosition, 10);
        console.log(`[Mount Effect] Restoring scroll position to: ${position}`);
        // Add a small delay to allow rendering before scrolling
        const timeoutId = setTimeout(() => {
            console.log(`[Mount Effect] Executing scrollTo(${position}) inside setTimeout`);
            window.scrollTo({ top: position, behavior: 'instant' });
            // Now that scroll is set, allow the page to fade in
            setIsReadyToShow(true);
            console.log("[Mount Effect] Set isReadyToShow = true after scroll.");
        }, 100); // Delay by 100ms (adjust if needed)

        // Cleanup function to clear timeout if component unmounts quickly
        return () => clearTimeout(timeoutId);
    } else {
      console.log("[Mount Effect] No saved scroll position found. Fading in immediately.");
      // No scroll to restore, fade in right away
      setIsReadyToShow(true);
    }
     // Run only once on component mount
  }, []);


  // Filter main categories and their subcategories based on search query
  const getFilteredMainCategories = () => {
    if (!searchQuery) return mainCategories;
    
    const query = searchQuery.toLowerCase().trim();
    const filtered: typeof mainCategories = [];
    
    mainCategories.forEach(mainCat => {
      // Check if main category matches
      const mainMatches = mainCat.title.toLowerCase().includes(query);
      
      // Check if any subcategory matches
      const subcategoryMatches = mainCat.subcategories.some(sub => 
        sub.title.toLowerCase().includes(query)
      );
      
      if (mainMatches || subcategoryMatches) {
        // If main category matches, include all subcategories
        // If only subcategory matches, include only matching subcategories
        if (mainMatches) {
          filtered.push(mainCat);
        } else {
          filtered.push({
            ...mainCat,
            subcategories: mainCat.subcategories.filter(sub => 
              sub.title.toLowerCase().includes(query)
            )
          });
        }
      }
    });
    
    return filtered;
  };

  const filteredMainCategories = getFilteredMainCategories();
  
  // Get all matching subcategories for display
  const getMatchingSubcategories = () => {
    if (!searchQuery) return [];
    
      const query = searchQuery.toLowerCase().trim();
    const matches: Array<{ mainCategory: string; subcategory: CategoryType }> = [];
    
    mainCategories.forEach(mainCat => {
      mainCat.subcategories.forEach(sub => {
        if (sub.title.toLowerCase().includes(query)) {
          matches.push({ mainCategory: mainCat.title, subcategory: sub });
        }
      });
    });
    
    return matches.sort((a, b) => {
      const aStartsWith = a.subcategory.title.toLowerCase().startsWith(query);
      const bStartsWith = b.subcategory.title.toLowerCase().startsWith(query);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return 0;
      });
  };
    
  const matchingSubcategories = getMatchingSubcategories();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isReadyToShow ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
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
        
        {/* Search bar */}
        <div className="mb-8 md:mb-12">
          <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search collections..."
              className="w-full px-4 py-4 md:py-4 pr-12 md:pr-24 min-h-[48px] rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg touch-manipulation"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchQuery('');
                }
              }}
              />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <svg 
                className="h-5 w-5 md:h-6 md:w-6 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Main 5 Category Cards */}
        {/* Mobile Layout: Featured on top, then 2x2 grid */}
        <div className="mb-12 md:mb-16 md:hidden space-y-4">
          {/* Featured - Full width row */}
          {filteredMainCategories.filter(cat => cat.id === 'featured').map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                href={category.href}
                className="group relative aspect-[21/9] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-end block w-full"
                onClick={saveScrollPosition}
              >
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
        </div>
        
                <div className="relative p-4">
                  <h2 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                    {category.title}
                  </h2>
          </div>
              </Link>
            </motion.div>
          ))}
        
          {/* Other 4 categories - 2x2 grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredMainCategories.filter(cat => cat.id !== 'featured').map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
              >
                <Link 
                  href={category.href}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-end block w-full"
                  onClick={saveScrollPosition}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={index < 2}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  </div>
                  
                  <div className="relative p-4">
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                      {category.title}
                    </h2>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Layout: All cards equal size */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 md:gap-6 mb-12 md:mb-16">
          {filteredMainCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link 
                href={category.href}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-end block w-full"
                onClick={saveScrollPosition}
              >
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 1024px) 20vw, 20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index < 2}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                </div>
                
                <div className="relative p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                    {category.title}
                  </h2>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Matching Subcategories (shown when searching) */}
        {searchQuery && matchingSubcategories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
              Matching Collections
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {matchingSubcategories.map((match, index) => (
                <motion.div
                  key={`${match.mainCategory}-${match.subcategory.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link 
                    href={`/gallery/${match.subcategory.id}`}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end block"
                    onClick={saveScrollPosition}
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={match.subcategory.image}
                        alt={match.subcategory.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={index < 4}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                    </div>
                    
                    <div className="relative p-3 md:p-4">
                      <div className="text-xs md:text-sm text-white/70 mb-1">{match.mainCategory}</div>
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                        {match.subcategory.title}
                      </h3>
                    <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* No results message with suggestions */}
        {searchQuery && filteredMainCategories.length === 0 && matchingSubcategories.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No collections found matching &quot;{searchQuery}&quot;</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {['Places', 'Heritage', 'Wildlife', 'Macro', 'Culture'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion.toLowerCase())}
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear search
              </button>
            </div>
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
    </motion.div>
  );
}