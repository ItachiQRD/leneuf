// models/Sauce.ts
import mongoose from 'mongoose';
import type { Sauce as SauceType } from '@/types/sauce';

const nutritionalInfoSchema = new mongoose.Schema({
  calories: {
    type: Number,
    required: [true, 'Les calories sont requises'],
    min: 0
  },
  proteins: {
    type: Number,
    required: [true, 'Les protéines sont requises'],
    min: 0
  },
  carbs: {
    type: Number,
    required: [true, 'Les glucides sont requis'],
    min: 0
  },
  fats: {
    type: Number,
    required: [true, 'Les lipides sont requis'],
    min: 0
  },
  servingSize: {
    type: String,
    required: [true, 'La portion est requise']
  }
}, { _id: false });

const sauceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  type: {
    type: String,
    enum: ['mayo', 'ketchup', 'bbq', 'special', 'hot'],
    required: [true, 'Le type est requis']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    minlength: [10, 'La description doit contenir au moins 10 caractères']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: 0
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise']
  },
  available: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  },
  allergens: {
    type: [String],
    default: []
  },
  nutritionalInfo: {
    type: nutritionalInfoSchema,
    required: [true, 'Les informations nutritionnelles sont requises']
  },
  spicyLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot'],
    required: [true, 'Le niveau de piquant est requis']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (_: any, ret: any) => {
      if (ret._id) ret._id = ret._id.toString();
      if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
      if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
      return ret;
    }
  }
});

const Sauce = mongoose.models.Sauce || mongoose.model<SauceType>('Sauce', sauceSchema);

export default Sauce;