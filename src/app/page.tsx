import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {
    id: 'nature',
    title: 'Nature Photography',
    description: 'Capturing the beauty of landscapes and wildlife',
    image: '/images/random.jpg'
  },
  {
    id: 'portrait',
    title: 'Portraits',
    description: 'Human expressions and emotions',
    image: '/images/random.jpg'
  },
  {
    id: 'architecture',
    title: 'Architecture',
    description: 'Structural beauty and urban landscapes',
    image: '/images/random.jpg'
  },
  {
    id: 'abstract',
    title: 'Abstract',
    description: 'Artistic and conceptual photography',
    image: '/images/random.jpg'
  }
]

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Professor Rahman&apos;s Photography
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          A curated collection of photographs capturing moments of beauty, emotion, and wonder through the lens of a passionate photographer and educator.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 py-12">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/gallery/${category.id}`}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-w-16 aspect-h-9 relative">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 z-10" />
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <p className="text-sm text-gray-200">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* About Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">About Professor Rahman</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          This gallery is dedicated to preserving and sharing the photographic legacy of Professor Rahman, 
          who captured life&apos;s beautiful moments through his lens until 2021. His work continues to inspire 
          and touch hearts through this digital collection.
        </p>
      </section>
    </div>
  )
}
