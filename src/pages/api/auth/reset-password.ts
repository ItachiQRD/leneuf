// src/pages/api/auth/reset-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await dbConnect();
    const { email, newPassword } = req.body;

    console.log(' Tentative de réinitialisation pour:', email);

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    console.log(' Mot de passe réinitialisé avec succès');

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    console.error(' Erreur lors de la réinitialisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation du mot de passe'
    });
  }
}