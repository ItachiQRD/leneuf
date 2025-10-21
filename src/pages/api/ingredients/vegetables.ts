import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Ingredient from '@/models/Ingredient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Récupérer les ingrédients de type légume
    const vegetables = await Ingredient.find({ 
      type: 'vegetable',
      active: true,
      available: true
    }).select('name image').sort({ orderIndex: 1 });

    res.status(200).json({
      success: true,
      vegetables: vegetables
    });

  } catch (error) {
    console.error('Error fetching vegetables:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching vegetables',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
