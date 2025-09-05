// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await connectDB();

    const { email, password, name, phone, address } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe manuellement
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('🔐 Création utilisateur avec mot de passe hashé');

    // Créer l'utilisateur avec le mot de passe hashé
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address
    });

    // Générer le token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-default-secret',
      { expiresIn: '7d' }
    );

    // Ne pas renvoyer le mot de passe
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address
    };

    console.log('✅ Utilisateur créé avec succès');

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de l\'inscription'
    });
  }
}