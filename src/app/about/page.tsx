import Image from 'next/image';

export default function About() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header with decorative elements */}
        <div className="relative mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 inline-block relative">
            About Prof. S. K. Rahman
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-amber-500 rounded-full"></div>
          </h1>
        </div>
        
        {/* Profile Image with elegant styling */}
        <div className="mb-12 sm:mb-16 relative w-[260px] h-[320px] mx-auto">
          <div className="relative w-full h-full overflow-hidden rounded-xl shadow-xl transform hover:scale-102 transition-transform duration-300">
          <Image
              src="/images/about/thumbnails/IMG_0020.jpeg"
              alt="Professor Shaik Khaleel-ur-Rahman"
            fill
              className="object-cover"
              sizes="(max-width: 640px) 260px, 320px"
              priority
          />
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-amber-500 rounded-full -z-10"></div>
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 rounded-full -z-10"></div>
        </div>

        {/* Timeline-style content sections */}
        <div className="prose prose-lg max-w-none">
          {/* Biography Quote */}
          <blockquote className="mb-12 p-4 sm:p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg italic text-gray-700 text-center">
           &quot;Professor Shaik Khaleel-ur-Rahman (1966-2021) was a pioneering photographer, educator, and visionary who shaped the landscape of photography education in India.&quot;
          </blockquote>

          {/* Timeline Sections */}
          <div className="relative border-l-2 border-gray-200 pl-5 sm:pl-8 ml-4 sm:ml-6">
            {/* Early Life */}
            <section className="mb-12 relative">
              <div className="absolute -left-14 top-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold">1</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Early Life</h2>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Born on March 23, 1966, in Rantachintala, Guntur district, Professor Shaik Khaleel-ur-Rahman spent his formative years in his village, 
                  where he developed a deep love for nature and rural surroundings. His father, Abdul Rahman, served as a Senior Accounts Officer in the A.G.&apos;s Office, Hyderabad. 
                  The family&apos;s move from their peaceful rural setting to the bustling city of Hyderabad marked a significant transition in young Rahman&apos;s life.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  During his teenage years, his father would give him 10 rupees on Sundays to watch movies independently, fostering a love for visual storytelling through films 
                  like Bruce Lee, James Bond, and Indiana Jones. This early exposure to cinema would later influence his photographic style and storytelling approach.
                </p>
              </div>
            </section>

            {/* Education */}
            <section className="mb-12 relative">
              <div className="absolute -left-14 top-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold">2</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-600">Education and Early Career</h2>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <p className="mb-4 text-gray-700 leading-relaxed">
                  After completing his Intermediate education in MPC (Mathematics, Physics, Chemistry), Rahman chose to diverge from conventional paths, 
                  pursuing photography at JNTU College of Fine Arts. This decision, though initially shocking to his family, would prove transformative.
                </p>
                <div className="mb-4 bg-green-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-green-700">Educational Milestones</h3>
                  <ul className="space-y-3 pl-1">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">Diploma in Photography from JNTU College of Fine Arts (1983-1985)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">Bachelor of Commerce from Osmania University (1986-1989)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">Master&apos;s in Journalism and Mass Communication from Madurai Kamaraj University (2000)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">Master of Fine Arts in Photography from JNAFAU (2008-2010)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Career */}
            <section className="mb-12 relative">
              <div className="absolute -left-14 top-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold">3</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-purple-600">Professional Journey</h2>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Professor Rahman&apos;s career began with diverse roles including assistant cameraman at Chaitanya Movies, photo lab printer at Raja Deen Dayal & Sons, 
                  and freelance fashion photographer for Impulse Advertising Agency. In 1992, he joined JNTU College of Fine Arts as a Lecturer, marking the beginning 
                  of his academic career.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3 text-purple-700">Key Academic Positions</h3>
                    <ul className="space-y-2 list-none">
                      <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span> Director of Academic and Planning</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span> Registrar of JNAFAU</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span> Controller of Examinations</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3 text-purple-700">Departmental Roles</h3>
                    <ul className="space-y-2 list-none">
                      <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span> Head of the Photography Department</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span> Special Officer for University Hostel</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span> Board of Studies Member</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Photography Expertise */}
            <section className="mb-12 relative">
              <div className="absolute -left-14 top-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold">4</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-amber-600">Photographic Journey</h2>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Coming from the tradition of small-format Analog Photography, Professor Rahman mastered black & white film processing and darkroom techniques. 
                  When digital technology emerged in the early 1990s, he embraced the change, starting with the Sony Mavica Floppy Disk storage camera.
                </p>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Throughout his career, he developed expertise across multiple photography disciplines. His fine art photography explored abstract forms and textures, 
                  while his documentary work captured the essence of everyday life across India. His landscape photography revealed his deep connection with nature, 
                  while his architectural work preserved heritage structures for future generations.
                </p>
                <div className="mb-4 bg-amber-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-amber-700">Areas of Specialization</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <p className="font-medium text-amber-800 text-center">Fine Art</p>
                      <p className="text-sm text-amber-700 mt-1">Abstract compositions exploring form and texture</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <p className="font-medium text-amber-800 text-center">Documentary</p>
                      <p className="text-sm text-amber-700 mt-1">Street life and cultural documentation</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <p className="font-medium text-amber-800 text-center">Landscape</p>
                      <p className="text-sm text-amber-700 mt-1">Natural vistas and environmental studies</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <p className="font-medium text-amber-800 text-center">Architecture</p>
                      <p className="text-sm text-amber-700 mt-1">Heritage structures and sacred spaces</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <p className="font-medium text-amber-800 text-center">Advertising</p>
                      <p className="text-sm text-amber-700 mt-1">Commercial and product photography</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <p className="font-medium text-amber-800 text-center">Macro</p>
                      <p className="text-sm text-amber-700 mt-1">Detailed studies of miniature subjects</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Exhibitions and Achievements */}
            <section className="mb-12 relative">
              <div className="absolute -left-14 top-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold">5</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-red-600">Exhibitions and Recognition</h2>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-red-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
                      </svg>
                      Notable Exhibitions
                    </h3>
                    <ul className="space-y-2 list-none">
                      <li className="p-2 bg-red-50 rounded-md">&ldquo;Deccan Rock Forms&rdquo; - Group Exhibition in Kolkata (2000)</li>
                      <li className="p-2 bg-red-50 rounded-md">&ldquo;Nukkad&rdquo; - Solo Exhibition on Street Life of Calcutta (2001)</li>
                      <li className="p-2 bg-red-50 rounded-md">&ldquo;Heritage Structures of Hyderabad&rdquo; - Solo Exhibition (2006)</li>
                      <li className="p-2 bg-red-50 rounded-md">&ldquo;Colors of Rajasthan&rdquo; - Group Exhibition (2015)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-red-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Awards and Recognition
                    </h3>
                    <ul className="space-y-2 list-none">
                      <li className="p-2 bg-red-50 rounded-md">State Best Teacher Award from the Government of Andhra Pradesh (2012)</li>
                      <li className="p-2 bg-red-50 rounded-md">Young Teacher Award (BOLT) from Singapore Tourism Board & Air India</li>
                      <li className="p-2 bg-red-50 rounded-md">PESGCPC Grand Progress Award from PASCAL and GREEK School Photographic Club Cyprus (2019)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* International Experience */}
            <section className="mb-12 relative">
              <div className="absolute -left-14 top-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold">6</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-600">International Experience</h2>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Professor Rahman conducted photography projects and workshops across multiple countries, bringing his expertise to international audiences and enriching his own work through global perspectives:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg flex items-start">
                    <div className="mr-3 mt-1 text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-indigo-700">United Kingdom</h3>
                      <p className="text-gray-700 text-sm">Visited Swansea Metropolitan University (2010) for academic collaboration and knowledge exchange</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg flex items-start">
                    <div className="mr-3 mt-1 text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-indigo-700">Sri Lanka</h3>
                      <p className="text-gray-700 text-sm">Conducted workshops on Temple Architecture & Travel Photography, focusing on the cultural heritage of the island</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg flex items-start">
                    <div className="mr-3 mt-1 text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-indigo-700">Thailand</h3>
                      <p className="text-gray-700 text-sm">Led workshops on Landscape & Travel Photography highlighting the techniques for capturing tropical landscapes</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg flex items-start">
                    <div className="mr-3 mt-1 text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-indigo-700">Nepal</h3>
                      <p className="text-gray-700 text-sm">Documented ancient temples and mountain landscapes (2013), creating a visual archive of religious architecture</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg flex items-start col-span-1 sm:col-span-2 md:col-span-1">
                    <div className="mr-3 mt-1 text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-indigo-700">Saudi Arabia</h3>
                      <p className="text-gray-700 text-sm">Conducted urban landscape photography project (2015) focusing on the contrast between traditional and modern architecture</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Legacy */}
            <section className="relative">
              <div className="absolute -left-14 top-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold">7</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-teal-600">Legacy and Impact</h2>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Throughout his career, Professor Rahman mentored numerous successful photographers and filmmakers. His students have excelled in various fields 
                  including Film Making, Advertising, Television, Sports Photography, and Education.
                </p>
                <div className="mb-6 bg-teal-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-teal-700">Notable Alumni</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full">P G Vinda</span>
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full">Srikanth Naroj</span>
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full">Samala Bhaskar</span>
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full">Acharya Venu</span>
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full">Nachiket Katti (USA)</span>
                  </div>
                </div>
                <div className="p-4 sm:p-5 border-t border-gray-200 mt-4 text-center">
                  <p className="text-gray-700 italic">
                    Professor Shaik Khaleel-ur-Rahman passed away on May 25, 2021, leaving behind a rich legacy of photographic work, educational contributions, and 
                    a lasting impact on the field of photography education in India. His work continues to inspire new generations of photographers and visual artists.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 