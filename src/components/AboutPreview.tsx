import Link from 'next/link';

export default function AboutPreview() {
  return (
    <div className="bg-white dark:bg-gray-900"> {/* Add this wrapper */}
      <div className="container mx-auto px-4 py-12"> {/* Added py-12 for vertical padding */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            About Professor Rahman
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8">
            Professor Shaik Khaleel-ur-Rahman was a distinguished photographer and educator who dedicated his life to the art of photography. 
            As the Director of Academic and Planning at JNAFAU College of Fine Arts, he inspired countless students with his unique perspective 
            and technical expertise.
          </p>
          <Link
  href="/about"
  className="inline-block bg-gray-900 dark:bg-gray-800 text-white px-8 py-3 rounded-lg 
             border border-gray-700 dark:border-gray-500
             hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors text-lg font-medium"
>
  Read Full Biography
</Link>

        </div>
      </div>
    </div>
  );
}