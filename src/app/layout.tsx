import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navigation from "@/components/Navigation";
import Footer from '@/components/Footer';

// Define the canonical site URL
const siteUrl = 'https://skrahman.art';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), // Set the base URL for resolving paths
  title: {
    default: "Professor Rahman's Gallery",
    template: "%s | Professor Rahman's Gallery",
  },
  description: "A tribute to Professor Shaik Khaleel-ur-Rahman's photographic legacy, showcasing diverse collections from wildlife to heritage. Honoring the memory of a master photographer and educator.",
  keywords: ['photography', 'gallery', 'wildlife photography', 'heritage photography', 'Professor Rahman', 'photography collection'],
  authors: [{ name: 'Professor Shaik Khaleel-ur-Rahman' }],
  creator: 'Professor Shaik Khaleel-ur-Rahman',
  alternates: {
    canonical: '/', // Sets the base canonical URL
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: "Professor Rahman's Gallery",
    title: "Professor Rahman's Gallery",
    description: "A tribute to Professor Shaik Khaleel-ur-Rahman's photographic legacy, showcasing diverse collections from wildlife to heritage.",
    images: [
      {
        url: `${siteUrl}/images/Profile.jpeg`,
        width: 1200,
        height: 630,
        alt: "Professor Rahman's Photography Gallery",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Professor Rahman's Gallery",
    description: "A tribute to Professor Shaik Khaleel-ur-Rahman's photographic legacy",
    images: [`${siteUrl}/images/Profile.jpeg`],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Mobile viewport optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif" }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
