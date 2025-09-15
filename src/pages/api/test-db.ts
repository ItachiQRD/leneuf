import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  // Timeout de 50 secondes pour Vercel
  const timeout = setTimeout(() => {
    res.status(504).json({
      success: false,
      message: 'Timeout de connexion à la base de données',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        MONGODB_URI_DEFINED: !!process.env.MONGODB_URI
      }
    });
  }, 50000);

  try {
    console.log('🔌 Test de connexion à la base de données...');
    console.log('🔧 MONGODB_URI défini:', !!process.env.MONGODB_URI);
    console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔧 VERCEL:', process.env.VERCEL);

    // Tenter la connexion avec timeout
    await Promise.race([
      dbConnect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout de connexion')), 45000)
      )
    ]);
    
    // Vérifier l'état de la connexion
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    console.log('📊 État de la connexion:', connectionStates[connectionState as keyof typeof connectionStates]);

    clearTimeout(timeout);
    return res.status(200).json({
      success: true,
      message: 'Connexion à la base de données réussie',
      connectionState: connectionStates[connectionState as keyof typeof connectionStates],
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        MONGODB_URI_DEFINED: !!process.env.MONGODB_URI
      }
    });

  } catch (error) {
    clearTimeout(timeout);
    console.error('❌ Erreur de connexion à la base de données:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erreur de connexion à la base de données',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        MONGODB_URI_DEFINED: !!process.env.MONGODB_URI
      }
    });
  }
}
