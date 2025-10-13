import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Promo from '@/models/Promo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid promo ID' });
    }

    switch (req.method) {
      case 'GET':
        return await getPromo(req, res, id);
      case 'PUT':
        return await updatePromo(req, res, id);
      case 'DELETE':
        return await deletePromo(req, res, id);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getPromo(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const promo = await Promo.findById(id);
    if (!promo) {
      return res.status(404).json({ error: 'Promo not found' });
    }
    return res.status(200).json({ success: true, data: promo });
  } catch (error) {
    console.error('Error fetching promo:', error);
    return res.status(500).json({ error: 'Failed to fetch promo' });
  }
}

async function updatePromo(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const updateData = req.body;
    
    // Validation des dates si fournies
    if (updateData.startDate && updateData.endDate) {
      const startDate = new Date(updateData.startDate);
      const endDate = new Date(updateData.endDate);
      
      if (startDate >= endDate) {
        return res.status(400).json({ error: 'End date must be after start date' });
      }
    }

    // Validation du type de remise si fourni
    if (updateData.discountType === 'percentage' && updateData.discountValue > 100) {
      return res.status(400).json({ error: 'Percentage discount cannot exceed 100%' });
    }

    const promo = await Promo.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!promo) {
      return res.status(404).json({ error: 'Promo not found' });
    }

    return res.status(200).json({ success: true, data: promo });
  } catch (error) {
    console.error('Error updating promo:', error);
    return res.status(500).json({ error: 'Failed to update promo' });
  }
}

async function deletePromo(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const promo = await Promo.findByIdAndDelete(id);
    if (!promo) {
      return res.status(404).json({ error: 'Promo not found' });
    }
    return res.status(200).json({ success: true, message: 'Promo deleted successfully' });
  } catch (error) {
    console.error('Error deleting promo:', error);
    return res.status(500).json({ error: 'Failed to delete promo' });
  }
}
