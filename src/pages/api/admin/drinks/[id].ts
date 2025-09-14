import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Drink from '@/models/Drink';
import { withAdmin } from '@/utils/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await connectDB();

    switch (req.method) {
      case 'PUT':
        try {
          const updateData = req.body;
          const drink = await Drink.findByIdAndUpdate(id, updateData, { new: true });
          
          if (!drink) {
            return res.status(404).json({ message: 'Boisson non trouvée' });
          }
          
          return res.status(200).json(drink);
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la boisson:', error);
          return res.status(500).json({ message: 'Erreur lors de la mise à jour de la boisson' });
        }

      case 'DELETE':
        try {
          const drink = await Drink.findByIdAndUpdate(id, { 
            active: false, 
            deletedAt: new Date() 
          }, { new: true });
          
          if (!drink) {
            return res.status(404).json({ message: 'Boisson non trouvée' });
          }
          
          return res.status(200).json({ message: 'Boisson supprimée avec succès' });
        } catch (error) {
          console.error('Erreur lors de la suppression de la boisson:', error);
          return res.status(500).json({ message: 'Erreur lors de la suppression de la boisson' });
        }

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur serveur:', error);
    return res.status(500).json({ message: 'Erreur serveur interne' });
  }
}

export default withAdmin(handler);
