'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"> {/* Dark gradient */}
      <div className="container mx-auto px-5 sm:px-6 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header with animated underline */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="mb-10 sm:mb-16 text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white-800 dark:text-white inline-block relative">
              About Prof. S. K. Rahman
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-3 left-0 h-1 bg-amber-500 rounded-full"
              ></motion.div>
            </h1>
          </motion.div>

          {/* Profile Image with elegant styling */}
          <div className="mb-12 sm:mb-16 relative max-w-xs mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <div className="relative w-[260px] h-[320px] mx-auto rounded-xl overflow-hidden shadow-xl dark:shadow-gray-700"> {/* Dark shadow */}
                <Image
                  src="/images/Profile.jpeg"
                  alt="Professor Shaik Khaleel-ur-Rahman"
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-700"
                  sizes="(max-width: 640px) 260px, 320px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </motion.div>
          </div>

          {/* Biography Quote */}
          <motion.blockquote
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-12 p-6 sm:p-8 bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg italic text-gray-700 dark:text-gray-300 text-center shadow-sm dark:shadow-md" /* Dark bg, border, text */
          >
            &quot;Professor Shaik Khaleel-ur-Rahman (1966-2021) was a pioneering photographer, educator, and visionary who shaped the landscape of photography education in India.&quot;
          </motion.blockquote>

          {/* Timeline Sections */}
          <div className="relative border-l-2 border-gray-200 dark:border-gray-700 pl-6 sm:pl-8 ml-5 sm:ml-8"> {/* Dark border */}
            {/* Early Life */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="mb-12 relative"
            >
              <div className="absolute -left-12 sm:-left-16 top-0 w-7 h-7 sm:w-9 sm:h-9 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xs sm:text-base">1</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Early Life</h2> {/* Dark text */}
              <div className="bg-white dark:bg-gray-800 p-5 sm:p-7 rounded-xl shadow-sm hover:shadow-md dark:shadow-gray-700 dark:hover:shadow-gray-600 transition-all duration-300 border border-gray-100 dark:border-gray-700"> {/* Dark bg, shadow, border */}
                <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark text */}
                  Born on March 23, 1966, in Rantachintala, Guntur district, Professor Shaik Khaleel-ur-Rahman spent his formative years in his village,
                  where he developed a deep love for nature and rural surroundings. His father, Abdul Rahman, served as a Senior Accounts Officer in the A.G.&apos;s Office, Hyderabad.
                  The family&apos;s move from their peaceful rural setting to the bustling city of Hyderabad marked a significant transition in young Rahman&apos;s life.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark text */}
                  During his teenage years, his father would give him 10 rupees on Sundays to watch movies independently, fostering a love for visual storytelling through films
                  like Bruce Lee, James Bond, and Indiana Jones. This early exposure to cinema would later influence his photographic style and storytelling approach.
                </p>
              </div>
            </motion.section>

            {/* Education */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="mb-12 relative"
            >
              <div className="absolute -left-12 sm:-left-16 top-0 w-7 h-7 sm:w-9 sm:h-9 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xs sm:text-base">2</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-green-600 dark:text-green-400">Education and Early Career</h2> {/* Dark text */}
              <div className="bg-white dark:bg-gray-800 p-5 sm:p-7 rounded-xl shadow-sm hover:shadow-md dark:shadow-gray-700 dark:hover:shadow-gray-600 transition-all duration-300 border border-gray-100 dark:border-gray-700"> {/* Dark bg, shadow, border */}
                <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark text */}
                  After completing his Intermediate education in MPC (Mathematics, Physics, Chemistry), Rahman chose to diverge from conventional paths,
                  pursuing photography at JNTU College of Fine Arts. This decision, though initially shocking to his family, would prove transformative.
                </p>
                <div className="mb-4 bg-green-50 dark:bg-gray-700 p-5 rounded-xl"> {/* Dark bg */}
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-green-700 dark:text-green-300">Educational Milestones</h3> {/* Dark text */}
                  <ul className="space-y-3 pl-1">
                    {[
                      "Diploma in Photography from JNTU College of Fine Arts (1983-1985)",
                      "Bachelor of Commerce from Osmania University (1986-1989)",
                      "Master's in Journalism and Mass Communication from Madurai Kamaraj University (2000)",
                      "Master of Fine Arts in Photography from JNAFAU (2008-2010)"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span> {/* Dark text */}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Career */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="mb-12 relative"
            >
              <div className="absolute -left-12 sm:-left-16 top-0 w-7 h-7 sm:w-9 sm:h-9 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xs sm:text-base">3</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400">Professional Journey</h2> {/* Dark text */}
              <div className="bg-white dark:bg-gray-800 p-5 sm:p-7 rounded-xl shadow-sm hover:shadow-md dark:shadow-gray-700 dark:hover:shadow-gray-600 transition-all duration-300 border border-gray-100 dark:border-gray-700"> {/* Dark bg, shadow, border */}
                <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark text */}
                  Professor Rahman&apos;s career began with diverse roles including assistant cameraman at Chaitanya Movies, photo lab printer at Raja Deen Dayal & Sons,
                  and freelance fashion photographer for Impulse Advertising Agency. In 1992, he joined JNTU College of Fine Arts as a Lecturer, marking the beginning
                  of his academic career.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-purple-50 dark:bg-gray-700 p-5 rounded-xl"> {/* Dark bg */}
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-purple-700 dark:text-purple-300">Key Academic Positions</h3> {/* Dark text */}
                    <ul className="space-y-3 pl-1 text-gray-700 dark:text-gray-300"> {/* Dark text */}
                      {["Director of Academic and Planning", "Registrar of JNAFAU", "Controller of Examinations"].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-purple-50 dark:bg-gray-700 p-5 rounded-xl"> {/* Dark bg */}
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-purple-700 dark:text-purple-300">Departmental Roles</h3> {/* Dark text */}
                    <ul className="space-y-3 pl-1 text-gray-700 dark:text-gray-300"> {/* Dark text */}
                      {["Head of the Photography Department", "Special Officer for University Hostel", "Board of Studies Member"].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Photography Expertise */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="mb-12 relative"
            >
              <div className="absolute -left-12 sm:-left-16 top-0 w-7 h-7 sm:w-9 sm:h-9 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xs sm:text-base">4</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-amber-600 dark:text-amber-400">Photographic Journey</h2> {/* Dark text */}
              <div className="bg-white dark:bg-gray-800 p-5 sm:p-7 rounded-xl shadow-sm hover:shadow-md dark:shadow-gray-700 dark:hover:shadow-gray-600 transition-all duration-300 border border-gray-100 dark:border-gray-700"> {/* Dark bg, shadow, border */}
                <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark text */}
                  Coming from the tradition of small-format Analog Photography, Professor Rahman mastered black & white film processing and darkroom techniques.
                  When digital technology emerged in the early 1990s, he embraced the change, starting with the Sony Mavica Floppy Disk storage camera.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark text */}
                  Throughout his career, he developed expertise across multiple photography disciplines. His fine art photography explored abstract forms and textures,
                  while his documentary work captured the essence of everyday life across India. His landscape photography revealed his deep connection with nature,
                  while his architectural work preserved heritage structures for future generations.
                </p>
                <div className="mb-4 bg-amber-50 dark:bg-gray-700 p-5 rounded-xl"> {/* Dark bg */}
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-amber-700 dark:text-amber-300">Areas of Specialization</h3> {/* Dark text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { title: "Fine Art", desc: "Abstract compositions exploring form and texture" },
                      { title: "Documentary", desc: "Street life and cultural documentation" },
                      { title: "Landscape", desc: "Natural vistas and environmental studies" },
                      { title: "Architecture", desc: "Heritage structures and sacred spaces" },
                      { title: "Advertising", desc: "Commercial and product photography" },
                      { title: "Macro", desc: "Detailed studies of miniature subjects" }
                    ].map((item, index) => (
                      <div key={index} className="bg-amber-100 dark:bg-gray-600 p-3 rounded-lg hover:shadow-sm transition-shadow duration-300 h-full"> {/* Dark bg */}
                        <p className="font-medium text-amber-800 dark:text-amber-200">{item.title}</p> {/* Dark text */}
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{item.desc}</p> {/* Dark text */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Exhibitions and Achievements */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="mb-12 relative"
            >
              <div className="absolute -left-12 sm:-left-16 top-0 w-7 h-7 sm:w-9 sm:h-9 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xs sm:text-base">5</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-red-600 dark:text-red-400">Exhibitions and Recognition</h2> {/* Dark text */}
              <div className="bg-white dark:bg-gray-800 p-5 sm:p-7 rounded-xl shadow-sm hover:shadow-md dark:shadow-gray-700 dark:hover:shadow-gray-600 transition-all duration-300 border border-gray-100 dark:border-gray-700"> {/* Dark bg, shadow, border */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-red-700 dark:text-red-300 flex items-center"> {/* Dark text */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10zm-4.793-6.707a1 1 0 00-1.414-1.414L9 8.586 7.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clipRule="evenodd" />
                      </svg>
                      Notable Exhibitions
                    </h3>
                    <ul className="space-y-2 list-none text-gray-700 dark:text-gray-300"> {/* Dark text */}
                      {[
                        "\"Deccan Rock Forms\" - Group Exhibition in Kolkata (2000)",
                        "\"Nukkad\" - Solo Exhibition on Street Life of Calcutta (2001)",
                        "\"Heritage Structures of Hyderabad\" - Solo Exhibition (2006)",
                        "\"Colors of Rajasthan\" - Group Exhibition (2015)"
                      ].map((item, index) => (
                        <li key={index} className="p-2 bg-red-50 dark:bg-gray-700 rounded-md hover:bg-red-100 dark:hover:bg-gray-600 transition-colors duration-300">{item}</li> /* Dark bg */
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-red-700 dark:text-red-300 flex items-center"> {/* Dark text */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Awards and Recognition
                    </h3>
                    <ul className="space-y-2 list-none text-gray-700 dark:text-gray-300"> {/* Dark text */}
                      {[
                        "State Best Teacher Award from the Government of Andhra Pradesh (2012)",
                        "Young Teacher Award (BOLT) from Singapore Tourism Board & Air India",
                        "PESGCPC Grand Progress Award from PASCAL and GREEK School Photographic Club Cyprus (2019)"
                      ].map((item, index) => (
                        <li key={index} className="p-2 bg-red-50 dark:bg-gray-700 rounded-md hover:bg-red-100 dark:hover:bg-gray-600 transition-colors duration-300">{item}</li> /* Dark bg */
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* International Experience */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="mb-12 relative"
            >
              <div className="absolute -left-12 sm:-left-16 top-0 w-7 h-7 sm:w-9 sm:h-9 bg-indigo-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xs sm:text-base">6</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">International Experience</h2> {/* Dark text */}
              <div className="bg-white dark:bg-gray-800 p-5 sm:p-7 rounded-xl shadow-sm hover:shadow-md dark:shadow-gray-700 dark:hover:shadow-gray-600 transition-all duration-300 border border-gray-100 dark:border-gray-700"> {/* Dark bg, shadow, border */}
                <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark text */}
                  Professor Rahman conducted photography projects and workshops across multiple countries, bringing his expertise to international audiences and enriching his own work through global perspectives:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      country: "United Kingdom",
                      desc: "Visited Swansea Metropolitan University (2010) for academic collaboration and knowledge exchange"
                    },
                    {
                      country: "Sri Lanka",
                      desc: "Conducted workshops on Temple Architecture & Travel Photography, focusing on the cultural heritage of the island"
                    },
                    {
                      country: "Thailand",
                      desc: "Led workshops on Landscape & Travel Photography highlighting the techniques for capturing tropical landscapes"
                    },
                    {
                      country: "Nepal",
                      desc: "Documented ancient temples and mountain landscapes (2013), creating a visual archive of religious architecture"
                    },
                    {
                      country: "Saudi Arabia",
                      desc: "Conducted urban landscape photography project (2015) focusing on the contrast between traditional and modern architecture"
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg flex items-start group hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors duration-300"> {/* Dark bg */}
                      <div className="mr-3 mt-1 text-indigo-600 dark:text-indigo-400"> {/* Dark icon color */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-800 dark:group-hover:text-indigo-200 transition-colors duration-300">{item.country}</h3> {/* Dark text */}
                        <p className="text-gray-700 dark:text-gray-400 text-sm">{item.desc}</p> {/* Dark text */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Legacy */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -left-12 sm:-left-16 top-0 w-7 h-7 sm:w-9 sm:h-9 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xs sm:text-base">7</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-teal-600 dark:text-teal-400">Legacy and Impact</h2> {/* Dark text */}
              <div className="bg-white dark:bg-gray-800 p-5 sm:p-7 rounded-xl shadow-sm hover:shadow-md dark:shadow-gray-700 dark:hover:shadow-gray-600 transition-all duration-300 border border-gray-100 dark:border-gray-700"> {/* Dark bg, shadow, border */}
                <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark text */}
                  Throughout his career, Professor Rahman mentored numerous successful photographers and filmmakers. His students have excelled in various fields
                  including Film Making, Advertising, Television, Sports Photography, and Education.
                </p>
                <div className="mb-6 bg-teal-50 dark:bg-gray-700 p-4 rounded-lg"> {/* Dark bg */}
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-teal-700 dark:text-teal-300">Notable Alumni</h3> {/* Dark text */}
                  <div className="flex flex-wrap gap-2">
                    {["P G Vinda", "Srikanth Naroj", "Samala Bhaskar", "Acharya Venu", "Nachiket Katti (USA)"].map((name, index) => (
                      <span key={index} className="bg-teal-100 dark:bg-gray-600 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full hover:bg-teal-200 dark:hover:bg-gray-500 transition-colors duration-300">{name}</span> /* Dark bg, text */
                    ))}
                  </div>
                </div>
                <div className="p-5 sm:p-6 border-t border-gray-200 dark:border-gray-700 mt-4 text-center"> {/* Dark border */}
                  <p className="text-gray-700 dark:text-gray-400 italic"> {/* Dark text */}
                    Professor Shaik Khaleel-ur-Rahman passed away on May 25, 2021, leaving behind a rich legacy of photographic work, educational contributions, and
                    a lasting impact on the field of photography education in India. His work continues to inspire new generations of photographers and visual artists.
                  </p>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Back to top button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="sticky bottom-8 flex justify-center mt-12"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105" /* Dark bg */
              aria-label="Back to top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
  