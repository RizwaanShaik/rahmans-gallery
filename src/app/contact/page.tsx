"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  relation: string;
}

export default function Contact() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState({
    name: '',
    email: '',
    message: '',
    relation: 'Student'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
      }
    };

    checkDarkMode();
    
    // Listen for storage events (which we dispatch when theme changes)
    window.addEventListener('storage', checkDarkMode);
    
    return () => {
      window.removeEventListener('storage', checkDarkMode);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call - in production, use a real API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      const message: Message = {
        id: Date.now().toString(),
        ...newMessage,
        date: new Date().toISOString()
      };

      setMessages([message, ...messages]);
      setNewMessage({ name: '', email: '', message: '', relation: 'Student' });
      setSubmitStatus('success');
    } catch (error) {
      console.error('Failed to send message:', error);
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
              <p className="text-blue-100 text-sm">Your memories help preserve Professor Rahman's legacy</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={newMessage.name}
                    onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
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
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={newMessage.email}
                    onChange={(e) => setNewMessage({ ...newMessage, email: e.target.value })}
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
                  Your Relation to Professor Rahman
                </label>
                <select
                  id="relation"
                  value={newMessage.relation}
                  onChange={(e) => setNewMessage({ ...newMessage, relation: e.target.value })}
                  className={`block w-full px-3 py-2 rounded ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="Student">Student</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Friend">Friend</option>
                  <option value="Family">Family Member</option>
                  <option value="Admirer">Admirer of Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Your Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                  className={`block w-full px-3 py-2 rounded ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Share your memories, thoughts, or tribute to Professor Rahman..."
                />
              </div>

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
              src="/images/wildlife/hero/hero.jpeg" 
              alt="Professor Rahman" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <blockquote className="italic text-lg">
                  "Photography is the story I fail to put into words."
                </blockquote>
                <p className="mt-2 text-sm text-gray-300">- Professor Rahman</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Display */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {messages.length > 0 ? 'Shared Memories' : ''}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl shadow-lg p-6 transition-all hover:shadow-xl ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
              >
                <div className={`flex items-center justify-between mb-4 pb-2 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div>
                    <h3 className="text-lg font-medium">
                      {msg.name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {msg.relation}
                    </p>
                  </div>
                  <time className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(msg.date).toLocaleDateString()}
                  </time>
                </div>
                <p className={`whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
          
          {messages.length === 0 && (
            <div className="text-center py-10">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Be the first to share your memory of Professor Rahman.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}