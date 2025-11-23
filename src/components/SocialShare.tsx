"use client";

import { useState } from 'react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  variant?: 'default' | 'compact' | 'floating' | 'icon-only';
  className?: string;
}

export default function SocialShare({
  url,
  title,
  description = "Explore Professor Rahman's Photography Gallery",
  imageUrl,
  variant = 'default',
  className = '',
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Use native share API if available
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title,
          text: description,
          url,
        };
        
        // Add image if provided and supported
        if (imageUrl && navigator.canShare && navigator.canShare({ ...shareData, files: [] })) {
          // Note: Some browsers don't support sharing images via navigator.share
          // We'll just share the URL and text
        }
        
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred - fallback to copy
        if ((err as Error).name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      // Fallback to copy link if native share not available
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Icon-only variant - single button that opens native share
  if (variant === 'icon-only') {
    // Check if className contains custom button styles (for FullscreenModal)
    const isFullscreenModal = className.includes('[&_button]:');
    const baseClasses = isFullscreenModal 
      ? "p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation backdrop-blur-sm"
      : "p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation active:scale-95";
    
    return (
      <button
        onClick={handleShare}
        className={`${baseClasses} ${className.replace(/\[&_button\]:[^\s]+/g, '').trim()}`}
        aria-label={copied ? "Link copied!" : "Share"}
        title={copied ? "Link copied!" : "Share"}
      >
        {copied ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
            />
          </svg>
        )}
      </button>
    );
  }

  // Default/compact/floating variants (keeping for backward compatibility if needed)
  const iconSize = variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonSize = variant === 'compact' ? 'p-2' : 'p-3';
  const textSize = variant === 'compact' ? 'text-xs' : 'text-sm';

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
        <button
          onClick={handleShare}
          className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Share"
          title="Share"
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    );
  }

  // Default variant - button with text
  return (
    <button
      onClick={handleShare}
      className={`${buttonSize} rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2 ${textSize} touch-manipulation ${className}`}
      aria-label="Share"
    >
      <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {variant !== 'compact' && <span>{copied ? 'Copied!' : 'Share'}</span>}
      {variant === 'compact' && copied && <span className="text-xs">Copied!</span>}
    </button>
  );
}
