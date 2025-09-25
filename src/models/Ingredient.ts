// models/Ingredient.ts
import mongoose from 'mongoose';
import { z } from 'zod';

const ingredientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  type: { 
    type: String, 
    enum: ['meat', 'cheese', 'vegetable', 'extra'],
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  available: {
    type: Boolean,
    default: true
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  allergens: {
    type: [String],
    default: []
  },
  orderIndex: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
ingredientSchema.index({ active: 1 });
ingredientSchema.index({ type: 1, active: 1 });
ingredientSchema.index({ name: 'text' });

const Ingredient = mongoose.models.Ingredient || mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;