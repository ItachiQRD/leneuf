import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mode développement sans base de données
  if (process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI) {
    console.log('Mode développement sans base de données - retour de boissons factices');
    const mockDrinks = [
      {
        _id: 'drink-1',
        name: 'Coca-Cola 33cl',
        price: 2.50,
        image: '/images/boissons/coca-33cl.jpg',
        category: 'boissons'
      },
      {
        _id: 'drink-2',
        name: 'Coca-Cola 1.5L',
        price: 3.50,
        image: '/images/boissons/coca-1.5l.jpg',
        category: 'boissons'
      },
      {
        _id: 'drink-3',
        name: 'Fanta 33cl',
        price: 2.50,
        image: '/images/boissons/fanta-33cl.jpg',
        category: 'boissons'
      },
      {
        _id: 'drink-4',
        name: 'Sprite 1.5L',
        price: 3.50,
        image: '/images/boissons/sprite-1.5l.jpg',
        category: 'boissons'
      }
    ];
    
    return res.status(200).json({
      success: true,
      data: mockDrinks
    });
  }

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
