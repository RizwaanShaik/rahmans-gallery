"use client";

import { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 text-center border-t border-gray-200 dark:border-gray-700"> {/* Added dark border */}
      <div className="container mx-auto px-4">
        <p className="text-gray-600 dark:text-gray-400">© {year} Professor Rahman's Gallery. All rights reserved.</p> {/* Added dark text */}
      </div>
    </footer>
  );
}
