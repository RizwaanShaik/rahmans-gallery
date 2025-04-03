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
    <html lang="en">
      <body className={`${inter.className}`}>
        <Navigation />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <footer className="py-6 text-center border-t">
          <div className="container mx-auto px-4">
            <p className="text-gray-600">© {new Date().getFullYear()} Professor Rahman&apos;s Gallery. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}