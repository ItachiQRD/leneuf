import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/utils/jwt';

interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

// Cache pour stocker les résultats de vérification du token
const tokenVerificationCache = new Map<string, { payload: JWTPayload; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minute

export async function verifyAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log('❌ Token manquant dans les cookies');
      res.status(401).json({ message: 'Non autorisé - Token manquant' });
      return false;
    }

    // Vérifier si le token est dans le cache et n'est pas expiré
    const cached = tokenVerificationCache.get(token);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      req.user = cached.payload;
      return true;
    }

    const decoded = verifyToken(token) as JWTPayload;

    if (!decoded) {
      console.log('❌ Token invalide ou expiré');
      res.status(401).json({ message: 'Token invalide ou expiré' });
      return false;
    }

    if (!decoded.isAdmin) {
      console.log('🚫 Utilisateur non admin:', decoded.email);
      res.status(403).json({ message: 'Accès refusé - Droits administrateur requis' });
      return false;
    }

    // Mettre en cache le résultat de la vérification
    tokenVerificationCache.set(token, {
      payload: decoded,
      timestamp: Date.now()
    });

    // Ajouter les informations utilisateur à la requête
    req.user = decoded;
    return true;
  } catch (error) {
    console.error('❌ Erreur de vérification admin:', error);
    res.status(401).json({ message: 'Token invalide ou expiré' });
    return false;
  }
}

export function withAdmin(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!(await verifyAdmin(req, res))) {
      return;
    }
    return handler(req, res);
  };
}
