import Image from 'next/image';
import { useState, useEffect } from 'react';

// SVG placeholder as data URL - no external file needed
const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3EImage%3C/text%3E%3C/svg%3E`;

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
  fallback
}: SmartImageProps) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER_SVG);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setHasError(false);
      setIsLoading(true);
    } else {
      setImgSrc(PLACEHOLDER_SVG);
      setHasError(true);
      setIsLoading(false);
    }
  }, [src]);

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
    if (!hasError) {
      setHasError(true);
      // Use fallback if provided, otherwise use the inline SVG placeholder
      setImgSrc(fallback || PLACEHOLDER_SVG);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const optimalSrc = getOptimalImageSrc(imgSrc, width);

  // Si className contient w-full et h-full, utiliser fill pour un meilleur contrôle
  const useFill = className.includes('w-full') && className.includes('h-full');
  
  return (
    <div className={`relative overflow-hidden ${useFill ? 'w-full h-full' : className.includes('w-') || className.includes('h-') ? className : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      )}
      {useFill ? (
        <Image
          src={optimalSrc}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          quality={quality}
          onError={handleError}
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className.includes('object-contain') ? 'object-contain' : 'object-cover'} ${className.includes('object-center') ? 'object-center' : ''}`}
        />
      ) : width && height ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={optimalSrc}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            sizes={sizes}
            quality={quality}
            onError={handleError}
            onLoad={handleLoad}
            className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} max-w-full max-h-full ${className.includes('object-contain') ? 'object-contain' : 'object-cover'}`}
            style={{
              width: 'auto',
              height: 'auto',
            }}
          />
        </div>
      ) : (
        <Image
          src={optimalSrc}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          quality={quality}
          onError={handleError}
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className.includes('object-contain') ? 'object-contain' : 'object-cover'} ${className.includes('object-center') ? 'object-center' : ''}`}
        />
      )}
    </div>
  );
}
