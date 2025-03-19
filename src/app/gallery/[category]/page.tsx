import PhotoCard from '@/components/PhotoCard'

// This would typically come from your database or CMS
const mockPhotos = [
  {
    id: '1',
    src: '/placeholder-1.jpg',
    alt: 'Sample photo 1',
    title: 'Morning Light',
    description: 'Captured during sunrise'
  },
  {
    id: '2',
    src: '/placeholder-2.jpg',
    alt: 'Sample photo 2',
    title: 'Urban Landscape',
    description: 'City view at dusk'
  },
  // Add more mock photos as needed
]

export default function CategoryGallery({
  params
}: {
  params: { category: string }
}) {
  const { category } = params
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{categoryTitle} Photography</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPhotos.map((photo) => (
          <PhotoCard
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            title={photo.title}
            description={photo.description}
          />
        ))}
      </div>
    </div>
  )
} 