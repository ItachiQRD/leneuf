import { z } from 'zod';

// Types de base
export type MenuType = 'combo' | 'promotion' | 'family' | 'couple' | 'senior' | 'trio' | 'kids';

// Schéma pour un article de menu
const MenuItemSchema = z.object({
  productType: z.enum(['food', 'drink', 'side', 'dessert']),
  productId: z.string(),
  quantity: z.number().min(1),
  size: z.string().optional(),
  variant: z.string().optional(),
  name: z.string(),
  price: z.number().min(0)
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
  includesSurprise: z.boolean().default(false),
  promotionText: z.string().optional()
});

// Types dérivés
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type MenuInput = z.infer<typeof MenuSchema>;

// Interface complète pour un menu
export interface Menu {
  _id: string;
  name: string;
  description: string;
  price: number;
  type: MenuType;
  items: MenuItem[];
  image: string;
  available: boolean;
  active: boolean;
  validUntil?: Date;
  minOrderValue?: number;
  discount?: number;
  isPromotion: boolean;
  originalPrice?: number;
  savings?: number;
  includesFries: boolean;
  includesDrink: boolean;
  drinkSize?: '33cl' | '1.5L';
  includesSurprise: boolean;
  promotionText?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Constantes pour les options
export const MENU_TYPES = [
  { value: 'combo', label: 'Combo' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'family', label: 'Famille' },
  { value: 'couple', label: 'Couple' },
  { value: 'senior', label: 'Senior' },
  { value: 'trio', label: 'Trio' },
  { value: 'kids', label: 'Enfants' }
] as const;
