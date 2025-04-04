"use client";

import Image from 'next/image';
import Link from 'next/link';
import FeaturedCollection from '@/components/FeaturedCollection';
import Timeline from '@/components/Timeline';

// S3 bucket base URL
const s3BaseUrl = "https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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
      <section id="featured" className="container mx-auto px-4 py-16">
        <FeaturedCollection />
      </section>

      {/* Timeline */}
      <section id="timeline" className="w-full py-16 bg-gray-50">
        <Timeline />
      </section>

      {/* About Preview */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              About Professor Rahman
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8">
              Professor Shaik Khaleel-ur-Rahman was a distinguished photographer and educator who dedicated his life to the art of photography. 
              As the Director of Academic and Planning at JNAFAU College of Fine Arts, he inspired countless students with his unique perspective 
              and technical expertise.
            </p>
            <Link
              href="/about"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg 
                       hover:bg-gray-800 transition-colors text-lg font-medium"
            >
              Read Full Biography
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}