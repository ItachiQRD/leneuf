import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  priority?: boolean;
}

export default function ProductImage({ 
  src, 
  alt, 
  fallback = '/images/placeholder-food.jpg',
  className = '',
  priority = false
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0.3 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-full"
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          priority={priority}
          onError={() => setImageSrc(fallback)}
          onLoad={() => setIsLoading(false)}
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 dark:border-gray-300"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
