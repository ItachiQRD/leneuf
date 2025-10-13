import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Promo from '@/models/Promo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Récupérer uniquement les promotions actives et en cours
    const now = new Date();
    const activePromos = await Promo.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: activePromos });
  } catch (error) {
    console.error('Error fetching active promos:', error);
    return res.status(500).json({ error: 'Failed to fetch promos' });
  }
}
