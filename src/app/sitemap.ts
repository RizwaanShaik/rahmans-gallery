import { MetadataRoute } from 'next'

// Define categories based on your gallery page
const categories = [
  { id: 'featured' },
  { id: 'wildlife' },
  { id: 'heritage' },
  { id: 'ladakh' },
  { id: 'london' },
  { id: 'macro' },
  { id: 'air-show' },
  { id: 'b-and-w' },
  { id: 'bidar' },
  { id: 'culture' },
  { id: 'hampi' },
  { id: 'hyderabad' },
  { id: 'kanhari-caves' },
  { id: 'kolkata-streets' },
  { id: 'landscapes' },
  { id: 'lockdown' },
  { id: 'rachakonda' },
  { id: 'rajasthan' },
  { id: 'rock-forms' },
  { id: 'tadoba' },
  { id: 'thai' },
  { id: 'tombs' },
  { id: 'warangal' },
  { id: 'portraits' }
];

const baseUrl = 'https://skrahman.art'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/gallery/${category.id}`,
    lastModified: new Date(), // Consider updating this based on actual content changes
    changeFrequency: 'weekly' as const, // Or 'monthly'/'yearly' depending on update frequency
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages];
}
