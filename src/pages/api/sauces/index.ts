import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Sauce from '@/models/Sauce';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const sauces = await Sauce.find({}).sort({ createdAt: -1 });
    
    res.status(200).json(sauces);
  } catch (error) {
    console.error('Error fetching sauces:', error);
    res.status(500).json({ message: 'Error fetching sauces' });
  }
}
