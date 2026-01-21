import mongoose, { Schema, SchemaDefinition, SchemaDefinitionType } from 'mongoose';
import { BaseModel } from '../types/models';

// Définition des champs de base comme un type
interface BaseSchemaFields {
  active: boolean;
}

// Les champs de base pour le schéma
const baseFields: SchemaDefinition<BaseSchemaFields> = {
  active: {
    type: Boolean,
    default: true,
  }
};

// Fonction pour créer un schéma de base avec timestamps
export function createBaseSchema<T extends BaseModel>(
  definition: any
): Schema<T> {
  return new Schema(
    {
      ...baseFields,
      ...definition,
    },
    { 
      timestamps: true,
      toJSON: {
        transform: (_, ret: any) => {
          if (ret._id) {
            ret._id = ret._id.toString();
          }
          if (ret.createdAt) {
            ret.createdAt = ret.createdAt.toISOString();
          }
          if (ret.updatedAt) {
            ret.updatedAt = ret.updatedAt.toISOString();
          }
          return ret;
        },
      },
    }
  );
}

// Helper type pour les méthodes de schéma
export type BaseDocument = BaseModel & Document;

// Helper type pour les méthodes statiques
export interface BaseModelType extends mongoose.Model<BaseDocument> {
  // Ajoutez ici des méthodes statiques communes si nécessaire
}