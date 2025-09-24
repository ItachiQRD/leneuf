// types/food.ts
import { BaseProduct } from './models';
import { z } from 'zod';

// Types de base pour les aliments
export type FoodType = 'burger' | 'pizza' | 'salad' | 'sandwich_durum' | 'paninis' | 'plates' | 'kids_menu' | 'small_hunger';
export type FoodCategory = 'bestseller' | 'new' | 'regular';
export type SpicyLevel = 'mild' | 'medium' | 'hot' | 'extra_hot';

// Constantes pour les options
export const FOOD_TYPES = [
  { value: 'burger', label: 'Burger' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'salad', label: 'Salade' },
  { value: 'sandwich_durum', label: 'Sandwich/Durum' },
  { value: 'paninis', label: 'Paninis' },
  { value: 'plates', label: 'Assiettes' },
  { value: 'kids_menu', label: 'Menu Enfants' },
  { value: 'small_hunger', label: 'P\'tite Faim' }
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


// Interface de base pour un plat
export interface FoodBase {
  _id?: string;
  name: string;
  price?: number; // Optionnel pour les pizzas
  type: FoodType;
  category: FoodCategory;
  image?: string | File;
  baseIngredients: string[];
  preparationTimeMinutes: number;
  available: boolean;
  nutritionalInfo: NutritionalInfo;
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  spicyLevel: SpicyLevel;
  active?: boolean;
}

export const FoodSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  price: z.number().min(0, 'Le prix doit être positif'),
  type: z.enum(['burger', 'pizza', 'salad', 'sandwich_durum', 'paninis', 'plates', 'kids_menu', 'small_hunger']),
  category: z.enum(['bestseller', 'new', 'regular']),
  image: z.string(),
  baseIngredients: z.array(z.string()),
  preparationTimeMinutes: z.number().min(1, 'Le temps de préparation est requis'),
  available: z.boolean(),
  nutritionalInfo: z.object({
    calories: z.number().min(0),
    proteins: z.number().min(0),
    carbs: z.number().min(0),
    fats: z.number().min(0),
    servingSize: z.string()
  }),
  isVegan: z.boolean(),
  isVegetarian: z.boolean(),
  isGlutenFree: z.boolean(),
  allergens: z.array(z.string()),
  spicyLevel: z.enum(['mild', 'medium', 'hot', 'extra_hot'])
});

// Type pour le formulaire
export type FoodFormData = Omit<FoodBase, '_id'>;

// Type pour l'API (simplifié)
export type FoodInputAPI = {
  _id?: string;
  name: string;
  type: FoodType;
  price: number;
  image: string | File;
  available: boolean;
  preparationTimeMinutes: number;
  category: FoodCategory;
  baseIngredients: string[];
  active?: boolean;
  description?: string;
};

// Type pour la réponse de l'API
export interface Food extends FoodBase {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  // Champs optionnels spécifiques
  pizzaBase?: string;
  pizzaSizes?: Array<{
    name: string;
    price: number;
    diameter: string;
    isDefault: boolean;
  }>;
  paniniAccompaniments?: {
    fries: boolean;
    drink?: string;
    drinkPrice: number;
  };
  plateAccompaniments?: {
    bread: boolean;
    fries: boolean;
    salad: boolean;
  };
  includesSurprise?: boolean;
  includesCaprisun?: boolean;
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