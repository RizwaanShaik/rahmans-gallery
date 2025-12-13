/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes all script tags, event handlers, and dangerous attributes
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  
  // Use browser's DOMParser for sanitization (client-side only)
  if (typeof window !== 'undefined') {
    // Import DOMPurify dynamically for client-side
    const DOMPurify = require('dompurify');
    
    const config = {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'span'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
      RETURN_TRUSTED_TYPE: false,
    };
    
    return DOMPurify.sanitize(dirty, config);
  }
  
  // Server-side: strip all HTML tags
  return dirty.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitizes plain text input
 * Removes all HTML tags and special characters that could be used for injection
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Remove all HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '');
  
  // Remove script-related content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  return sanitized.trim();
}

/**
 * Validates and sanitizes email addresses
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  // Basic email validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = email.trim().toLowerCase();
  
  return emailRegex.test(sanitized) ? sanitized : '';
}

/**
 * Sanitizes user input for database storage
 * Prevents SQL injection and XSS
 */
export function sanitizeForDatabase(input: string): string {
  if (!input) return '';
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');
  
  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Limit length to prevent DoS
  const MAX_LENGTH = 10000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }
  
  return sanitized.trim();
}

/**
 * Rate limiting helper - tracks request counts per IP
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = requestCounts.get(identifier);
  
  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

/**
 * Clean up old rate limit records periodically
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}
