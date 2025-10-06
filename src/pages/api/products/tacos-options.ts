import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Ingredient from '@/models/Ingredient';
import Sauce from '@/models/Sauce';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Récupérer les ingrédients (suppléments)
    const ingredients = await Ingredient.find({ 
      available: true,
      active: true 
    }).select('name price image description category type isSpicy isVegetarian allergens');

    // Récupérer les sauces
    const sauces = await Sauce.find({ 
      available: true,
      active: true 
    }).select('name price image description category spicyLevel');

    // Récupérer les viandes depuis les ingrédients
    const meats = ingredients.filter(ing => ing.type === 'meat');

    // Options de tailles
    const sizes = [
      { id: 'M', name: 'Moyen', price: 0, description: '2 tortillas' },
      { id: 'L', name: 'Large', price: 2, description: '3 tortillas' },
      { id: 'XL', name: 'Extra Large', price: 4, description: '4 tortillas' }
    ];

    res.status(200).json({
      success: true,
      data: {
        meats,
        sauces: sauces.map(sauce => ({
          ...sauce.toObject(),
          productType: 'sauce'
        })),
        ingredients: ingredients.map(ingredient => ({
          ...ingredient.toObject(),
          productType: 'ingredient'
        })),
        sizes
      }
    });

  } catch (error) {
    console.error('Error fetching tacos options:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching tacos options',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
