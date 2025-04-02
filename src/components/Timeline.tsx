import React from 'react';

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  category: 'education' | 'exhibition' | 'award' | 'milestone';
}

const events: TimelineEvent[] = [
  {
    year: 1975,
    title: "Bachelor's in Fine Arts",
    description: "Graduated with distinction from College of Fine Arts, JNAFAU",
    category: "education"
  },
  {
    year: 1978,
    title: "Master's in Fine Arts",
    description: "Specialized in Photography at JNAFAU",
    category: "education"
  },
  {
    year: 1980,
    title: "First Photography Exhibition",
    description: "Hosted first solo exhibition at the University Gallery",
    category: "exhibition"
  },
  {
    year: 1985,
    title: "National Photography Award",
    description: "Received recognition for wildlife photography",
    category: "award"
  },
  {
    year: 1990,
    title: "Director of Academic Planning",
    description: "Appointed at JNAFAU College of Fine Arts",
    category: "milestone"
  },
  {
    year: 1995,
    title: "PhD in Fine Arts",
    description: "Completed doctoral research in Photography",
    category: "education"
  },
  {
    year: 2000,
    title: "Wildlife Conservation Project",
    description: "Led documentation project in national parks",
    category: "milestone"
  },
  {
    year: 2012,
    title: "State Best Teacher Award",
    description: "Awarded by Government of Andhra Pradesh",
    category: "award"
  }
];

export default function Timeline() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Journey & Achievements
      </h2>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-6 md:space-y-12">
          {events.map((event, index) => (
            <div
              key={event.year}
              className={`relative flex items-start md:items-center ${
                index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
              }`}
            >
              {/* Event Content */}
              <div
                className={`ml-12 md:ml-0 w-full md:w-5/12 ${
                  index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:pl-8'
                }`}
              >
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                    event.category === 'education' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    event.category === 'exhibition' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    event.category === 'award' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  }`}>
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {event.description}
                  </p>
                  <div className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {event.year}
                  </div>
                </div>
              </div>

              {/* Center Point */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 shadow" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 