"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-shadow ${isScrolled ? 'shadow-md dark:shadow-gray-900' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <span className="text-xl font-bold">Professor Rahman's Gallery</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center px-6 py-3 text-base font-medium rounded-lg ${
                  isActive(link.href)
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                } transition-all`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-10 h-10 flex justify-center items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <div className="absolute w-5 flex flex-col items-center">
                <span
                  className={`w-full h-0.5 bg-gray-600 dark:bg-gray-400 rounded-full transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-gray-600 dark:bg-gray-400 rounded-full transform transition-all duration-200 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-gray-600 dark:bg-gray-400 rounded-full transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-x-0 top-16 transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        } sm:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40`}
      >
        <div className="py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-6 py-3 text-base font-medium ${
                isActive(link.href)
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-l-4 border-blue-500 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:border-l-4 hover:border-gray-300 dark:hover:border-gray-500'
              } transition-all duration-200`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
