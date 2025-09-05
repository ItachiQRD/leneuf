// schemas/sideSchema.ts
import { z } from 'zod';

const sizeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  price: z.number().min(0, 'Le prix doit être positif'),
  weight: z.string().min(1, 'Le poids est requis'),
  isDefault: z.boolean().optional()
});

const nutritionalInfoSchema = z.object({
  calories: z.number().min(0, 'Les calories doivent être positives'),
  proteins: z.number().min(0, 'Les protéines doivent être positives'),
  carbs: z.number().min(0, 'Les glucides doivent être positifs'),
  fats: z.number().min(0, 'Les lipides doivent être positifs'),
  servingSize: z.string().min(1, 'La taille de la portion est requise')
});

export const sideSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),
  
  category: z.enum(['fries', 'wings', 'onion_rings', 'salad', 'coleslaw'], {
    errorMap: () => ({ message: 'Catégorie invalide' })
  }),
  
  price: z.number()
    .min(0, 'Le prix doit être positif')
    .max(100, 'Le prix ne peut pas dépasser 100€'),
  
  image: z.string().url('L\'image doit être une URL valide'),
  
  available: z.boolean(),
  
  sizes: z.array(sizeSchema)
    .min(1, 'Au moins une taille est requise')
    .max(5, 'Maximum 5 tailles autorisées'),
  
  ingredients: z.array(z.string())
    .min(1, 'Au moins un ingrédient est requis'),
  
  allergens: z.array(z.string()),
  
  nutritionalInfo: nutritionalInfoSchema,
  
  spicyLevel: z.enum(['mild', 'medium', 'hot'])
    .optional(),
  
  vegetarian: z.boolean(),
  
  vegan: z.boolean(),
  
  preparationTime: z.number()
    .min(1, 'Le temps de préparation doit être d\'au moins 1 minute')
    .max(60, 'Le temps de préparation ne peut pas dépasser 60 minutes')
});

export type SideSchemaType = z.infer<typeof sideSchema>;