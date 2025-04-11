import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Add disallow rules here if needed, e.g.:
      // disallow: '/admin/',
      // disallow: '/private/',
    },
    sitemap: 'https://www.skrahman.art/sitemap.xml',
  }
}
