import Image from 'next/image'

interface PhotoCardProps {
  src: string
  alt: string
  title: string
  description?: string
  onClick?: () => void
}

export default function PhotoCard({ src, alt, title, description, onClick }: PhotoCardProps) {
  return (
    <div 
      className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 p-4 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-gray-200">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
} 