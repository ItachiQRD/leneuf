// src/pages/api/auth/verify-email.ts
import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await connectDB();
    const { token } = req.body;

    // Ajout de select pour inclure verificationToken et verificationTokenExpires
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    }).select('+verificationToken +verificationTokenExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    // Mise à jour des champs
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email vérifié avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la vérification'
    });
  }
}