import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Promo from '@/models/Promo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    switch (req.method) {
      case 'GET':
        return await getPromos(req, res);
      case 'POST':
        return await createPromo(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getPromos(req: NextApiRequest, res: NextApiResponse) {
  try {
    const promos = await Promo.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: promos });
  } catch (error) {
    console.error('Error fetching promos:', error);
    return res.status(500).json({ error: 'Failed to fetch promos' });
  }
}

async function createPromo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const promoData = req.body;
    
    // Validation des données requises
    if (!promoData.name || !promoData.description || !promoData.discountType || !promoData.discountValue || !promoData.startDate || !promoData.endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validation des dates
    const startDate = new Date(promoData.startDate);
    const endDate = new Date(promoData.endDate);
    
    if (startDate >= endDate) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Validation du type de remise
    if (promoData.discountType === 'percentage' && promoData.discountValue > 100) {
      return res.status(400).json({ error: 'Percentage discount cannot exceed 100%' });
    }

    const promo = new Promo({
      ...promoData,
      startDate,
      endDate
    });

    await promo.save();
    return res.status(201).json({ success: true, data: promo });
  } catch (error) {
    console.error('Error creating promo:', error);
    return res.status(500).json({ error: 'Failed to create promo' });
  }
}
