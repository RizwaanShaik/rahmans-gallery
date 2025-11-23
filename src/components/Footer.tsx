"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ContactModal from './ContactModal';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              A tribute to Professor Shaik Khaleel-ur-Rahman (1966-2021), a pioneering photographer and educator who dedicated his life to the art of photography. This gallery preserves just a tiny bit of his extensive collection.
            </p>
          </div>

          {/* Quick Links */}
{/* Quick Links */}
<div>
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Quick Links
  </h3>
  <ul className="space-y-2">
    <li>
      <Link
        href="/"
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
      >
        Home
      </Link>
    </li>
    <li>
      <Link
        href="/gallery"
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
      >
        Gallery
      </Link>
    </li>
    <li>
      <Link
        href="/about"
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
      >
        Biography
      </Link>
    </li>
    <li>
      <Link
        href="/contact"
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
      >
        Share Memories
      </Link>
    </li>
    <li>
      <Link
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          setIsContactModalOpen(true);
        }}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
      >
        Contact
      </Link>
    </li>
  </ul>
</div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
              © {year} Professor Rahman&apos;s Gallery. All rights reserved.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs text-center md:text-right">
              In loving memory of Professor Shaik Khaleel-ur-Rahman (1966–2021)
            </p>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </footer>
  );
}