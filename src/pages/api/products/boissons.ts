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
      console.log('Boissons trouvées dans Product:', drinks.length);
      
      // Si aucune boisson trouvée, essayer le modèle Drink
      if (drinks.length === 0) {
        console.log('Aucune boisson dans Product, essai avec Drink...');
        const drinkData = await Drink.find({}).sort({ name: 1 });
        console.log('Boissons trouvées dans Drink:', drinkData.length);
        
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
        console.log('Aucune boisson trouvée, utilisation des données de fallback');
        drinks = [
          {
            _id: 'coca-33cl',
            name: 'Coca-Cola 33cl',
            price: 2.50,
            image: '/images/boissons/coca-33cl.jpg',
            category: 'boissons',
            type: 'drink'
          },
          {
            _id: 'coca-50cl',
            name: 'Coca-Cola 50cl',
            price: 3.50,
            image: '/images/boissons/coca-50cl.jpg',
            category: 'boissons',
            type: 'drink'
          },
          {
            _id: 'eau-50cl',
            name: 'Eau 50cl',
            price: 2.00,
            image: '/images/boissons/eau-50cl.jpg',
            category: 'boissons',
            type: 'drink'
          },
          {
            _id: 'jus-orange-25cl',
            name: 'Jus d\'Orange 25cl',
            price: 2.80,
            image: '/images/boissons/jus-orange-25cl.jpg',
            category: 'boissons',
            type: 'drink'
          },
          {
            _id: 'jus-pomme-25cl',
            name: 'Jus de Pomme 25cl',
            price: 2.80,
            image: '/images/boissons/jus-pomme-25cl.jpg',
            category: 'boissons',
            type: 'drink'
          }
        ];
      }
      
      console.log('Noms des boissons finales:', drinks.map(d => d.name));
      
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
