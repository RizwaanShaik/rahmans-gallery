"use client";

import Image from 'next/image';
import Link from 'next/link';
import FeaturedCollection from '@/components/FeaturedCollection';
import Timeline from '@/components/Timeline';
import AboutPreview from '@/components/AboutPreview';

// S3 bucket base URL
const s3BaseUrl = "https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <Image
          src={`${s3BaseUrl}/categories/wildlife/hero/hero.jpeg`}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Professor Rahman&apos;s Photography
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-8 leading-relaxed">
            A legacy of capturing the extraordinary in nature and wildlife through the lens
          </p>
          <Link
            href="/gallery"
            className="inline-block bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-lg 
                     hover:bg-white/20 transition-all duration-300 text-lg font-medium"
          >
            Explore Gallery
          </Link>
        </div>
      </section>

      {/* Featured Collection */}
      <section id="featured" className="container mx-auto px-4 py-16 dark:bg-gray-900">
        <FeaturedCollection />
      </section>

      {/* Timeline */}
      <section id="timeline" className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        <Timeline />
      </section>

      {/* About Preview */}
      <section className="w-full py-16 bg-white dark:bg-gray-900">
        <AboutPreview />
      </section>
    </main>
  );
}