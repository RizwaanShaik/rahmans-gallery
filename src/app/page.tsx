"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Professor Rahman&apos;s Photography
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          A curated collection of photographs capturing moments of beauty, emotion, and wonder through the lens of a passionate photographer and educator.
        </p>
        <Link 
          href="/gallery" 
          className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Explore Gallery
        </Link>
      </section>

      {/* Featured Image Section */}
      <section className="py-16">
        <div className="relative h-[70vh] w-full rounded-xl overflow-hidden shadow-2xl">
          <Image
            src="/images/wildlife/RedPanda.JPG"
            alt="Featured Photography"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Discover the Collection</h2>
            <p className="text-lg text-gray-200">Explore a diverse portfolio of wildlife, portraits, architecture, and abstract photography.</p>
          </div>
        </div>
      </section>

      {/* Wildlife Section */}
      <section className="py-16">
        <div className="relative h-[70vh] w-full rounded-xl overflow-hidden shadow-2xl">
          <Image
            src="/images/wildlife/hero.JPG"
            alt="Wildlife Photography"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Wildlife Photography</h2>
            <p className="text-lg text-gray-200">Discover the beauty of nature through wildlife photography.</p>
            <Link
              href="/gallery/wildlife"
              className="inline-block mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Wildlife
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-16">
        <div className="relative h-[70vh] w-full rounded-xl overflow-hidden shadow-2xl">
          <Image
            src="/images/architecture/hero.JPG"
            alt="Architecture Photography"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Architecture</h2>
            <p className="text-lg text-gray-200">Explore the world of architectural marvels.</p>
            <Link
              href="/gallery/architecture"
              className="inline-block mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">About Professor Rahman</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          This gallery is dedicated to preserving and sharing the photographic legacy of Professor Rahman, 
          who captured life&apos;s beautiful moments through his lens until 2021. His work continues to inspire 
          and touch hearts through this digital collection.
        </p>
        <Link 
          href="/about" 
          className="inline-block border-2 border-gray-800 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
        >
          Learn More
        </Link>
      </section>
    </div>
  );
}