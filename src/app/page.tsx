import Image from 'next/image';
import Link from 'next/link';
import Timeline from '@/components/Timeline';
import type { Metadata } from 'next';

// Homepage Specific Metadata
export const metadata: Metadata = {
  title: "Professor Rahman's Photography Gallery | Home",
  description: "A tribute to Professor Shaik Khaleel-ur-Rahman's photographic legacy, showcasing diverse collections from wildlife to heritage. Honoring the memory of a master photographer and educator.",
};

// S3 bucket base URL
const s3BaseUrl = "https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <Image
          //src={`${s3BaseUrl}/Ladakh/hero/Ladakh_022_hero.jpeg`}
          src={`${s3BaseUrl}/Warangal/hero/Warangal_009_hero.jpeg`}
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
          <p className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
           A tribute gallery dedicated to the memory of Professor Shaik Khaleel-ur-Rahman (1966–2021), whose photography and teaching left a lasting impact on students, colleagues, friends, and family alike.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
            <Link
              href="/gallery"
              className="inline-block bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 min-h-[48px] rounded-lg 
                       hover:bg-white/20 active:bg-white/30 transition-all duration-300 text-lg font-medium touch-manipulation active:scale-95 flex items-center justify-center"
            >
              Open Gallery
            </Link>
            <Link
              href="/about"
              className="inline-block bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 min-h-[48px] rounded-lg
                       hover:bg-white/20 active:bg-white/30 transition-all duration-300 text-lg font-medium touch-manipulation active:scale-95 flex items-center justify-center"
            >
              Read his story
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 min-h-[48px] rounded-lg
                       hover:bg-white/20 active:bg-white/30 transition-all duration-300 text-lg font-medium touch-manipulation active:scale-95 flex items-center justify-center"
            >
              Share a Memory
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        {/* Timeline component (includes its own title/container) */}
        <Timeline />
        {/* Link to full About page */}
        <div className="text-center mt-12 container mx-auto px-4">
          <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg">
            See the full journey &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}