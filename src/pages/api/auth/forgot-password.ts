// Envoie un lien de réinitialisation par email (token stocké en base)
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

const RESET_TOKEN_VALIDITY_MS = 60 * 60 * 1000; // 1 heure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Email requis' });
    }

    await dbConnect();
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    // On renvoie toujours succès pour ne pas révéler si l'email existe
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'Si un compte existe pour cette adresse, un lien de réinitialisation a été envoyé.'
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_VALIDITY_MS);
    await user.save({ validateBeforeSave: false });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const resetUrl = `${baseUrl}/auth/nouveau-mot-de-passe?token=${token}`;

    // TODO: envoyer l'email avec resetUrl (nodemailer, Resend, etc.)
    // Pour l'instant on log le lien en dev pour tester
    if (process.env.NODE_ENV !== 'production') {
      console.log('Lien de réinitialisation (dev):', resetUrl);
    }

    res.status(200).json({
      success: true,
      message: 'Si un compte existe pour cette adresse, un lien de réinitialisation a été envoyé.'
    });
  } catch (error) {
    console.error('Erreur forgot-password:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du lien' });
  }
}
