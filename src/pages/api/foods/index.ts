import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Food from '@/models/Food';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const foods = await Food.find({}).sort({ createdAt: -1 });
    
    res.status(200).json(foods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ message: 'Error fetching foods' });
  }
}
