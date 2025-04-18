import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navigation from "@/components/Navigation";
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ["latin"] });

// Define the canonical site URL
const siteUrl = 'https://skrahman.art';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), // Set the base URL for resolving paths
  title: "Professor Rahman's Gallery",
  description: "A legacy of capturing the extraordinary in nature and wildlife through the lens",
  alternates: {
    canonical: '/', // Sets the base canonical URL
  },
  icons: {
    icon: '/favicon.ico', // Explicitly define the favicon path
    // You can add other icons like apple-touch-icon here if needed
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
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
