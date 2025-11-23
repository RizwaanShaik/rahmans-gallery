import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Explore Professor Shaik Khaleel-ur-Rahman\'s diverse photography collections including wildlife, heritage sites, landscapes, and cultural moments. A tribute to a master photographer\'s legacy.',
  openGraph: {
    title: 'Gallery - Professor Rahman\'s Photography',
    description: 'Explore diverse photography collections from wildlife to heritage sites',
    type: 'website',
    images: [
      {
        url: 'https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com/Featured/Featured_001.jpeg',
        width: 1200,
        height: 630,
        alt: 'Professor Rahman\'s Photography Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery - Professor Rahman\'s Photography',
    description: 'Explore diverse photography collections from wildlife to heritage sites',
    images: ['https://rahmansgallerybucket.s3.ap-south-1.amazonaws.com/Featured/Featured_001.jpeg'],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

