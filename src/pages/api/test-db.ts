import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test de connexion à la base de données
    console.log('Testing database connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    await connectDB();
    console.log('Database connection successful');
    
    // Vérifier l'état de la connexion
    const connectionState = Food.db.readyState;
    console.log('MongoDB connection state:', connectionState);

    // Lister toutes les collections
    const collections = await Food.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Compter le nombre de documents dans la collection Food
    const count = await Food.countDocuments();
    console.log('Number of documents in Food collection:', count);

    // Récupérer un échantillon de la collection
    const sample = await Food.findOne();
    console.log('Sample document:', sample);

    return res.status(200).json({
      success: true,
      connectionState,
      collections: collections.map(c => c.name),
      foodCount: count,
      sampleDocument: sample
    });
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    });
  }
}
