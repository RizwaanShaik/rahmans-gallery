import Image from 'next/image'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Professor Rahman</h1>
        
        <div className="mb-12 relative w-full h-[400px]">
          <Image
            src="/placeholder-profile.jpg"
            alt="Professor Rahman"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="prose prose-lg mx-auto">
          <p className="text-xl mb-6">
            Professor Rahman was not just an educator but a visionary who saw the world through his lens, 
            capturing moments that told stories of life, nature, and human connection.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Legacy in Photography</h2>
          <p className="mb-6">
            Throughout his career as a professor of photography, he inspired countless students with his unique 
            perspective and technical expertise. His work spans across various genres, from breathtaking 
            landscapes to intimate portraits, each photograph telling its own story.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Teaching Philosophy</h2>
          <p className="mb-6">
            As an educator, Professor Rahman believed in the power of photography to connect people and 
            preserve moments in time. He taught his students not just the technical aspects of photography, 
            but how to see the world with new eyes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">This Gallery</h2>
          <p className="mb-6">
            This digital gallery serves as a tribute to his work and legacy, making his photographs 
            accessible to everyone who wishes to experience the world through his lens. The collection 
            showcases his diverse portfolio, organized into categories that reflect his various interests 
            and specialties.
          </p>
        </div>
      </div>
    </div>
  )
} 