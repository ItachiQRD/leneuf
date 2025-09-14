import { useState, useEffect } from 'react';

interface UseImageOptimizationProps {
  src: string;
  targetWidth?: number;
  fallback?: string;
}

interface ImageVariants {
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}

export function useImageOptimization({ 
  src, 
  targetWidth = 800, 
  fallback = '/images/placeholder.jpg' 
}: UseImageOptimizationProps) {
  const [optimizedSrc, setOptimizedSrc] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setOptimizedSrc(fallback);
      setIsLoading(false);
      return;
    }

    // Si c'est une image uploadée avec des variantes
    if (src.includes('/uploads/') && src.includes('-')) {
      const baseUrl = src.replace(/-(large|medium|thumbnail)\.webp$/, '');
      
      // Choisir la taille optimale selon la largeur cible
      let selectedVariant: string;
      if (targetWidth <= 300) {
        selectedVariant = `${baseUrl}-thumbnail.webp`;
      } else if (targetWidth <= 600) {
        selectedVariant = `${baseUrl}-medium.webp`;
      } else {
        selectedVariant = `${baseUrl}-large.webp`;
      }

      setOptimizedSrc(selectedVariant);
    } else {
      // Image simple, utiliser telle quelle
      setOptimizedSrc(src);
    }

    setIsLoading(false);
  }, [src, targetWidth, fallback]);

  // Fonction pour obtenir toutes les variantes d'une image
  const getImageVariants = (imageSrc: string): ImageVariants | null => {
    if (!imageSrc.includes('/uploads/') || !imageSrc.includes('-')) {
      return null;
    }

    const baseUrl = imageSrc.replace(/-(large|medium|thumbnail)\.webp$/, '');
    
    return {
      thumbnail: `${baseUrl}-thumbnail.webp`,
      medium: `${baseUrl}-medium.webp`,
      large: `${baseUrl}-large.webp`,
      original: imageSrc
    };
  };

  // Fonction pour précharger les variantes
  const preloadVariants = (imageSrc: string) => {
    const variants = getImageVariants(imageSrc);
    if (!variants) return;

    Object.values(variants).forEach(variant => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = variant;
      document.head.appendChild(link);
    });
  };

  return {
    optimizedSrc,
    isLoading,
    error,
    variants: getImageVariants(src),
    preloadVariants: () => preloadVariants(src),
    retry: () => {
      setError(false);
      setIsLoading(true);
    }
  };
}
