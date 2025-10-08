import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur de connexion à la base de données',
      error: 'MongoDB non configuré'
    });
  }

  if (req.method === 'GET') {
    try {
      // Récupérer tous les produits de la catégorie boissons
      const drinks = await Product.find({ category: 'boissons' }).sort({ name: 1 });
      
      res.status(200).json({
        success: true,
        data: drinks
      });
    } catch (error) {
      console.error('Error fetching drinks:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération des boissons',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ 
      success: false, 
      message: `Méthode ${req.method} non autorisée` 
    });
  }
}
