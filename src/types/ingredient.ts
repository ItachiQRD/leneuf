import { z } from 'zod';

export type IngredientType = 'meat' | 'cheese' | 'vegetable' | 'extra';
export type IngredientUsage = 'base' | 'extra' | 'both';

// Schéma pour les valeurs nutritionnelles
export const NutritionalInfoSchema = z.object({
  calories: z.number().min(0, 'Les calories doivent être positives'),
  proteins: z.number().min(0, 'Les protéines doivent être positives'),
  carbs: z.number().min(0, 'Les glucides doivent être positifs'),
  fats: z.number().min(0, 'Les lipides doivent être positifs'),
  fiber: z.number().min(0, 'Les fibres doivent être positives').optional(),
  sugar: z.number().min(0, 'Les sucres doivent être positifs').optional(),
  servingSize: z.number().min(0, 'La portion doit être positive').default(100), // en grammes
});

export type NutritionalInfo = z.infer<typeof NutritionalInfoSchema>;

export const IngredientSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional().default(''),
  type: z.enum(['meat', 'cheese', 'vegetable', 'extra']),
  price: z.number().min(0, 'Le prix doit être positif'),
  image: z.union([z.string(), z.instanceof(File)]).optional(),
  isAvailable: z.boolean().default(true),
  isSpicy: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
  allergens: z.array(z.string()).default([]),
  orderIndex: z.number().int().min(0).default(0),
});

export interface Ingredient {
  _id: string;
  name: string;
  description?: string;
  type: IngredientType;
  price: number;
  image: string;
  isAvailable: boolean;
  isSpicy: boolean;
  isVegetarian: boolean;
  allergens: string[];
  orderIndex: number;
  active: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Type pour la création d'un nouvel ingrédient
export type CreateIngredientData = z.infer<typeof IngredientSchema>;

// Type pour la mise à jour d'un ingrédient
export type UpdateIngredientData = Partial<CreateIngredientData>;

// Type pour le formulaire d'ingrédient
export type IngredientInput = z.infer<typeof IngredientSchema>;