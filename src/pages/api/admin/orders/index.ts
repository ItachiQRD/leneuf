import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import User from '@/models/User';

// S'assurer que le modèle User est enregistré
if (!User) {
  console.error('User model not found');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mode développement sans base de données
  if (process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI) {
    console.log('Mode développement sans base de données - retour de données factices');
    return res.status(200).json({
      success: true,
      data: [],
      pagination: {
        current: 1,
        total: 0,
        count: 0
      }
    });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur de connexion à la base de données',
      error: 'MongoDB non configuré'
    });
  }

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
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit));

        // Essayer de populer les informations utilisateur si possible
        let populatedOrders = orders;
        try {
          populatedOrders = await Order.find(filter)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        } catch (populateError) {
          console.warn('Could not populate user data:', populateError);
          // Continuer avec les commandes sans les données utilisateur
        }

        // Compter le total pour la pagination
        const total = await Order.countDocuments(filter);

        res.status(200).json({
          success: true,
          data: populatedOrders,
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
        );

        // Essayer de populer les informations utilisateur si possible
        let populatedOrder = order;
        try {
          populatedOrder = await Order.findById(id).populate('userId', 'name email phone');
        } catch (populateError) {
          console.warn('Could not populate user data for update:', populateError);
          // Continuer avec la commande sans les données utilisateur
        }

        if (!order) {
          return res.status(404).json({
            success: false,
            message: 'Commande non trouvée'
          });
        }

        res.status(200).json({
          success: true,
          data: populatedOrder,
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
