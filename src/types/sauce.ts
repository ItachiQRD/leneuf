// types/sauce.ts
import { z } from 'zod';
import { BaseProduct } from './models';

export type SauceCategory = 'mayo' | 'ketchup' | 'bbq' | 'special' | 'hot';
export type SpicyLevel = 'mild' | 'medium' | 'hot';

// Interface principale
export interface Sauce extends BaseProduct {
  type: SauceCategory;
  description: string;
  price: number;
  image: string | File;
  available: boolean;
  maxQuantity: number;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    servingSize: string;
  };
  spicyLevel: SpicyLevel;
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
}

const nutritionalInfoSchema = z.object({
  calories: z.number().min(0, "Les calories doivent être positives").or(z.string().transform(val => Number(val))),
  proteins: z.number().min(0, "Les protéines doivent être positives").or(z.string().transform(val => Number(val))),
  carbs: z.number().min(0, "Les glucides doivent être positifs").or(z.string().transform(val => Number(val))),
  fats: z.number().min(0, "Les lipides doivent être positifs").or(z.string().transform(val => Number(val))),
  servingSize: z.string()
});

export const sauceSchema = z.object({
  _id: z.string().optional(),
  type: z.enum(['mayo', 'ketchup', 'bbq', 'special', 'hot']),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit être plus détaillée"),
  price: z.number().min(0, "Le prix doit être positif").or(z.string().transform(val => Number(val))),
  image: z.string(),
  available: z.boolean().default(true),
  allergens: z.array(z.string()).default([]),
  nutritionalInfo: nutritionalInfoSchema,
  spicyLevel: z.enum(['mild', 'medium', 'hot']).default('mild')
});

// Interface pour la création/mise à jour
export interface SauceInput extends Omit<Sauce, '_id' | 'createdAt' | 'updatedAt' | 'active'> {
  _id?: string;
  image: string | File;
}

// Interface pour les filtres
export interface SauceFilters {
  type?: SauceCategory;
  spicyLevel?: SpicyLevel;
  available?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}

// Constantes pour les options des selects
export const SAUCE_CATEGORIES = [
  { value: 'mayo', label: 'Mayonnaise' },
  { value: 'ketchup', label: 'Ketchup' },
  { value: 'bbq', label: 'Barbecue' },
  { value: 'special', label: 'Spéciale' },
  { value: 'hot', label: 'Piquante' },
] as const;

export const SPICY_LEVELS = [
  { value: 'mild', label: 'Doux' },
  { value: 'medium', label: 'Moyen' },
  { value: 'hot', label: 'Piquant' },
] as const;

// Type pour le formulaire
export type SauceFormData = SauceInput;