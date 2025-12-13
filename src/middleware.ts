import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  '/api/memories': { maxRequests: 10, windowMs: 60000 }, // 10 requests per minute
  '/api/photos': { maxRequests: 50, windowMs: 60000 },   // 50 requests per minute
  default: { maxRequests: 100, windowMs: 60000 },        // 100 requests per minute
};

function getRateLimit(pathname: string) {
  for (const [path, config] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pathname.startsWith(path)) {
      return config;
    }
  }
  return RATE_LIMIT_CONFIG.default;
}

function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers (CloudFlare, AWS, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';
  return ip.trim();
}

function checkRateLimit(identifier: string, pathname: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const config = getRateLimit(pathname);
  const key = `${identifier}:${pathname}`;
  const record = rateLimitStore.get(key);
  
  // Clean up expired records
  if (record && now > record.resetTime) {
    rateLimitStore.delete(key);
  }
  
  if (!record || now > record.resetTime) {
    // Create new record
    const resetTime = now + config.windowMs;
    rateLimitStore.set(key, {
      count: 1,
      resetTime,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }
  
  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }
  
  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const identifier = getClientIdentifier(request);
    const { allowed, remaining, resetTime } = checkRateLimit(identifier, pathname);
    
    // Add rate limit headers to response
    const response = allowed
      ? NextResponse.next()
      : NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
    
    response.headers.set('X-RateLimit-Limit', getRateLimit(pathname).maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString());
    
    if (!allowed) {
      response.headers.set('Retry-After', Math.ceil((resetTime - Date.now()) / 1000).toString());
    }
    
    return response;
  }
  
  // Security headers for all routes
  const response = NextResponse.next();
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.emailjs.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.supabase.co https://api.emailjs.com; " +
    "frame-ancestors 'self';"
  );
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
