import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    console.log('🔌 Test de connexion à la base de données...');
    console.log('🔧 MONGODB_URI défini:', !!process.env.MONGODB_URI);
    console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔧 VERCEL:', process.env.VERCEL);

    // Tenter la connexion
    await dbConnect();
    
    // Vérifier l'état de la connexion
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    console.log('📊 État de la connexion:', connectionStates[connectionState as keyof typeof connectionStates]);

    // Tester une requête simple
    const collections = await mongoose.connection.db?.listCollections().toArray();
    
    res.status(200).json({
      success: true,
      message: 'Connexion à la base de données réussie',
      connectionState: connectionStates[connectionState as keyof typeof connectionStates],
      collections: collections?.map(c => c.name) || [],
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        MONGODB_URI_DEFINED: !!process.env.MONGODB_URI
      }
    });

  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    
    res.status(500).json({
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
