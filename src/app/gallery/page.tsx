import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 'architecture',
    title: 'Architecture',
    description: 'Structural beauty and urban landscapes',
    image: '/images/architecture/hero/hero.jpeg',
  },
  {
    id: 'air-show',
    title: 'Air Show',
    description: 'Spectacular aerial displays and aircraft',
    image: '/images/airshow/hero/hero.jpeg',
  },
  {
    id: 'b-and-w',
    title: 'Black & White',
    description: 'Monochrome photography',
    image: '/images/bandw/hero/hero.jpeg',
  },
  {
    id: 'bidar',
    title: 'Bidar',
    description: 'Scenes from Bidar',
    image: '/images/bidar/hero/hero.jpeg',
  },
  {
    id: 'clouds',
    title: 'Clouds',
    description: 'Cloud formations and skyscapes',
    image: '/images/Clouds/hero/hero.jpeg',
  },
  {
    id: 'featured',
    title: 'Featured',
    description: 'Featured photographs',
    image: '/images/Featured/hero/hero.jpeg',
  },
  {
    id: 'festivals',
    title: 'Festivals',
    description: 'Cultural celebrations and festivals',
    image: '/images/Festivals/hero/hero.jpeg',
  },
  {
    id: 'hampi',
    title: 'Hampi',
    description: 'Ancient ruins and landscapes of Hampi',
    image: '/images/Hampi/hero/hero.jpeg',
  },
  {
    id: 'heritage',
    title: 'Heritage',
    description: 'Historical and cultural heritage sites',
    image: '/images/heritage/hero/hero.jpeg',
  },
  {
    id: 'hyderabad',
    title: 'Hyderabad',
    description: 'City of pearls and its culture',
    image: '/images/Hyderabad/hero/hero.jpeg',
  },
  {
    id: 'kanhari-caves',
    title: 'Kanhari Caves',
    description: 'Ancient cave systems and rock-cut architecture',
    image: '/images/kanharicaves/hero/hero.jpeg',
  },
  {
    id: 'kolkata-streets',
    title: 'Kolkata Streets 2001',
    description: 'Street photography from Kolkata',
    image: '/images/kolkatastreets2001/hero/hero.jpeg',
  },
  {
    id: 'landscapes',
    title: 'Landscapes',
    description: 'Natural and urban landscapes',
    image: '/images/landscapes/hero/hero.jpeg',
  },
  {
    id: 'ladakh',
    title: 'Ladakh',
    description: 'The land of high passes',
    image: '/images/Ladakh/hero/hero.jpeg',
  },
  {
    id: 'lanka',
    title: 'Lanka',
    description: 'Scenes from Sri Lanka',
    image: '/images/lanka/hero/hero.jpeg',
  },
  {
    id: 'lockdown',
    title: 'Lockdown',
    description: 'Photography during lockdown',
    image: '/images/lockdown/hero/hero.jpeg',
  },
  {
    id: 'london',
    title: 'London',
    description: 'Streets and life in London',
    image: '/images/london/hero/hero.jpeg',
  },
  {
    id: 'macro',
    title: 'Macro',
    description: 'Close-up and macro photography',
    image: '/images/Macro/hero/hero.jpeg',
  },
  {
    id: 'rachakonda',
    title: 'Rachakonda',
    description: 'Scenes from Rachakonda',
    image: '/images/Rachakonda/hero/hero.jpeg',
  },
  {
    id: 'rajasthan',
    title: 'Rajasthan',
    description: 'The land of kings',
    image: '/images/rajasthan/hero/hero.jpeg',
  },
  {
    id: 'rock-forms',
    title: 'Rock Forms',
    description: 'Natural rock formations',
    image: '/images/rockforms/hero/hero.jpeg',
  },
  {
    id: 'tadoba',
    title: 'Tadoba',
    description: 'Wildlife and nature from Tadoba',
    image: '/images/tadoba/hero/hero.jpeg',
  },
  {
    id: 'thai',
    title: 'Thailand',
    description: 'Scenes from Thailand',
    image: '/images/thai/hero/hero.jpeg',
  },
  {
    id: 'tombs',
    title: 'Tombs',
    description: 'Historical tombs and monuments',
    image: '/images/tombs/hero/hero.jpeg',
  },
  {
    id: 'warangal',
    title: 'Warangal',
    description: 'Heritage and culture of Warangal',
    image: '/images/warangal/hero/hero.jpeg',
  },
  {
    id: 'wildlife',
    title: 'Wildlife',
    description: 'Wildlife photography',
    image: '/images/wildlife/hero/hero.jpeg',
  }
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
