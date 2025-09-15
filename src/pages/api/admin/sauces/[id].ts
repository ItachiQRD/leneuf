import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Sauce from '@/models/Sauce';
import { withAdmin } from '@/utils/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await dbConnect();

    switch (req.method) {
      case 'PUT':
        try {
          const updateData = req.body;
          const sauce = await Sauce.findByIdAndUpdate(id, updateData, { new: true });
          
          if (!sauce) {
            return res.status(404).json({ message: 'Sauce non trouvée' });
          }
          
          return res.status(200).json(sauce);
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la sauce:', error);
          return res.status(500).json({ message: 'Erreur lors de la mise à jour de la sauce' });
        }

      case 'DELETE':
        try {
          const sauce = await Sauce.findByIdAndUpdate(id, { 
            active: false, 
            deletedAt: new Date() 
          }, { new: true });
          
          if (!sauce) {
            return res.status(404).json({ message: 'Sauce non trouvée' });
          }
          
          return res.status(200).json({ message: 'Sauce supprimée avec succès' });
        } catch (error) {
          console.error('Erreur lors de la suppression de la sauce:', error);
          return res.status(500).json({ message: 'Erreur lors de la suppression de la sauce' });
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
