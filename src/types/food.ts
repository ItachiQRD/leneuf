// types/food.ts
import { BaseProduct } from './models';
import { z } from 'zod';

// Types de base pour les aliments
export type FoodType = 'burger' | 'pizza' | 'salad' | 'sandwich_durum' | 'tacos' | 'bowls' | 'paninis' | 'plates' | 'tex_mex' | 'defsoce';
export type FoodCategory = 'bestseller' | 'new' | 'regular';
export type SpicyLevel = 'mild' | 'medium' | 'hot' | 'extra_hot';
export type ExtraCategory = 'protein' | 'vegetable' | 'cheese' | 'other';

// Constantes pour les options
export const FOOD_TYPES = [
  { value: 'burger', label: 'Burger' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'salad', label: 'Salade' },
  { value: 'sandwich_durum', label: 'Sandwich/Durum' },
  { value: 'tacos', label: 'Tacos' },
  { value: 'bowls', label: 'Bowls' },
  { value: 'paninis', label: 'Paninis' },
  { value: 'plates', label: 'Assiettes' },
  { value: 'tex_mex', label: 'Tex Mex' },
  { value: 'defsoce', label: 'Defsoces' }
] as const;

export const FOOD_CATEGORIES = [
  { value: 'bestseller', label: 'Best-seller' },
  { value: 'new', label: 'Nouveau' },
  { value: 'regular', label: 'Regular' }
] as const;

export const SPICY_LEVELS = [
  { value: 'mild', label: 'Doux' },
  { value: 'medium', label: 'Moyen' },
  { value: 'hot', label: 'Épicé' },
  { value: 'extra_hot', label: 'Très épicé' }
] as const;

export const EXTRA_CATEGORIES = [
  { value: 'protein', label: 'Protéine' },
  { value: 'vegetable', label: 'Légume' },
  { value: 'cheese', label: 'Fromage' },
  { value: 'other', label: 'Autre' }
] as const;

// Constantes pour les allergènes
export const COMMON_ALLERGENS = [
  { id: 'gluten', label: 'Gluten' },
  { id: 'crustaceans', label: 'Crustacés' },
  { id: 'eggs', label: 'Œufs' },
  { id: 'fish', label: 'Poisson' },
  { id: 'peanuts', label: 'Arachides' },
  { id: 'soy', label: 'Soja' },
  { id: 'milk', label: 'Lait' },
  { id: 'nuts', label: 'Fruits à coque' },
  { id: 'celery', label: 'Céleri' },
  { id: 'mustard', label: 'Moutarde' },
  { id: 'sesame', label: 'Sésame' },
  { id: 'sulphites', label: 'Sulfites' }
];

// Interface pour les informations nutritionnelles
export interface NutritionalInfo {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  servingSize: string;
}

// Interface pour les extras
export interface Extra {
  name: string;
  price: number;
  available: boolean;
  category: ExtraCategory;
}

// Interfaces pour les nouvelles catégories
export interface PizzaSize {
  name: string;
  price: number;
  diameter: string;
  isDefault: boolean;
}

export interface TacoSize {
  name: string;
  price: number;
  isDefault: boolean;
}

export interface TacoOption {
  category: string;
  name: string;
  price: number;
  available: boolean;
}

export interface TacoOptions {
  meats: TacoOption[];
  sauces: TacoOption[];
  cheeses: TacoOption[];
  supplements: TacoOption[];
}

export interface BowlMeat {
  name: string;
  price: number;
  available: boolean;
}

export interface PaniniAccompaniments {
  fries: boolean;
  drink?: string;
  drinkPrice: number;
}

export interface PlateAccompaniments {
  bread: boolean;
  fries: boolean;
  salad: boolean;
}

export interface DefsoceOptions {
  availableBases: string[];
  availableIngredients: string[];
  maxIngredients: number;
}

// Interface de base pour un plat
export interface FoodBase {
  _id?: string;
  name: string;
  description: string;
  price: number;
  type: FoodType;
  category: FoodCategory;
  image?: string | File;
  baseIngredients: string[];
  preparationTimeMinutes: number;
  available: boolean;
  nutritionalInfo: NutritionalInfo;
  extras: Extra[];
  maxSauces: number;
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  spicyLevel: SpicyLevel;
  active?: boolean;
  // Nouveaux champs pour les catégories étendues
  pizzaBase?: 'tomate' | 'creme_fraiche';
  pizzaSizes?: PizzaSize[];
  tacoSizes?: TacoSize[];
  tacoOptions?: TacoOptions;
  bowlMeats?: BowlMeat[];
  paniniAccompaniments?: PaniniAccompaniments;
  plateAccompaniments?: PlateAccompaniments;
  defsoceOptions?: DefsoceOptions;
}

export const FoodSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  price: z.number().min(0, 'Le prix doit être positif'),
  type: z.enum(['burger', 'pizza', 'salad', 'sandwich_durum', 'tacos', 'bowls', 'paninis', 'plates', 'tex_mex', 'defsoce'], {
    errorMap: () => ({ message: 'Type de plat invalide' })
  }),
  category: z.enum(['bestseller', 'new', 'regular'], {
    errorMap: () => ({ message: 'Catégorie invalide' })
  }),
  image: z.string({ required_error: 'L\'image est requise' }),
  baseIngredients: z.array(z.string()),
  preparationTimeMinutes: z.number().min(1, 'Le temps de préparation est requis'),
  available: z.boolean(),
  nutritionalInfo: z.object({
    calories: z.number(),
    proteins: z.number(),
    carbs: z.number(),
    fats: z.number(),
    servingSize: z.string()
  }),
  extras: z.array(z.object({
    name: z.string(),
    price: z.number(),
    available: z.boolean(),
    category: z.enum(['protein', 'vegetable', 'cheese', 'other'])
  })),
  maxSauces: z.number(),
  isVegan: z.boolean(),
  isVegetarian: z.boolean(),
  isGlutenFree: z.boolean(),
  allergens: z.array(z.string()),
  spicyLevel: z.enum(['mild', 'medium', 'hot', 'extra_hot']),
  active: z.boolean().optional()
});

// Type pour le formulaire
export type FoodFormData = Omit<FoodBase, '_id'>;

// Type pour l'API
export type FoodInputAPI = Omit<FoodBase, 'image'> & {
  image?: string;
};

// Type pour la réponse de l'API
export interface Food extends FoodBase {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type pour les filtres de recherche
export interface FoodFilters {
  type?: FoodType;
  category?: FoodCategory;
  spicyLevel?: SpicyLevel;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  maxPrice?: number;
  search?: string;
}