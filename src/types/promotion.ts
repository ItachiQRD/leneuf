import { z } from 'zod';

// Types de base
export type PromotionType = 'buy_x_get_y' | 'percentage_discount' | 'fixed_discount' | 'free_delivery' | 'combo_offer' | 'pizza_promotion';

// Schéma pour les conditions de promotion
const PromotionConditionSchema = z.object({
  minQuantity: z.number().min(1).optional(),
  minOrderValue: z.number().min(0).optional(),
  applicableProducts: z.array(z.string()).default([]),
  applicableCategories: z.array(z.string()).default([]),
  productTypes: z.array(z.enum(['food', 'drink', 'side', 'dessert'])).default([])
});

// Schéma pour les récompenses de promotion
const PromotionRewardSchema = z.object({
  freeItems: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    name: z.string()
  })).default([]),
  discountPercentage: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  freeDelivery: z.boolean().default(false)
});

// Schéma principal pour les promotions
export const PromotionSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  type: z.enum(['buy_x_get_y', 'percentage_discount', 'fixed_discount', 'free_delivery', 'combo_offer', 'pizza_promotion']),
  conditions: PromotionConditionSchema,
  reward: PromotionRewardSchema,
  validFrom: z.date(),
  validUntil: z.date(),
  active: z.boolean().default(true),
  image: z.string().optional(),
  priority: z.number().default(0),
  maxUses: z.number().min(1).optional(),
  usedCount: z.number().min(0).default(0),
  pizzaSizes: z.array(z.enum(['junior', 'senior', 'mega'])).default([]),
  promotionText: z.string().optional()
});

// Types dérivés
export type PromotionCondition = z.infer<typeof PromotionConditionSchema>;
export type PromotionReward = z.infer<typeof PromotionRewardSchema>;
export type PromotionInput = z.infer<typeof PromotionSchema>;

// Interface complète pour une promotion
export interface Promotion {
  _id: string;
  name: string;
  description: string;
  type: PromotionType;
  conditions: PromotionCondition;
  reward: PromotionReward;
  validFrom: Date;
  validUntil: Date;
  active: boolean;
  image?: string;
  priority: number;
  maxUses?: number;
  usedCount: number;
  pizzaSizes: ('junior' | 'senior' | 'mega')[];
  promotionText?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Constantes pour les options
export const PROMOTION_TYPES = [
  { value: 'buy_x_get_y', label: 'Achetez X, obtenez Y' },
  { value: 'percentage_discount', label: 'Remise en pourcentage' },
  { value: 'fixed_discount', label: 'Remise fixe' },
  { value: 'free_delivery', label: 'Livraison gratuite' },
  { value: 'combo_offer', label: 'Offre combo' },
  { value: 'pizza_promotion', label: 'Promotion pizza' }
] as const;
