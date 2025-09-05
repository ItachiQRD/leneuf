// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET n\'est pas défini dans les variables d\'environnement');
  throw new Error('JWT_SECRET must be defined in environment variables');
}

console.log('✅ JWT_SECRET est défini');

interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

export const signToken = (payload: JWTPayload) => {
  try {
    console.log('🔑 Création d\'un nouveau token pour:', payload.email);
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '30d' // Augmenté à 30 jours
    });
    console.log('✅ Token créé avec succès');
    return token;
  } catch (error) {
    console.error('❌ Erreur lors de la création du token:', error);
    throw error;
  }
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    console.log('🔍 Vérification du token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    console.log('✅ Token valide pour:', decoded.email);
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('❌ Token expiré');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('❌ Token invalide:', error.message);
    } else {
      console.error('❌ Erreur lors de la vérification du token:', error);
    }
    return null;
  }
};