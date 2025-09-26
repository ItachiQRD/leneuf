// models/Side.ts
import mongoose from 'mongoose';
import type { Side as SideType, SideCategory } from '@/types/side';
import type { BaseModel } from '@/types/models';
import { createBaseSchema } from './BaseSchema';


type SideDocument = Omit<SideType, '_id'> & BaseModel;

const sizeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  weight: { 
    type: String, 
    required: true 
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  }
});


const sideSchema = createBaseSchema<SideType>({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  category: {
    type: String,
    enum: ['fries', 'wings', 'onion_rings', 'salad', 'coleslaw'],
    required: [true, 'La catégorie est requise']
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
  sizes: [{
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    weight: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  preparationTime: {
    type: Number,
    required: true,
    min: 1
  }
});


sideSchema.index({ category: 1, active: 1 });
sideSchema.index({ available: 1 });
sideSchema.index({ 'sizes.price': 1 });

// Supprimer le modèle du cache s'il existe pour forcer la recompilation
if (mongoose.models.Side) {
  delete mongoose.models.Side;
}

const Side = mongoose.model<SideDocument>('Side', sideSchema);

export default Side;