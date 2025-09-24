// types/dessert.ts
import { z } from 'zod';
import { BaseProduct } from './models';

export type DessertType = 'cake' | 'ice_cream' | 'cookie' | 'brownie' | 'muffin';

interface Size {
  name: string;
  price: number;
  isDefault: boolean;
}

export interface Dessert {
  _id: string;
  id?: string; // Ajouté pour la transformation toJSON de Mongoose
  name: string;
  type: DessertType;
  price: number;
  image: string;
  available: boolean;
  active: boolean;
  sizes: Size[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour la création/mise à jour
export type DessertInput = Omit<Dessert, '_id' | 'createdAt' | 'updatedAt'> & {
  image: string | File;
};

// Interface pour les filtres
export interface DessertFilters {
  type?: DessertType;
  available?: boolean;
}

// Schéma de validation
export const sizeSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  price: z.number().min(0, "Le prix doit être positif"),
  isDefault: z.boolean().default(false),
});

export const dessertSchema = z.object({
  type: z.enum(['cake', 'ice_cream', 'cookie', 'brownie', 'muffin']),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  price: z.number().min(0, "Le prix doit être positif"),
  image: z.string(),
  description: z.string().optional(),
  available: z.boolean(),
  sizes: z.array(sizeSchema)
});

// Constantes pour les options des selects
export const DESSERT_TYPES = [
  { value: 'cake', label: 'Gâteau' },
  { value: 'ice_cream', label: 'Glace' },
  { value: 'cookie', label: 'Cookie' },
  { value: 'brownie', label: 'Brownie' },
  { value: 'muffin', label: 'Muffin' }
] as const;

// Type pour le formulaire
export type DessertFormData = DessertInput;