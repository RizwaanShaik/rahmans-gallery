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
              Born on March 23, 1966, in Rantachintala, Guntur district, Professor Shaik Khaleel-ur-Rahman grew up in a middle-class family. 
              His father, Abdul Rahman, served as a Senior Accounts Officer in the A.G.&apos;s Office, Hyderabad. His early childhood was spent in the village, 
              where he completed his primary education before the family moved to Hyderabad, marking a significant transition from rural to urban life.
            </p>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Education</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Primary and Secondary Education: Completed primary education in the village and attended Sardar Vallabhbhai Patel Govt. High School, Asifnagar, Hyderabad (1981)</li>
              <li>Intermediate: Studied MPC subjects at G. Pulla Reddy Junior College, Vijayanagar Colony, Hyderabad (1981-1983)</li>
              <li>Diploma in Photography: JNTU College of Fine Arts (1983-1985)</li>
              <li>Bachelor of Commerce: New Science College, Ameerpet, Hyderabad (1986-1989)</li>
              <li>Master&apos;s in Journalism and Mass Communication: Madurai Kamaraj University (2000)</li>
              <li>Master of Fine Arts in Photography: JNAFAU (2009)</li>
            </ul>
          </section>

          {/* Career */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Career</h2>
            <p className="mb-4">
              Professor Rahman&apos;s career began as an assistant cameraman, photo lab printer, and event photographer. Despite opportunities in cinema, 
              he chose to focus on family commitments. His teaching journey began at JNTU College of Fine Arts in 1992, where he served as a Lecturer in Photography.
            </p>
            <p className="mb-4">
              Over the years, he held various administrative positions including Head of the Department, Special Officer for University Hostel, 
              Member of the Board of Studies, Controller of Examinations, and Registrar of the University. At the time of his passing, he was the 
              Director of Academic and Planning and Professor in Photography at JNAFAU College of Fine Arts.
            </p>
          </section>

          {/* Personal Life */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Personal Life</h2>
            <p className="mb-4">
              An extrovert and family-oriented person, Professor Rahman was passionate about travel and sports. During his college days, he was the 
              captain of the kabaddi team and a runner-up in javelin throw. His leadership qualities extended beyond sports, as he often took the 
              initiative in planning events and served as a bridge between different generations in his community.
            </p>
          </section>

          {/* Photography Interests and Achievements */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Photography Interests and Achievements</h2>
            <p className="mb-4">
              His photographic expertise spanned multiple genres including Fine Art, Travel Photography, Documentary Photography, Advertising Photography, 
              and Macro Photography. He participated in numerous exhibitions, including &ldquo;Deccan Rock Forms,&rdquo; &ldquo;Nukkad,&rdquo; &ldquo;Heritage Structures of Hyderabad,&rdquo; and &ldquo;Ragilo Rajasthan.&rdquo;
            </p>
            <p className="mb-4">
              His contributions were recognized with several awards, including the State Best Teacher Award from the Government of Andhra Pradesh (2012) 
              and the Young Teacher Award from the Singapore Tourism Board & Air India. He was an active member of the Telangana Photography Society, 
              Federation of Indian Photography, and Telangana Photography Akademy.
            </p>
          </section>

          {/* Travel and Projects */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Travel and Projects</h2>
            <p className="mb-4">
              His passion for photography took him across India and internationally to destinations including London, Sri Lanka, Nepal, Thailand, 
              and Saudi Arabia. He had planned future exhibitions featuring Ladakh, Mumbai, Kerala, Thailand, Sri Lanka, and London.
            </p>
          </section>

          {/* Legacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Legacy</h2>
            <p className="mb-4">
              Professor Shaik Khaleel-ur-Rahman passed away on May 25, 2021, leaving behind a rich legacy of photographic work and educational contributions. 
              His photographs continue to inspire and reflect his deep passion for capturing life&apos;s moments, while his dedication to teaching has shaped 
              countless careers in photography.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 