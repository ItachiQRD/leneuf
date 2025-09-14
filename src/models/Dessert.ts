// models/Dessert.ts
import mongoose from 'mongoose';
import type { Dessert as DessertType } from '@/types/dessert';

const sizeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Le nom est requis']
  },
  price: { 
    type: Number, 
    required: [true, 'Le prix est requis'],
    min: 0 
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  }
}, { _id: false });

const dessertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  type: {
    type: String,
    enum: ['cake', 'ice_cream', 'cookie', 'brownie', 'muffin'],
    required: [true, 'Le type est requis']
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
  deletedAt: {
    type: Date,
    default: null
  },
  sizes: {
    type: [sizeSchema],
    default: []
  }
}, {
  timestamps: true,
  toJSON: {
    transform(_, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Dessert = mongoose.models.Dessert || mongoose.model<DessertType>('Dessert', dessertSchema);

export default Dessert;