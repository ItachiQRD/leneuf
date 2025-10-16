import { ObjectId } from 'mongodb';

// Type helper pour convertir les IDs MongoDB en string
export type WithStringId<T> = Omit<T, '_id'> & { _id: string };

// Type helper pour les IDs MongoDB
export type MongoId = string;

// Interface de base pour tous les documents
export interface BaseModel {
  _id?: MongoId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseProduct extends BaseModel {
  name: string;
  description: string;
  price: number;
  image: string | File;
  available: boolean;
}

// Types pour les utilisateurs
export interface UserModel extends BaseModel {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    complement?: string;
  };
  isAdmin: boolean;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
}

// Types pour les commandes
export interface OrderModel extends BaseModel {
  userId?: MongoId; // Optionnel pour les commandes sans compte
  customer?: {
    name: string;
    phone: string;
    address: string;
    paymentMethod: PaymentMethod;
    deliveryInstructions?: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    complement?: string;
  };
  deliveryTime?: Date;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface OrderItem {
  productId: MongoId;
  quantity: number;
  price: number;
  options?: {
    name: string;
    choice: {
      name: string;
      price: number;
    };
  }[];
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'card' | 'cash';