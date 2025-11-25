"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { formatDate } from '@/utils/dateUtils';
import { formatMessage } from '@/utils/textUtils';

// S3 bucket base URL
const s3BaseUrl = "https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com";

const MAX_MESSAGE_LENGTH = 2000;

interface Memory {
  id: number;
  name: string | null;
  email: string | null;
  message: string;
  relation: string | null;
  is_anonymous?: boolean;
  created_at: string;
}

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [relation, setRelation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [sortedMemories, setSortedMemories] = useState<Memory[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const AUTO_ROTATE_INTERVAL = 6000; // 6 seconds

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'KGyg8MIyzMnx7qIiY');
  }, []);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
      }
    };

    checkDarkMode();
    window.addEventListener('storage', checkDarkMode);
    return () => {
      window.removeEventListener('storage', checkDarkMode);
    };
  }, []);

  // Fetch existing memories
  useEffect(() => {
    fetchMemories();
  }, []);

  // Sort memories when sort option changes
  useEffect(() => {
    const sorted = [...memories].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          const nameA = (a.is_anonymous ? 'Anonymous' : (a.name || 'Anonymous')).toLowerCase();
          const nameB = (b.is_anonymous ? 'Anonymous' : (b.name || 'Anonymous')).toLowerCase();
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });
    setSortedMemories(sorted);
    setCurrentIndex(0); // Reset to first memory when sorting changes
  }, [sortBy, memories]);

  // Auto-rotate carousel
  useEffect(() => {
    if (sortedMemories.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sortedMemories.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [sortedMemories.length, isPaused, AUTO_ROTATE_INTERVAL]);

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && sortedMemories.length > 0) {
      setIsPaused(true); // Pause autoplay when user swipes
      setCurrentIndex((prev) => (prev + 1) % sortedMemories.length);
    }
    if (isRightSwipe && sortedMemories.length > 0) {
      setIsPaused(true); // Pause autoplay when user swipes
      setCurrentIndex((prev) => (prev - 1 + sortedMemories.length) % sortedMemories.length);
    }
  };

  const goToNext = () => {
    setIsPaused(true); // Pause autoplay when user interacts
    setCurrentIndex((prev) => (prev + 1) % sortedMemories.length);
  };

  const goToPrevious = () => {
    setIsPaused(true); // Pause autoplay when user interacts
    setCurrentIndex((prev) => (prev - 1 + sortedMemories.length) % sortedMemories.length);
  };

  const goToIndex = (index: number) => {
    setIsPaused(true); // Pause autoplay when user interacts
    setCurrentIndex(index);
  };

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories');
      const data = await response.json();
      if (data.memories) {
        setMemories(data.memories);
        // Initial sort will be handled by useEffect
      } else if (data.error) {
        console.error('Error fetching memories:', data.error);
        // Still set empty array to show empty state
        setMemories([]);
        setSortedMemories([]);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
      // Set empty array on error to show empty state
      setMemories([]);
      setSortedMemories([]);
    }
  };

  const validateForm = (): string | null => {
    if (!message.trim()) {
      return 'Message is required';
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return `Message must be ${MAX_MESSAGE_LENGTH} characters or less`;
    }
    if (!isAnonymous && !name.trim()) {
      return 'Name is required when not sharing anonymously';
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // First, try to send the email
      if (form.current && !isAnonymous) {
        try {
          const result = await emailjs.sendForm(
            "service_k027bvr",
            "template_mlnh9pb",
            form.current,
            "KGyg8MIyzMnx7qIiY"
          );
          console.log("Email sent successfully:", result);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          // Continue with database save even if email fails
        }
      }

      // Then save to database
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: isAnonymous ? null : name.trim(),
          email: email.trim() || null,
          message: message.trim(),
          relation: relation || null,
          is_anonymous: isAnonymous,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        setRelation('');
        setIsAnonymous(false);
        setErrorMessage('');
        // Refresh memories list
        fetchMemories();
        // Scroll to success message
        setTimeout(() => {
          document.getElementById('success-message')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // Show detailed error message
        const errorMsg = data.error || data.details || 'Failed to submit memory. Please try again.';
        const hint = data.hint ? ` ${data.hint}` : '';
        setErrorMessage(`${errorMsg}${hint}`);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting memory:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current memory for carousel
  const currentMemory = sortedMemories[currentIndex];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="pt-16 max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Share Your Memories
          </h1>
          <p className="text-lg max-w-3xl mx-auto opacity-80">
            Leave a message to share your experiences and memories of Professor Rahman
          </p>
        </motion.div>

        {/* Mobile layout shows images first, then form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Mobile Hero Image */}
          <motion.div 
            className="lg:hidden relative rounded-xl overflow-hidden shadow-xl h-64 mb-4"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Image 
              src={`${s3BaseUrl}/Wildlife/hero/Wildlife_006_hero.jpeg`}
              alt="Professor Rahman" 
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <blockquote className="italic text-base">
                  &quot;Passion gives you purpose; confidence gives you the courage to live it.&quot;
                </blockquote>
                <p className="mt-1 text-sm text-gray-300">- Prof. Rahman</p>
              </div>
            </div>
          </motion.div>
          
          {/* Form Column */}
          <motion.div 
            className={`rounded-xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className={`px-6 py-4 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'}`}>
              <h2 className="text-xl font-semibold text-white">Share Your Story</h2>
              <p className="text-blue-100 text-sm">Your memories help preserve Professor Rahman&apos;s legacy</p>
            </div>
            
            <form ref={form} onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Anonymity Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isAnonymous"
                    name="isAnonymous"
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
                    }`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isAnonymous" className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Share anonymously
                  </label>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Your name will not be displayed publicly
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Your Name {!isAnonymous && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required={!isAnonymous}
                    disabled={isAnonymous}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`block w-full px-4 py-4 min-h-[48px] rounded-lg border text-base ${
                      isAnonymous 
                        ? 'opacity-50 cursor-not-allowed' 
                        : ''
                    } ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600'
                    } transition-colors touch-manipulation`}
                    aria-label="Your Name"
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full px-4 py-4 min-h-[48px] rounded-lg border text-base ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600'
                    } transition-colors touch-manipulation`}
                    aria-label="Your Email"
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="relation" className="block text-sm font-medium">
                  Your Relation to Prof. Rahman
                </label>
                <div className="relative">
                  <select
                    name="relation"
                    id="relation"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className={`block w-full pl-4 pr-10 py-4 min-h-[48px] rounded-lg border text-base appearance-none ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600'
                    } transition-colors touch-manipulation`}
                    aria-label="Your Relation to Prof. Rahman"
                  >
                    <option value="">Select your relation</option>
                    <option value="Student">Student</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Friend">Friend</option>
                    <option value="Family">Family</option>
                    <option value="Admirer">Admirer</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="message" className="block text-sm font-medium">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-xs ${message.length > MAX_MESSAGE_LENGTH ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {message.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`block w-full px-4 py-4 rounded-lg border text-base resize-y ${
                    message.length > MAX_MESSAGE_LENGTH 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : ''
                  } ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600'
                  } transition-colors touch-manipulation`}
                  placeholder="Share your memories, thoughts, or tribute to Prof. Rahman..."
                  aria-label="Your Message"
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className={`rounded-md p-3 border ${
                  isDarkMode 
                    ? 'bg-red-900/30 border-red-800 text-red-200' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              <input type="hidden" name="date" value={new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} />

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md text-base font-medium text-white transition-colors shadow-sm
                    ${isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800' 
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                    }`}
                  aria-label={isSubmitting ? "Sending..." : "Share Your Memory"}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Share Your Memory'}
                </button>
              </div>

              {submitStatus === 'success' && (
                <motion.div 
                  id="success-message"
                  className={`rounded-md p-4 border ${
                    isDarkMode 
                      ? 'bg-green-900/30 border-green-800 text-green-200' 
                      : 'bg-green-50 border-green-200 text-green-800'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        Thank you for sharing your memory! Your message has been sent successfully.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
          
          {/* Desktop Image Column */}
          <motion.div 
            className="hidden lg:block relative rounded-xl overflow-hidden shadow-xl h-full min-h-[600px]"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Image 
              src={`${s3BaseUrl}/Wildlife/hero/Wildlife_006_hero.jpeg`}
              alt="Prof. Rahman" 
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-8">
              <blockquote className="italic text-xl text-white mb-3">
                &quot;Passion gives you purpose; confidence gives you the courage to live it.&quot;
              </blockquote>
              <p className="text-gray-300">- Professor Rahman</p>
            </div>
          </motion.div>
        </div>

        {/* Memories List */}
        <motion.div 
          className="mt-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="flex flex-row justify-between items-center gap-4 mb-8">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Shared Memories
            </h2>
            {memories.length > 0 && (
              <div className="flex items-center gap-3">
                {/* Sort By Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
                    className={`px-3 py-1.5 pl-7 pr-7 rounded-lg border text-xs md:text-sm appearance-none cursor-pointer ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600'
                    } transition-colors`}
                    aria-label="Sort memories"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Sort by Name</option>
                  </select>
                  <div className={`absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  </div>
                  <div className={`absolute inset-y-0 right-0 pr-1.5 flex items-center pointer-events-none ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {sortedMemories.length > 0 && (
                  <span className={`text-xs md:text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {currentIndex + 1} / {sortedMemories.length}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Carousel Container */}
          {sortedMemories.length > 0 ? (
            <div 
              ref={carouselRef}
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Navigation Arrows - Desktop only, outside the box */}
              {sortedMemories.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className={`hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all z-10 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                    } hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    aria-label="Previous memory"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={goToNext}
                    className={`hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all z-10 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                    } hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    aria-label="Next memory"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Carousel Track */}
              <div className="relative overflow-hidden rounded-xl">
                <motion.div
                  key={currentIndex}
                  className={`p-8 md:p-12 rounded-xl shadow-lg min-h-[400px] flex flex-col justify-between ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                  }`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  {currentMemory && (
                    <>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                          <div>
                            <h3 className={`text-2xl md:text-3xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {currentMemory.is_anonymous ? 'Anonymous' : (currentMemory.name || 'Anonymous')}
                            </h3>
                            {currentMemory.relation && (
                              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                                isDarkMode ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {currentMemory.relation}
                              </span>
                            )}
                          </div>
                          <time className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDate(currentMemory.created_at)}
                          </time>
                        </div>
                        <div 
                          className={`text-lg md:text-xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line`}
                          dangerouslySetInnerHTML={{ __html: formatMessage(currentMemory.message) }}
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Dots Indicator - Instagram style */}
              {sortedMemories.length > 1 && (
                <div className="flex justify-center items-center gap-1 md:gap-1.5 mt-6">
                  {sortedMemories.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => goToIndex(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          goToIndex(index);
                        }
                      }}
                      className={`flex-shrink-0 transition-all duration-200 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        index === currentIndex
                          ? isDarkMode 
                            ? 'bg-white w-[9px] h-[9px] md:w-2 md:h-2 opacity-100' 
                            : 'bg-gray-800 w-[9px] h-[9px] md:w-2 md:h-2 opacity-100'
                          : isDarkMode 
                            ? 'bg-white w-[6px] h-[6px] md:w-1.5 md:h-1.5 hover:bg-white/80 opacity-50' 
                            : 'bg-gray-600 w-[6px] h-[6px] md:w-1.5 md:h-1.5 hover:bg-gray-700 opacity-50'
                      }`}
                      style={{ minWidth: 'unset', minHeight: 'unset' }}
                      aria-label={`Go to memory ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={`text-center py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <svg className="mx-auto h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="mt-4 text-lg">
                No memories shared yet.
              </p>
              <p className="mt-2">
                Be the first to share your story!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
