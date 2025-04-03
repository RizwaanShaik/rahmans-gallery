import React from 'react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  category: 'early-life' | 'education' | 'career' | 'exhibition' | 'award' | 'international';
}

// Define a type for category keys
type Category = 'early-life' | 'education' | 'career' | 'exhibition' | 'award' | 'international';

const events: TimelineEvent[] = [
  {
    year: "1966",
    title: "Birth of a Visionary",
    description: "Born on March 23 in Rantachintala, Guntur district, where he developed a deep love for nature and rural surroundings.",
    category: "early-life"
  },
  {
    year: "1983-85",
    title: "Diploma in Photography",
    description: "Pursued photography at JNTU College of Fine Arts, diverging from conventional career paths.",
    category: "education"
  },
  {
    year: "1986-89",
    title: "Bachelor of Commerce",
    description: "Completed B.Com degree from Osmania University while nurturing his passion for photography.",
    category: "education"
  },
  {
    year: "1992",
    title: "Beginning of Academic Career",
    description: "Joined JNTU College of Fine Arts as a Lecturer, marking the start of his influential teaching journey.",
    category: "career"
  },
  {
    year: "2000",
    title: "Master's in Journalism",
    description: "Completed Master's in Journalism and Mass Communication from Madurai Kamaraj University.",
    category: "education"
  },
  {
    year: "2001",
    title: "\"Nukkad\" Exhibition",
    description: "Solo exhibition on Street Life of Calcutta, showcasing his documentary photography skills.",
    category: "exhibition"
  },
  {
    year: "2006",
    title: "Heritage Structures Exhibition",
    description: "Solo exhibition featuring architectural photography of historical buildings in Hyderabad.",
    category: "exhibition"
  },
  {
    year: "2008-10",
    title: "Master of Fine Arts",
    description: "Earned MFA in Photography from JNAFAU, further solidifying his expertise in the field.",
    category: "education"
  },
  {
    year: "2012",
    title: "State Best Teacher Award",
    description: "Recognized by the Government of Andhra Pradesh for excellence in teaching.",
    category: "award"
  },
  {
    year: "2019",
    title: "PESGCPC Grand Progress Award",
    description: "Honored by PASCAL and GREEK School Photographic Club Cyprus for his contributions to photography.",
    category: "award"
  },
  {
    year: "2021",
    title: "Legacy Lives On",
    description: "Passed away on May 25, leaving behind a rich legacy of photographic work and educational contributions.",
    category: "early-life"
  }
];

export default function Timeline() {
  const getCategoryColor = (category: Category) => {
    const colors = {
      'early-life': 'bg-blue-500',
      'education': 'bg-green-500',
      'career': 'bg-purple-500',
      'exhibition': 'bg-amber-500',
      'award': 'bg-red-500',
      'international': 'bg-indigo-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryTextColor = (category: Category) => {
    const colors = {
      'early-life': 'text-blue-700',
      'education': 'text-green-700',
      'career': 'text-purple-700',
      'exhibition': 'text-amber-700',
      'award': 'text-red-700',
      'international': 'text-indigo-700'
    };
    return colors[category] || 'text-gray-700';
  };

  const getCategoryBgColor = (category: Category) => {
    const colors = {
      'early-life': 'bg-blue-50',
      'education': 'bg-green-50',
      'career': 'bg-purple-50',
      'exhibition': 'bg-amber-50',
      'award': 'bg-red-50',
      'international': 'bg-indigo-50'
    };
    return colors[category] || 'bg-gray-50';
  };

  const getCategoryLabel = (category: Category) => {
    const labels = {
      'early-life': 'Life Event',
      'education': 'Education',
      'career': 'Career',
      'exhibition': 'Exhibition',
      'award': 'Award',
      'international': 'International'
    };
    return labels[category] || category;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 inline-block relative">
          Journey & Achievements
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-amber-500 rounded-full"></div>
        </h2>
        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          Professor Shaik Khaleel-ur-Rahman (1966-2021) was a pioneering photographer, educator, and visionary who shaped the landscape of photography education in India.
        </p>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:block relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200"></div>
        
        <div className="space-y-12">
          {events.map((event, index) => (
            <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              {/* Event Content */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                <div className={`p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 ${getCategoryBgColor(event.category)}`}>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getCategoryTextColor(event.category)} bg-white`}>
                    {getCategoryLabel(event.category)}
                  </span>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </div>
              
              {/* Center Point */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full ${getCategoryColor(event.category)}`}></div>
              </div>
              
              {/* Year Tag */}
              <div className={`absolute ${index % 2 === 0 ? 'left-1/2 ml-8' : 'right-1/2 mr-8'} top-0 transform ${index % 2 === 0 ? 'translate-x-1' : '-translate-x-full'}`}>
                <span className="bg-gray-800 text-white px-2 py-1 rounded font-bold text-sm">
                  {event.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
        
        <div className="space-y-8">
          {events.map((event, index) => (
            <div key={index} className="relative pl-12">
              {/* Circle on timeline */}
              <div className="absolute left-4 top-6 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full ${getCategoryColor(event.category)}`}></div>
              </div>
              
              {/* Content */}
              <div className={`p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 ${getCategoryBgColor(event.category)}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryTextColor(event.category)} bg-white`}>
                    {getCategoryLabel(event.category)}
                  </span>
                  <span className="bg-gray-800 text-white px-2 py-1 rounded font-bold text-sm">
                    {event.year}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}