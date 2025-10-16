import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Side from '@/models/Side';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const sides = await Side.find({}).sort({ createdAt: -1 });
    
    res.status(200).json(sides);
  } catch (error) {
    console.error('Error fetching sides:', error);
    res.status(500).json({ message: 'Error fetching sides' });
  }
}
