"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Professor S. K. Rahman&apos;s Photography
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          A distinguished photographer, educator, and visionary who captured life&apos;s beautiful moments through his lens. 
          His work spans across Fine Art, Travel, Documentary, and Macro Photography, leaving behind a legacy that continues to inspire.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/gallery" 
            className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            View Gallery
          </Link>
          <Link 
            href="/about" 
            className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Read Biography
          </Link>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Collections</h2>

        {/* Wildlife Section */}
        <div className="relative h-[70vh] w-full rounded-xl overflow-hidden shadow-2xl mb-16">
          <Image
            src="/images/wildlife/hero/hero.jpeg"
            alt="Wildlife Photography"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Wildlife Photography</h3>
            <p className="text-lg text-gray-200">Discover the beauty of nature through wildlife photography.</p>
            <Link
              href="/gallery/wildlife"
              className="inline-block mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Collection
            </Link>
          </div>
        </div>

        {/* Architecture Section */}
        <div className="relative h-[70vh] w-full rounded-xl overflow-hidden shadow-2xl mb-16">
          <Image
            src="/images/architecture/hero/hero.jpeg"
            alt="Architecture Photography"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Architecture</h3>
            <p className="text-lg text-gray-200">Explore the world of architectural marvels.</p>
            <Link
              href="/gallery/architecture"
              className="inline-block mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Awards and Recognition Section */}
      <section className="py-16 bg-gray-50 rounded-2xl">
        <h2 className="text-3xl font-bold text-center mb-12">Awards & Recognition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">State Best Teacher Award</h3>
            <p className="text-gray-600">Awarded by the Government of Andhra Pradesh in 2012 for outstanding contributions to education.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Young Teacher Award</h3>
            <p className="text-gray-600">Recognized by the Singapore Tourism Board & Air India for excellence in teaching.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Professional Memberships</h3>
            <p className="text-gray-600">Active member of Telangana Photography Society, Federation of Indian Photography, and Telangana Photography Akademy.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Exhibitions</h3>
            <p className="text-gray-600">Featured in exhibitions including "Deccan Rock Forms," "Nukkad," "Heritage Structures of Hyderabad," and "Ragilo Rajasthan."</p>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">About the Artist</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Professor Shaik Khaleel-ur-Rahman was a distinguished photographer and educator who dedicated his life to the art of photography. 
          As the Director of Academic and Planning at JNAFAU College of Fine Arts, he inspired countless students with his unique perspective 
          and technical expertise. His work spans various genres, from breathtaking landscapes to intimate portraits, each photograph telling its own story.
        </p>
        <Link 
          href="/about" 
          className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Read Full Biography
        </Link>
      </section>
    </div>
  );
}