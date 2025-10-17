import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Drink from '@/models/Drink';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const drinks = await Drink.find({}).sort({ createdAt: -1 });
    
    // Formater les boissons pour inclure un prix de base
    const formattedDrinks = drinks.map(drink => ({
      ...drink.toObject(),
      price: drink.sizes?.[0]?.price || 0, // Prix de la première taille comme prix de base
      category: 'boissons',
      type: 'drink'
    }));
    
    res.status(200).json(formattedDrinks);
  } catch (error) {
    console.error('Error fetching drinks:', error);
    res.status(500).json({ message: 'Error fetching drinks' });
  }
}
