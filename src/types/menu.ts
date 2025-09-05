import { z } from 'zod';
import { BaseProduct } from './models';

// Types de base
export type MenuType = 'combo' | 'promotion' | 'family' | 'couple' | 'senior' | 'trio' | 'kids';
export type MenuItemType = 'food' | 'drink' | 'side' | 'dessert';

// Schéma pour un article de menu
const MenuItemSchema = z.object({
  productType: z.enum(['food', 'drink', 'side', 'dessert']),
  productId: z.string().min(1, "L'ID du produit est requis"),
  quantity: z.number().min(1, "La quantité doit être au moins 1"),
  size: z.string().optional(),
  variant: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  price: z.number().min(0, "Le prix doit être positif")
});

// Schéma principal pour les menus
export const MenuSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.number().min(0, "Le prix doit être positif"),
  type: z.enum(['combo', 'promotion', 'family', 'couple', 'senior', 'trio', 'kids']),
  items: z.array(MenuItemSchema).min(1, "Au moins un article est requis"),
  image: z.string().min(1, "L'image est requise"),
  available: z.boolean().default(true),
  active: z.boolean().default(true),
  validUntil: z.date().optional(),
  minOrderValue: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional(),
  isPromotion: z.boolean().default(false),
  originalPrice: z.number().min(0).optional(),
  savings: z.number().min(0).optional(),
  includesFries: z.boolean().default(false),
  includesDrink: z.boolean().default(false),
  drinkSize: z.enum(['33cl', '1.5L']).optional(),
  includesDessert: z.boolean().default(false),
  isKidsMenu: z.boolean().default(false),
  surprise: z.string().optional()
});

// Types dérivés du schéma
export type MenuInput = z.infer<typeof MenuSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;

// Interface complète pour un menu
export interface Menu extends BaseProduct {
  _id: string;
  type: MenuType;
  items: MenuItem[];
  validUntil?: Date;
  minOrderValue?: number;
  discount?: number;
  isPromotion: boolean;
  originalPrice?: number;
  savings?: number;
  includesFries: boolean;
  includesDrink: boolean;
  drinkSize?: '33cl' | '1.5L';
  includesDessert: boolean;
  isKidsMenu: boolean;
  surprise?: string;
}

// Type pour les filtres
export interface MenuFilters {
  type?: MenuType;
  available?: boolean;
  isPromotion?: boolean;
  isKidsMenu?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}

// Constantes pour les options des selects
export const MENU_TYPES = [
  { value: 'combo', label: 'Combo' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'family', label: 'Famille' },
  { value: 'couple', label: 'Couple' },
  { value: 'senior', label: 'Senior' },
  { value: 'trio', label: 'Trio' },
  { value: 'kids', label: 'Enfants' }
] as const;

// Type pour le formulaire
export type MenuFormData = MenuInput;
