import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Drink from '@/models/Drink';
import { withAdmin } from '@/utils/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const drinks = await Drink.find({ deletedAt: { $exists: false } });
        res.status(200).json(drinks);
      } catch (error) {
        console.error('Erreur lors de la récupération des boissons:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      break;

    case 'POST':
      try {
        // Gérer les données envoyées via FormData
        let drinkData = req.body;
        if (req.body.data) {
          try {
            drinkData = JSON.parse(req.body.data);
          } catch (parseError) {
            console.error('Erreur parsing data:', parseError);
            return res.status(400).json({ message: 'Données JSON invalides' });
          }
        }
        
        if (!drinkData || typeof drinkData !== 'object') {
          return res.status(400).json({ message: 'Données invalides' });
        }
        
        const drink = new Drink(drinkData);
        await drink.save();
        res.status(201).json(drink);
      } catch (error) {
        console.error('Erreur lors de la création de la boisson:', error);
        return res.status(400).json({ message: 'Erreur lors de la création de la boisson' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default withAdmin(handler);
