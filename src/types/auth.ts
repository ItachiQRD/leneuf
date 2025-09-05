import { User } from './models';

// Type pour l'adresse
interface Address {
  street: string;
  city: string;
  postalCode: string;
  complement?: string;
}

// Type pour l'utilisateur authentifié (sans données sensibles)
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  isAdmin: boolean;
  active: boolean;
  emailVerified: boolean;
}

// Type pour les données de connexion
export interface LoginCredentials {
  email: string;
  password: string;
}

// Type pour les données d'inscription
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

// Type pour la réponse d'authentification
export interface AuthResponse {
  message: string;
  user: User;
}

// Type pour le contexte d'authentification
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}