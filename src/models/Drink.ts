// models/Drink.ts
import mongoose from 'mongoose';
import type { Drink } from '@/types/drink';
import { createBaseSchema } from './BaseSchema';

const sizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  volume: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const drinkSchema = createBaseSchema<Drink>({
  name: { 
    type: String, 
    required: [true, 'Le nom est requis'],
    trim: true
  },
  type: { 
    type: String, 
    enum: ['soda', 'water', 'juice', 'coffee', 'milkshake'],
    required: [true, 'Le type est requis']
  },
  brand: String,
  image: {
    type: String,
    required: [true, 'L\'image est requise']
  },
  available: {
    type: Boolean,
    default: true
  },
  nutritionalInfo: {
    calories: { type: Number, required: true },
    sugar: { type: Number, required: true },
    servingSize: { type: Number, required: true }
  },
  sizes: {
    type: [sizeSchema],
    required: true,
    validate: {
      validator: function(sizes: any[]) {
        return sizes.length > 0;
      },
      message: 'Au moins une taille est requise'
    }
  }
});

const Drink = mongoose.models.Drink || mongoose.model<Drink>('Drink', drinkSchema);

export default Drink;