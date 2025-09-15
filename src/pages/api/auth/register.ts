// src/pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await dbConnect();

    const { name, email, password, phone, address } = req.body;

    // Validation des champs requis
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Validation de l'adresse
    if (!address.street || !address.city || !address.postalCode) {
      return res.status(400).json({ message: 'L\'adresse complète est requise' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      isAdmin: false, // Par défaut, les nouveaux utilisateurs ne sont pas admin
      active: true,
      emailVerified: false
    });

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Retourner la réponse sans le mot de passe
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin,
      active: user.active,
      emailVerified: user.emailVerified
    };

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
}