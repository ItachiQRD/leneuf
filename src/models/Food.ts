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
    enum: ['burger', 'pizza', 'salad', 'sandwich_durum', 'tacos', 'bowls', 'paninis', 'plates', 'tex_mex', 'defsoce'],
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
  },
  // Champs spécifiques aux pizzas
  pizzaBase: {
    type: String,
    enum: ['tomate', 'creme_fraiche'],
    default: 'tomate'
  },
  pizzaSizes: [{
    name: { type: String, required: true }, // 'junior', 'senior', 'mega'
    price: { type: Number, required: true },
    diameter: { type: String, required: true }, // '29cm', '33cm', '40cm'
    isDefault: { type: Boolean, default: false }
  }],
  // Champs spécifiques aux tacos
  tacoSizes: [{
    name: { type: String, required: true }, // 'M', 'L', 'XL'
    price: { type: Number, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  tacoOptions: {
    meats: [{
      category: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      available: { type: Boolean, default: true }
    }],
    sauces: [{
      category: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      available: { type: Boolean, default: true }
    }],
    cheeses: [{
      category: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      available: { type: Boolean, default: true }
    }],
    supplements: [{
      category: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      available: { type: Boolean, default: true }
    }]
  },
  // Champs spécifiques aux bowls
  bowlMeats: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true }
  }],
  // Champs spécifiques aux paninis
  paniniAccompaniments: {
    fries: { type: Boolean, default: true },
    drink: { type: String }, // '33cl'
    drinkPrice: { type: Number, default: 0 }
  },
  // Champs spécifiques aux assiettes
  plateAccompaniments: {
    bread: { type: Boolean, default: true },
    fries: { type: Boolean, default: true },
    salad: { type: Boolean, default: true }
  },
  // Champs spécifiques aux defsoces
  defsoceOptions: {
    availableBases: [{ type: String }], // ['tomate', 'creme_fraiche']
    availableIngredients: [{ type: String }],
    maxIngredients: { type: Number, default: 2 }
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