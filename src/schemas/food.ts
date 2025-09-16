import { z } from 'zod';
import { FoodType, FoodCategory, SpicyLevel } from '@/types/food';

// Schéma pour les informations nutritionnelles
const NutritionalInfoSchema = z.object({
  calories: z.number().min(0, 'Les calories doivent être positives'),
  proteins: z.number().min(0, 'Les protéines doivent être positives'),
  carbs: z.number().min(0, 'Les glucides doivent être positifs'),
  fats: z.number().min(0, 'Les lipides doivent être positifs'),
  servingSize: z.string().min(1, 'La portion doit être spécifiée')
}).partial();

// Schéma pour les extras
const ExtraSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  price: z.number().min(0, 'Le prix doit être positif'),
  maxQuantity: z.number().int().min(1, 'La quantité maximale doit être au moins 1'),
  category: z.enum(['protein', 'vegetable', 'cheese', 'other'] as const)
});

// Schéma principal pour les plats
export const FoodSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  type: z.enum(['burger', 'pizza', 'salad', 'sandwich_durum'] as const),
  price: z.number().min(0, 'Le prix doit être positif'),
  image: z.union([z.string(), z.instanceof(File)]),
  available: z.boolean(),
  preparationTimeMinutes: z.number().int().min(1, 'Le temps de préparation doit être au moins 1 minute'),
  category: z.enum(['bestseller', 'new', 'regular'] as const),
  baseIngredients: z.array(z.string()).min(1, 'Au moins un ingrédient est requis'),
  active: z.boolean().optional(),
  description: z.string().optional()
});

// Schéma pour la mise à jour (plus flexible)
export const FoodUpdateSchema = FoodSchema.partial().extend({
  _id: z.string().optional()
});
