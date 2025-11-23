import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Share Memories',
  description: 'Share your memories and stories about Professor Shaik Khaleel-ur-Rahman. Your memories help preserve his photographic legacy and honor his memory.',
  openGraph: {
    title: 'Share Memories - Professor Rahman\'s Gallery',
    description: 'Share your memories and stories about Professor Rahman',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Share Memories - Professor Rahman\'s Gallery',
    description: 'Share your memories and stories about Professor Rahman',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

