// types/dessert.ts
import { z } from 'zod';
import { BaseProduct } from './models';

export type DessertType = 'cake' | 'ice_cream' | 'cookie' | 'brownie' | 'muffin';

interface Size {
  name: string;
  price: number;
  isDefault: boolean;
}

export interface Dessert {
  _id: string;
  name: string;
  type: DessertType;
  price: number;
  image: string;
  available: boolean;
  active: boolean;
  sizes: Size[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour la création/mise à jour
export type DessertInput = Omit<Dessert, '_id' | 'createdAt' | 'updatedAt'> & {
  image: string | File;
};

// Interface pour les filtres
export interface DessertFilters {
  type?: DessertType;
  available?: boolean;
}

// Schéma de validation
export const sizeSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  price: z.number().min(0, "Le prix doit être positif"),
  isDefault: z.boolean().default(false),
});

export const dessertSchema = z.object({
  type: z.enum(['cake', 'ice_cream', 'cookie', 'brownie', 'muffin'], {
    required_error: "Le type de dessert est requis",
    invalid_type_error: "Type de dessert invalide"
  }),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  price: z.number().min(0, "Le prix doit être positif"),
  image: z.string().min(1, "L'image est requise"),
  available: z.boolean().default(true),
  active: z.boolean().default(true),
  sizes: z.array(sizeSchema).default([]),
}).refine((data) => {
  if (data.sizes.length === 0) return true;
  // Vérifier qu'il n'y a qu'une seule taille par défaut si des tailles sont présentes
  const defaultSizes = data.sizes.filter(size => size.isDefault);
  return defaultSizes.length <= 1;
}, {
  message: "Il ne peut y avoir qu'une seule taille par défaut",
  path: ["sizes"]
});

// Constantes pour les options des selects
export const DESSERT_TYPES = [
  { value: 'cake', label: 'Gâteau' },
  { value: 'ice_cream', label: 'Glace' },
  { value: 'cookie', label: 'Cookie' },
  { value: 'brownie', label: 'Brownie' },
  { value: 'muffin', label: 'Muffin' }
] as const;

// Type pour le formulaire
export type DessertFormData = DessertInput;