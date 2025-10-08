import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Drink from '@/models/Drink';

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
      // Essayer d'abord le modèle Product
      let drinks = await Product.find({ category: 'boissons' }).sort({ name: 1 });
      
      // Si aucune boisson trouvée, essayer le modèle Drink
      if (drinks.length === 0) {
        const drinkData = await Drink.find({}).sort({ name: 1 });
        
        // Convertir le format Drink vers le format Product
        drinks = drinkData.map(drink => ({
          _id: drink._id,
          name: drink.name,
          price: drink.sizes?.[0]?.price || 0,
          image: drink.image || '',
          category: 'boissons',
          type: 'drink',
          sizes: drink.sizes || []
        }));
      }
      
      // Si toujours aucune boisson, utiliser les données de fallback
      if (drinks.length === 0) {
        drinks = [
          {
            _id: 'coca-cola',
            name: 'Coca-Cola',
            price: 2.50,
            image: '/images/boissons/coca-cola.jpg',
            category: 'boissons',
            type: 'drink',
            sizes: [
              { name: '33cl', price: 2.50, volume: '33cl', isDefault: true },
              { name: '50cl', price: 3.50, volume: '50cl', isDefault: false },
              { name: '1.5L', price: 4.50, volume: '1.5L', isDefault: false }
            ]
          },
          {
            _id: 'eau',
            name: 'Eau',
            price: 2.00,
            image: '/images/boissons/eau.jpg',
            category: 'boissons',
            type: 'drink',
            sizes: [
              { name: '50cl', price: 2.00, volume: '50cl', isDefault: true },
              { name: '1.5L', price: 3.00, volume: '1.5L', isDefault: false }
            ]
          },
          {
            _id: 'jus-orange',
            name: 'Jus d\'Orange',
            price: 2.80,
            image: '/images/boissons/jus-orange.jpg',
            category: 'boissons',
            type: 'drink',
            sizes: [
              { name: '25cl', price: 2.80, volume: '25cl', isDefault: true }
            ]
          },
          {
            _id: 'jus-pomme',
            name: 'Jus de Pomme',
            price: 2.80,
            image: '/images/boissons/jus-pomme.jpg',
            category: 'boissons',
            type: 'drink',
            sizes: [
              { name: '25cl', price: 2.80, volume: '25cl', isDefault: true }
            ]
          },
          {
            _id: 'fanta',
            name: 'Fanta',
            price: 2.50,
            image: '/images/boissons/fanta.jpg',
            category: 'boissons',
            type: 'drink',
            sizes: [
              { name: '33cl', price: 2.50, volume: '33cl', isDefault: true },
              { name: '1.5L', price: 4.50, volume: '1.5L', isDefault: false }
            ]
          }
        ];
      }
      
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
