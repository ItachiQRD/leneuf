import Image from 'next/image';
import { useState } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fallback?: string;
}

export default function SmartImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 90,
  fallback = '/images/placeholder.jpg'
}: SmartImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour déterminer la meilleure taille d'image à utiliser
  const getOptimalImageSrc = (originalSrc: string, targetWidth?: number) => {
    if (!originalSrc) return fallback;

    // Si c'est une image uploadée avec des variantes
    if (originalSrc.includes('/uploads/') && originalSrc.includes('-')) {
      const baseUrl = originalSrc.replace(/-(large|medium|thumbnail)\.webp$/, '');
      
      // Choisir la taille selon la largeur cible
      if (targetWidth) {
        if (targetWidth <= 300) {
          return `${baseUrl}-thumbnail.webp`;
        } else if (targetWidth <= 600) {
          return `${baseUrl}-medium.webp`;
        } else {
          return `${baseUrl}-large.webp`;
        }
      }
      
      // Par défaut, utiliser la version large
      return `${baseUrl}-large.webp`;
    }

    // Si c'est une image simple, la retourner telle quelle
    return originalSrc;
  };

  const handleError = () => {
    setImgSrc(fallback);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const optimalSrc = getOptimalImageSrc(imgSrc, width);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={optimalSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        sizes={sizes}
        quality={quality}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          width: 'auto',
          height: 'auto',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}
