import Image from 'next/image';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Prof. S. K. Rahman</h1>
        
        {/* Image Container */}
        <div className="mb-12 relative w-[280px] h-[350px] sm:w-[300px] sm:h-[400px] mx-auto">
          <div className="relative w-full h-full overflow-hidden rounded-[50%] shadow-xl">
            <Image
              src="/images/about/thumbnails/IMG_0020.jpeg"
              alt="Professor Shaik Khaleel-ur-Rahman"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 280px, 300px"
              priority
            />
          </div>
        </div>

        <div className="prose prose-lg mx-auto">
          {/* Early Life */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Early Life</h2>
            <p className="mb-4">
              Born on March 23, 1966, in Rantachintala, Guntur district, Professor Shaik Khaleel-ur-Rahman spent his formative years in his village, 
              where he developed a deep love for nature and rural surroundings. His father, Abdul Rahman, served as a Senior Accounts Officer in the A.G.&apos;s Office, Hyderabad. 
              The family&apos;s move from their peaceful rural setting to the bustling city of Hyderabad marked a significant transition in young Rahman&apos;s life.
            </p>
            <p className="mb-4">
              During his teenage years, his father would give him 10 rupees on Sundays to watch movies independently, fostering a love for visual storytelling through films 
              like Bruce Lee, James Bond, and Indiana Jones. This early exposure to cinema would later influence his photographic style and storytelling approach.
            </p>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Education and Early Career</h2>
            <p className="mb-4">
              After completing his Intermediate education in MPC (Mathematics, Physics, Chemistry), Rahman chose to diverge from conventional paths, 
              pursuing photography at JNTU College of Fine Arts. This decision, though initially shocking to his family, would prove transformative. 
              His educational journey includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Diploma in Photography from JNTU College of Fine Arts (1983-1985)</li>
              <li>Bachelor of Commerce from Osmania University (1986-1989)</li>
              <li>Master&apos;s in Journalism and Mass Communication from Madurai Kamaraj University (2000)</li>
              <li>Master of Fine Arts in Photography from JNAFAU (2008-2010)</li>
            </ul>
          </section>

          {/* Career */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Professional Journey</h2>
            <p className="mb-4">
              Professor Rahman&apos;s career began with diverse roles including assistant cameraman at Chaitanya Movies, photo lab printer at Raja Deen Dayal & Sons, 
              and freelance fashion photographer for Impulse Advertising Agency. In 1992, he joined JNTU College of Fine Arts as a Lecturer, marking the beginning 
              of his academic career.
            </p>
            <p className="mb-4">
              Throughout his 27-year tenure, he has held numerous key positions including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Director of Academic and Planning</li>
              <li>Registrar of JNAFAU</li>
              <li>Controller of Examinations</li>
              <li>Head of the Photography Department</li>
              <li>Special Officer for University Hostel</li>
              <li>Board of Studies Member at JNAFAU and Osmania University</li>
            </ul>
          </section>

          {/* Photography Expertise */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Photographic Journey</h2>
            <p className="mb-4">
              Coming from the tradition of small-format Analog Photography, Professor Rahman mastered black & white film processing and darkroom techniques. 
              When digital technology emerged in the early 1990s, he embraced the change, starting with the Sony Mavica Floppy Disk storage camera.
            </p>
            <p className="mb-4">
              His photographic expertise spans multiple genres:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fine Art Photography</li>
              <li>Travel and Documentary Photography</li>
              <li>Landscape Photography</li>
              <li>Architectural Photography</li>
              <li>Advertising Photography</li>
              <li>Macro Photography</li>
            </ul>
          </section>

          {/* Exhibitions and Achievements */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Exhibitions and Recognition</h2>
            <p className="mb-4">Notable exhibitions include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>&ldquo;Deccan Rock Forms&rdquo; - Group Exhibition in Kolkata (2000)</li>
              <li>&ldquo;Nukkad&rdquo; - Solo Exhibition on Street Life of Calcutta (2001)</li>
              <li>&ldquo;Heritage Structures of Hyderabad&rdquo; - Solo Exhibition (2006)</li>
              <li>&ldquo;Colors of Rajasthan&rdquo; - Group Exhibition (2015)</li>
            </ul>
            <p className="mt-4 mb-4">Awards and Recognition:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>State Best Teacher Award from the Government of Andhra Pradesh (2012)</li>
              <li>Young Teacher Award (BOLT) from Singapore Tourism Board & Air India</li>
              <li>PESGCPC Grand Progress Award from PASCAL and GREEK School Photographic Club Cyprus (2019)</li>
            </ul>
          </section>

          {/* International Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">International Experience</h2>
            <p className="mb-4">
              Professor Rahman has conducted photography projects and workshops across multiple countries including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>United Kingdom - Visited Swansea Metropolitan University (2010) for academic collaboration</li>
              <li>Sri Lanka - Conducted workshops on Temple Architecture & Travel Photography</li>
              <li>Thailand - Led workshops on Landscape & Travel Photography</li>
              <li>Nepal and Saudi Arabia - Photography documentation projects</li>
            </ul>
          </section>

          {/* Legacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Legacy and Impact</h2>
            <p className="mb-4">
              Throughout his career, Professor Rahman has mentored numerous successful photographers and filmmakers. His students have excelled in various fields 
              including Film Making, Advertising, Television, Sports Photography, and Education. Notable alumni include P G Vinda, Srikanth Naroj, Samala Bhaskar, 
              Acharya Venu, and Nachiket Katti (USA).
            </p>
            <p className="mb-4">
              Professor Shaik Khaleel-ur-Rahman passed away on May 25, 2021, leaving behind a rich legacy of photographic work, educational contributions, and 
              a lasting impact on the field of photography education in India. His work continues to inspire new generations of photographers and visual artists.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 