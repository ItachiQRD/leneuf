import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/utils/jwt';

interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('\n👤 /api/auth/me - Vérification de session');

  if (req.method !== 'GET') {
    console.log('❌ Méthode non autorisée:', req.method);
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    // Récupérer le token du cookie
    const token = req.cookies.token;
    console.log('🔍 Recherche du token dans les cookies...');

    if (!token) {
      console.log('❌ Pas de token trouvé');
      return res.status(401).json({ message: 'Non authentifié' });
    }

    console.log('✅ Token trouvé, vérification...');

    // Vérifier et décoder le token
    const decoded = verifyToken(token) as JWTPayload;

    if (!decoded) {
      console.log('❌ Token invalide ou expiré');
      return res.status(401).json({ message: 'Token invalide' });
    }

    console.log('✅ Token valide pour userId:', decoded.userId);

    // Connexion à la base de données
    console.log('🔌 Connexion à la base de données...');
    await dbConnect();
    console.log('✅ Connecté à la base de données');

    // Récupérer l'utilisateur (sans le mot de passe)
    console.log('🔍 Recherche de l\'utilisateur:', decoded.userId);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.log('❌ Utilisateur non trouvé dans la base de données');
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    console.log('✅ Utilisateur trouvé:', user.email);

    // Retourner les informations de l'utilisateur
    const userInfo = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin
    };

    console.log('📤 Envoi des informations utilisateur');
    res.status(200).json({ user: userInfo });
  } catch (error) {
    console.error('❌ Erreur dans /api/auth/me:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
}