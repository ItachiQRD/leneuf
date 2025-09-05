import { ObjectId } from 'mongodb';

// Type de base pour les IDs MongoDB
export type MongoId = string | ObjectId;

// Interface de base pour les documents MongoDB
export interface MongoDocument {
  _id: MongoId;
  createdAt: Date;
  updatedAt: Date;
}

// Utilitaires pour la conversion des IDs
export const convertToObjectId = (id: MongoId): ObjectId => {
  return typeof id === 'string' ? new ObjectId(id) : id;
};

export const convertToString = (id: MongoId): string => {
  return typeof id === 'string' ? id : id.toString();
};

// Type helper pour convertir les IDs en string dans les réponses API
export type WithStringId<T> = Omit<T, '_id'> & { _id: string };

// Type helper pour les documents avec ID optionnel (création)
export type WithOptionalId<T> = Omit<T, '_id'> & { _id?: MongoId };