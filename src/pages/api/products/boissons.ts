import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Retourner directement les boissons factices pour le développement
    console.log('Retour de boissons factices pour le développement');
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
      },
      {
        _id: 'drink-5',
        name: 'Orangina 33cl',
        price: 2.50,
        image: '/images/boissons/orangina-33cl.jpg',
        category: 'boissons'
      },
      {
        _id: 'drink-6',
        name: 'Pepsi 1.5L',
        price: 3.50,
        image: '/images/boissons/pepsi-1.5l.jpg',
        category: 'boissons'
      }
    ];
    
    return res.status(200).json({
      success: true,
      data: mockDrinks
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ 
      success: false, 
      message: `Méthode ${req.method} non autorisée` 
    });
  }
}
