import mongoose from 'mongoose';
import type { Food } from '@/types/food';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: 0,
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise'],
  },
  type: {
    type: String,
    required: [true, 'Le type est requis'],
    enum: ['burger', 'pizza', 'salad', 'sandwich_durum'],
  },
  category: {
    type: String,
    enum: ['bestseller', 'new', 'regular'],
    default: 'regular',
  },
  active: {
    type: Boolean,
    default: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  preparationTimeMinutes: {
    type: Number,
    required: [true, 'Le temps de préparation est requis'],
    min: 1,
  },
  baseIngredients: {
    type: [String],
    default: [],
  },
  allergens: {
    type: [String],
    default: [],
  },
  spicyLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot'],
    default: 'mild',
  },
  nutritionalInfo: {
    calories: { type: Number, default: 0 },
    proteins: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    servingSize: { type: String, default: '100g' },
  },
  extras: [{
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    maxQuantity: { type: Number, required: true, min: 1 },
    category: { 
      type: String, 
      required: true,
      enum: ['protein', 'vegetable', 'cheese', 'other']
    }
  }],
  maxSauces: {
    type: Number,
    default: 2,
    min: 0,
  },
  isVegan: {
    type: Boolean,
    default: false,
  },
  isVegetarian: {
    type: Boolean,
    default: false,
  },
  isGlutenFree: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
  toJSON: {
    transform(_, ret) {
      // Toujours convertir l'ID en string
      ret._id = ret._id.toString();
      return ret;
    }
  }
});

// Indexes pour améliorer les performances
foodSchema.index({ type: 1, category: 1 });
foodSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Food || mongoose.model<Food>('Food', foodSchema);