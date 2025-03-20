"use client"; // Mark this component as a client-side component

import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Send email using EmailJS
      await emailjs.send(
        'service_k027bvr', // Your EmailJS service ID
        'template_mlnh9pb', // Your EmailJS template ID
        {
          name: name, // From Name
          email: email, // Reply To
          message: message, // Content
        },
        'KGyg8MIyzMnx7qIiY' // Your EmailJS user ID
      );

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      
      // Auto-hide the success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('EmailJS Error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Me</h1>
          <p className="text-lg text-gray-600">Get in touch with me for software development inquiries or collaborations</p>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Me */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-600 leading-relaxed">
                I am a passionate software engineer with expertise in web development and modern technologies. 
                I specialize in creating efficient, scalable, and user-friendly applications using the latest 
                frameworks and best practices. My goal is to build innovative solutions that make a difference.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Details</h2>
              
              {/* Phone */}
              <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+918639136086" className="text-gray-600 hover:text-gray-900 transition-colors">
                  +91 8639136086
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:shaikrizwaan@gmail.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                  shaikrizwaan@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send a Message</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Your email address"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 resize-none"
                placeholder="Your message"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3.5 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSuccess(false)}></div>
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto z-10 relative">
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" 
              onClick={() => setSuccess(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center">
              <svg 
                className="h-16 w-16 text-green-500 mx-auto mb-4" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">
                Thank you for your message. I'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 