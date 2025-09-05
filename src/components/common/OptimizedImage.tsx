import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallback?: string;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  fallback = '/images/placeholder.jpg',
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(fallback);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Préchargement de l'image
    const img = new window.Image();
    img.src = src as string;
    
    img.onload = () => {
      setCurrentSrc(src as string);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <Image
          {...props}
          src={currentSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          quality={75}
          priority={props.priority || false}
          sizes={props.sizes || '100vw'}
          onError={() => setError(true)}
        />
        
        {isLoading && (
          <div className="absolute inset-0 bg-surface animate-pulse" />
        )}
        
        {error && (
          <div className="absolute inset-0 bg-error/10 flex items-center justify-center">
            <span className="text-error">Erreur de chargement</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}