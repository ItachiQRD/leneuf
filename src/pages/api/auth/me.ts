import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/utils/jwt';

interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

function toUserInfo(user: { _id: unknown; name: string; email: string; phone: string; address: unknown; isAdmin: boolean }) {
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    isAdmin: user.isAdmin
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Non authentifié' });

    const decoded = verifyToken(token) as JWTPayload;
    if (!decoded) return res.status(401).json({ message: 'Token invalide' });

    await dbConnect();

    if (req.method === 'GET') {
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });
      return res.status(200).json({ user: toUserInfo(user) });
    }

    if (req.method === 'PATCH') {
      const { name, phone, address } = req.body || {};
      const update: Record<string, unknown> = {};
      if (typeof name === 'string' && name.trim()) update.name = name.trim();
      if (typeof phone === 'string' && phone.trim()) update.phone = phone.trim();
      if (address && typeof address === 'object') {
        const a = address as { street?: string; city?: string; postalCode?: string; complement?: string };
        if (typeof a.street === 'string' && a.street.trim()) update['address.street'] = a.street.trim();
        if (typeof a.city === 'string' && a.city.trim()) update['address.city'] = a.city.trim();
        if (typeof a.postalCode === 'string' && /^[0-9]{5}$/.test(a.postalCode)) update['address.postalCode'] = a.postalCode;
        if (typeof a.complement === 'string') update['address.complement'] = a.complement;
      }
      const updated = await User.findByIdAndUpdate(
        decoded.userId,
        { $set: update },
        { new: true }
      ).select('-password');
      if (!updated) return res.status(401).json({ message: 'Utilisateur non trouvé' });
      return res.status(200).json({ user: toUserInfo(updated) });
    }
  } catch (error) {
    console.error('Erreur /api/auth/me:', error);
    return res.status(401).json({ message: 'Token invalide' });
  }
}