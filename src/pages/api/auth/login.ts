import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/utils/jwt';
import { serialize } from 'cookie';
import { Document } from 'mongoose';

interface UserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  isAdmin: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: true,
        message: 'Email et mot de passe requis' 
      });
    }

    try {
      await connectDB();
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({ 
          error: true,
          message: 'Email ou mot de passe incorrect' 
        });
      }

      const isValid = await user.comparePassword(password);

      if (!isValid) {
        return res.status(401).json({ 
          error: true,
          message: 'Email ou mot de passe incorrect' 
        });
      }

      // Créer le token JWT
      const tokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        isAdmin: user.isAdmin
      };
      
      const token = signToken(tokenPayload);

      // Configurer le cookie
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 30 * 24 * 60 * 60, // 30 jours
        path: '/',
      };

      const cookie = serialize('token', token, cookieOptions);
      res.setHeader('Set-Cookie', cookie);

      // Retourner la réponse sans le mot de passe
      const userInfo = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin
      };

      return res.status(200).json({
        error: false,
        message: 'Connexion réussie',
        user: userInfo
      });
    } catch (authError) {
      console.error('Erreur d\'authentification:', authError);
      return res.status(401).json({ 
        error: true,
        message: 'Email ou mot de passe incorrect' 
      });
    }
  } catch (error) {
    console.error('Erreur serveur:', error);
    return res.status(500).json({ 
      error: true,
      message: 'Une erreur est survenue lors de la connexion' 
    });
  }
}