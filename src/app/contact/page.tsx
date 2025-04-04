"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import emailjs from '@emailjs/browser';

// S3 bucket base URL
const s3BaseUrl = "https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com";

interface Memory {
  id: number;
  name: string;
  email: string;
  message: string;
  relation: string;
  created_at: string;
}

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [relation, setRelation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories');
      const data = await response.json();
      if (data.memories) {
        setMemories(data.memories);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // First, try to send the email
      if (form.current) {
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
          name,
          email,
          message,
          relation,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        setRelation('');
        // Refresh memories list
        fetchMemories();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting memory:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Share Your Memories
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Leave a message to share your experiences and memories of Professor Rahman
          </p>
        </div>

        {/* Form and decorative image in two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Form Column */}
          <div className={`rounded-xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'}`}>
              <h2 className="text-xl font-semibold text-white">Share Your Story</h2>
              <p className="text-blue-100 text-sm">Your memories help preserve Professor Rahman&apos;s legacy</p>
            </div>
            
            <form ref={form} onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`block w-full px-3 py-2 rounded ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Your Email <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full px-3 py-2 rounded ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="relation" className="block text-sm font-medium">
                  Your Relation to Prof. Rahman <span className="text-gray-400">(optional)</span>
                </label>
                <select
                  name="relation"
                  id="relation"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className={`block w-full px-3 py-2 rounded ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select your relation</option>
                  <option value="Student">Student</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Friend">Friend</option>
                  <option value="Admirer">Admirer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`block w-full px-3 py-2 rounded ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Share your memories, thoughts, or tribute to Professor Rahman..."
                />
              </div>

              <input type="hidden" name="date" value={new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} />

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded text-base font-medium text-white transition-colors
                    ${isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : isDarkMode 
                        ? 'bg-blue-700 hover:bg-blue-800' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
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
                <div className={`rounded p-4 border ${
                  isDarkMode 
                    ? 'bg-green-900/30 border-green-800 text-green-200' 
                    : 'bg-green-50 border-green-200 text-green-800'
                }`}>
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
                </div>
              )}

              {submitStatus === 'error' && (
                <div className={`rounded p-4 border ${
                  isDarkMode 
                    ? 'bg-red-900/30 border-red-800 text-red-200' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        Sorry, there was an error sending your message. Please try again later.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          {/* Decorative Image Column */}
          <div className="hidden lg:block relative rounded-xl overflow-hidden shadow-xl h-[600px]">
            <Image 
              src={`${s3BaseUrl}/categories/tombs/hero/hero.jpeg`}
              alt="Professor Rahman" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <blockquote className="italic text-lg">
                &quot;Photography is the story I fail to put into words.&quot;
                </blockquote>
                <p className="mt-2 text-sm text-gray-300">- Professor Rahman</p>
              </div>
            </div>
          </div>
        </div>

        {/* Memories List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shared Memories</h2>
          <div className="space-y-6">
            {memories.map((memory) => (
              <div key={memory.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{memory.name}</h3>
                    <p className="text-sm text-gray-500">{memory.relation}</p>
                  </div>
                  <time className="text-sm text-gray-500">
                    {new Date(memory.created_at).toLocaleDateString()}
                  </time>
                </div>
                <p className="text-gray-700">{memory.message}</p>
              </div>
            ))}
            {memories.length === 0 && (
              <p className="text-gray-600 text-center py-8">No memories shared yet. Be the first to share!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}