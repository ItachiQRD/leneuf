import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotion extends Document {
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'free_delivery';
  value: number; // Pourcentage ou montant fixe
  minOrder?: number; // Montant minimum de commande
  maxDiscount?: number; // Remise maximale
  applicableProducts: string[]; // IDs des produits concernés
  applicableCategories: string[]; // Catégories concernées
  conditions: {
    minQuantity?: number; // Quantité minimum
    buyQuantity?: number; // Quantité à acheter
    getQuantity?: number; // Quantité offerte
    freeProduct?: string; // Produit offert
  };
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit?: number; // Limite d'utilisation
  usedCount: number; // Nombre d'utilisations
  image?: string; // Image de la promotion
  createdAt: Date;
  updatedAt: Date;
}

const PromotionSchema = new Schema<IPromotion>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'buy_x_get_y', 'free_delivery'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrder: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  applicableProducts: [{
    type: String
  }],
  applicableCategories: [{
    type: String
  }],
  conditions: {
    minQuantity: {
      type: Number,
      default: 1
    },
    buyQuantity: {
      type: Number,
      default: 1
    },
    getQuantity: {
      type: Number,
      default: 1
    },
    freeProduct: {
      type: String,
      default: null
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
PromotionSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
PromotionSchema.index({ applicableCategories: 1 });
PromotionSchema.index({ type: 1 });

export default mongoose.models.Promotion || mongoose.model<IPromotion>('Promotion', PromotionSchema);
