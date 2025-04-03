"use client";

import { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 text-center border-t">
      <div className="container mx-auto px-4">
        <p className="text-gray-600">© {year} Professor Rahman&apos;s Gallery. All rights reserved.</p>
      </div>
    </footer>
  );
} 