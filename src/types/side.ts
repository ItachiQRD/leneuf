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

export interface SideNutritionalInfo {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  servingSize: string; // ex: "100g"
}

// Interface principale
export interface Side extends BaseProduct {
  name: string;
  category: SideCategory;
  price: number;
  image: string | File;
  available: boolean;
  sizes: SideSize[];
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: SideNutritionalInfo;
  spicyLevel?: 'mild' | 'medium' | 'hot';
  vegetarian: boolean;
  vegan: boolean;
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
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: SideNutritionalInfo;
  spicyLevel?: 'mild' | 'medium' | 'hot';
  vegetarian: boolean;
  vegan: boolean;
  preparationTime: number;
}

// Interface pour les filtres de recherche
export interface SideFilters {
  category?: SideCategory;
  vegetarian?: boolean;
  vegan?: boolean;
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

export const nutritionalInfoSchema = z.object({
  calories: z.number().min(0, "Les calories doivent être positives"),
  proteins: z.number().min(0, "Les protéines doivent être positives"),
  carbs: z.number().min(0, "Les glucides doivent être positifs"),
  fats: z.number().min(0, "Les lipides doivent être positifs"),
  servingSize: z.string().min(1, "La taille de la portion est requise"),
});

export const sideSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  category: z.enum(['fries', 'wings', 'onion_rings', 'salad', 'coleslaw']),
  price: z.number().min(0, "Le prix doit être positif"),
  image: z.union([z.string(), z.instanceof(File)]),
  available: z.boolean(),
  sizes: z.array(sizeSchema),
  ingredients: z.array(z.string()),
  nutritionalInfo: nutritionalInfoSchema,
  spicyLevel: z.enum(['mild', 'medium', 'hot']).optional(),
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