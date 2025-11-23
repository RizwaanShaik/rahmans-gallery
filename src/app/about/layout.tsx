import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Professor Shaik Khaleel-ur-Rahman (1966-2021), a pioneering photographer and educator who dedicated his life to the art of photography. Explore his journey, achievements, and photographic legacy.',
  openGraph: {
    title: 'About Professor Rahman - Biography',
    description: 'Learn about Professor Shaik Khaleel-ur-Rahman, a pioneering photographer and educator',
    type: 'profile',
    images: [
      {
        url: 'https://skrahman.art/images/Profile.jpeg',
        width: 1200,
        height: 630,
        alt: 'Professor Shaik Khaleel-ur-Rahman',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Professor Rahman - Biography',
    description: 'Learn about Professor Shaik Khaleel-ur-Rahman, a pioneering photographer and educator',
    images: ['https://skrahman.art/images/Profile.jpeg'],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

