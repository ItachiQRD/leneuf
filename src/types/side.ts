// types/side.ts
import { BaseProduct, MongoId } from './models';
import { z } from 'zod';

export type SideCategory = 'fries' | 'wings' | 'onion_rings' | 'salad' | 'coleslaw';

export interface SideSize {
  name: string;
  price: number;
  weight: string; // ex: "150g"
  isDefault?: boolean;
}


// Interface principale
export interface Side extends BaseProduct {
  name: string;
  category: SideCategory;
  price: number;
  image: string | File;
  available: boolean;
  sizes: SideSize[];
  preparationTime: number;
  active: boolean;
}

// Interface pour la création/mise à jour
export interface SideInput extends Omit<Side, '_id' | 'createdAt' | 'updatedAt' | 'active'> {
  name: string;
  category: SideCategory;
  price: number;
  image: string | File;
  available: boolean;
  sizes: SideSize[];
  preparationTime: number;
}

// Interface pour les filtres de recherche
export interface SideFilters {
  category?: SideCategory;
  available?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}

// Schémas de validation
export const sizeSchema = z.object({
  name: z.string().min(1, "Le nom de la taille est requis"),
  price: z.number().min(0, "Le prix doit être positif"),
  weight: z.string().min(1, "Le poids est requis"),
  isDefault: z.boolean().optional(),
});


export const sideSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  category: z.enum(['fries', 'wings', 'onion_rings', 'salad', 'coleslaw']),
  price: z.number().min(0, "Le prix doit être positif"),
  image: z.union([z.string(), z.instanceof(File)]),
  available: z.boolean(),
  sizes: z.array(sizeSchema),
  preparationTime: z.number().min(1, "Le temps de préparation est requis"),
});

// Constantes pour les options des selects
export const SIDE_CATEGORIES = [
  { value: 'fries', label: 'Frites' },
  { value: 'wings', label: 'Ailes de poulet' },
  { value: 'onion_rings', label: 'Beignets d\'oignon' },
  { value: 'salad', label: 'Salade' },
  { value: 'coleslaw', label: 'Coleslaw' },
] as const;

// Type pour le formulaire
export type SideFormData = SideInput;