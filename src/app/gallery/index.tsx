import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 'nature',
    title: 'Nature Photography',
    description: 'Capturing the beauty of landscapes and wildlife',
    image: '/images/random.jpg', // Ensure this image exists
  },
  {
    id: 'portrait',
    title: 'Portraits',
    description: 'Human expressions and emotions',
    image: '/images/random.jpg',
  },
  {
    id: 'architecture',
    title: 'Architecture',
    description: 'Structural beauty and urban landscapes',
    image: '/images/random.jpg',
  },
  {
    id: 'abstract',
    title: 'Abstract',
    description: 'Artistic and conceptual photography',
    image: '/images/random.jpg',
  },
];

export default function Gallery() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/gallery/${category.id}`} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full mb-4">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
            <p className="text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 