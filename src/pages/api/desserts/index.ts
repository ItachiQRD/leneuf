import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Dessert from '@/models/Dessert';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const desserts = await Dessert.find({}).sort({ createdAt: -1 });
    
    res.status(200).json(desserts);
  } catch (error) {
    console.error('Error fetching desserts:', error);
    res.status(500).json({ message: 'Error fetching desserts' });
  }
}
