import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Food from '@/models/Food';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const foods = await Food.find({ available: true, active: true }).sort({ createdAt: -1 });

    const formattedFoods = foods.map(food => {
      const obj = food.toObject();
      return {
        ...obj,
        price: food.price ?? (food.pizzaSizes?.[0]?.price) ?? 0,
        category: food.category || 'regular',
        type: food.type,
      };
    });

    res.status(200).json(formattedFoods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ message: 'Error fetching foods' });
  }
}
