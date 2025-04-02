import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Professor Rahman's Gallery",
  description: "A collection of Professor Rahman's photography work",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Check if dark mode is set in localStorage
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                  document.body.style.backgroundColor = '#0a0a0a';
                  document.body.style.color = '#ededed';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.body.style.backgroundColor = '#ffffff';
                  document.body.style.color = '#171717';
                }
              } catch (_) {}
            `,
          }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            .dark { background-color: #0a0a0a; color: #ededed; }
            .dark nav { background-color: #111827; color: #ededed; }
            .dark footer { background-color: #1f2937; color: #9ca3af; }
            .dark input, .dark textarea, .dark select { background-color: #374151; color: #f9fafb; border-color: #4b5563; }
          `}} 
        />
      </head>
      <body className={`${inter.className}`}>
        <Navigation />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <footer className="py-6 text-center border-t">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} Professor Rahman's Gallery. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}