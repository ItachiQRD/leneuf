import { Schema, model, models, Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface Address {
  street: string;
  city: string;
  postalCode: string;
  complement?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: Address;
  isAdmin: boolean;
  active: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const addressSchema = new Schema({
  street: {
    type: String,
    required: [true, 'L\'adresse est requise']
  },
  city: {
    type: String,
    required: [true, 'La ville est requise']
  },
  postalCode: {
    type: String,
    required: [true, 'Le code postal est requis'],
    match: [/^[0-9]{5}$/, 'Code postal invalide']
  },
  complement: {
    type: String,
    default: ''
  }
});

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit faire au moins 6 caractères'],
    select: false // Ne pas inclure par défaut dans les requêtes
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    match: [/^(\+33|0)[1-9][0-9]{8}$/, 'Numéro de téléphone invalide']
  },
  address: {
    type: addressSchema,
    required: [true, 'L\'adresse est requise']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Middleware pour hasher le mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
  try {
    // Ne hasher le mot de passe que s'il a été modifié
    if (!this.isModified('password')) {
      return next();
    }

    console.log(' Hashage du mot de passe...');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(' Mot de passe hashé avec succès');
    next();
  } catch (error) {
    console.error(' Erreur lors du hashage du mot de passe:', error);
    next(error as Error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    if (!this.password || !candidatePassword) {
      return false;
    }

    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Erreur de comparaison des mots de passe:', error);
    return false;
  }
};

// Vérifier si le modèle existe déjà pour éviter la recompilation
const User = models.User || model<IUser>('User', userSchema);

export default User as Model<IUser>;