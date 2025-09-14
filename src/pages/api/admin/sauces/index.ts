import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Sauce from '@/models/Sauce';
import { withAdmin } from '@/utils/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const sauces = await Sauce.find({ deletedAt: { $exists: false } });
        res.status(200).json(sauces);
      } catch (error) {
        console.error('Erreur lors de la récupération des sauces:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      break;

    case 'POST':
      try {
        // Gérer les données envoyées via FormData
        let sauceData = req.body;
        if (req.body.data) {
          try {
            sauceData = JSON.parse(req.body.data);
          } catch (parseError) {
            console.error('Erreur parsing data:', parseError);
            return res.status(400).json({ message: 'Données JSON invalides' });
          }
        }
        
        if (!sauceData || typeof sauceData !== 'object') {
          return res.status(400).json({ message: 'Données invalides' });
        }
        
        const sauce = new Sauce(sauceData);
        await sauce.save();
        res.status(201).json(sauce);
      } catch (error) {
        console.error('Erreur lors de la création de la sauce:', error);
        return res.status(400).json({ message: 'Erreur lors de la création de la sauce' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default withAdmin(handler);
