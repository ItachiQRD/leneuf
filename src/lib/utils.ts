import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Fonction pour fusionner les classes Tailwind de manière intelligente
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formater un prix
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

// Formater une date
export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(date));
};

// Delay async function
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour tronquer un texte
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Fonction pour générer un slug
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Valider une URL
export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Deep merge d'objets
export const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
    const result = { ...target };
  
    Object.keys(source).forEach(key => {
      const sourceValue = source[key as keyof T];
      const targetValue = target[key as keyof T];
  
      if (
        sourceValue &&
        targetValue &&
        typeof sourceValue === 'object' &&
        typeof targetValue === 'object' &&
        !Array.isArray(sourceValue) &&
        !Array.isArray(targetValue)
      ) {
        result[key as keyof T] = deepMerge(targetValue, sourceValue as any);
      } else if (sourceValue !== undefined) {
        result[key as keyof T] = sourceValue as T[keyof T];
      }
    });
  
    return result;
  };