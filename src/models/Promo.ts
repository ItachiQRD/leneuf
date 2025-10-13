import mongoose, { Document, Schema } from 'mongoose';

export interface IPromo extends Document {
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  image?: string;
  conditions?: {
    minOrderAmount?: number;
    applicableProducts?: string[];
    maxUses?: number;
    currentUses?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PromoSchema = new Schema<IPromo>({
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
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
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
  image: {
    type: String,
    trim: true
  },
  conditions: {
    minOrderAmount: {
      type: Number,
      min: 0
    },
    applicableProducts: [{
      type: String
    }],
    maxUses: {
      type: Number,
      min: 1
    },
    currentUses: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
PromoSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

export default mongoose.models.Promo || mongoose.model<IPromo>('Promo', PromoSchema);
