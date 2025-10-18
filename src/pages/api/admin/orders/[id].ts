import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'ID de commande requis' });
    }

    // Vérifier que la commande existe
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Supprimer la commande
    await Order.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: 'Commande supprimée avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la commande',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}
