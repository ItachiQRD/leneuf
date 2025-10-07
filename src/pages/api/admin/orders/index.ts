import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { status, page = 1, limit = 10 } = req.query;
        
        // Construire le filtre
        const filter: any = {};
        if (status && status !== 'all') {
          filter.status = status;
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        // Récupérer les commandes avec les informations utilisateur
        const orders = await Order.find(filter)
          .populate('userId', 'name email phone')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit));

        // Compter le total pour la pagination
        const total = await Order.countDocuments(filter);

        res.status(200).json({
          success: true,
          data: orders,
          pagination: {
            current: Number(page),
            total: Math.ceil(total / Number(limit)),
            count: total
          }
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Erreur lors de la récupération des commandes',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'PUT':
      try {
        const { id, status, notes } = req.body;
        
        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'ID de commande requis'
          });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const order = await Order.findByIdAndUpdate(
          id,
          updateData,
          { new: true }
        ).populate('userId', 'name email phone');

        if (!order) {
          return res.status(404).json({
            success: false,
            message: 'Commande non trouvée'
          });
        }

        res.status(200).json({
          success: true,
          data: order,
          message: 'Commande mise à jour avec succès'
        });
      } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Erreur lors de la mise à jour de la commande',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).json({ 
        success: false, 
        message: `Méthode ${req.method} non autorisée` 
      });
  }
}
