// src/components/common/AnimatedImage.tsx
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
  };
  priority?: boolean;
}

export default function AnimatedImage({
  src,
  alt,
  className = '',
  sizes,
  priority = false
}: AnimatedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Détermine la meilleure source d'image
  const imageSrc = sizes ? sizes.large || sizes.medium || sizes.thumbnail || src : src;
  const thumbnailSrc = sizes?.thumbnail || src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="placeholder"
            className="absolute inset-0 bg-gray-100 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {isError && (
          <motion.div
            key="error"
            className="absolute inset-0 bg-red-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-red-500">Erreur de chargement</span>
          </motion.div>
        )}

        <motion.div
          key="image"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            onLoadStart={() => {
              setIsLoading(true);
              setIsError(false);
            }}
            onLoad={() => {
              setIsLoading(false);
              setIsError(false);
            }}
            onError={() => {
              setIsLoading(false);
              setIsError(true);
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}