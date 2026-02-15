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
    const { email, newPassword, token } = req.body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (token && typeof token === 'string') {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Lien invalide ou expiré. Veuillez demander un nouveau lien.'
        });
      }
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(200).json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email ou lien de réinitialisation requis'
      });
    }

    const user = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    console.error('Erreur reset-password:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation du mot de passe'
    });
  }
}