import { z } from 'zod';
import { BaseProduct } from './models';

// Types de base
const drinkTypes = ['soda', 'water', 'juice', 'coffee', 'milkshake'] as const;
export type DrinkType = (typeof drinkTypes)[number];

// Schéma pour une taille
const DrinkSizeSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  volume: z.string().min(1, "Le volume est requis"),
  price: z.union([
    z.number().min(0, "Le prix doit être positif"),
    z.string().transform((val) => {
      const num = parseFloat(val.replace(',', '.'));
      if (isNaN(num) || num < 0) {
        throw new Error("Le prix doit être un nombre positif");
      }
      return num;
    })
  ]),
  isDefault: z.boolean()
});

// Schéma pour les informations nutritionnelles
const nutritionalInfoSchema = z.object({
  calories: z.number().min(0, "Les calories doivent être positives"),
  sugar: z.number().min(0, "Le sucre doit être positif"),
  servingSize: z.number().min(1, "La portion de référence est requise")
});

// Schéma principal pour les boissons
export const DrinkSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.enum(["soda", "water", "juice", "coffee", "milkshake"]),
  brand: z.string().optional(),
  image: z.union([
    z.string(),
    z.instanceof(File),
  ]).optional(),
  available: z.boolean(),
  price: z.union([
    z.number().min(0, "Le prix doit être positif"),
    z.string().transform((val) => {
      const num = parseFloat(val.replace(',', '.'));
      if (isNaN(num) || num < 0) {
        throw new Error("Le prix doit être un nombre positif");
      }
      return num;
    })
  ]).optional(),
  sizes: z.array(DrinkSizeSchema).min(1, "Au moins une taille est requise"),
  nutritionalInfo: nutritionalInfoSchema,
  allergens: z.array(z.string()).default([]),
});

// Types dérivés du schéma
export type DrinkInput = z.infer<typeof DrinkSchema>;
export type DrinkSize = z.infer<typeof DrinkSizeSchema>;
export type NutritionalInfo = z.infer<typeof nutritionalInfoSchema>;

// Interface complète pour une boisson
export interface Drink extends BaseProduct {
  _id: string;
  type: DrinkType;
  brand?: string;
  sizes: DrinkSize[];
  nutritionalInfo: NutritionalInfo;
  allergens: string[];
}

// Type pour les filtres
export interface DrinkFilters {
  type?: DrinkType;
  brand?: string;
  available?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}